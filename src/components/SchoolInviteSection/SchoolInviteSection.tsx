import React from "react";
import type { SchoolInviteContent } from "@/lib/queries/site";
import { withKeptCompounds } from "@/lib/typography";
import styles from "./SchoolInviteSection.module.css";

export const SchoolInviteSection: React.FC<{ invite: SchoolInviteContent }> = ({
  invite,
}) => {
  const closerParts = invite.closer
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);
  return (
    <section
      id={invite.id}
      className={styles.section}
      aria-labelledby="scuole-heading"
    >
      <svg
        className={styles.pitch}
        viewBox="0 0 1050 680"
        fill="none"
        aria-hidden="true"
      >
        <rect x="40" y="40" width="970" height="600" />
        <line x1="525" y1="40" x2="525" y2="640" />
        <circle cx="525" cy="340" r="88" />
        <circle cx="525" cy="340" r="3.5" fill="currentColor" stroke="none" />
        <rect x="40" y="186" width="148" height="308" />
        <rect x="40" y="262" width="56" height="156" />
        <rect x="862" y="186" width="148" height="308" />
        <rect x="954" y="262" width="56" height="156" />
        <path d="M188 274 A78 78 0 0 1 188 406" />
        <path d="M862 274 A78 78 0 0 0 862 406" />
      </svg>

      <div className={`lcs-container ${styles.inner}`}>
        <p className={styles.concept}>
          <span className={styles.sidelineTick} aria-hidden="true" />
          {invite.concept}
        </p>

        <h2 id="scuole-heading" className={styles.title}>
          {invite.titleLines.map((line, index) => {
            const isLast = index === invite.titleLines.length - 1;

            return (
              <span key={line} className={styles.titleLine}>
                {isLast ? (
                  <>
                    {line}
                    <span className={styles.titleDot}>.</span>
                  </>
                ) : (
                  line
                )}
              </span>
            );
          })}
        </h2>

        <div className={styles.band}>
          <p className={styles.statement}>
            {withKeptCompounds(invite.statement, styles.nowrap)}
          </p>
          <a
            className={styles.cta}
            href={invite.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{invite.ctaLabel}</span>
            <span className={styles.ctaArrow} aria-hidden="true">
              ↗
            </span>
            <span className={styles.srOnly}>Si apre in una nuova scheda</span>
          </a>
        </div>

        <ul className={styles.closer}>
          {closerParts.map((part) => (
            <li key={part}>{part}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
