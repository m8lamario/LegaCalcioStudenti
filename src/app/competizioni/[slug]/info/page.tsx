import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CupAwaiting } from "@/components/CupPage/CupAwaiting";
import { CupOverview, hasCupOverview } from "@/components/CupPage/CupOverview";
import { CupSubpage } from "@/components/CupPage/CupSubpage";
import styles from "@/components/CupPage/CupPage.module.css";
import { CUP_AWAITING } from "@/data/cupAwaiting";
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

  const social = Object.entries(data.social).filter(([, href]) => Boolean(href));
  const hasContacts =
    social.length > 0 ||
    data.venues.length > 0 ||
    Boolean(data.contacts?.email || data.contacts?.phone || data.contacts?.address || data.contacts?.notes);

  return (
    <CupSubpage competition={data.competition} title="Info" current="info">
      {hasCupOverview(data.competition, data.phases) ? (
        <CupOverview
          competition={data.competition}
          phases={data.phases}
          heading="Scheda"
          compact
        />
      ) : null}
      {hasContacts ? (
        <div className={styles.infoList}>
          {social.map(([network, href]) => (
            <a key={network} href={href}>
              {network}
            </a>
          ))}
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
        </div>
      ) : hasCupOverview(data.competition, data.phases) ? null : (
        <CupAwaiting copy={CUP_AWAITING.info} />
      )}
    </CupSubpage>
  );
}
