import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs | Expédition",
  description: "Rejoignez la Vague Pionnier à 9,99€/mois. Prix bloqué à vie. Accédez à tous les outils Expédition : ClipForge, TubeForge, Launcher et plus.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
