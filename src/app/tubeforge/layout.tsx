import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import TubeForgeTracking from "@/components/tubeforge/TubeForgeTracking";
import CaptureParrainage from "@/components/CaptureParrainage";

// Display font scopée TubeForge : grotesque à caractère (axe optique un peu
// rugueux) — cohérente avec l'identité mono/technique ember, contrairement au
// Playfair éditorial hérité du reste du site via la règle h1/h2 globale.
// Sans `weight`, next/font sert la version VARIABLE : un seul fichier couvre
// l'axe 200-800. Avant, trois fichiers statiques etaient declares alors que
// seul le 800 etait rendu ; les deux autres n'etaient pas telecharges (un
// navigateur ne va chercher un fichier de police qu'au premier glyphe qui en
// a besoin) mais tout titre en font-bold aurait declenche une requete de plus.
const tfDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-tf-display",
});

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

// JSON-LD SoftwareApplication + offres (abonnement dès 4,99€/mois / accès à vie 39,99€).
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
  // Une seule offre depuis le 2026-08-08. Laisser les deux abonnements ici
  // ferait annoncer par Google un prix qu'aucune page ne vend plus — et c'est
  // le genre d'écart qui se découvre par un client qui lit 4,99 € et paie 39,99 €.
  offers: {
    "@type": "Offer",
    name: "TubeForge — achat unique",
    price: "39.99",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${siteUrl}/tubeforge/checkout?plan=lifetime`,
  },
};

export default function TubeForgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${tfDisplay.variable} tf-scope`}>
      <TubeForgeTracking />
      {/* Capte ?ref= dès la page produit : le lien partenaire n'a plus besoin
          de pointer droit sur le paiement pour que la commission survive. */}
      <CaptureParrainage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  );
}
