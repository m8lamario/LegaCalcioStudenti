import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CupPage } from "@/components/CupPage/CupPage";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { sportsEventJsonLd } from "@/lib/jsonLd";
import { getCupPageData, getPublishedCupSlugs } from "@/lib/queries/cup";
import { pageMetadata } from "@/lib/seo";

interface CompetitionRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedCupSlugs();
}

export async function generateMetadata({
  params,
}: CompetitionRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCupPageData(slug);
  if (!data) return { title: "Competizione non trovata — Lega Calcio Studenti" };
  const place = data.competition.city ? ` — ${data.competition.city}` : "";
  return pageMetadata({
    title: `${data.competition.name}${place} — Lega Calcio Studenti`,
    description:
      data.competition.description ??
      `${data.competition.name}, competizione locale della Lega Calcio Studenti.`,
    path: `/competizioni/${data.competition.slug}`,
    image: data.competition.image ?? data.competition.logo ?? undefined,
  });
}

export default async function CompetitionRoute({ params }: CompetitionRouteProps) {
  const { slug } = await params;
  const data = await getCupPageData(slug);
  if (!data) notFound();

  return (
    <>
      <JsonLd data={sportsEventJsonLd(data.competition)} />
      <CupPage data={data} />
    </>
  );
}
