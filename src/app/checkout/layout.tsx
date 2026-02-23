import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement | Expédition",
  description: "Finalisez votre inscription à Expédition. Paiement sécurisé par Stripe.",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
