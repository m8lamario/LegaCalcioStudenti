import React from 'react';
import { getLeagueBySlug, getMatchesByLeagueSlug } from '@/lib/queries';
import {
  TERRITORIAL_COMPETITIONS,
  DEMO_FEATURED_MATCHES,
  OFFICIAL_HOME_STANDINGS,
  EDITORIAL_HIGHLIGHTS
} from '@/data/mock/lcsMockData';
import { Competition } from '@/types/competitions';
import { Match } from '@/types/matches';
import { Hero, HeroStat } from '@/components/features/hero/Hero/Hero';
import { MatchTicker } from '@/components/features/matches/MatchTicker/MatchTicker';
import { CompetitionsSection } from '@/components/features/competitions/CompetitionsSection/CompetitionsSection';
import { ResultsStandingsSection } from '@/components/features/standings/StandingsWidget/ResultsStandingsSection';
import { EditorialGrid } from '@/components/features/editorial/EditorialGrid/EditorialGrid';
import { NationalIdentitySection } from '@/components/features/identity/NationalIdentitySection/NationalIdentitySection';
import { ScrollReveal } from '@/components/ui/ScrollReveal/ScrollReveal';
import styles from './page.module.css';

interface RawApiTeam {
  id?: string | number;
  name?: string;
  title?: string;
  local_league?: string;
}

interface RawApiLeague {
  id?: string | number;
  slug?: string;
  title?: string;
  name?: string;
  teams?: RawApiTeam[];
}

interface RawApiMatchTeamEntry {
  goals?: number;
  team?: RawApiTeam;
}

interface RawApiMatch {
  id?: string | number;
  datetime?: string;
  finished?: boolean;
  location?: string;
  teams?: RawApiMatchTeamEntry[];
}

function toArray<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : [];
}

export default async function HomePage() {
  const rawLeagues = toArray<RawApiLeague>(await getLeagueBySlug());
  const rawMatches = toArray<RawApiMatch>(await getMatchesByLeagueSlug());

  // Integra eventuali dati live dall'API con la configurazione grafica ufficiale delle 6 coppe
  const competitions: Competition[] = TERRITORIAL_COMPETITIONS.map((mockComp) => {
    const matchingApiLeague = rawLeagues.find(
      (l) => l.slug?.toLowerCase().trim() === mockComp.slug.toLowerCase()
    );
    if (!matchingApiLeague) return mockComp;

    const apiTeamsCount = toArray<RawApiTeam>(matchingApiLeague.teams).length;
    const apiMatchesCount = rawMatches.filter((m) =>
      toArray<RawApiMatchTeamEntry>(m.teams).some(
        (tm) => tm?.team?.local_league?.toLowerCase().trim() === mockComp.slug.toLowerCase()
      )
    ).length;

    return {
      ...mockComp,
      teamsCount: apiTeamsCount > 0 ? apiTeamsCount : mockComp.teamsCount,
      matchesCount: apiMatchesCount > 0 ? apiMatchesCount : mockComp.matchesCount
    };
  });

  // Se l'API restituisce match reali, li mappa nel formato Match; altrimenti usa i match dimostrativi
  const apiMappedMatches: Match[] = rawMatches.slice(0, 6).map((m, idx) => {
    const matchTeams = toArray<RawApiMatchTeamEntry>(m.teams);
    const homeTeam = matchTeams[0]?.team;
    const awayTeam = matchTeams[1]?.team;
    const leagueSlug = homeTeam?.local_league?.toLowerCase().trim() || 'molecup';
    const matchedComp = TERRITORIAL_COMPETITIONS.find((c) => c.slug === leagueSlug);

    const parsedDate = m.datetime ? new Date(m.datetime) : null;
    const isValidDate = parsedDate && !Number.isNaN(parsedDate.getTime());
    const timeStr = isValidDate
      ? parsedDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
      : '15:00';
    const dateStr = isValidDate
      ? parsedDate.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
      : 'In programma';

    return {
      id: String(m.id ?? `api-m-${idx}`),
      stage: 'Fase Cittadina',
      matchday: m.finished ? 'Risultato Ufficiale' : 'Prossimo Turno',
      competitionSlug: leagueSlug,
      competitionName: matchedComp?.name || 'Torneo LCS',
      date: dateStr,
      time: m.finished ? 'FINALE' : timeStr,
      home: {
        name: homeTeam?.title || homeTeam?.name || 'Istituto Casa',
        city: matchedComp?.city,
        logo: matchedComp?.logoImage || '/logoCities/lcsw.png'
      },
      away: {
        name: awayTeam?.title || awayTeam?.name || 'Istituto Ospite',
        city: matchedComp?.city,
        logo: matchedComp?.logoImage || '/logoCities/lcsw.png'
      },
      score:
        m.finished &&
        typeof matchTeams[0]?.goals === 'number' &&
        typeof matchTeams[1]?.goals === 'number'
          ? { home: matchTeams[0].goals, away: matchTeams[1].goals }
          : undefined,
      status: m.finished ? 'FT' : 'SCHEDULED',
      isLive: false,
      isDemoData: false,
      venue: m.location || matchedComp?.venue || 'Impianto Ufficiale LCS'
    };
  });

  const hasDemoMatches = apiMappedMatches.length === 0;
  const activeMatches = hasDemoMatches ? DEMO_FEATURED_MATCHES : apiMappedMatches;

  const heroStats: HeroStat[] = [
    {
      label: 'Tornei Territoriali',
      value: rawLeagues.length > 0 ? String(rawLeagues.length).padStart(2, '0') : '06',
      hint: 'Circuito nazionale attivo'
    },
    {
      label: 'Top Scuole in Classifica',
      value: String(OFFICIAL_HOME_STANDINGS.length),
      hint: 'Graduatoria generale LCS'
    },
    {
      label: 'Match in Calendario',
      value: rawMatches.length > 0 ? String(rawMatches.length) : '157+',
      hint: rawMatches.length > 0 ? 'Gare ufficiali registrate' : 'Stagione territoriale (stima)'
    },
    {
      label: 'Fase Finale Nazionale',
      value: 'KO',
      hint: 'Semifinali e finale secca'
    }
  ];

  return (
    <div className={styles.homepage}>
      {/* 2. HERO SCENOGRAFICA + MATCH TICKER */}
      <Hero stats={heroStats} />

      <MatchTicker
        matches={activeMatches}
        title={hasDemoMatches ? 'INCONTRI (DEMO)' : 'CALENDARIO GARE'}
      />

      {/* 3. SEZIONE COMPETIZIONI TERRITORIALI */}
      <ScrollReveal>
        <CompetitionsSection competitions={competitions} />
      </ScrollReveal>

      {/* 4. AREA RISULTATI E CLASSIFICHE */}
      <ScrollReveal>
        <ResultsStandingsSection
          standings={OFFICIAL_HOME_STANDINGS}
          matches={activeMatches}
          hasDemoMatches={hasDemoMatches}
        />
      </ScrollReveal>

      {/* 5. SEZIONE EDITORIALE CON NEWS, FOTOGRAFIE E MOMENTI SALIENTI */}
      <ScrollReveal>
        <EditorialGrid articles={EDITORIAL_HIGHLIGHTS} />
      </ScrollReveal>

      {/* 6. SEZIONE IDENTITÀ NAZIONALE DELLA LEGA (seguita dal Footer in RootLayout) */}
      <ScrollReveal>
        <NationalIdentitySection />
      </ScrollReveal>
    </div>
  );
}
