import React from "react";
import Link from "next/link";
import type { NationalFinalsContent } from "@/lib/queries/site";
import { RevealOnScroll } from "@/components/RevealOnScroll/RevealOnScroll";
import styles from "./NationalFinalsSection.module.css";

export const NationalFinalsSection: React.FC<{
  content: NationalFinalsContent;
}> = ({ content: NATIONAL_FINALS }) => {
  return (
    <section
      id={NATIONAL_FINALS.id}
      className={`lcs-section ${styles.section}`}
      aria-labelledby="finali-heading"
    >
      <div className="lcs-container">
        <RevealOnScroll>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.eyebrowRow}>
                <span className={styles.sidelineTick} aria-hidden="true" />
                <p className={styles.eyebrow}>{NATIONAL_FINALS.eyebrow}</p>
              </div>
              <h2 id="finali-heading" className={styles.title}>
                <span>{NATIONAL_FINALS.titleLead} </span>
                <span className={styles.titleScript}>{NATIONAL_FINALS.titleScript}</span>
              </h2>
            </div>
            <p className={styles.lead}>{NATIONAL_FINALS.lead}</p>
          </header>
        </RevealOnScroll>

        <RevealOnScroll>
          <ol className={styles.steps}>
            {NATIONAL_FINALS.steps.map((step) => (
              <li key={step.index} className={styles.step}>
                <span className={styles.stepIndex}>{step.index}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </li>
            ))}
          </ol>

          <Link href={NATIONAL_FINALS.href} className={styles.moreLink}>
            <span>{NATIONAL_FINALS.ctaLabel}</span>
            <span className={styles.moreArrow} aria-hidden="true">
              →
            </span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
};
