'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Competition } from '@/types/competitions';
import { Badge } from '@/components/ui/Badge/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import styles from './CompetitionsSection.module.css';

export interface CompetitionsSectionProps {
  competitions: Competition[];
  className?: string;
}

type StatusFilter = 'all' | 'active' | 'upcoming';

export const CompetitionsSection: React.FC<CompetitionsSectionProps> = ({
  competitions,
  className = ''
}) => {
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filteredCompetitions = competitions.filter((comp) => {
    if (filter === 'all') return true;
    return comp.activeStatus === filter;
  });

  return (
    <section
      id="competizioni-territoriali"
      className={`${styles.section} ${className}`}
      aria-labelledby="heading-competizioni"
    >
      <div className={styles.container}>
        <div className={styles.topRow}>
          <SectionHeader
            eyebrow="SEDI UFFICIALI E TORNEI CITTADINI"
            scriptAccent="Orgoglio Cittadino"
            title="LE COMPETIZIONI"
            titleHighlight="Territoriali"
            subtitle="Ogni città esprime il proprio torneo liceale con stemma, impianti dedicati e gironi ufficiali. Le vincitrici conquistano l'accesso alle finali nazionali LCS."
            actionText="Vedi tutte le competizioni"
            actionHref="/competitions"
            className={styles.headerOverride}
          />
        </div>

        {/* Barra di filtro interattiva */}
        <div className={styles.filterBar} role="tablist" aria-label="Filtra competizioni per stato">
          <div className={styles.filterTabs}>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter('all')}
            >
              Tutte le Sedi ({competitions.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'active'}
              className={`${styles.filterBtn} ${filter === 'active' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter('active')}
            >
              Stagione in Corso ({competitions.filter((c) => c.activeStatus === 'active').length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'upcoming'}
              className={`${styles.filterBtn} ${filter === 'upcoming' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Nuove Aperture ({competitions.filter((c) => c.activeStatus === 'upcoming').length})
            </button>
          </div>
          <span className={styles.filterLegend}>
            Seleziona una coppa per consultare gironi, calendario e rose degli istituti
          </span>
        </div>

        {/* Griglia Card Competizioni */}
        <div className={styles.grid}>
          {filteredCompetitions.map((comp, index) => {
            const isFeatured = index === 0 && filter === 'all';
            return (
              <article
                key={comp.id}
                className={`${styles.card} ${isFeatured ? styles.cardFeatured : ''}`}
              >
                {/* Header visuale con illustrazione ufficiale città e stemma coppa */}
                <div className={styles.visualBanner}>
                  {comp.bannerImage && (
                    <Image
                      src={comp.bannerImage}
                      alt={`Panorama e impianto rappresentativo di ${comp.name} — ${comp.city}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.bannerImg}
                    />
                  )}
                  <div className={styles.bannerOverlay} aria-hidden="true" />

                  <div className={styles.bannerTopBar}>
                    <span className={styles.cityTag}>{comp.city}</span>
                    <Badge
                      variant={comp.activeStatus === 'active' ? 'aqua' : 'institutional'}
                      size="sm"
                      dot={comp.activeStatus === 'active'}
                    >
                      {comp.activeStatus === 'active' ? 'ATTIVO' : 'IN APERTURA'}
                    </Badge>
                  </div>

                  {/* Stemma Ufficiale della Coppa */}
                  <div className={styles.emblemBox}>
                    {comp.logoImage ? (
                      <Image
                        src={comp.logoImage}
                        alt={`Stemma ufficiale ${comp.name}`}
                        width={44}
                        height={44}
                        className={styles.emblemImg}
                      />
                    ) : (
                      <span className={styles.emblemFallback}>LCS</span>
                    )}
                  </div>
                </div>

                {/* Corpo della Card */}
                <div className={styles.cardBody}>
                  <div className={styles.titleGroup}>
                    <span className={styles.seasonTag}>{comp.season || 'Stagione 2025/26'}</span>
                    <h3 className={styles.cupTitle}>
                      <Link href={`/competitions/${comp.slug}`} className={styles.titleLink}>
                        {comp.name}
                      </Link>
                    </h3>
                    {comp.subtitle && <p className={styles.cupSubtitle}>{comp.subtitle}</p>}
                  </div>

                  {/* Statistiche Torneo in Komu New C */}
                  <div className={styles.statsRow}>
                    <div className={styles.statBox}>
                      <span className={styles.statNumber}>{comp.teamsCount || '—'}</span>
                      <span className={styles.statText}>Scuole Iscritte</span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statNumber}>{comp.matchesCount || '—'}</span>
                      <span className={styles.statText}>Match Totali</span>
                    </div>
                    <div className={styles.statBoxWide}>
                      <span className={styles.venueLabel}>SEDE UFFICIALE</span>
                      <span className={styles.venueValue}>{comp.venue || comp.city}</span>
                    </div>
                  </div>

                  {/* Footer della Card con Navigazione Diretta */}
                  <div className={styles.cardFooter}>
                    <div className={styles.quickSubLinks}>
                      <Link
                        href={`/competitions/${comp.slug}/partite`}
                        className={styles.subLink}
                      >
                        Partite
                      </Link>
                      <span className={styles.dotSep} aria-hidden="true">•</span>
                      <Link
                        href={`/competitions/${comp.slug}/classifica`}
                        className={styles.subLink}
                      >
                        Classifica
                      </Link>
                      <span className={styles.dotSep} aria-hidden="true">•</span>
                      <Link
                        href={`/competitions/${comp.slug}/squadre`}
                        className={styles.subLink}
                      >
                        Squadre
                      </Link>
                    </div>

                    <Link
                      href={`/competitions/${comp.slug}`}
                      className={styles.primaryCardCta}
                      aria-label={`Esplora il torneo ${comp.name} di ${comp.city}`}
                    >
                      <span>ESPLORA</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
