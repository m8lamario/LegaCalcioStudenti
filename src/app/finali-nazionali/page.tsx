import type { Metadata } from "next";
import Link from "next/link";
import { NATIONAL_FINALS } from "@/data/homeData";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Finali nazionali — Lega Calcio Studenti",
  description:
    "Le competizioni territoriali di Lega Calcio Studenti fanno parte di un unico circuito e possono culminare nelle finali nazionali.",
  path: "/finali-nazionali",
});

export default function NationalFinalsPage() {
  return (
    <article className={styles.page} aria-labelledby="finali-page-heading">
      <div className="lcs-container">
        <header className={styles.intro}>
          <div className={styles.eyebrowRow}>
            <span className={styles.sidelineTick} aria-hidden="true" />
            <p className={styles.eyebrow}>{NATIONAL_FINALS.pageEyebrow}</p>
          </div>
          <h1 id="finali-page-heading" className={styles.title}>
            <span>{NATIONAL_FINALS.pageTitleLead} </span>
            <span className={styles.titleScript}>{NATIONAL_FINALS.pageTitleScript}</span>
          </h1>
          <p className={styles.lead}>{NATIONAL_FINALS.pageLead}</p>
          <p className={styles.lead}>{NATIONAL_FINALS.pageMeaning}</p>
        </header>

        <ol className={styles.steps}>
          {NATIONAL_FINALS.steps.map((step) => (
            <li key={step.index} className={styles.step}>
              <span className={styles.stepIndex}>{step.index}</span>
              <h2 className={styles.stepTitle}>{step.title}</h2>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>

        <p className={styles.notice}>{NATIONAL_FINALS.unpublishedNote}</p>

        <Link href="/#competizioni" className={styles.backLink}>
          <span aria-hidden="true">←</span>
          <span>Le competizioni territoriali</span>
        </Link>
      </div>
    </article>
  );
}
