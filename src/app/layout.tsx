import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Expédition | Les outils pour les créateurs",
  description: "Découvrez les outils développés par la communauté Expédition. ClipForge et bien plus pour booster votre création de contenu sur YouTube, TikTok et Twitch.",
  keywords: ["expedition", "tools", "clipforge", "youtube", "tiktok", "discord", "création", "vidéo", "ia"],
  openGraph: {
    title: "Expédition | Les outils pour les créateurs",
    description: "Rejoignez l'aventure Expédition et accédez aux meilleurs outils pour créateurs de contenu.",
    url: "https://expedition.so",
    siteName: "Expédition",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expédition | Les outils pour les créateurs",
    description: "Rejoignez l'aventure Expédition et accédez aux meilleurs outils pour créateurs de contenu.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalSpace />
        {children}
      </body>
    </html>
  );
}
