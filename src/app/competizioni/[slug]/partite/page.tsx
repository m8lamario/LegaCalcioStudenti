import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CupAwaiting } from "@/components/CupPage/CupAwaiting";
import { CupSubpage } from "@/components/CupPage/CupSubpage";
import { MatchCard } from "@/components/CupPage/MatchCard";
import styles from "@/components/CupPage/CupPage.module.css";
import { CUP_AWAITING } from "@/data/cupAwaiting";
import { getCupMatches, getPublishedCupSlugs } from "@/lib/queries/cup";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ girone?: string; squadra?: string }>;
}

export async function generateStaticParams() {
  return getPublishedCupSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCupMatches(slug);
  if (!data) return { title: "Partite — Lega Calcio Studenti" };
  return pageMetadata({
    title: `Partite ${data.competition.name} — Lega Calcio Studenti`,
    description: `Calendario e risultati della ${data.competition.name}.`,
    path: `/competizioni/${slug}/partite`,
  });
}

export default async function CupMatchesPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const data = await getCupMatches(slug);
  if (!data) notFound();

  return (
    <CupSubpage competition={data.competition} title="Partite" current="partite">
      <Suspense fallback={<p className={styles.muted}>Il calendario sta arrivando…</p>}>
        <MatchesList slug={slug} searchParams={searchParams} />
      </Suspense>
    </CupSubpage>
  );
}

async function MatchesList({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Promise<{ girone?: string; squadra?: string }>;
}) {
  const data = await getCupMatches(slug);
  if (!data) return null;
  const { girone, squadra } = await searchParams;
  const filtered = data.matches.filter((match) => {
    if (girone && match.groupSlug !== girone) return false;
    if (
      squadra &&
      match.homeTeam?.slug !== squadra &&
      match.awayTeam?.slug !== squadra
    ) {
      return false;
    }
    return true;
  });

  if (data.matches.length === 0) {
    return <CupAwaiting copy={CUP_AWAITING.matches} />;
  }

  return (
    <>
      {data.groups.length > 0 || data.teams.length > 0 ? (
        <form className={styles.filters} method="get">
          {data.groups.length > 0 ? (
            <label>
              Girone
              <select name="girone" defaultValue={girone ?? ""}>
                <option value="">Tutti</option>
                {data.groups.map((group) => (
                  <option key={group.slug} value={group.slug}>
                    {group.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {data.teams.length > 0 ? (
            <label>
              Squadra
              <select name="squadra" defaultValue={squadra ?? ""}>
                <option value="">Tutte</option>
                {data.teams.map((team) => (
                  <option key={team.slug} value={team.slug}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <button className={styles.cta} type="submit">
            Filtra
          </button>
        </form>
      ) : null}
      {filtered.length === 0 ? (
        <CupAwaiting copy={CUP_AWAITING.matchesFilter} />
      ) : (
        <div className={styles.grid}>
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </>
  );
}
