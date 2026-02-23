import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TubeForge | Expédition",
  description: "Téléchargez des vidéos YouTube en 8K, 60fps, sans publicité. L'outil ultime pour archiver vos contenus préférés.",
};

export default function TubeForgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
