/**
 * Registry des partenaires — landing pages dédiées /via/<slug>.
 *
 * Chaque partenaire a sa page personnalisée qui mélange son univers et celui
 * d'Expédition. Le slug sert AUSSI de clé d'attribution (cookie + worker),
 * voir src/lib/partnerAttribution.ts.
 *
 * Pour ajouter un partenaire : ajoute une entrée ici + dépose son logo dans
 * public/partners/<slug>.png (ou .svg). C'est tout.
 */

export type Partner = {
  /** Slug unique — sert d'URL (/via/<slug>) ET de clé d'attribution. */
  slug: string;
  /** Nom affiché du partenaire. */
  name: string;
  /** Comment on appelle leur communauté (ex: "Fire Writers"). */
  community: string;
  /** Chemin du logo dans /public. */
  logo: string;
  /** Couleur d'accent du partenaire (hex) — utilisée pour le dégradé de la landing. */
  accentColor: string;
  /** Couleur secondaire pour le dégradé. */
  accentColor2: string;
  /** Phrase d'accroche personnalisée affichée sur la landing. */
  tagline: string;
  /** Court paragraphe qui explique le partenariat (univers mélangé). */
  intro: string;
  /** URL du Discord / communauté du partenaire (optionnel). */
  communityUrl?: string;
};

export const PARTNERS: Record<string, Partner> = {
  firewriting: {
    slug: "firewriting",
    name: "Fire Writing",
    community: "Fire Writers",
    logo: "/partners/firewriting.webp",
    accentColor: "#3b82f6", // blue-500
    accentColor2: "#22d3ee", // cyan-400
    tagline: "L'écriture qui prend feu, le montage qui suit.",
    intro:
      "Tu viens de la communauté Fire Writing. Ici, on partage la même obsession : créer mieux, plus vite, sans se noyer dans la logistique. Fire Writing t'aide à écrire — Expédition s'occupe du reste de ta production vidéo.",
    communityUrl: undefined,
  },
};

/** Récupère un partenaire par slug (insensible à la casse). Retourne null si inconnu. */
export function getPartner(slug: string): Partner | null {
  if (!slug) return null;
  const cleaned = slug.trim().toLowerCase();
  return PARTNERS[cleaned] ?? null;
}

/** Liste tous les slugs de partenaires (pour generateStaticParams). */
export function getAllPartnerSlugs(): string[] {
  return Object.keys(PARTNERS);
}
