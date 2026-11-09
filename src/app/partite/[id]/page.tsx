import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { MatchCard } from "@/components/CupPage/MatchCard";
import styles from "@/components/CupPage/CupPage.module.css";
import { matchSportsEventJsonLd } from "@/lib/jsonLd";
import { getMatchPage, getPublishedMatchParams } from "@/lib/queries/cup";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ id: string }>;
}

const EVENT_LABEL = {
  goal: "Gol",
  yellow_card: "Giallo",
  red_card: "Rosso",
  substitution: "Cambio",
} as const;

export async function generateStaticParams() {
  return getPublishedMatchParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getMatchPage(id);
  if (!data) return { title: "Partita — Lega Calcio Studenti" };
  const home = data.match.homeTeam?.name ?? "Casa";
  const away = data.match.awayTeam?.name ?? "Trasferta";
  return pageMetadata({
    title: `${home} vs ${away} — ${data.competition.name}`,
    description: `${home} contro ${away} nella ${data.competition.name}.`,
    path: `/partite/${data.match.id}`,
    image: data.competition.image ?? data.competition.logo ?? undefined,
  });
}

export default async function MatchPage({ params }: Props) {
  const { id } = await params;
  const data = await getMatchPage(id);
  if (!data) notFound();

  const home = data.match.homeTeam?.name ?? "TBD";
  const away = data.match.awayTeam?.name ?? "TBD";
  const score =
    data.match.homeScore != null && data.match.awayScore != null
      ? `${data.match.homeScore} — ${data.match.awayScore}`
      : data.match.dateLabel ?? data.match.status;

  return (
    <>
      <JsonLd
        data={matchSportsEventJsonLd({
          id: data.match.id,
          homeName: home,
          awayName: away,
          startDate: data.match.kickoffAt,
          venueName: data.match.venueName,
          competitionName: data.competition.name,
          competitionSlug: data.competition.slug,
          status: data.match.status,
          homeScore: data.match.homeScore,
          awayScore: data.match.awayScore,
        })}
      />
      <article className={`lcs-container ${styles.subpage}`}>
        <p className={styles.eyebrow}>{data.competition.name}</p>
        <div className={styles.matchHero}>
          <h1 className={styles.sectionTitle}>
            {home} vs {away}
          </h1>
          <p className={styles.score}>{score}</p>
          <p className={styles.muted}>
            {data.match.roundLabel}
            {data.match.venueName ? ` · ${data.match.venueName}` : ""}
            {data.match.dateLabel ? ` · ${data.match.dateLabel}` : ""}
          </p>
          {data.match.venueMapsUrl ? (
            <a className={styles.ctaGhost} href={data.match.venueMapsUrl}>
              Mappa del campo
            </a>
          ) : null}
        </div>
        <h2 className={styles.cardTitle}>Cronaca eventi</h2>
        {data.events.length === 0 ? (
          <p className={styles.empty}>Gli eventi di gara saranno pubblicati a referto chiuso.</p>
        ) : (
          <ol className={styles.events}>
            {data.events.map((event) => (
              <li key={event.id}>
                {event.minute != null ? `${event.minute}' · ` : ""}
                {EVENT_LABEL[event.type]} · {event.playerName}
                {event.note ? ` · ${event.note}` : ""}
              </li>
            ))}
          </ol>
        )}
        <div className={styles.block}>
          <MatchCard match={data.match} />
        </div>
        <Link className={styles.ctaGhost} href={`/competizioni/${data.competition.slug}`}>
          Torna a {data.competition.name}
        </Link>
      </article>
    </>
  );
}
