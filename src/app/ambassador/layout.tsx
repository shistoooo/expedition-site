import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programme Ambassadeur | Expédition",
  description: "Partagez Expédition, gagnez 50% de commission récurrente sur chaque abonnement généré via votre code de parrainage.",
};

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
