/**
 * Registry des partenaires — landing pages dédiées /via/<slug>.
 *
 * Chaque partenaire a sa page personnalisée qui mélange son univers et celui
 * d'Expédition. Le slug sert AUSSI de clé d'attribution (cookie + worker),
 * voir src/lib/partnerAttribution.ts.
 *
 * Pour ajouter un partenaire : ajoute une entrée ici + dépose son logo dans
 * public/partners/<slug>.png|webp. C'est tout.
 *
 * MODE BROUILLON (`draft: true`) : les champs de preuve laissés vides
 * (founderQuote, membersLabel, etc.) affichent un encart "À REMPLIR" visible
 * sur la landing. Pratique pour envoyer la démo au partenaire afin qu'il voie
 * où placer sa citation / ses chiffres. Une fois rempli, passe `draft` à false.
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
  /** Début du H1 (blanc). */
  tagline: string;
  /** Fin du H1, rendue en dégradé aux couleurs du partenaire (accent visuel). */
  taglineAccent?: string;
  /** Court paragraphe qui explique le partenariat (univers mélangé). */
  intro: string;
  /** URL du Discord / communauté du partenaire (optionnel). */
  communityUrl?: string;

  // ── Éléments de preuve (optionnels — placeholder "À REMPLIR" si draft + vide) ──
  /** Citation du fondateur / représentant du partenaire. */
  founderQuote?: string;
  /** Nom de l'auteur de la citation. */
  founderName?: string;
  /** Rôle de l'auteur (ex: "Fondateur de Fire Writing"). */
  founderRole?: string;
  /** Label social proof (ex: "+2 400 membres", "Communauté de 5 000 créateurs"). */
  membersLabel?: string;
  /** ID YouTube de la vidéo "C'est quoi Expédition" dédiée au partenaire.
   *  Vide + draft → slot vidéo "À REMPLIR". */
  videoDemoId?: string;

  /** Si true : les champs de preuve vides affichent un encart "À REMPLIR". */
  draft?: boolean;
};

export const PARTNERS: Record<string, Partner> = {
  firewriting: {
    slug: "firewriting",
    name: "Fire Writing",
    community: "Fire Writers",
    logo: "/partners/firewriting.webp",
    accentColor: "#3b82f6", // blue-500
    accentColor2: "#22d3ee", // cyan-400
    tagline: "Plus d'outils à chaque vague.",
    taglineAccent: "Le même prix, à vie.",
    intro:
      "Tu viens de Fire Writing. Expédition, c'est une suite d'outils pour créateurs de contenu. Regarde TubeForge : développé sans relâche jusqu'à te faire gagner des heures sur la prépa de tes vidéos. Les prochains suivent le même chemin — inclus dans ton abonnement, sans surcoût. Tu rejoins maintenant : ton prix est bloqué, sur tout ce qui arrive.",

    // Social proof — fourni : 500 membres sur le serveur.
    membersLabel: "500 membres",

    // Citation des fondateurs — noms fournis. Le texte ci-dessous est une
    // PROPOSITION à faire valider par Yasser, Tommate & Lucasvr avant la prod.
    founderQuote:
      "Nos membres produisent du contenu vidéo non-stop. La prépa, le téléchargement des références, c'est du temps qu'on préfère passer à créer. Expédition règle ça proprement — c'est pour ça qu'on le partage avec la commu.",
    founderName: "Yasser, Tommate & Lucasvr",
    founderRole: "Fondateurs de Fire Writing",
    communityUrl: undefined,

    // ── À REMPLIR : vidéo "C'est quoi Expédition" dédiée Fire Writing ──
    // (centrée sur leur problématique). Slot "À remplir" affiché tant que vide.
    videoDemoId: undefined,
    draft: true,
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
