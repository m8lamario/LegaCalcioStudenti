import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalCompetitionPage } from "@/components/LocalCompetitionPage/LocalCompetitionPage";
import {
  getLocalCompetition,
  LOCAL_COMPETITIONS,
} from "@/data/homeData";

interface CompetitionRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return LOCAL_COMPETITIONS.map((competition) => ({
    slug: competition.slug,
  }));
}

export async function generateMetadata({
  params,
}: CompetitionRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const competition = getLocalCompetition(slug);

  if (!competition) {
    return { title: "Competizione non trovata — Lega Calcio Studenti" };
  }

  const place = competition.city ? ` — ${competition.city}` : "";

  return {
    title: `${competition.name}${place} — Lega Calcio Studenti`,
    description:
      competition.description ??
      `${competition.name}, competizione locale della Lega Calcio Studenti.`,
  };
}

export default async function CompetitionRoute({ params }: CompetitionRouteProps) {
  const { slug } = await params;
  const competition = getLocalCompetition(slug);

  if (!competition) {
    notFound();
  }

  return <LocalCompetitionPage competition={competition} />;
}
