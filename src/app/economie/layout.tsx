import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "Économie Expédition | Expedition Coin (EX)",
  description:
    "Découvrez l'économie virtuelle du Discord Expédition : gagnez de l'Or, convertissez du Bronze, dépensez des Éclats. La monnaie qui fait circuler les talents.",
  openGraph: {
    title: "Économie Expédition — Expedition Coin (EX)",
    description: "Système de récompenses du Discord Expédition. Gagnez de l'Or, échangez des Éclats, faites circuler les talents.",
    url: `${siteUrl}/economie`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Économie Expédition — Expedition Coin" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Économie Expédition — Expedition Coin (EX)",
    description: "Système de récompenses du Discord Expédition. Gagnez de l'Or, échangez des Éclats, faites circuler les talents.",
    images: ["/og-image.jpg"],
  },
};

export default function EconomieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
