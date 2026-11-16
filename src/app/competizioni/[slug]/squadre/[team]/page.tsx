import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CupAwaiting } from "@/components/CupPage/CupAwaiting";
import { CupSubpage } from "@/components/CupPage/CupSubpage";
import { MatchCard } from "@/components/CupPage/MatchCard";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import styles from "@/components/CupPage/CupPage.module.css";
import { CUP_AWAITING } from "@/data/cupAwaiting";
import { sportsTeamJsonLd } from "@/lib/jsonLd";
import { getCupTeamPage, getPublishedTeamParams } from "@/lib/queries/cup";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string; team: string }>;
}

export async function generateStaticParams() {
  return getPublishedTeamParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, team } = await params;
  const data = await getCupTeamPage(slug, team);
  if (!data) return { title: "Squadra — Lega Calcio Studenti" };
  return pageMetadata({
    title: `${data.team.name} — ${data.competition.name}`,
    description: `Rosa, risultati e statistiche di ${data.team.name} nella ${data.competition.name}.`,
    path: `/competizioni/${slug}/squadre/${team}`,
    image: data.team.logo ?? data.competition.logo ?? undefined,
  });
}

export default async function CupTeamPage({ params }: Props) {
  const { slug, team } = await params;
  const data = await getCupTeamPage(slug, team);
  if (!data) notFound();

  return (
    <>
      <JsonLd
        data={sportsTeamJsonLd({
          name: data.team.name,
          slug: data.team.slug,
          competitionSlug: data.competition.slug,
          competitionName: data.competition.name,
          logo: data.team.logo,
        })}
      />
      <CupSubpage competition={data.competition} title={data.team.name} current="squadre">
        {data.team.groupName ? <p className={styles.muted}>{data.team.groupName}</p> : null}
        <h2 className={styles.cardTitle}>Rosa</h2>
        {data.players.length === 0 ? (
          <CupAwaiting copy={CUP_AWAITING.roster} />
        ) : (
          <ul className={styles.list}>
            {data.players.map((player) => (
              <li key={player.id}>
                {player.number != null ? `${player.number} · ` : ""}
                {player.name}
                {player.position ? ` · ${player.position}` : ""}
              </li>
            ))}
          </ul>
        )}
        <h2 className={styles.cardTitle}>Risultati</h2>
        {data.matches.length > 0 ? (
          <div className={styles.grid}>
            {data.matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <CupAwaiting copy={CUP_AWAITING.teamResults} />
        )}
        {data.scorers.length > 0 ? (
          <>
            <h2 className={styles.cardTitle}>Marcatori</h2>
            <ol className={styles.list}>
              {data.scorers.map((row) => (
                <li key={row.playerId}>
                  {row.name} · {row.goals}
                </li>
              ))}
            </ol>
          </>
        ) : null}
      </CupSubpage>
    </>
  );
}
