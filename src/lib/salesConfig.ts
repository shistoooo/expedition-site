/**
 * Toggle sales on/off via Vercel env var NEXT_PUBLIC_SALES_OPEN.
 * - "true"  → checkout normal (Stripe)
 * - "false" → waitlist mode (email collection)
 *
 * Change in Vercel dashboard → redeploy → live in ~30s.
 */
export const SALES_OPEN = true;

/**
 * Quel(s) segment(s) de prix TubeForge afficher — pilote /tubeforge.
 * - "classic"          → seulement l'abonnement mensuel/annuel (état historique)
 * - "recharge_lifetime" → seulement la recharge (14,99€/mois, sans engagement) + le lifetime (49,99€)
 * - "both"             → les deux modèles affichés côte à côte
 *
 * Les deux systèmes vivent en parallèle côté backend (jamais l'un ne remplace
 * l'autre) — cette valeur ne fait que MUTER l'affichage, à changer ici puis
 * redéployer pour mettre en avant l'un ou l'autre.
 */
export const PRICING_MODE: "classic" | "recharge_lifetime" | "both" = "recharge_lifetime";
