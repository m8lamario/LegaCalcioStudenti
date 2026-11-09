import { cacheTag } from "next/cache";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { competitions, posts } from "@/db/schema";
import type { CupBlogPost } from "@/data/cupBlog";
import { cacheTags } from "@/lib/cache-tags";

export async function getPublishedPosts(): Promise<CupBlogPost[]> {
  "use cache";
  cacheTag(cacheTags.posts, cacheTags.competitions);

  const rows = await getDb()
    .select({
      post: posts,
      competitionSlug: competitions.slug,
    })
    .from(posts)
    .innerJoin(competitions, eq(posts.competitionId, competitions.id))
    .where(eq(posts.published, true))
    .orderBy(desc(posts.dateIso));

  return rows.map(({ post, competitionSlug }) => toCupBlogPost(post, competitionSlug));
}

export async function getPublishedPostsByCompetition(
  competitionSlug: string,
): Promise<CupBlogPost[]> {
  "use cache";
  cacheTag(cacheTags.posts, cacheTags.competitions);

  const rows = await getDb()
    .select({
      post: posts,
      competitionSlug: competitions.slug,
    })
    .from(posts)
    .innerJoin(competitions, eq(posts.competitionId, competitions.id))
    .where(and(eq(competitions.slug, competitionSlug), eq(posts.published, true)))
    .orderBy(desc(posts.dateIso));

  return rows.map(({ post, competitionSlug: slug }) => toCupBlogPost(post, slug));
}

export async function getPublishedPost(
  competitionSlug: string,
  postSlug: string,
): Promise<CupBlogPost | null> {
  "use cache";
  cacheTag(cacheTags.posts, cacheTags.competitions);

  const [row] = await getDb()
    .select({
      post: posts,
      competitionSlug: competitions.slug,
    })
    .from(posts)
    .innerJoin(competitions, eq(posts.competitionId, competitions.id))
    .where(
      and(
        eq(competitions.slug, competitionSlug),
        eq(posts.slug, postSlug),
        eq(posts.published, true),
      ),
    )
    .limit(1);

  if (!row) return null;
  return toCupBlogPost(row.post, row.competitionSlug);
}

export async function getCompetitionSlugsWithPosts(): Promise<string[]> {
  "use cache";
  cacheTag(cacheTags.posts, cacheTags.competitions);

  const rows = await getDb()
    .selectDistinct({ slug: competitions.slug })
    .from(posts)
    .innerJoin(competitions, eq(posts.competitionId, competitions.id))
    .where(eq(posts.published, true));

  return rows.map((row) => row.slug);
}

function toCupBlogPost(
  post: typeof posts.$inferSelect,
  competitionSlug: string,
): CupBlogPost {
  return {
    slug: post.slug,
    competitionSlug,
    title: post.title,
    dek: post.dek,
    authors: post.authors ?? [],
    dateLabel: post.dateLabel,
    dateIso: post.dateIso,
    image: post.image,
    imageAlt: post.imageAlt,
    imageCredit: post.imageCredit ?? undefined,
    body: post.body ?? [],
  };
}
