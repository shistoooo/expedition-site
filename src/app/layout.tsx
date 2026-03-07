import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import GlobalSpace from "@/components/GlobalSpace";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Expédition | Les outils pour les créateurs",
  description: "Découvrez les outils développés par la communauté Expédition. TubeForge, ClipForge, ReviewForge et bien plus pour booster votre création de contenu.",
  keywords: ["expedition", "tools", "clipforge", "tubeforge", "youtube", "tiktok", "discord", "création", "vidéo", "ia"],
  openGraph: {
    title: "Expédition | Les outils pour les créateurs",
    description: "Rejoignez l'aventure Expédition et accédez aux meilleurs outils pour créateurs de contenu.",
    url: siteUrl,
    siteName: "Expédition",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expédition | Les outils pour les créateurs",
    description: "Rejoignez l'aventure Expédition et accédez aux meilleurs outils pour créateurs de contenu.",
  },
  // TODO: Remplacer par votre vrai code Google Search Console
  // verification: { google: "VOTRE_CODE_GOOGLE_SEARCH_CONSOLE" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Expédition Studio",
  url: siteUrl,
  description: "Suite d'outils pour créateurs de contenu : TubeForge, ClipForge, ReviewForge.",
  email: "contact@expedition.studio",
  sameAs: [
    process.env.NEXT_PUBLIC_DISCORD_URL || "https://dsc.gg/expedition",
  ].filter(Boolean),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}
      >
        <GlobalSpace />
        {children}
      </body>
    </html>
  );
}
