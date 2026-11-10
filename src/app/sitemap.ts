import type { MetadataRoute } from "next";
import { getCupBlogHref } from "@/data/cupBlog";
import { getPublishedPosts } from "@/lib/queries/posts";
import { getSitemapCupPaths } from "@/lib/queries/cup";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cupPaths, posts] = await Promise.all([
    getSitemapCupPaths(),
    getPublishedPosts(),
  ]);

  const staticPaths = [
    "/",
    "/contatti",
    "/collabora",
    "/finali-nazionali",
    "/privacy",
    "/terms",
    "/cookie",
  ];

  const articlePaths = posts.map((post) =>
    getCupBlogHref(post.competitionSlug, post.slug),
  );

  return [...staticPaths, ...cupPaths, ...articlePaths].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
  }));
}
