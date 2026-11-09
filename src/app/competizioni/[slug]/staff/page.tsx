import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CupSubpage } from "@/components/CupPage/CupSubpage";
import styles from "@/components/CupPage/CupPage.module.css";
import { getCupStaff, getPublishedCupSlugs } from "@/lib/queries/cup";
import { pageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedCupSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCupStaff(slug);
  if (!data) return { title: "Staff — Lega Calcio Studenti" };
  return pageMetadata({
    title: `Staff ${data.competition.name} — Lega Calcio Studenti`,
    description: `Lo staff della ${data.competition.name}.`,
    path: `/competizioni/${slug}/staff`,
  });
}

export default async function CupStaffPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCupStaff(slug);
  if (!data) notFound();

  return (
    <CupSubpage competition={data.competition} title="Staff" current="staff">
      {data.staff.length === 0 ? (
        <p className={styles.empty}>Lo staff sarà pubblicato a breve.</p>
      ) : (
        <div className={styles.staffGrid}>
          {data.staff.map((member) => (
            <article key={member.id} className={styles.card}>
              {member.photo ? (
                <Image src={member.photo} alt="" width={96} height={96} />
              ) : null}
              <p className={styles.cardTitle}>{member.name}</p>
              <p className={styles.muted}>{member.role}</p>
            </article>
          ))}
        </div>
      )}
    </CupSubpage>
  );
}
