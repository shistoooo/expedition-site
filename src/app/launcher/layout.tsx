import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Command Center | Expédition",
  description: "Téléchargez le Launcher Expédition. Centralisez tous vos outils créatifs, gérez les mises à jour automatiquement.",
};

export default function LauncherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
