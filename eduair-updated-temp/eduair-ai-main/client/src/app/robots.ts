import type { MetadataRoute } from "next";

const BASE_URL = "https://eduair-ai.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api", "/auth"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
