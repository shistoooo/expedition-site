import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outils | Expédition",
  description: "Découvrez tous les outils Expédition : TubeForge, ClipForge, ReviewForge, Launcher. Une suite complète pour créateurs de contenu.",
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
