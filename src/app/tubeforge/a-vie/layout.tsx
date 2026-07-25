import type { Metadata } from "next";

// Page « offre privée » accès à vie : jamais indexée, accessible par lien seulement.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AVieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
