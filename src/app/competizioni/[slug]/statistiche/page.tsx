import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CupSubpage } from "@/components/CupPage/CupSubpage";
import styles from "@/components/CupPage/CupPage.module.css";
import { getCupStats, getPublishedCupSlugs } from "@/lib/queries/cup";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedCupSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCupStats(slug);
  if (!data) return { title: "Statistiche — Lega Calcio Studenti" };
  return pageMetadata({
    title: `Statistiche ${data.competition.name} — Lega Calcio Studenti`,
    description: `Marcatori, cartellini e numeri della ${data.competition.name}.`,
    path: `/competizioni/${slug}/statistiche`,
  });
}

export default async function CupStatsPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCupStats(slug);
  if (!data) notFound();

  return (
    <CupSubpage competition={data.competition} title="Statistiche" current="statistiche">
      <div className={styles.twoCol}>
        <section>
          <h2 className={styles.cardTitle}>Marcatori</h2>
          {data.scorers.length === 0 ? (
            <p className={styles.empty}>Nessun gol registrato.</p>
          ) : (
            <ol className={styles.list}>
              {data.scorers.map((row) => (
                <li key={row.playerId}>
                  {row.name} · {row.goals}
                </li>
              ))}
            </ol>
          )}
        </section>
        <section>
          <h2 className={styles.cardTitle}>Cartellini</h2>
          {data.cards.length === 0 ? (
            <p className={styles.empty}>Nessun cartellino registrato.</p>
          ) : (
            <ol className={styles.list}>
              {data.cards.map((row) => (
                <li key={row.playerId}>
                  {row.name} · {row.yellow} gialli · {row.red} rossi
                </li>
              ))}
            </ol>
          )}
        </section>
        <section>
          <h2 className={styles.cardTitle}>Miglior attacco</h2>
          <ol className={styles.list}>
            {data.attack.slice(0, 8).map((row) => (
              <li key={row.teamId}>
                {row.teamName} · {row.goalsFor} gol
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className={styles.cardTitle}>Miglior difesa</h2>
          <ol className={styles.list}>
            {data.defense.slice(0, 8).map((row) => (
              <li key={row.teamId}>
                {row.teamName} · {row.goalsAgainst} subiti
              </li>
            ))}
          </ol>
        </section>
      </div>
    </CupSubpage>
  );
}
