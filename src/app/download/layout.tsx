import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Télécharger des vidéos YouTube gratuitement | TubeForge Web",
  description:
    "Téléchargez des vidéos YouTube en MP4 gratuitement avec TubeForge Web. Qualité 720p, 15 téléchargements par jour. Passez à Pro pour la vitesse maximale et le 4K.",
  openGraph: {
    title: "TubeForge Web — Téléchargeur YouTube gratuit",
    description: "Téléchargez vos vidéos YouTube en MP4 720p gratuitement. 15 téléchargements par jour.",
    url: "https://expedition.so/download",
  },
};

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
