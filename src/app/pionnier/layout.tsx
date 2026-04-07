import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "La suite YouTube. Au tarif Pionnier. | Expédition",
  description:
    "TubeForge, ClipForge, ReviewForge — un seul abonnement dès 8,03€/mois, tarif bloqué à vie. Réservé aux Pionniers.",
  alternates: { canonical: `${siteUrl}/pionnier` },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "La suite YouTube. Au tarif Pionnier.",
    description:
      "Un seul abonnement, tous les outils. Tarif bloqué à vie. Dès 8,03€/mois.",
    url: `${siteUrl}/pionnier`,
    siteName: "Expédition",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Expédition — La suite YouTube au tarif Pionnier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La suite YouTube. Au tarif Pionnier.",
    description: "Un seul abonnement, tous les outils. Dès 8,03€/mois — bloqué à vie.",
    images: ["/og-image.jpg"],
  },
};

export default function PionnierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
