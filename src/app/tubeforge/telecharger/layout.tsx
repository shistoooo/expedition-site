import type { Metadata } from "next";

/**
 * Metadonnees propres au telechargeur.
 *
 * La page etant un composant client, elle ne peut pas exporter `metadata` :
 * sans ce layout de segment, elle heritait du titre de la one-page TubeForge et
 * se presentait donc comme une page produit, ce qu'elle n'est pas.
 *
 * INTENTION DE RECHERCHE VISEE, et celle qu'on evite.
 *
 * On ne cherche PAS a se placer sur « telecharger video youtube gratuit ». Deux
 * raisons : le trafic arriverait sur une porte Discord et repartirait aussitot,
 * et cette requete est un marecage de sites publicitaires ou l'on ne gagne rien
 * a etre confondu avec eux.
 *
 * On vise le probleme du monteur : recuperer un extrait pour Premiere Pro ou
 * DaVinci Resolve. Ces requetes amenent des gens pour qui TubeForge a un sens,
 * et le contenu de la page (comparaison chiffree, captures reelles) repond
 * vraiment a leur question.
 */
export const metadata: Metadata = {
  // 50 caracteres : tient dans un resultat de recherche sans etre tronque.
  title: "Télécharger une vidéo pour Premiere Pro ou DaVinci",
  description:
    "Colle un lien YouTube, TikTok, X ou Twitch et récupère le fichier en 1080p, sans publicité ni recompression. Outil gratuit pour les membres du Discord Expédition.",
  alternates: { canonical: "https://expeditionlauncher.store/tubeforge/telecharger" },
  openGraph: {
    title: "Télécharger une vidéo pour ton montage, sans publicité",
    description:
      "YouTube, TikTok, X, Twitch. Le fichier d’origine en 1080p, sans publicité ni recompression.",
    url: "https://expeditionlauncher.store/tubeforge/telecharger",
    siteName: "Expédition",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Télécharger une vidéo pour ton montage, sans publicité",
    description: "YouTube, TikTok, X, Twitch. Le fichier d’origine en 1080p, sans publicité.",
  },
};

export default function TelechargerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
