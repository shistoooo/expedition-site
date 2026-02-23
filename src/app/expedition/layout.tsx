import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "L'Expédition | Programme Créateurs",
  description: "Rejoignez l'Expédition : un accélérateur de 60 jours pour créateurs de contenu. Stratégie, entraide et passage à l'action.",
};

export default function ExpeditionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
