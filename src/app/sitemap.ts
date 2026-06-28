import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/features/posts/queries";
import { routing, type Locale } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = routing.locales.flatMap((locale) => [
    {
      url: localizedUrl(locale, ""),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1
    },
    {
      url: localizedUrl(locale, "news"),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8
    }
  ]);

  const articleRoutes = (
    await Promise.all(
      routing.locales.map(async (locale) => {
        const posts = await getPublishedPosts(locale as Locale);
        return posts.map((post) => ({
          url: localizedUrl(locale as Locale, `news/${post.slug}`),
          lastModified: new Date(post.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.7
        }));
      })
    )
  ).flat();

  return [...staticRoutes, ...articleRoutes];
}
