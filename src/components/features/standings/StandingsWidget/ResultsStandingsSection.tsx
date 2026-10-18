'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StandingRow } from '@/types/standings';
import { Match } from '@/types/matches';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { Badge } from '@/components/ui/Badge/Badge';
import { StandingsWidget } from './StandingsWidget';
import { MatchCard } from '@/components/features/matches/MatchCard/MatchCard';
import styles from './ResultsStandingsSection.module.css';

export interface ResultsStandingsSectionProps {
  standings: StandingRow[];
  matches: Match[];
  hasDemoMatches?: boolean;
}

export const ResultsStandingsSection: React.FC<ResultsStandingsSectionProps> = ({
  standings,
  matches,
  hasDemoMatches = true
}) => {
  const [selectedComp, setSelectedComp] = useState<string>('all');

  const filteredMatches = selectedComp === 'all'
    ? matches
    : matches.filter((m) => m.competitionSlug === selectedComp);

  const displayedMatches = filteredMatches.length > 0 ? filteredMatches : matches;

  return (
    <section
      id="risultati-classifiche"
      className={styles.section}
      aria-labelledby="heading-risultati-classifiche"
    >
      <div className={styles.container}>
        <SectionHeader
          eyebrow="MATCH CENTER & GRADUATORIA"
          scriptAccent="Verdetti del Campo"
          title="RISULTATI E"
          titleHighlight="Classifiche"
          subtitle="Consulta la classifica generale inter-liceale aggiornata con record vittorie-pareggi-sconfitte, differenza reti e gli accoppiamenti in programma sui campi cittadini."
          actionText="Vai al Match Center completo"
          actionHref="/partite"
        />

        <div className={styles.asymmetricLayout}>
          {/* Colonna Principale: Classifica Sportiva Interattiva */}
          <div className={styles.standingsColumn}>
            <StandingsWidget
              standings={standings}
              title="CLASSIFICA GENERALE SCUOLE"
              selectedCompetitionSlug={selectedComp}
              onSelectCompetitionSlug={setSelectedComp}
            />
          </div>

          {/* Colonna Laterale: Calendario, Risultati & Regolamento Qualificazione */}
          <aside className={styles.matchesColumn} aria-label="Calendario incontri e stato turno">
            <div className={styles.matchesPanel}>
              <div className={styles.matchesHeader}>
                <div className={styles.matchesTitleWrap}>
                  <span className={styles.matchesEyebrow}>PROGRAMMA GARE</span>
                  <h3 className={styles.matchesTitle}>INCONTRI IN EVIDENZA</h3>
                </div>
                {hasDemoMatches && (
                  <Badge variant="outline" size="sm">
                    DATI DIMOSTRATIVI
                  </Badge>
                )}
              </div>

              {hasDemoMatches && (
                <div className={styles.demoBanner}>
                  <span className={styles.demoDot} aria-hidden="true" />
                  <p className={styles.demoText}>
                    Accoppiamenti dimostrativi basati sulle scuole ufficiali in classifica. Il calendario ufficiale viene sincronizzato all&apos;apertura dei turni cittadini.
                  </p>
                </div>
              )}

              <div className={styles.matchesList}>
                {displayedMatches.slice(0, 5).map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>

              <div className={styles.matchesFooter}>
                <Link href="/partite" className={styles.allMatchesBtn}>
                  <span>TUTTE LE PARTITE E TABELLINI</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Box Regolamento Sintetico Qualificazione */}
            <div className={styles.formatBox}>
              <div className={styles.formatBadgeRow}>
                <span className={styles.formatTag}>REGOLAMENTO FORMAT</span>
                <span className={styles.formatSeason}>LCS 2025/26</span>
              </div>
              <h4 className={styles.formatTitle}>CRITERI DI QUALIFICAZIONE NAZIONALE</h4>
              <p className={styles.formatDesc}>
                La graduatoria generale confronta il rendimento degli istituti di tutte le città nei gironi ufficiali. Le prime 8 accedono al tabellone principale del <strong>Knockout Day</strong>.
              </p>
              <div className={styles.formatLinks}>
                <Link href="/classifica" className={styles.formatLink}>
                  Consulta classifica integrale &rarr;
                </Link>
                <Link href="/squadre" className={styles.formatLink}>
                  Esplora le scuole &rarr;
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
