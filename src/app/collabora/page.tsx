import type { Metadata } from "next";
import Link from "next/link";
import { PartnersSection } from "@/components/PartnersSection/PartnersSection";
import { COLLABORATION_PAGE } from "@/data/homeData";
import { getHomePageContent } from "@/lib/queries/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Collabora — Lega Calcio Studenti",
  description:
    "Opportunità di collaborazione con Lega Calcio Studenti: istituzioni, sponsor, media partner e realtà tecniche al fianco del circuito.",
  path: "/collabora",
});

export default async function CollaboraPage() {
  const { partners } = await getHomePageContent();

  return (
    <article className={styles.page} aria-labelledby="collabora-heading">
      <div className="lcs-container">
        <header className={styles.intro}>
          <div className={styles.eyebrowRow}>
            <span className={styles.sidelineTick} aria-hidden="true" />
            <p className={styles.eyebrow}>{COLLABORATION_PAGE.eyebrow}</p>
          </div>
          <h1 id="collabora-heading" className={styles.title}>
            <span>{COLLABORATION_PAGE.titleLead} </span>
            <span className={styles.titleScript}>{COLLABORATION_PAGE.titleScript}</span>
          </h1>
          <p className={styles.lead}>{COLLABORATION_PAGE.lead}</p>
          <p className={styles.lead}>{COLLABORATION_PAGE.meaning}</p>
        </header>

        <ol className={styles.steps}>
          {COLLABORATION_PAGE.opportunities.map((step) => (
            <li key={step.index} className={styles.step}>
              <span className={styles.stepIndex}>{step.index}</span>
              <h2 className={styles.stepTitle}>{step.title}</h2>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <PartnersSection partners={partners} framed={false} />

      <div className="lcs-container">
        <Link href={COLLABORATION_PAGE.ctaHref} className={styles.backLink}>
          <span>{COLLABORATION_PAGE.ctaLabel}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
