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
 * On ne cherche PAS a se placer sur « telecharger video youtube gratuit ».
 * Cette requete est un marecage de sites publicitaires ou l'on ne gagne rien a
 * etre confondu avec eux, et le visiteur qu'elle amene ne devient jamais client.
 * (Une deuxieme raison a disparu le 28/07/2026 avec l'ouverture de la porte
 * Discord : le trafic ne tombe plus sur un mur de connexion.)
 *
 * On vise le probleme du monteur : recuperer un extrait pour Premiere Pro ou
 * DaVinci Resolve. Ces requetes amenent des gens pour qui TubeForge a un sens,
 * et le contenu de la page (comparaison chiffree, captures reelles) repond
 * vraiment a leur question.
 */
export const metadata: Metadata = {
  // 50 caracteres : tient dans un resultat de recherche sans etre tronque.
  title: "Télécharger une vidéo pour Premiere Pro ou DaVinci",
  // ⚠️ Ne plus promettre ce que la page ne demande plus. Cette phrase se
  // terminait par « Outil gratuit pour les membres du Discord Expédition »,
  // devenu faux le 28/07/2026 : il n'y a plus de connexion a faire. Sur la page
  // qui vend l'honnetete comme argument principal, un resultat de recherche qui
  // annonce une condition inexistante coute plus qu'il ne rapporte.
  description:
    "Colle un lien YouTube, TikTok, X ou Twitch et récupère le fichier en 1080p, sans publicité ni recompression. Gratuit, sans compte et sans installation.",
  /**
   * Canonical pointe sur l'URL qui sert REELLEMENT cette page.
   *
   * Il valait `https://expeditionlauncher.store/tubeforge/telecharger` — une URL
   * qui renvoie 404. Constate le 27/07/2026 : `expeditionlauncher.store` est le
   * domaine de PRODUCTION, mais le projet n'a plus de deploiement marque
   * Production (regle « jamais vercel --prod »), donc il sert un build anterieur
   * a toute la section `/tubeforge`. Un canonical vers un 404 dit a Google
   * « la vraie version est la-bas », et la-bas il n'y a rien.
   *
   * Le SUPPRIMER ne suffit pas : la page herite alors du canonical du segment
   * parent, `.../tubeforge`, et se declare donc doublon de la page produit — un
   * autre mensonge, verifie apres coup sur la page servie. Il faut donc le poser
   * explicitement, et auto-referent est le defaut sur.
   *
   * ⚠️ A METTRE A JOUR le jour ou le domaine public est arrete, en meme temps que
   * l'entree au sitemap qui manque pour la meme raison. Tant que rien ne pointe
   * vers cette page, elle reste de toute facon introuvable par un moteur.
   */
  alternates: { canonical: "https://tubeforge.explauncheur.space/tubeforge/telecharger" },
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
