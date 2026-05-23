import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "TubeForge en démo — Tu colles un lien, ça atterrit dans ta timeline | Expédition",
  description:
    "La vidéo de démo de TubeForge : le plugin Premiere & DaVinci d'abord, puis recherche YouTube intégrée, multi-téléchargement, découpe avant téléchargement, extraction de frames, import de script.",
  alternates: { canonical: `${siteUrl}/demo` },
  openGraph: {
    title: "Démo TubeForge — Le plugin Premiere & DaVinci en action",
    description:
      "Le plugin Premiere & DaVinci, puis toutes les fonctionnalités du logiciel en vidéo.",
    url: `${siteUrl}/demo`,
    siteName: "Expédition",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Démo TubeForge — Le plugin Premiere & DaVinci en action",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Démo TubeForge — Le plugin Premiere & DaVinci en action",
    description: "La présentation complète : le plugin Premiere & DaVinci, puis toutes les fonctionnalités du logiciel.",
    images: ["/og-image.jpg"],
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
