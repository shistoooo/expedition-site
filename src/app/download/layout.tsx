import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Récupérer une vidéo en MP4 — 1500+ sites | TubeForge Web",
  description:
    "Récupère une vidéo en MP4 depuis plus de 1 500 sites, gratuitement, avec TubeForge Web. Qualité 720p, 15 par jour. Passe à Pro pour le 4K et la vitesse max.",
  openGraph: {
    title: "TubeForge Web — une vidéo en MP4, depuis 1500+ sites",
    description: "Récupère une vidéo en MP4 720p, gratuitement. 15 par jour.",
    url: "https://expedition.so/download",
  },
};

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
