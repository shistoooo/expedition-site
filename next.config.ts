import type { NextConfig } from "next";

/**
 * Directives CSP communes. `script-src` est ajoute a part, parce qu'UNE seule
 * page a besoin d'un cran de plus (voir CSP_SCRIPT_SRC_DOWNLOADER).
 */
const CSP_BASE = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  // Les 3 dernieres entrees servent le telechargeur web (/tubeforge/telecharger) :
  // le Worker resout les liens, les CDN de X et Twitch sont appeles EN DIRECT par
  // le navigateur (ils autorisent notre origine), et jnn-pa est l'API BotGuard.
  "connect-src 'self' blob: https://*.stripe.com https://api.clipapp.uk https://stream.clipapp.uk https://expedition-licensing.expedition-studio.workers.dev https://download-proxy.expedition-studio.workers.dev https://*.r2.dev https://discord.com https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms https://tubeforge-webdl.expedition-studio.workers.dev https://jnn-pa.googleapis.com https://video.twimg.com https://*.cloudfront.net",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.youtube-nocookie.com https://www.youtube.com",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
];

const CSP_SCRIPT_SRC =
  "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms https://www.youtube.com https://s.ytimg.com";

/**
 * `'unsafe-eval'`, UNIQUEMENT pour /tubeforge/telecharger.
 *
 * Pourquoi : l'attestation BotGuard (le PoToken qui empeche YouTube de nous
 * prendre pour un robot) execute un interpreteur fourni par Google qui evalue
 * du bytecode via `new Function`. Sans `'unsafe-eval'` il leve
 * « EvalError: ... 'unsafe-eval' is not an allowed source of script » et la VM
 * ne s'installe jamais — verifie en production le 26/07/2026.
 *
 * Pourquoi scope a cette page : la relacher partout affaiblirait aussi le
 * paiement et le compte. Cette page ne contient ni formulaire, ni donnee
 * personnelle, ni Stripe : c'est la seule ou le compromis est acceptable.
 */
const CSP_SCRIPT_SRC_DOWNLOADER = CSP_SCRIPT_SRC + " 'unsafe-eval'";

const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const csp = (scriptSrc: string) => ({
  key: "Content-Security-Policy",
  value: [scriptSrc, ...CSP_BASE].join("; "),
});

const securityHeaders = [...baseSecurityHeaders, csp(CSP_SCRIPT_SRC)];
const downloaderSecurityHeaders = [...baseSecurityHeaders, csp(CSP_SCRIPT_SRC_DOWNLOADER)];

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_WORKER_URL: process.env.NEXT_PUBLIC_WORKER_URL || "",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    NEXT_PUBLIC_R2_BUCKET_URL: process.env.NEXT_PUBLIC_R2_BUCKET_URL || "",
    NEXT_PUBLIC_DISCORD_URL: process.env.NEXT_PUBLIC_DISCORD_URL || "",
    NEXT_PUBLIC_DISCORD_INVITE_URL: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "",
    NEXT_PUBLIC_GITHUB_URL: process.env.NEXT_PUBLIC_GITHUB_URL || "",
    NEXT_PUBLIC_TWITTER_URL: process.env.NEXT_PUBLIC_TWITTER_URL || "",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "",
  },
  async headers() {
    return [
      {
        source: "/tubeforge/telecharger",
        headers: downloaderSecurityHeaders,
      },
      {
        // Tout le reste, en strict. L'exclusion est indispensable : deux regles
        // qui matchent enverraient deux en-tetes CSP, et le navigateur applique
        // l'INTERSECTION — `'unsafe-eval'` resterait donc bloque.
        source: "/((?!tubeforge/telecharger$).*)",
        headers: securityHeaders,
      },
      {
        // Vidéos de démo (assets statiques immuables du dossier public) : par
        // défaut Next les sert en `max-age=0, must-revalidate` → chaque visite
        // re-télécharge ~2,3 Mo. On force un cache long côté navigateur ; si on
        // remplace une vidéo, on versionne son nom de fichier.
        source: "/tubeforge/:file(.*\\.mp4)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // /pionnier et /discord-pionnier (page supprimée — fusionnée avec /pricing
      // après audit copy-sales-expert : 95% du contenu était dupliqué)
      {
        source: "/pionnier",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/discord-pionnier",
        destination: "/pricing",
        permanent: true,
      },
      // /tools (page supprimée — pas de vidéos demo dispo pour l'instant,
      // on évite que les visiteurs y atterrissent par accident)
      {
        source: "/tools",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
