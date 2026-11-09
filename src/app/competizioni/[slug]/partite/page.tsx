import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CupSubpage } from "@/components/CupPage/CupSubpage";
import { MatchCard } from "@/components/CupPage/MatchCard";
import styles from "@/components/CupPage/CupPage.module.css";
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
      <Suspense fallback={<p className={styles.muted}>Caricamento calendario…</p>}>
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

  return (
    <>
      <form className={styles.filters} method="get">
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
        <button className={styles.cta} type="submit">
          Filtra
        </button>
      </form>
      {filtered.length === 0 ? (
        <p className={styles.empty}>Nessuna partita in questo filtro.</p>
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
