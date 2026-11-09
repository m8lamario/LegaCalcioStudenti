import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CupSubpage } from "@/components/CupPage/CupSubpage";
import { MatchCard } from "@/components/CupPage/MatchCard";
import { StandingsTable } from "@/components/CupPage/StandingsTable";
import styles from "@/components/CupPage/CupPage.module.css";
import { getCupStandingsPage, getPublishedCupSlugs } from "@/lib/queries/cup";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedCupSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCupStandingsPage(slug);
  if (!data) return { title: "Classifica — Lega Calcio Studenti" };
  return pageMetadata({
    title: `Classifica ${data.competition.name} — Lega Calcio Studenti`,
    description: `Classifica dei gironi della ${data.competition.name}.`,
    path: `/competizioni/${slug}/classifica`,
  });
}

export default async function CupStandingsPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCupStandingsPage(slug);
  if (!data) notFound();

  return (
    <CupSubpage competition={data.competition} title="Classifica" current="classifica">
      {data.standings.length === 0 ? (
        <p className={styles.empty}>La classifica sarà visibile dopo le prime partite terminate.</p>
      ) : (
        data.standings.map((group) => (
          <section key={group.groupId}>
            <h2 className={styles.cardTitle}>{group.groupName}</h2>
            <StandingsTable rows={group.rows} />
          </section>
        ))
      )}
      {data.knockout.length > 0 ? (
        <section>
          <h2 className={styles.sectionTitle}>Eliminazione diretta</h2>
          <div className={styles.grid}>
            {data.knockout.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      ) : null}
    </CupSubpage>
  );
}
