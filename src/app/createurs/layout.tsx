import type { Metadata } from "next";

// Force dynamic — consomme ?utm_* via useSearchParams
export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "Le plugin Premiere & DaVinci pour créateurs YouTube | TubeForge",
  description:
    "Ton workflow YouTube enfin fluide dans Premiere Pro et DaVinci Resolve. Plus de stress logistique, plus de temps pour ton contenu.",
  alternates: { canonical: `${siteUrl}/createurs` },
  openGraph: {
    title: "Le plugin Premiere & DaVinci pour créateurs YouTube",
    description:
      "Ton workflow YouTube enfin fluide. TubeForge unifie téléchargements, recherche, import dans ton outil de montage.",
    url: `${siteUrl}/createurs`,
    siteName: "Expédition",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TubeForge — Le plugin Premiere & DaVinci pour créateurs YouTube",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Le plugin Premiere & DaVinci pour créateurs YouTube",
    description: "Ton workflow YouTube enfin fluide. Plus de stress logistique.",
    images: ["/og-image.jpg"],
  },
};

export default function CreateursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
