import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Économie Expédition | Expedition Coin (EX)",
  description:
    "Découvrez l'économie virtuelle du Discord Expédition : gagnez de l'Or, convertissez du Bronze, dépensez des Éclats. La monnaie qui fait circuler les talents.",
};

export default function EconomieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
