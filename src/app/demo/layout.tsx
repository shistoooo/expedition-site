import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "Démo TubeForge — Le plugin Premiere & DaVinci en action | Expédition",
  description:
    "60 secondes pour voir TubeForge intégrer tes références YouTube directement dans ta timeline Premiere Pro ou DaVinci Resolve.",
  alternates: { canonical: `${siteUrl}/demo` },
  openGraph: {
    title: "Démo TubeForge — Le plugin Premiere & DaVinci en action",
    description:
      "60 secondes pour voir TubeForge intégrer tes références YouTube directement dans ta timeline.",
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
    description: "60 secondes pour voir le plugin en action.",
    images: ["/og-image.jpg"],
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
