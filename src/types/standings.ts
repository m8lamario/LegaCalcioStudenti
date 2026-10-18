/**
 * Definizioni di tipo TypeScript per classifiche e statistiche di squadra.
 */

export interface StandingTeam {
  id?: string | number;
  slug?: string;
  name: string;
  shortName?: string;
  logo?: string;
  city?: string;
  competitionSlug?: string;
  competitionName?: string;
}

export interface StandingRow {
  position: number;
  team: StandingTeam;
  record: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDifference: string;
  points: number;
  qualificationZone?: 'podium' | 'knockout' | 'playoff' | 'neutral';
}
