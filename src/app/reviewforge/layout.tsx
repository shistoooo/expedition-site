import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "ReviewForge — partage de montages sécurisé de la suite Expédition",
  description:
    "ReviewForge partage tes montages en cours avec tes clients sans upload cloud : tunnel sécurisé, liens qui s'auto-détruisent, suivi en temps réel. Vague 3 — inclus dans ton abonnement Pionnier.",
  alternates: { canonical: `${siteUrl}/reviewforge` },
  openGraph: {
    title: "ReviewForge — partage de montages sécurisé | Expédition",
    description:
      "L'alternative à Frame.io, incluse dans ton abonnement. Tes vidéos restent sur ta machine, liens éphémères, suivi en temps réel. En préparation — réserve ton tarif Pionnier.",
    url: `${siteUrl}/reviewforge`,
    siteName: "Expédition",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ReviewForge — partage de montages sécurisé de la suite Expédition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReviewForge — partage de montages sécurisé | Expédition",
    description: "L'alternative à Frame.io, incluse dans ton abonnement Pionnier. En préparation.",
    images: ["/og-image.jpg"],
  },
};

export default function ReviewForgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
