import type { Metadata } from "next";

// Page d'inscription essai : jamais indexée (parcours, pas contenu SEO).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function EssaiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
