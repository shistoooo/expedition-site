import type { Metadata } from "next";

// Force dynamic — page cliente ("use client"), le segment config doit vivre ici.
export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expeditionlauncher.store";

export const metadata: Metadata = {
  title: "TubeForge — Récupère tes vidéos direct dans Premiere & DaVinci",
  description:
    "Colle un lien, TubeForge envoie l'extrait exact directement sur ta timeline Premiere Pro ou DaVinci Resolve. Plus de 1500 sites, 4K, sans détour.",
  alternates: { canonical: `${siteUrl}/tubeforge` },
  openGraph: {
    title: "TubeForge — Direct dans ta timeline",
    description:
      "Colle un lien, TubeForge envoie l'extrait exact directement sur ta timeline Premiere Pro ou DaVinci Resolve.",
    url: `${siteUrl}/tubeforge`,
    siteName: "Expédition",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TubeForge — Direct dans ta timeline Premiere & DaVinci",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TubeForge — Direct dans ta timeline",
    description: "Colle un lien, l'extrait arrive direct sur ta timeline. Plus de 1500 sites, 4K.",
    images: ["/og-image.jpg"],
  },
};

// JSON-LD SoftwareApplication + offres (abonnement dès 4,99€/mois / accès à vie 89,99€).
// Pas de note/avis agrégés ici : on n'invente pas de aggregateRating.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TubeForge",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "macOS, Windows",
  description:
    "Colle un lien, TubeForge envoie l'extrait exact directement sur ta timeline Premiere Pro ou DaVinci Resolve. Plus de 1500 sites, 4K.",
  url: `${siteUrl}/tubeforge`,
  offers: [
    {
      "@type": "Offer",
      name: "Abonnement mensuel",
      price: "4.99",
      priceCurrency: "EUR",
      url: `${siteUrl}/tubeforge/checkout?plan=sub&months=1`,
    },
    {
      "@type": "Offer",
      name: "Abonnement annuel (3,49€/mois)",
      price: "41.88",
      priceCurrency: "EUR",
      url: `${siteUrl}/tubeforge/checkout?plan=sub&months=12`,
    },
  ],
};

export default function TubeForgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
