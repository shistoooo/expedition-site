import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://expedition.so";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/account", "/coin-green-screen", "/avatar-editor", "/pionnier", "/partenaire", "/admin", "/try"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
