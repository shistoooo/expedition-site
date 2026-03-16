import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Expédition",
  description: "Panneau d'administration Expédition.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
