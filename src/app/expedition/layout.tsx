import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

export const metadata: Metadata = {
  title: "L'Expédition | Programme Créateurs",
  description: "Rejoignez l'Expédition : un accélérateur de 60 jours pour créateurs de contenu. Stratégie, entraide et passage à l'action.",
  openGraph: {
    title: "L'Expédition — Programme Créateurs",
    description: "Accélérateur de 60 jours pour créateurs YouTube. Stratégie personnalisée, groupe restreint, feedback constant.",
    url: `${siteUrl}/expedition`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "L'Expédition — Programme Créateurs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "L'Expédition — Programme Créateurs",
    description: "Accélérateur de 60 jours pour créateurs YouTube. Stratégie personnalisée, groupe restreint, feedback constant.",
    images: ["/og-image.jpg"],
  },
};

export default function ExpeditionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
