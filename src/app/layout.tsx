import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import GlobalSpace from "@/components/GlobalSpace";
import Analytics from "@/components/Analytics";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expeditionlauncher.store";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Expédition — Outils desktop pour créateurs YouTube | TubeForge, ClipForge, ReviewForge",
  description: "Suite d'outils desktop pour YouTubeurs et monteurs : téléchargement 4K, clips automatiques, review sécurisé. Un abonnement, tous les outils. Dès 8,03€/mois.",
  keywords: ["expedition", "tools", "clipforge", "tubeforge", "montage", "premiere pro", "davinci resolve", "discord", "création", "vidéo", "ia"],
  openGraph: {
    title: "Expédition | Les outils pour les créateurs",
    description: "Rejoignez l'aventure Expédition et accédez aux meilleurs outils pour créateurs de contenu.",
    url: siteUrl,
    siteName: "Expédition",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Expédition — Suite d'outils pour créateurs de contenu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expédition | Les outils pour les créateurs",
    description: "Rejoignez l'aventure Expédition et accédez aux meilleurs outils pour créateurs de contenu.",
    images: ["/og-image.jpg"],
  },
  verification: { google: "oLXLGG98BZT1xUWic3Tg2exNujxy3tCgjOF1MCvJo5c" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Expédition Studio",
  url: siteUrl,
  description: "Suite d'outils pour créateurs de contenu : TubeForge, ClipForge, ReviewForge.",
  email: "contact@expeditionlauncher.store",
  sameAs: [
    process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.com/invite/QuV3bYDEYT",
  ].filter(Boolean),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased noise-overlay`}
      >
        <GlobalSpace />
        <Analytics />

        {/* ── MESURE D'AUDIENCE — hors du chemin critique ─────────────────────
            Ces deux scripts vivaient dans le <head>, en balises brutes. Mesure du
            02/08/2026 (profil mobile, 4G lente, processeur bridé 4×) :

                Google Tag Manager .... 586,9 Ko et 106 ms de processeur
                Microsoft Clarity ..... 101,7 Ko et  78 ms
                                        ─────────
                                        688 Ko — soit PLUS que tout notre propre
                                        JavaScript, et téléchargés en priorité.

            Le LCP de la page est son titre H1 : un texte, rien à télécharger.
            Il mettait pourtant 1 440 ms à s'afficher alors que le serveur avait
            répondu en 60 ms. Sur une ligne mobile, ces 688 Ko passent devant.

            ⚠️ LES DEUX STRATÉGIES SONT DIFFÉRENTES, ET C'EST VOULU :
              - `afterInteractive` pour l'analyse d'audience : elle mesure le
                tunnel de vente, on ne peut pas se permettre de perdre les
                visites courtes. Elle part dès que la page est interactive.
              - `lazyOnload` pour l'enregistrement de session : il n'alimente
                aucune décision commerciale, il attend donc que le navigateur
                n'ait plus rien de mieux à faire. */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        )}
        <Script id="clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "vyekj8t7md");`}
        </Script>
        {children}
      </body>
    </html>
  );
}
