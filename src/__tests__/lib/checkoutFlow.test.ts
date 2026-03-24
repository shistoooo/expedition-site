import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    DISCORD_PROMO_CODE,
    buildRegisterPayload,
    calculateFinalPrice,
    PLANS,
    isPromoError,
} from "@/lib/checkout";

/**
 * These tests simulate the checkout API flow to verify promo code handling,
 * especially the Discord auto-apply bug where the frontend shows "réduction appliquée"
 * but the backend rejects the code.
 */

describe("Checkout flow: Discord promo code", () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it("register succeeds when promo code is valid on backend", async () => {
        const mockResponse = {
            success: true,
            discount: { percentOff: 20, amountOff: null },
            clientSecret: "pi_test_secret",
            subscriptionId: "sub_test",
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        } as Response);

        const payload = buildRegisterPayload("user@test.com", "password123", DISCORD_PROMO_CODE, "monthly", "discord123");

        const res = await fetch("https://api.test.com/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        expect(data.success).toBe(true);
        expect(data.discount).toEqual({ percentOff: 20, amountOff: null });

        const { finalPrice } = calculateFinalPrice(PLANS.monthly.price, data.discount);
        expect(finalPrice).toBeCloseTo(9.592);
    });

    it("register fails when promo code is invalid on backend (THE BUG)", async () => {
        const errorResponse = {
            success: false,
            error: "Code promo invalide ou expiré",
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: () => Promise.resolve(errorResponse),
        } as unknown as Response);

        const payload = buildRegisterPayload("user@test.com", "password123", DISCORD_PROMO_CODE, "monthly", "discord123");

        const res = await fetch("https://api.test.com/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        // Backend rejects the code
        expect(data.success).toBe(false);
        expect(isPromoError(data.error)).toBe(true);

        // BUG: At this point, the UI still shows the green "Discord vérifié" banner
        // because discordVerified state is true (set from cookie verification),
        // but the error "Code promo invalide ou expiré" is also displayed.
        // These two states contradict each other.
    });

    it("subscribe endpoint also fails with invalid promo (existing user path)", async () => {
        // Simulate: register returns 409 (account exists), login succeeds, subscribe fails
        vi.mocked(global.fetch)
            // register → 409
            .mockResolvedValueOnce({
                ok: false,
                status: 409,
                json: () => Promise.resolve({ error: "Account already exists" }),
            } as unknown as Response)
            // login → success
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ accessToken: "token123", subscription: null }),
            } as Response)
            // subscribe → promo invalid
            .mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ error: "Code promo invalide ou expiré" }),
            } as unknown as Response);

        // 1. Register
        const registerRes = await fetch("https://api.test.com/auth/register", {
            method: "POST",
            body: JSON.stringify(buildRegisterPayload("user@test.com", "pass123", DISCORD_PROMO_CODE, "monthly")),
        });
        expect(registerRes.status).toBe(409);

        // 2. Login
        const loginRes = await fetch("https://api.test.com/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: "user@test.com", password: "pass123" }),
        });
        const loginData = await loginRes.json();
        expect(loginData.accessToken).toBe("token123");

        // 3. Subscribe with promo code
        const subRes = await fetch("https://api.test.com/portal/subscribe", {
            method: "POST",
            headers: { Authorization: `Bearer ${loginData.accessToken}` },
            body: JSON.stringify({ plan: "monthly", promoCode: DISCORD_PROMO_CODE }),
        });
        const subData = await subRes.json();

        expect(subRes.ok).toBe(false);
        expect(isPromoError(subData.error)).toBe(true);
    });

    it("register succeeds without promo code (no Discord, no referral)", async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                success: true,
                clientSecret: "pi_test_secret",
                subscriptionId: "sub_test",
            }),
        } as Response);

        const payload = buildRegisterPayload("user@test.com", "password123", "", "yearly");

        expect(payload.promoCode).toBeUndefined();

        const res = await fetch("https://api.test.com/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        expect(data.success).toBe(true);
    });
});

describe("Checkout flow: Discord verification then checkout", () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it("full flow: verify Discord cookie → auto-apply code → register", async () => {
        vi.mocked(global.fetch)
            // 1. Discord verify
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ verified: true, discordUserId: "discord456" }),
            } as Response)
            // 2. Register with auto-applied promo
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    success: true,
                    discount: { percentOff: 15, amountOff: null },
                    clientSecret: "pi_secret",
                    subscriptionId: "sub_123",
                }),
            } as Response);

        // Step 1: Verify Discord
        const verifyRes = await fetch("/api/discord/verify");
        const verifyData = await verifyRes.json();

        expect(verifyData.verified).toBe(true);

        // Step 2: Auto-apply promo code (simulating what useEffect does)
        let promoCode = "";
        let discordVerified = false;
        let discordUserId: string | undefined;

        if (verifyData.verified) {
            discordVerified = true;
            discordUserId = verifyData.discordUserId;
            promoCode = DISCORD_PROMO_CODE; // Auto-applied
        }

        expect(discordVerified).toBe(true);
        expect(promoCode).toBe("DISCORD837204");

        // Step 3: Register
        const payload = buildRegisterPayload("user@test.com", "pass123", promoCode, "monthly", discordUserId);
        const registerRes = await fetch("https://api.test.com/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        const registerData = await registerRes.json();

        expect(registerData.success).toBe(true);
        expect(registerData.discount.percentOff).toBe(15);

        const { finalPrice } = calculateFinalPrice(PLANS.monthly.price, registerData.discount);
        expect(finalPrice).toBeCloseTo(10.1915);
    });

    it("detects the contradiction: Discord verified but promo rejected", async () => {
        vi.mocked(global.fetch)
            // Discord verify succeeds
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ verified: true, discordUserId: "discord456" }),
            } as Response)
            // But register rejects the promo code
            .mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: () => Promise.resolve({
                    success: false,
                    error: "Code promo invalide ou expiré",
                }),
            } as unknown as Response);

        // Verify Discord
        const verifyRes = await fetch("/api/discord/verify");
        const verifyData = await verifyRes.json();
        const discordVerified = verifyData.verified;

        // Register with auto-applied promo
        const registerRes = await fetch("https://api.test.com/auth/register", {
            method: "POST",
            body: JSON.stringify(buildRegisterPayload("user@test.com", "pass", DISCORD_PROMO_CODE, "monthly")),
        });
        const registerData = await registerRes.json();

        // THE BUG: both of these are true at the same time
        expect(discordVerified).toBe(true); // ✅ green banner shown
        expect(isPromoError(registerData.error)).toBe(true); // ❌ red error shown

        // This should never happen — if Discord is verified, the discount should work
        // Fix: Either ensure DISCORD837204 coupon exists in Stripe,
        // or have the Worker apply the discount via discordUserId instead of promo code
    });
});
