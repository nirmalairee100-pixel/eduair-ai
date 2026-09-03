import type { MetadataRoute } from "next";

const BASE_URL = "https://eduair-ai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/features",
    "/pricing",
    "/schools",
    "/contact",
    "/privacy",
    "/terms",
    "/resources/class-10",
    "/resources/see-preparation",
    "/resources/study-tips",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route.startsWith("/resources/")
          ? 0.8
          : 0.7,
  }));
}
