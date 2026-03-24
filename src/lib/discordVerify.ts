import crypto from "crypto";

export interface DiscordVerifyResult {
    verified: boolean;
    discordUserId?: string | null;
}

export function parseDiscordCookie(cookieValue: string | undefined): {
    timestamp: string;
    signature: string;
    discordUserId: string;
} | null {
    if (!cookieValue) return null;

    const parts = cookieValue.split(".");
    const timestamp = parts[0];
    const signature = parts[1];
    const discordUserId = parts[2] || "";

    if (!timestamp || !signature) return null;

    return { timestamp, signature, discordUserId };
}

export function verifySignature(timestamp: string, signature: string, secret: string): boolean {
    const payload = `discord_verified:${timestamp}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return signature === expected;
}

export function isExpired(timestamp: string, maxAgeMs: number = 30 * 60 * 1000): boolean {
    const age = Date.now() - parseInt(timestamp, 10);
    return age > maxAgeMs;
}

export function verifyDiscordCookie(
    cookieValue: string | undefined,
    secret: string,
    now?: number
): DiscordVerifyResult {
    const parsed = parseDiscordCookie(cookieValue);
    if (!parsed) return { verified: false };

    if (!verifySignature(parsed.timestamp, parsed.signature, secret)) {
        return { verified: false };
    }

    const age = (now ?? Date.now()) - parseInt(parsed.timestamp, 10);
    if (age > 30 * 60 * 1000) {
        return { verified: false };
    }

    return { verified: true, discordUserId: parsed.discordUserId || null };
}
