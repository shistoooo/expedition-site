import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs | Expédition",
  description: "Rejoignez la Vague Pionnier dès 7,99€/mois — tarif bloqué tant que vous restez abonné. TubeForge (Vague 1), ClipForge (Vague 2), ReviewForge (Vague 3) et plus.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
