import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "ClipForge — le générateur de clips viraux de la suite Expédition",
  description:
    "ClipForge transforme tes vidéos YouTube en clips verticaux prêts à poster : moments viraux détectés par l'IA, recadrage qui suit le visage, sous-titres animés. Vague 2 — inclus dans ton abonnement Pionnier.",
  alternates: { canonical: `${siteUrl}/clipforge` },
  openGraph: {
    title: "ClipForge — clips viraux générés par l'IA | Expédition",
    description:
      "L'alternative à OpusClip, incluse dans ton abonnement. Moments viraux, recadrage visage, sous-titres animés. En développement — réserve ton tarif Pionnier.",
    url: `${siteUrl}/clipforge`,
    siteName: "Expédition",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ClipForge — le générateur de clips de la suite Expédition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClipForge — clips viraux générés par l'IA | Expédition",
    description: "L'alternative à OpusClip, incluse dans ton abonnement Pionnier. En développement.",
    images: ["/og-image.jpg"],
  },
};

export default function ClipForgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
