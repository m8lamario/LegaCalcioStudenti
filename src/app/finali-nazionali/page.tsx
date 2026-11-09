import type { Metadata } from "next";
import Link from "next/link";
import { getHomePageContent } from "@/lib/queries/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Finali nazionali — Lega Calcio Studenti",
  description:
    "Le competizioni territoriali di Lega Calcio Studenti fanno parte di un unico circuito e possono culminare nelle finali nazionali.",
  path: "/finali-nazionali",
});

export default async function NationalFinalsPage() {
  const { nationalFinals } = await getHomePageContent();

  return (
    <article className={styles.page} aria-labelledby="finali-page-heading">
      <div className="lcs-container">
        <header className={styles.intro}>
          <div className={styles.eyebrowRow}>
            <span className={styles.sidelineTick} aria-hidden="true" />
            <p className={styles.eyebrow}>{nationalFinals.pageEyebrow}</p>
          </div>
          <h1 id="finali-page-heading" className={styles.title}>
            <span>{nationalFinals.pageTitleLead} </span>
            <span className={styles.titleScript}>{nationalFinals.pageTitleScript}</span>
          </h1>
          <p className={styles.lead}>{nationalFinals.pageLead}</p>
          <p className={styles.lead}>{nationalFinals.pageMeaning}</p>
        </header>

        <ol className={styles.steps}>
          {nationalFinals.steps.map((step) => (
            <li key={step.index} className={styles.step}>
              <span className={styles.stepIndex}>{step.index}</span>
              <h2 className={styles.stepTitle}>{step.title}</h2>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>

        <p className={styles.notice}>{nationalFinals.unpublishedNote}</p>

        <Link href="/#competizioni" className={styles.backLink}>
          <span aria-hidden="true">←</span>
          <span>Le competizioni territoriali</span>
        </Link>
      </div>
    </article>
  );
}
