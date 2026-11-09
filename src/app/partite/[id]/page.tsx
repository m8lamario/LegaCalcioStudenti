import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { MatchCard } from "@/components/CupPage/MatchCard";
import { LiveMatchClient } from "@/components/LiveMatch/LiveMatchClient";
import { SponsorSlot } from "@/components/SponsorSlot/SponsorSlot";
import styles from "@/components/CupPage/CupPage.module.css";
import { matchSportsEventJsonLd } from "@/lib/jsonLd";
import { loadLiveSnapshot } from "@/lib/live/snapshot";
import { getMatchPage, getPublishedMatchParams } from "@/lib/queries/cup";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ id: string }>;
}

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

async function LiveBlock({
  matchId,
  fallbackScore,
}: {
  matchId: string;
  fallbackScore: string;
}) {
  const snapshot = await loadLiveSnapshot(matchId);
  if (!snapshot) {
    return <p className={styles.score}>{fallbackScore}</p>;
  }
  return <LiveMatchClient matchId={matchId} initial={snapshot} />;
}

export default async function MatchPage({ params }: Props) {
  const { id } = await params;
  const data = await getMatchPage(id);
  if (!data) notFound();

  const home = data.match.homeTeam?.name ?? "TBD";
  const away = data.match.awayTeam?.name ?? "TBD";
  const fallbackScore =
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
          <Suspense fallback={<p className={styles.score}>{fallbackScore}</p>}>
            <LiveBlock matchId={data.match.id} fallbackScore={fallbackScore} />
          </Suspense>
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
        <SponsorSlot placement="live" competitionId={data.competition.dbId} />
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
