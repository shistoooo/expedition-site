import type { NextConfig } from "next";

const securityHeaders = [
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
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms https://www.youtube.com https://s.ytimg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' blob: https://*.stripe.com https://api.clipapp.uk https://stream.clipapp.uk https://expedition-licensing.expedition-studio.workers.dev https://download-proxy.expedition-studio.workers.dev https://*.r2.dev https://discord.com https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.youtube-nocookie.com https://www.youtube.com",
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

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
        source: "/:path*",
        headers: securityHeaders,
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
