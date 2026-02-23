import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClipForge | Expédition",
  description: "Transformez vos vidéos longues en clips viraux. Découpage IA, sous-titres automatiques, recadrage 9:16 pour TikTok et YouTube Shorts.",
};

export default function ClipForgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
