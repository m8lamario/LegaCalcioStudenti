import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CupSubpage } from "@/components/CupPage/CupSubpage";
import styles from "@/components/CupPage/CupPage.module.css";
import { getCupTeams, getPublishedCupSlugs } from "@/lib/queries/cup";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedCupSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCupTeams(slug);
  if (!data) return { title: "Squadre — Lega Calcio Studenti" };
  return pageMetadata({
    title: `Squadre ${data.competition.name} — Lega Calcio Studenti`,
    description: `Le squadre della ${data.competition.name}.`,
    path: `/competizioni/${slug}/squadre`,
  });
}

export default async function CupTeamsPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCupTeams(slug);
  if (!data) notFound();

  return (
    <CupSubpage competition={data.competition} title="Squadre" current="squadre">
      {data.teams.length === 0 ? (
        <p className={styles.empty}>Le squadre saranno pubblicate a breve.</p>
      ) : (
        <div className={styles.schoolGrid}>
          {data.teams.map((team) => (
            <Link
              key={team.id}
              href={`/competizioni/${slug}/squadre/${team.slug}`}
              className={styles.card}
            >
              {team.logo ? <Image src={team.logo} alt="" width={48} height={48} /> : null}
              <p className={styles.cardTitle}>{team.name}</p>
              {team.groupName ? <p className={styles.muted}>{team.groupName}</p> : null}
            </Link>
          ))}
        </div>
      )}
    </CupSubpage>
  );
}
