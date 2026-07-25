import type { Metadata } from "next";

// Page de confirmation post-paiement : jamais indexée.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function MerciLayout({ children }: { children: React.ReactNode }) {
  return children;
}
