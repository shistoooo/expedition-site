import type { Metadata } from "next";

// Page de paiement : jamais indexée (lien-only, contenu transactionnel).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
