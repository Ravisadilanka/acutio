import type { MetadataRoute } from "next";
import { categories, tools, SITE_URL } from "@/lib/tools";

export const dynamic = "force-static";

/** Generated from the tool registry — new tools appear automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "weekly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    u("/", 1),
    ...categories.map((c) => u(c.href, 0.9)),
    ...tools.map((t) => u(t.href, t.popular ? 0.9 : 0.8)),
    ...["/about-us/", "/contact-us/", "/privacy-policy/", "/terms-and-conditions/"].map((p) => u(p, 0.3, "yearly")),
  ];
}
