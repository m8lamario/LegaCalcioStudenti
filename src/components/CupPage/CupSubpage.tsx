import Link from "next/link";
import type { CupCompetition } from "@/lib/cup-types";
import type { CupTabKey } from "@/lib/cup-nav";
import { CupSubnav } from "./CupSubnav";
import styles from "./CupPage.module.css";

export function CupSubpage({
  competition,
  title,
  current,
  children,
}: {
  competition: CupCompetition;
  title: string;
  current?: CupTabKey;
  children: React.ReactNode;
}) {
  return (
    <section className={`lcs-container ${styles.subpage}`}>
      <p className={styles.eyebrow}>{competition.name}</p>
      <h1 className={styles.sectionTitle}>{title}</h1>
      <CupSubnav slug={competition.slug} current={current} />
      <div className={styles.block}>{children}</div>
      <Link href={`/competizioni/${competition.slug}`} className={styles.ctaGhost}>
        Torna a {competition.name}
      </Link>
    </section>
  );
}
