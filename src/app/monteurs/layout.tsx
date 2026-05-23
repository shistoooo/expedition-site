import type { Metadata } from "next";

// Force dynamic — la page consomme ?tool=premiere|davinci et ?utm_* via useSearchParams
export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "Le plugin Premiere & DaVinci pour monteurs YouTube freelance | TubeForge",
  description:
    "Économise 5h par mois sur tes projets YouTube. TubeForge intègre tes références directement dans Premiere Pro ou DaVinci Resolve. Rentable dès le premier projet.",
  alternates: { canonical: `${siteUrl}/monteurs` },
  openGraph: {
    title: "Le plugin Premiere & DaVinci pour monteurs YouTube freelance",
    description:
      "Économise 5h par mois sur tes projets YouTube. Plus jamais d'aller-retour entre 20 onglets et 4K Video Downloader.",
    url: `${siteUrl}/monteurs`,
    siteName: "Expédition",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TubeForge — Le plugin Premiere & DaVinci pour monteurs YouTube",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Le plugin Premiere & DaVinci pour monteurs YouTube freelance",
    description: "Économise 5h par mois. Plugin direct dans ta timeline. Rentable dès le premier projet.",
    images: ["/og-image.jpg"],
  },
};

export default function MonteursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
