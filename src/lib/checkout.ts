export type PlanType = "monthly" | "yearly";

export const PLANS: Record<PlanType, { price: number; label: string; period: string }> = {
    monthly: { price: 11.99, label: "/mois", period: "mois" },
    yearly: { price: 99.99, label: "/an", period: "an" },
};

export const DISCORD_PROMO_CODE = "DISCORD837204";

export interface Discount {
    percentOff: number | null;
    amountOff: number | null;
}

export function calculateFinalPrice(
    basePrice: number,
    discount: Discount | null
): { finalPrice: number; discountLabel: string } {
    let finalPrice = basePrice;
    let discountLabel = "";

    if (discount?.percentOff) {
        finalPrice = basePrice * (1 - discount.percentOff / 100);
        discountLabel = `-${discount.percentOff}%`;
    } else if (discount?.amountOff) {
        finalPrice = Math.max(0, basePrice - discount.amountOff / 100);
        discountLabel = `-${(discount.amountOff / 100).toFixed(2)}€`;
    }

    return { finalPrice, discountLabel };
}

export function normalizePromoCode(code: string): string {
    return code.trim().toUpperCase();
}

export function buildRegisterPayload(
    email: string,
    password: string,
    promoCode: string,
    plan: PlanType,
    discordUserId?: string
) {
    const promoTrimmed = promoCode.trim() || undefined;
    return {
        email,
        password,
        promoCode: promoTrimmed,
        plan,
        discordUserId: discordUserId || undefined,
    };
}

export function isPromoError(message: string): boolean {
    return message.includes("Code promo") || message.includes("promo");
}

export function isPasswordError(message: string): boolean {
    return message.includes("mot de passe") || message.includes("incorrect");
}
