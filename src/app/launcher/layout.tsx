import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "Command Center | Expédition",
  description: "Téléchargez le Launcher Expédition. Centralisez tous vos outils créatifs, gérez les mises à jour automatiquement.",
  openGraph: {
    title: "Command Center — Expédition",
    description: "Votre QG de créateur. Centralisez TubeForge, ClipForge, ReviewForge et gérez tout depuis un seul launcher.",
    url: `${siteUrl}/launcher`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Expedition Launcher — Command Center" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Command Center — Expédition",
    description: "Votre QG de créateur. Centralisez TubeForge, ClipForge, ReviewForge et gérez tout depuis un seul launcher.",
    images: ["/og-image.jpg"],
  },
};

export default function LauncherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
