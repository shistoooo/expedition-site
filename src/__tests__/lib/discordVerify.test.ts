import { describe, it, expect, vi } from "vitest";
import crypto from "crypto";
import {
    parseDiscordCookie,
    verifySignature,
    isExpired,
    verifyDiscordCookie,
} from "@/lib/discordVerify";

const TEST_SECRET = "test-secret-key";

function createValidCookie(discordUserId: string = "123456789", timestampMs?: number): string {
    const timestamp = (timestampMs ?? Date.now()).toString();
    const payload = `discord_verified:${timestamp}`;
    const signature = crypto.createHmac("sha256", TEST_SECRET).update(payload).digest("hex");
    return `${timestamp}.${signature}.${discordUserId}`;
}

describe("parseDiscordCookie", () => {
    it("returns null for undefined cookie", () => {
        expect(parseDiscordCookie(undefined)).toBeNull();
    });

    it("returns null for empty string", () => {
        expect(parseDiscordCookie("")).toBeNull();
    });

    it("returns null for cookie with only timestamp (no signature)", () => {
        expect(parseDiscordCookie("12345")).toBeNull();
    });

    it("parses valid cookie with all parts", () => {
        const result = parseDiscordCookie("12345.abcdef.999888777");
        expect(result).toEqual({
            timestamp: "12345",
            signature: "abcdef",
            discordUserId: "999888777",
        });
    });

    it("parses cookie without discordUserId (defaults to empty string)", () => {
        const result = parseDiscordCookie("12345.abcdef");
        expect(result).toEqual({
            timestamp: "12345",
            signature: "abcdef",
            discordUserId: "",
        });
    });
});

describe("verifySignature", () => {
    it("returns true for valid signature", () => {
        const timestamp = Date.now().toString();
        const payload = `discord_verified:${timestamp}`;
        const signature = crypto.createHmac("sha256", TEST_SECRET).update(payload).digest("hex");

        expect(verifySignature(timestamp, signature, TEST_SECRET)).toBe(true);
    });

    it("returns false for invalid signature", () => {
        expect(verifySignature("12345", "invalid-signature", TEST_SECRET)).toBe(false);
    });

    it("returns false for wrong secret", () => {
        const timestamp = Date.now().toString();
        const payload = `discord_verified:${timestamp}`;
        const signature = crypto.createHmac("sha256", TEST_SECRET).update(payload).digest("hex");

        expect(verifySignature(timestamp, signature, "wrong-secret")).toBe(false);
    });

    it("returns false for tampered timestamp", () => {
        const timestamp = Date.now().toString();
        const payload = `discord_verified:${timestamp}`;
        const signature = crypto.createHmac("sha256", TEST_SECRET).update(payload).digest("hex");

        // Use a different timestamp for verification
        expect(verifySignature((Date.now() + 1000).toString(), signature, TEST_SECRET)).toBe(false);
    });
});

describe("isExpired", () => {
    it("returns false for recent timestamp", () => {
        const timestamp = Date.now().toString();
        expect(isExpired(timestamp)).toBe(false);
    });

    it("returns true for timestamp older than 30 minutes", () => {
        const thirtyOneMinutesAgo = (Date.now() - 31 * 60 * 1000).toString();
        expect(isExpired(thirtyOneMinutesAgo)).toBe(true);
    });

    it("returns false for timestamp exactly at 30 minutes (boundary)", () => {
        // At exactly 30 minutes, age === maxAge, so it's NOT expired (> not >=)
        const exactlyThirtyMinutesAgo = (Date.now() - 30 * 60 * 1000).toString();
        expect(isExpired(exactlyThirtyMinutesAgo)).toBe(false);
    });

    it("supports custom maxAge", () => {
        const fiveMinutesAgo = (Date.now() - 5 * 60 * 1000 - 1).toString();
        expect(isExpired(fiveMinutesAgo, 5 * 60 * 1000)).toBe(true);
    });
});

describe("verifyDiscordCookie", () => {
    it("returns verified: false for no cookie", () => {
        expect(verifyDiscordCookie(undefined, TEST_SECRET)).toEqual({ verified: false });
    });

    it("returns verified: true for valid, fresh cookie", () => {
        const now = Date.now();
        const cookie = createValidCookie("123456789", now);
        const result = verifyDiscordCookie(cookie, TEST_SECRET, now);

        expect(result.verified).toBe(true);
        expect(result.discordUserId).toBe("123456789");
    });

    it("returns verified: false for expired cookie", () => {
        const thirtyOneMinutesAgo = Date.now() - 31 * 60 * 1000;
        const cookie = createValidCookie("123456789", thirtyOneMinutesAgo);
        const result = verifyDiscordCookie(cookie, TEST_SECRET);

        expect(result.verified).toBe(false);
    });

    it("returns verified: false for tampered signature", () => {
        const cookie = createValidCookie("123456789");
        const tampered = cookie.replace(/\.[^.]+\./, ".tamperedsig.");
        const result = verifyDiscordCookie(tampered, TEST_SECRET);

        expect(result.verified).toBe(false);
    });

    it("returns verified: false for wrong secret", () => {
        const cookie = createValidCookie("123456789");
        const result = verifyDiscordCookie(cookie, "wrong-secret");

        expect(result.verified).toBe(false);
    });

    it("returns discordUserId as null when not in cookie", () => {
        const now = Date.now();
        const timestamp = now.toString();
        const payload = `discord_verified:${timestamp}`;
        const signature = crypto.createHmac("sha256", TEST_SECRET).update(payload).digest("hex");
        const cookie = `${timestamp}.${signature}`;

        const result = verifyDiscordCookie(cookie, TEST_SECRET, now);
        expect(result.verified).toBe(true);
        expect(result.discordUserId).toBeNull();
    });
});
