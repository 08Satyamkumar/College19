import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

// Automatically revalidate sitemap every hour in production
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.college19.com";

  // Core High-Authority Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/colleges`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/predictor`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/credit-card`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/scholarship`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    // Dynamically query all colleges from Supabase
    const { data: colleges, error } = await supabase
      .from("colleges")
      .select("slug, created_at")
      .not("slug", "is", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase sitemap notice (fallback to static):", error.message);
      return staticRoutes;
    }

    if (!colleges || colleges.length === 0) {
      return staticRoutes;
    }

    // Filter out internal system config records & deduplicate slugs
    const seenSlugs = new Set<string>();
    const collegeRoutes: MetadataRoute.Sitemap = [];

    for (const col of colleges) {
      if (!col.slug || typeof col.slug !== "string") continue;
      const cleanSlug = col.slug.trim().toLowerCase();

      // Skip internal system flags or already processed duplicates
      if (cleanSlug.startsWith("__") || seenSlugs.has(cleanSlug)) continue;
      seenSlugs.add(cleanSlug);

      collegeRoutes.push({
        url: `${baseUrl}/colleges/${cleanSlug}`,
        lastModified: col.created_at ? new Date(col.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }

    return [...staticRoutes, ...collegeRoutes];
  } catch (err) {
    console.error("Error generating dynamic sitemap:", err);
    return staticRoutes;
  }
}
