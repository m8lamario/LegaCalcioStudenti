import type { MetadataRoute } from "next";
import { CUP_BLOG_POSTS, competitionsWithBlog } from "@/data/cupBlog";
import { LOCAL_COMPETITIONS } from "@/data/homeData";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/contatti",
    "/finali-nazionali",
    "/privacy",
    "/terms",
    "/cookie",
  ];

  const competitionPaths = LOCAL_COMPETITIONS.map(
    (competition) => `/competizioni/${competition.slug}`,
  );
  const blogIndexPaths = competitionsWithBlog().map(
    (slug) => `/competizioni/${slug}/blog`,
  );
  const articlePaths = CUP_BLOG_POSTS.map(
    (post) => `/competizioni/${post.competitionSlug}/blog/${post.slug}`,
  );

  return [...staticPaths, ...competitionPaths, ...blogIndexPaths, ...articlePaths].map(
    (path) => ({
      url: absoluteUrl(path),
      lastModified: new Date(),
    }),
  );
}
