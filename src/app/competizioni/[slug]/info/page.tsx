import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CupSubpage } from "@/components/CupPage/CupSubpage";
import styles from "@/components/CupPage/CupPage.module.css";
import { getCupInfo, getPublishedCupSlugs } from "@/lib/queries/cup";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedCupSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCupInfo(slug);
  if (!data) return { title: "Info — Lega Calcio Studenti" };
  return pageMetadata({
    title: `Info ${data.competition.name} — Lega Calcio Studenti`,
    description: `Campi, contatti e regolamento della ${data.competition.name}.`,
    path: `/competizioni/${slug}/info`,
  });
}

export default async function CupInfoPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCupInfo(slug);
  if (!data) notFound();

  return (
    <CupSubpage competition={data.competition} title="Info" current="info">
      <div className={styles.infoList}>
        {Object.entries(data.social).map(([network, href]) =>
          href ? (
            <a key={network} href={href}>
              {network}
            </a>
          ) : null,
        )}
        {data.venues.map((venue) => (
          <p key={venue.id}>
            {venue.mapsUrl ? <a href={venue.mapsUrl}>{venue.name}</a> : venue.name}
            {venue.address ? ` · ${venue.address}` : ""}
          </p>
        ))}
        {data.contacts?.email ? (
          <a href={`mailto:${data.contacts.email}`}>{data.contacts.email}</a>
        ) : null}
        {data.contacts?.phone ? (
          <a href={`tel:${data.contacts.phone}`}>{data.contacts.phone}</a>
        ) : null}
        {data.contacts?.address ? <p>{data.contacts.address}</p> : null}
        {data.contacts?.notes ? <p className={styles.muted}>{data.contacts.notes}</p> : null}
        {data.regulationsUrl ? <a href={data.regulationsUrl}>Regolamento</a> : null}
        {Object.keys(data.social).length === 0 &&
        data.venues.length === 0 &&
        !data.contacts &&
        !data.regulationsUrl ? (
          <p className={styles.empty}>Le informazioni di contatto saranno pubblicate a breve.</p>
        ) : null}
      </div>
    </CupSubpage>
  );
}
