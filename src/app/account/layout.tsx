import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon compte | Expédition",
  description: "Gérez votre abonnement Expédition, consultez votre statut et modifiez vos préférences.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
