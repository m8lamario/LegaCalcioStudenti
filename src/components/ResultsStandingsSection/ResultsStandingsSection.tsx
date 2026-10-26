"use client";

import React, { useState } from "react";
import Image from "next/image";
import { COMPACT_LEAGUE_SNAPSHOTS } from "@/data/homeData";
import { RevealOnScroll } from "@/components/RevealOnScroll/RevealOnScroll";
import styles from "./ResultsStandingsSection.module.css";

export const ResultsStandingsSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState(
    COMPACT_LEAGUE_SNAPSHOTS[0]?.id ?? "mole-cup"
  );

  const currentSnapshot =
    COMPACT_LEAGUE_SNAPSHOTS.find((item) => item.id === selectedId) ??
    COMPACT_LEAGUE_SNAPSHOTS[0];

  return (
    <section
      id="risultati"
      className={`lcs-section ${styles.section}`}
      aria-labelledby="risultati-heading"
    >
      <div className="lcs-container">
        <RevealOnScroll>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.eyebrowRow}>
                <span className={styles.sidelineTick} aria-hidden="true" />
                <span className={styles.eyebrow}>CAMPO E GRADUATORIA</span>
                <span className={styles.demoPill}>DATI DIMOSTRATIVI</span>
              </div>
              <h2 id="risultati-heading" className={styles.title}>
                <span>RISULTATI E </span>
                <span className={styles.titleScript}>Classifiche</span>
              </h2>
            </div>

            {/* Selettore rapido competizione territoriale */}
            <div
              className={styles.cupSwitch}
              role="tablist"
              aria-label="Seleziona torneo territoriale"
            >
              {COMPACT_LEAGUE_SNAPSHOTS.map((cup) => {
                const isSelected = cup.id === currentSnapshot.id;
                return (
                  <button
                    key={cup.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`${styles.cupTab} ${
                      isSelected ? styles.cupTabActive : ""
                    }`}
                    onClick={() => setSelectedId(cup.id)}
                  >
                    <Image
                      src={cup.logo}
                      alt=""
                      width={20}
                      height={20}
                      className={styles.cupTabLogo}
                    />
                    <span className={styles.cupTabName}>{cup.cupName}</span>
                    <span className={styles.cupTabCity}>{cup.city}</span>
                  </button>
                );
              })}
            </div>
          </header>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className={styles.boardGrid}>
            {/* Colonna Sinistra: Risultati e Prossimo Turno */}
            <div className={styles.matchesPanel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleGroup}>
                  <span className={styles.panelCategory}>ULTIMI TURNI & CALENDARIO</span>
                  <h3 className={styles.panelTitle}>
                    {currentSnapshot.cupName} · {currentSnapshot.city}
                  </h3>
                </div>
                <span className={styles.stageLabel}>
                  {currentSnapshot.stageNote}
                </span>
              </div>

              <ul className={styles.matchList}>
                {currentSnapshot.matches.map((match) => {
                  const isFinal = match.status === "FINALE";
                  return (
                    <li key={match.id} className={styles.matchRow}>
                      <div className={styles.matchMeta}>
                        <span className={styles.matchRound}>{match.round}</span>
                        <span className={styles.matchVenue}>{match.venue}</span>
                      </div>

                      <div className={styles.matchCenter}>
                        <span className={styles.schoolHome}>
                          {match.homeSchool}
                        </span>

                        {isFinal ? (
                          <span
                            className={styles.scoreBox}
                            aria-label={`Risultato finale ${match.homeScore} a ${match.awayScore}`}
                          >
                            <strong>{match.homeScore}</strong>
                            <span className={styles.scoreSep}>-</span>
                            <strong>{match.awayScore}</strong>
                          </span>
                        ) : (
                          <span className={styles.timeBox}>
                            {match.dateLabel}
                          </span>
                        )}

                        <span className={styles.schoolAway}>
                          {match.awaySchool}
                        </span>
                      </div>

                      <div className={styles.matchStatusCol}>
                        <span
                          className={
                            isFinal ? styles.statusFinal : styles.statusUpcoming
                          }
                        >
                          {match.status}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Colonna Destra: Classifica Compatta Girone */}
            <div className={styles.standingsPanel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleGroup}>
                  <span className={styles.panelCategory}>GRADUATORIA ISTITUTI</span>
                  <h3 className={styles.panelTitle}>CLASSIFICA GIRONE</h3>
                </div>
                <span className={styles.qualifyLegend}>
                  <span className={styles.legendBar} aria-hidden="true" />
                  <span>Top 4 · Fase Finale</span>
                </span>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col" className={styles.colRank}>
                        #
                      </th>
                      <th scope="col" className={styles.colSchool}>
                        Istituto
                      </th>
                      <th scope="col" title="Partite Giocate">
                        G
                      </th>
                      <th scope="col" title="Vittorie-Pareggi-Sconfitte">
                        V-N-P
                      </th>
                      <th scope="col" title="Differenza Reti">
                        DR
                      </th>
                      <th scope="col" className={styles.colPoints} title="Punti">
                        PT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSnapshot.standings.map((row) => (
                      <tr
                        key={row.school}
                        className={
                          row.qualifiedZone ? styles.rowQualified : styles.rowRegular
                        }
                      >
                        <td className={styles.cellRank}>
                          <span className={styles.rankNumber}>0{row.rank}</span>
                        </td>
                        <td className={styles.cellSchool}>{row.school}</td>
                        <td>{row.played}</td>
                        <td className={styles.cellRecord}>
                          {row.won}-{row.drawn}-{row.lost}
                        </td>
                        <td>{row.goalDiff}</td>
                        <td className={styles.cellPoints}>{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
