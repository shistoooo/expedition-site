import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const DISCORD_API = "https://discord.com/api/v10";

function signToken(payload: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    const stateParam = req.nextUrl.searchParams.get("state");

    if (!code) {
        return NextResponse.redirect(new URL("/checkout?discord_error=no_code", req.url));
    }

    let plan = "monthly";
    let ref = "";
    if (stateParam) {
        try {
            const parsed = JSON.parse(Buffer.from(stateParam, "base64url").toString());
            plan = parsed.plan || "monthly";
            ref = parsed.ref || "";
        } catch { /* ignore */ }
    }

    const clientId = process.env.DISCORD_CLIENT_ID!;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET!;
    const guildId = process.env.DISCORD_GUILD_ID!;
    const secret = process.env.DISCORD_SIGN_SECRET || clientSecret;
    const redirectUri = `${req.nextUrl.origin}/api/discord/callback`;

    try {
        // 1. Exchange code for token
        const tokenRes = await fetch(`${DISCORD_API}/oauth2/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenRes.ok) {
            return NextResponse.redirect(new URL("/checkout?discord_error=token_failed", req.url));
        }

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        // 2. Get user's guilds
        const guildsRes = await fetch(`${DISCORD_API}/users/@me/guilds`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!guildsRes.ok) {
            return NextResponse.redirect(new URL("/checkout?discord_error=guilds_failed", req.url));
        }

        const guilds: { id: string }[] = await guildsRes.json();
        const isMember = guilds.some((g) => g.id === guildId);

        if (!isMember) {
            const params = new URLSearchParams({ plan, discord_error: "not_member" });
            if (ref) params.set("ref", ref);
            return NextResponse.redirect(new URL(`/checkout?${params}`, req.url));
        }

        // 3. Set signed cookie to prove Discord membership
        const timestamp = Date.now().toString();
        const payload = `discord_verified:${timestamp}`;
        const signature = signToken(payload, secret);
        const cookieValue = `${timestamp}.${signature}`;

        const redirectParams = new URLSearchParams({ plan, discord_verified: "true" });
        if (ref) redirectParams.set("ref", ref);

        const response = NextResponse.redirect(new URL(`/checkout?${redirectParams}`, req.url));

        (await cookies()).set("discord_member", cookieValue, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 30, // 30 minutes — just needs to last through checkout
            path: "/",
        });

        return response;
    } catch {
        return NextResponse.redirect(new URL("/checkout?discord_error=server_error", req.url));
    }
}
