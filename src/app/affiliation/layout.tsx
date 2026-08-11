import type { Metadata } from "next";

/**
 * Sans ces métadonnées, la page héritait du titre racine — « Expédition, outils
 * desktop pour créateurs YouTube | TubeForge, ClipForge, ReviewForge ». Sur
 * `expeditionlauncher.store`, qui ne vend plus que TubeForge depuis la bascule,
 * l'onglet annonçait donc deux produits invisibles partout ailleurs.
 *
 * `noindex` : cette page ne s'ouvre qu'avec un jeton d'invitation. La référencer
 * n'apporterait rien à un visiteur, et exposerait le programme à des demandes
 * qu'on ne peut pas satisfaire — l'entrée se fait par invitation.
 */
export const metadata: Metadata = {
  title: "Programme d'affiliation — TubeForge",
  description: "Accepte ton invitation au programme d'affiliation TubeForge.",
  robots: { index: false, follow: false },
};

export default function AffiliationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
