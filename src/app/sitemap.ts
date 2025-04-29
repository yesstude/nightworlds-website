import type { MetadataRoute } from "next";
import { routing } from "~/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nightworlds.ni-li.com";
  const locales = routing.locales;
  const routes10 = ["/"];
  const routes8 = ["/signin"];
  const routes4 = ["/documents"];

  function format(pages: string[], priority: number): MetadataRoute.Sitemap {
    return pages.map((p) => ({
      url: base + p,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}${p}`] as const),
        ),
      },
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority,
    }));
  }

  return [...format(routes10, 1.0)].concat(
    format(routes8, 0.8),
    format(routes4, 0.4),
  );
}
