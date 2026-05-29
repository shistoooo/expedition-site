/**
 * Partner attribution — tracking SANS code promo.
 *
 * Quand un visiteur arrive via un lien partenaire (ex: /via/firewriting),
 * on set un cookie `partner_attribution` qui persiste 30 jours. Au moment
 * du checkout (register OU subscribe), le slug est envoyé au worker qui :
 * 1. Stocke `users.partner_slug` en BDD (source de vérité)
 * 2. Passe en metadata Stripe (visible dans le dashboard Stripe)
 *
 * Cette mécanique n'applique AUCUNE remise — c'est juste de l'attribution
 * marketing pour mesurer le ROI de chaque partenariat.
 *
 * Règles :
 * - Le premier partenaire qui amène un visiteur "gagne" l'attribution
 *   (le cookie n'est pas écrasé si déjà présent — voir setPartnerAttribution)
 * - L'attribution persiste 30 jours
 * - Côté worker, l'attribution n'est jamais écrasée si déjà set en BDD
 *   (setUserPartnerSlug a une clause WHERE partner_slug IS NULL)
 */

const COOKIE_NAME = "partner_attribution";
const COOKIE_DAYS = 30;

/** Normalise un slug pour matcher la regex côté worker (a-z, 0-9, -, _, 2-64 chars). */
function normalize(slug: string): string | null {
  const cleaned = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 64);
  return cleaned.length >= 2 ? cleaned : null;
}

/** Lit le cookie partner_attribution. Retourne le slug normalisé ou null. */
export function getPartnerAttribution(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    return normalize(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

/**
 * Set le cookie partner_attribution. Ne fait RIEN si déjà présent (premier
 * partenaire gagne l'attribution — évite de surécrire par accident).
 */
export function setPartnerAttribution(slug: string): void {
  if (typeof document === "undefined") return;
  const cleaned = normalize(slug);
  if (!cleaned) return;

  // Si un cookie existe déjà, ne pas l'overwrite (first-touch attribution).
  if (getPartnerAttribution()) return;

  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  const isHttps = window.location.protocol === "https:";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(cleaned)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${isHttps ? "; Secure" : ""}`;
}

/**
 * Fire les events analytics pour le partner attribution.
 * À appeler dès qu'on set le cookie (sur /via/[slug]).
 */
export function trackPartnerAttribution(slug: string): void {
  if (typeof window === "undefined") return;
  const cleaned = normalize(slug);
  if (!cleaned) return;

  // Microsoft Clarity — tag custom permet de filtrer les sessions par partenaire
  // dans le dashboard Clarity (Filters → Custom tags).
  try {
    window.clarity?.("set", "partner", cleaned);
    window.clarity?.("event", "partner_attributed");
  } catch {
    // Clarity peut être bloqué par adblock — non-fatal
  }

  // Google Analytics 4 — event custom pour rapports custom
  try {
    window.gtag?.("event", "partner_attributed", {
      partner: cleaned,
    });
  } catch {
    // GA peut être bloqué — non-fatal
  }
}

// Type declarations pour les analytics globaux (Clarity + GA4 sont chargés via layout.tsx)
declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}
