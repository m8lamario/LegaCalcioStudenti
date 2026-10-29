import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { LocalCompetition } from "@/data/homeData";
import styles from "./LocalCompetitionPage.module.css";

interface LocalCompetitionPageProps {
  competition: LocalCompetition;
}

export const LocalCompetitionPage: React.FC<LocalCompetitionPageProps> = ({
  competition,
}) => {
  const place = [competition.city, competition.regionTag].filter(Boolean).join(" · ");
  const facts = [
    competition.city ? { label: "Città", value: competition.city } : null,
    competition.regionTag ? { label: "Area", value: competition.regionTag } : null,
    competition.stageLabel ? { label: "Fase", value: competition.stageLabel } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  const awaitingAssets = !competition.image && !competition.logo && !competition.city;

  return (
    <article className={styles.page}>
      <header className={styles.banner}>
        {competition.image ? (
          <Image
            src={competition.image}
            alt={competition.imageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className={styles.bannerImage}
          />
        ) : null}
        <div className={styles.bannerScrim} aria-hidden="true" />

        <div className={`lcs-container ${styles.bannerContent}`}>
          {competition.logo ? (
            <Image
              src={competition.logo}
              alt=""
              width={72}
              height={72}
              className={styles.logo}
            />
          ) : null}
          <p className={styles.eyebrow}>Competizione locale</p>
          <h1 className={styles.title}>{competition.name}</h1>
          {place ? <p className={styles.place}>{place}</p> : null}
        </div>
      </header>

      <div className={`lcs-container lcs-section ${styles.body}`}>
        {competition.description ? (
          <p className={styles.description}>{competition.description}</p>
        ) : null}

        {facts.length > 0 ? (
          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {awaitingAssets ? (
          <p className={styles.pending}>
            Immagine, logo e informazioni di questa competizione saranno
            pubblicati quando disponibili.
          </p>
        ) : null}

        <Link href="/#competizioni" className={styles.backLink}>
          <span aria-hidden="true">←</span>
          <span>Tutte le competizioni</span>
        </Link>
      </div>
    </article>
  );
};
