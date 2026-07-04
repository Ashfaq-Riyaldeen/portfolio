import type { MetadataRoute } from "next";
import { getBlogPosts, getProjects } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()]);

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // External posts live on Medium/Dev.to — only local pages belong here.
    ...posts
      .filter((p) => !p.externalUrl)
      .map((p) => ({
        url: `${siteUrl}/blog/${p.slug}`,
        lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
