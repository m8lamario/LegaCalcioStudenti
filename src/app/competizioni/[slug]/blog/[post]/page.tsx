import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CUP_BLOG_POSTS,
  getCupBlogHref,
  getCupBlogPost,
} from "@/data/cupBlog";
import { getLocalCompetition } from "@/data/homeData";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { newsArticleJsonLd } from "@/lib/jsonLd";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/CupBlog/CupBlog.module.css";

interface BlogPostProps {
  params: Promise<{ slug: string; post: string }>;
}

export function generateStaticParams() {
  return CUP_BLOG_POSTS.map((article) => ({
    slug: article.competitionSlug,
    post: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug, post } = await params;
  const article = getCupBlogPost(slug, post);
  const competition = getLocalCompetition(slug);

  if (!article || !competition) {
    return { title: "Articolo non trovato — Lega Calcio Studenti" };
  }

  return pageMetadata({
    title: `${article.title} — ${competition.name}`,
    description: article.dek,
    path: getCupBlogHref(slug, post),
    image: article.image,
    type: "article",
    publishedTime: article.dateIso,
    authors: article.authors,
  });
}

export default async function CupBlogPostPage({ params }: BlogPostProps) {
  const { slug, post } = await params;
  const article = getCupBlogPost(slug, post);
  const competition = getLocalCompetition(slug);

  if (!article || !competition) {
    notFound();
  }

  return (
    <article className={styles.page} aria-labelledby="article-heading">
      <JsonLd data={newsArticleJsonLd(article, competition.name)} />
      <div className="lcs-container">
        <header className={styles.intro}>
          <div className={styles.eyebrowRow}>
            <span className={styles.sidelineTick} aria-hidden="true" />
            <p className={styles.eyebrow}>{competition.name}</p>
          </div>
          <h1 id="article-heading" className={styles.title}>
            {article.title}
          </h1>
          <p className={styles.dek}>{article.dek}</p>
          <p className={styles.meta}>
            {article.authors.join(", ")} · {article.dateLabel}
          </p>
        </header>

        <div className={styles.article}>
          <div className={styles.body}>
            {article.body.map((block, index) => {
              if (block.type === "h2") {
                return (
                  <h2 key={`${block.type}-${index}`} className={styles.heading}>
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "h3") {
                return (
                  <h3 key={`${block.type}-${index}`} className={styles.subheading}>
                    {block.text}
                  </h3>
                );
              }

              if (block.type === "ul") {
                return (
                  <ul key={`${block.type}-${index}`} className={styles.list}>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={`${block.type}-${index}`} className={styles.paragraph}>
                  {block.text}
                </p>
              );
            })}
          </div>

          <div className={styles.mediaCol}>
            <figure className={styles.cover}>
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                priority
                sizes="(max-width: 960px) 100vw, 42vw"
                className={styles.coverImage}
              />
            </figure>
            {article.imageCredit ? (
              <p className={styles.credit}>{article.imageCredit}</p>
            ) : null}
          </div>
        </div>

        <Link href={getCupBlogHref(slug)} className={styles.backLink}>
          <span aria-hidden="true">←</span>
          <span>Tutte le cronache della {competition.name}</span>
        </Link>
      </div>
    </article>
  );
}
