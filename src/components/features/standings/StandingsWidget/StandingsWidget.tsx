'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StandingRow } from '@/types/standings';
import styles from './StandingsWidget.module.css';

export interface StandingsWidgetProps {
  standings: StandingRow[];
  title?: string;
  selectedCompetitionSlug?: string;
  onSelectCompetitionSlug?: (slug: string) => void;
  className?: string;
}

const COMPETITION_FILTERS = [
  { slug: 'all', label: 'Classifica Generale' },
  { slug: 'molecup', label: 'Mole Cup (TO)' },
  { slug: 'leonessacup', label: 'Leonessa Cup (BS)' },
  { slug: 'ferreacup', label: 'Ferrea Cup (MB)' },
  { slug: 'olympiuscup', label: 'Olympius Cup (MO)' },
  { slug: 'turascup', label: 'Turàs Cup (CR)' }
];

export const StandingsWidget: React.FC<StandingsWidgetProps> = ({
  standings,
  title = 'CLASSIFICA GENERALE LCS',
  selectedCompetitionSlug,
  onSelectCompetitionSlug,
  className = ''
}) => {
  const [internalFilter, setInternalFilter] = useState<string>('all');
  const [showAllRows, setShowAllRows] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'pt' | 'dr'>('pt');

  const activeFilter = selectedCompetitionSlug !== undefined ? selectedCompetitionSlug : internalFilter;

  const handleFilterChange = (slug: string) => {
    if (onSelectCompetitionSlug) {
      onSelectCompetitionSlug(slug);
    } else {
      setInternalFilter(slug);
    }
  };

  const filteredAndSorted = useMemo(() => {
    const base = activeFilter === 'all'
      ? [...standings]
      : standings.filter((row) => row.team.competitionSlug === activeFilter);

    base.sort((a, b) => {
      if (sortBy === 'dr') {
        const drA = parseInt(String(a.goalDifference), 10) || 0;
        const drB = parseInt(String(b.goalDifference), 10) || 0;
        if (drB !== drA) return drB - drA;
      }
      return b.points - a.points;
    });

    return base;
  }, [standings, activeFilter, sortBy]);

  const displayedRows = showAllRows ? filteredAndSorted : filteredAndSorted.slice(0, 8);

  return (
    <div className={`${styles.widget} ${className}`}>
      {/* Header del Widget Classifica */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>GRADUATORIA INTER-LICEALE UFFICIALE</span>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.sortControl} role="group" aria-label="Ordina classifica per">
            <span className={styles.sortLabel}>Ordina:</span>
            <button
              type="button"
              className={`${styles.sortBtn} ${sortBy === 'pt' ? styles.sortBtnActive : ''}`}
              onClick={() => setSortBy('pt')}
            >
              Punti (PT)
            </button>
            <button
              type="button"
              className={`${styles.sortBtn} ${sortBy === 'dr' ? styles.sortBtnActive : ''}`}
              onClick={() => setSortBy('dr')}
            >
              Diff. Reti (DR)
            </button>
          </div>

          <Link href="/classifica" className={styles.fullLink}>
            Classifica Completa &rarr;
          </Link>
        </div>
      </div>

      {/* Filtri per Competizione / Sede */}
      <div className={styles.compTabs} role="tablist" aria-label="Filtra graduatoria per competizione">
        {COMPETITION_FILTERS.map((tab) => {
          const isActive = activeFilter === tab.slug;
          return (
            <button
              key={tab.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.compTabBtn} ${isActive ? styles.compTabBtnActive : ''}`}
              onClick={() => handleFilterChange(tab.slug)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tabella Sportiva */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" className={styles.colPos}>#</th>
              <th scope="col" className={styles.colSchool}>Istituto Scolastico</th>
              <th scope="col" className={styles.colCup}>Torneo</th>
              <th scope="col" className={styles.colStat} title="Vittorie - Pareggi - Sconfitte">
                Record (V-P-S)
              </th>
              <th scope="col" className={styles.colStat} title="Differenza Reti">
                DR
              </th>
              <th scope="col" className={styles.colPts} title="Punti Ufficiali">
                PT
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row, idx) => {
              const displayPos = activeFilter === 'all' && sortBy === 'pt' ? row.position : idx + 1;
              const isPodium = displayPos <= 3;
              const isKnockoutZone = displayPos > 3 && displayPos <= 8;

              return (
                <tr
                  key={`${row.team.name}-${row.position}`}
                  className={`${styles.row} ${isPodium ? styles.rowPodium : ''} ${isKnockoutZone ? styles.rowKnockout : ''}`}
                >
                  <td className={styles.colPos}>
                    <span
                      className={`${styles.posBadge} ${
                        displayPos === 1
                          ? styles.posFirst
                          : isPodium
                          ? styles.posTop3
                          : isKnockoutZone
                          ? styles.posTop8
                          : ''
                      }`}
                    >
                      {displayPos}
                    </span>
                  </td>

                  <td className={styles.colSchool}>
                    <div className={styles.schoolCell}>
                      {row.team.logo && (
                        <Image
                          src={row.team.logo}
                          alt=""
                          width={22}
                          height={22}
                          className={styles.schoolCupLogo}
                        />
                      )}
                      <div className={styles.schoolMeta}>
                        <span className={styles.schoolName}>{row.team.name}</span>
                        {row.team.city && <span className={styles.schoolCity}>{row.team.city}</span>}
                      </div>
                    </div>
                  </td>

                  <td className={styles.colCup}>
                    {row.team.competitionSlug ? (
                      <Link
                        href={`/competitions/${row.team.competitionSlug}`}
                        className={styles.cupPill}
                      >
                        {row.team.competitionName || row.team.competitionSlug}
                      </Link>
                    ) : (
                      <span className={styles.cupPill}>LCS</span>
                    )}
                  </td>

                  <td className={styles.colStat}>
                    <span className={styles.recordVal}>{row.record}</span>
                  </td>

                  <td className={styles.colStat}>
                    <span className={styles.drVal}>{row.goalDifference}</span>
                  </td>

                  <td className={styles.colPts}>
                    <span className={styles.ptsVal}>{row.points}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer con Legenda e Pulsante Espansione */}
      <div className={styles.footer}>
        <div className={styles.legendGroup}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendIndicator} ${styles.indicatorAqua}`} />
            <span>Top 3 — Podio Nazionale</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendIndicator} ${styles.indicatorBlue}`} />
            <span>Top 8 — Qualificazione Knockout Day</span>
          </div>
        </div>

        {filteredAndSorted.length > 8 && (
          <button
            type="button"
            className={styles.expandBtn}
            onClick={() => setShowAllRows((prev) => !prev)}
          >
            {showAllRows
              ? 'Mostra Top 8 Scuole ↑'
              : `Mostra tutte le ${filteredAndSorted.length} Scuole ↓`}
          </button>
        )}
      </div>
    </div>
  );
};
