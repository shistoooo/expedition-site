import type { Metadata } from "next";

// Force dynamic — la page lit le slug runtime + pose un cookie d'attribution.
export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

// Métadonnées génériques. Les pages partenaires ne doivent pas être indexées
// (ce sont des liens privés partagés en communauté) → robots noindex.
export const metadata: Metadata = {
  title: "Rejoins l'expédition | Expédition",
  description:
    "Tu viens d'une communauté partenaire ? Débloque TubeForge — le plugin Premiere & DaVinci qui te fait gagner du temps et de l'argent sur chaque montage.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteUrl}/` },
};

export default function ViaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
