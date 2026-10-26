import React from "react";
import Image from "next/image";
import { TERRITORIAL_COMPETITIONS } from "@/data/homeData";
import { RevealOnScroll } from "@/components/RevealOnScroll/RevealOnScroll";
import styles from "./CompetitionsSection.module.css";

export const CompetitionsSection: React.FC = () => {
  return (
    <section
      id="competizioni"
      className={`lcs-section ${styles.section}`}
      aria-labelledby="competizioni-heading"
    >
      <div className="lcs-container">
        <RevealOnScroll>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.eyebrowRow}>
                <span className={styles.sidelineTick} aria-hidden="true" />
                <span className={styles.eyebrow}>IL CIRCUITO NAZIONALE LCS</span>
              </div>
              <h2 id="competizioni-heading" className={styles.title}>
                <span>LE COMPETIZIONI </span>
                <span className={styles.titleScript}>Territoriali</span>
              </h2>
            </div>

            <p className={styles.lead}>
              Sei città, sei coppe cittadine con identità e storia propria. I
              migliori istituti conquistano sul campo la qualificazione alle
              finali nazionali.
            </p>
          </header>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className={styles.grid}>
            {TERRITORIAL_COMPETITIONS.map((cup) => (
              <a
                key={cup.id}
                href={cup.href}
                className={styles.card}
                aria-label={`${cup.name} — ${cup.city}`}
              >
                <div className={styles.mediaWrapper}>
                  <Image
                    src={cup.image}
                    alt={`Panorama e atmosfera ${cup.name} a ${cup.city}`}
                    fill
                    sizes="(max-width: 680px) 100vw, (max-width: 1080px) 50vw, 33vw"
                    className={styles.cardImage}
                  />
                  <div className={styles.mediaShade} aria-hidden="true" />

                  <div className={styles.cardTop}>
                    <span className={styles.crestBox}>
                      <Image
                        src={cup.logo}
                        alt={`Stemma ${cup.name}`}
                        width={36}
                        height={36}
                        className={styles.crestImage}
                      />
                    </span>
                    <span className={styles.stageTag}>{cup.stageLabel}</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.cardSideline} aria-hidden="true" />
                  <div className={styles.cardInfo}>
                    <span className={styles.cityLabel}>
                      {cup.city} · {cup.regionTag}
                    </span>
                    <h3 className={styles.cupName}>{cup.name}</h3>
                  </div>
                  <span className={styles.cardAction}>
                    <span>Esplora</span>
                    <span className={styles.cardArrow} aria-hidden="true">
                      →
                    </span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
