/**
 * Toggle sales on/off via Vercel env var NEXT_PUBLIC_SALES_OPEN.
 * - "true"  → checkout normal (Stripe)
 * - "false" → waitlist mode (email collection)
 *
 * Change in Vercel dashboard → redeploy → live in ~30s.
 */
export const SALES_OPEN =
  (process.env.NEXT_PUBLIC_SALES_OPEN || "false") === "true";
