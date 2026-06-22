import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const paths = ["", "shop", "shop/pigments", "shop/mediums", "shop/sets", "about", "contact", "agents"];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of paths) {
      entries.push({
        url: `${base}/${locale}${path ? `/${path}` : ""}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${base}/${l}${path ? `/${path}` : ""}`]),
          ),
        },
      });
    }
  }
  return entries;
}
