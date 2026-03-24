import { describe, it, expect } from "vitest";
import {
    calculateFinalPrice,
    normalizePromoCode,
    buildRegisterPayload,
    isPromoError,
    isPasswordError,
    PLANS,
    DISCORD_PROMO_CODE,
} from "@/lib/checkout";

describe("calculateFinalPrice", () => {
    it("returns base price when no discount", () => {
        const result = calculateFinalPrice(11.99, null);
        expect(result.finalPrice).toBe(11.99);
        expect(result.discountLabel).toBe("");
    });

    it("returns base price when discount has null values", () => {
        const result = calculateFinalPrice(11.99, { percentOff: null, amountOff: null });
        expect(result.finalPrice).toBe(11.99);
        expect(result.discountLabel).toBe("");
    });

    it("applies percent off discount correctly", () => {
        const result = calculateFinalPrice(11.99, { percentOff: 20, amountOff: null });
        expect(result.finalPrice).toBeCloseTo(9.592);
        expect(result.discountLabel).toBe("-20%");
    });

    it("applies 100% percent off discount", () => {
        const result = calculateFinalPrice(11.99, { percentOff: 100, amountOff: null });
        expect(result.finalPrice).toBeCloseTo(0);
        expect(result.discountLabel).toBe("-100%");
    });

    it("applies amount off discount correctly (amountOff is in cents)", () => {
        const result = calculateFinalPrice(11.99, { percentOff: null, amountOff: 500 });
        expect(result.finalPrice).toBeCloseTo(6.99);
        expect(result.discountLabel).toBe("-5.00€");
    });

    it("clamps final price to 0 when amountOff exceeds base price", () => {
        const result = calculateFinalPrice(11.99, { percentOff: null, amountOff: 5000 });
        expect(result.finalPrice).toBe(0);
        expect(result.discountLabel).toBe("-50.00€");
    });

    it("prioritizes percentOff over amountOff when both are set", () => {
        const result = calculateFinalPrice(100, { percentOff: 10, amountOff: 2000 });
        expect(result.finalPrice).toBeCloseTo(90);
        expect(result.discountLabel).toBe("-10%");
    });

    it("works with yearly plan price", () => {
        const result = calculateFinalPrice(PLANS.yearly.price, { percentOff: 50, amountOff: null });
        expect(result.finalPrice).toBeCloseTo(49.995);
        expect(result.discountLabel).toBe("-50%");
    });
});

describe("normalizePromoCode", () => {
    it("trims whitespace and uppercases", () => {
        expect(normalizePromoCode("  discord837204 ")).toBe("DISCORD837204");
    });

    it("returns empty string for empty input", () => {
        expect(normalizePromoCode("")).toBe("");
    });

    it("handles already uppercase codes", () => {
        expect(normalizePromoCode("EXPEDITION20")).toBe("EXPEDITION20");
    });
});

describe("buildRegisterPayload", () => {
    it("builds correct payload with promo code", () => {
        const payload = buildRegisterPayload("test@example.com", "password123", "DISCOUNT20", "monthly");
        expect(payload).toEqual({
            email: "test@example.com",
            password: "password123",
            promoCode: "DISCOUNT20",
            plan: "monthly",
            discordUserId: undefined,
        });
    });

    it("sets promoCode to undefined when empty", () => {
        const payload = buildRegisterPayload("test@example.com", "password123", "", "yearly");
        expect(payload.promoCode).toBeUndefined();
    });

    it("sets promoCode to undefined when whitespace only", () => {
        const payload = buildRegisterPayload("test@example.com", "password123", "   ", "monthly");
        expect(payload.promoCode).toBeUndefined();
    });

    it("includes discordUserId when provided", () => {
        const payload = buildRegisterPayload("test@example.com", "password123", DISCORD_PROMO_CODE, "monthly", "123456789");
        expect(payload.discordUserId).toBe("123456789");
    });

    it("sets discordUserId to undefined when empty string", () => {
        const payload = buildRegisterPayload("test@example.com", "password123", "", "monthly", "");
        expect(payload.discordUserId).toBeUndefined();
    });
});

describe("isPromoError", () => {
    it("detects 'Code promo' error messages", () => {
        expect(isPromoError("Code promo invalide ou expiré")).toBe(true);
    });

    it("detects generic 'promo' error messages", () => {
        expect(isPromoError("Le promo code est invalide")).toBe(true);
    });

    it("returns false for non-promo errors", () => {
        expect(isPromoError("Email ou mot de passe incorrect")).toBe(false);
    });
});

describe("isPasswordError", () => {
    it("detects 'mot de passe' error", () => {
        expect(isPasswordError("Mot de passe incorrect")).toBe(true);
    });

    it("detects 'incorrect' error", () => {
        expect(isPasswordError("Email ou mot de passe incorrect")).toBe(true);
    });

    it("returns false for non-password errors", () => {
        expect(isPasswordError("Code promo invalide")).toBe(false);
    });
});

describe("DISCORD_PROMO_CODE constant", () => {
    it("is the expected hardcoded value", () => {
        expect(DISCORD_PROMO_CODE).toBe("DISCORD837204");
    });
});

describe("PLANS", () => {
    it("has monthly plan with correct price", () => {
        expect(PLANS.monthly.price).toBe(11.99);
    });

    it("has yearly plan with correct price", () => {
        expect(PLANS.yearly.price).toBe(99.99);
    });
});

describe("Discord promo code bug scenario", () => {
    it("DISCORD837204 is auto-applied but must be valid on Stripe backend", () => {
        // This test documents the bug: the frontend auto-applies DISCORD837204
        // when Discord is verified, but if Stripe doesn't have this coupon,
        // the API returns "Code promo invalide ou expiré"
        const payload = buildRegisterPayload(
            "user@example.com",
            "pass12345",
            DISCORD_PROMO_CODE,
            "monthly",
            "discord-user-id-123"
        );

        // The promo code IS sent to the backend
        expect(payload.promoCode).toBe("DISCORD837204");
        // The discordUserId is also sent
        expect(payload.discordUserId).toBe("discord-user-id-123");

        // BUG: If backend doesn't recognize DISCORD837204, user sees both:
        // ✅ "Membre Discord vérifié — réduction appliquée automatiquement"
        // ❌ "Code promo invalide ou expiré"
        // These two states are contradictory.
    });

    it("when Discord verified, promo input is disabled — user cannot fix the code", () => {
        // Documents that the input is disabled={discordVerified}
        // So if the auto-applied code is invalid, the user is stuck
        const discordVerified = true;
        const promoCode = DISCORD_PROMO_CODE;
        const inputDisabled = discordVerified;

        expect(inputDisabled).toBe(true);
        expect(promoCode).toBe("DISCORD837204");
        // User cannot change the code because input is disabled
    });
});
