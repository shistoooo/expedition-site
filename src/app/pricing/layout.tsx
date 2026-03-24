import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "Tarifs | Expédition",
  description: "Rejoignez la Vague Pionnier dès 8,03€/mois — tarif bloqué tant que vous restez abonné. TubeForge, ClipForge, ReviewForge et plus.",
  openGraph: {
    title: "Tarifs — Expédition | Dès 8,03€/mois",
    description: "Un seul abonnement, tous les outils. Tarif bloqué à vie pour les Pionniers. TubeForge, ClipForge, ReviewForge inclus.",
    url: `${siteUrl}/pricing`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Tarifs Expédition — Vague Pionnier" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarifs — Expédition | Dès 8,03€/mois",
    description: "Un seul abonnement, tous les outils. Tarif bloqué à vie pour les Pionniers.",
    images: ["/og-image.jpg"],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
