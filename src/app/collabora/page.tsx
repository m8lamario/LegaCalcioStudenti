import type { Metadata } from "next";
import { COLLABORATION_PAGE } from "@/data/homeData";
import { withKeptSentences } from "@/lib/typography";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Collabora — Lega Calcio Studenti",
  description:
    "Opportunità di collaborazione con Lega Calcio Studenti: istituzioni, sponsor, media partner e realtà tecniche al fianco del circuito.",
  path: "/collabora",
});

export default function CollaboraPage() {
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
          <p className={styles.lead}>{withKeptSentences(COLLABORATION_PAGE.lead)}</p>
          <p className={styles.lead}>{withKeptSentences(COLLABORATION_PAGE.meaning)}</p>
        </header>

        <ol className={styles.steps}>
          {COLLABORATION_PAGE.opportunities.map((step) => (
            <li key={step.index} className={styles.step}>
              <span className={styles.stepIndex}>{step.index}</span>
              <h2 className={styles.stepTitle}>{step.title}</h2>
              <p className={styles.stepText}>{withKeptSentences(step.text)}</p>
            </li>
          ))}
        </ol>

        <a className={styles.cta} href={COLLABORATION_PAGE.ctaHref}>
          <span>{COLLABORATION_PAGE.ctaLabel}</span>
          <span className={styles.ctaArrow} aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </article>
  );
}
