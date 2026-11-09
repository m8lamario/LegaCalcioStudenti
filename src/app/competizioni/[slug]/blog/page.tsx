import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCupBlogHref } from "@/data/cupBlog";
import { getCompetitionBySlug } from "@/lib/queries/site";
import { getPublishedCupSlugs } from "@/lib/queries/cup";
import { getPublishedPostsByCompetition } from "@/lib/queries/posts";
import { pageMetadata } from "@/lib/seo";
import styles from "@/components/CupBlog/CupBlog.module.css";

interface BlogIndexProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedCupSlugs();
}

export async function generateMetadata({
  params,
}: BlogIndexProps): Promise<Metadata> {
  const { slug } = await params;
  const competition = await getCompetitionBySlug(slug);

  if (!competition) {
    return { title: "Cronache non trovate — Lega Calcio Studenti" };
  }

  return pageMetadata({
    title: `Cronache ${competition.name} — Lega Calcio Studenti`,
    description: `Le cronache della ${competition.name}${competition.city ? ` a ${competition.city}` : ""}.`,
    path: getCupBlogHref(slug),
  });
}

export default async function CupBlogIndexPage({ params }: BlogIndexProps) {
  const { slug } = await params;
  const competition = await getCompetitionBySlug(slug);
  const posts = await getPublishedPostsByCompetition(slug);

  if (!competition) {
    notFound();
  }

  return (
    <section className={styles.page} aria-labelledby="blog-heading">
      <div className="lcs-container">
        <header className={styles.intro}>
          <div className={styles.eyebrowRow}>
            <span className={styles.sidelineTick} aria-hidden="true" />
            <p className={styles.eyebrow}>{competition.name}</p>
          </div>
          <h1 id="blog-heading" className={styles.title}>
            <span>Le </span>
            <span className={styles.titleScript}>cronache</span>
          </h1>
          <p className={styles.lead}>
            I racconti di campo della {competition.name}
            {competition.city ? ` a ${competition.city}` : ""}.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className={styles.lead}>
            Le cronache della {competition.name} saranno pubblicate dopo le prime giornate.
          </p>
        ) : (
        <div className={styles.grid}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={getCupBlogHref(slug, post.slug)}
              className={styles.card}
            >
              <div className={styles.cardMedia}>
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  sizes="(max-width: 960px) 100vw, 46vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.meta}>
                  {post.authors.join(", ")} · {post.dateLabel}
                </span>
                <h2 className={styles.cardTitle}>{post.title}</h2>
                <p className={styles.excerpt}>{post.dek}</p>
              </div>
            </Link>
          ))}
        </div>
        )}

        <Link href={`/competizioni/${slug}`} className={styles.backLink}>
          <span aria-hidden="true">←</span>
          <span>Torna a {competition.name}</span>
        </Link>
      </div>
    </section>
  );
}
