import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/CupPage/CupPage.module.css";
import { getPublishedSchoolParams, getSchoolPage } from "@/lib/queries/cup";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedSchoolParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSchoolPage(slug);
  if (!data) return { title: "Scuola — Lega Calcio Studenti" };
  return pageMetadata({
    title: `${data.name} — Lega Calcio Studenti`,
    description: `Le squadre di ${data.name} nel circuito della Lega Calcio Studenti.`,
    path: `/scuole/${slug}`,
  });
}

export default async function SchoolPage({ params }: Props) {
  const { slug } = await params;
  const data = await getSchoolPage(slug);
  if (!data) notFound();

  return (
    <section className={`lcs-container ${styles.subpage}`}>
      <p className={styles.eyebrow}>{data.cityName ?? "Istituto"}</p>
      <h1 className={styles.sectionTitle}>{data.name}</h1>
      {data.teams.length === 0 ? (
        <p className={styles.empty}>Nessuna squadra pubblicata per questo istituto.</p>
      ) : (
        <div className={styles.schoolGrid}>
          {data.teams.map((team) => (
            <Link
              key={team.id}
              href={`/competizioni/${team.competitionSlug}/squadre/${team.slug}`}
              className={styles.card}
            >
              <p className={styles.muted}>{team.competitionName}</p>
              <p className={styles.cardTitle}>{team.name}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
