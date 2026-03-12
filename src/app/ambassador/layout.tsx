import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "Programme Ambassadeur | Expédition",
  description: "Partagez Expédition, gagnez 42% de commission pendant 6 mois sur chaque abonnement généré via votre code de parrainage.",
  openGraph: {
    title: "Programme Ambassadeur — 42% de commission | Expédition",
    description: "Recommandez Expédition et gagnez 42% de commission pendant 6 mois par filleul. Sans plafond.",
    url: `${siteUrl}/ambassador`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Programme Ambassadeur Expédition — 42% de commission" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Programme Ambassadeur — 42% de commission | Expédition",
    description: "Recommandez Expédition et gagnez 42% de commission pendant 6 mois par filleul. Sans plafond.",
    images: ["/og-image.jpg"],
  },
};

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
