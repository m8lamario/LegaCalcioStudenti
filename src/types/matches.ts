/**
 * Definizioni di tipo TypeScript per partite, risultati ed eventi live di LCS.
 */

export type MatchStatus = 'LIVE' | 'FT' | 'SCHEDULED';

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow' | 'red' | 'sub';
  team: string;
  player: string;
}

export interface MatchTeam {
  id?: string | number;
  slug?: string;
  name: string;
  shortName?: string;
  logo?: string;
  city?: string;
}

export interface Match {
  id: string | number;
  stage: string;
  matchday: string;
  competitionSlug: string;
  competitionName: string;
  date: string;
  time: string;
  home: MatchTeam;
  away: MatchTeam;
  score?: {
    home: number;
    away: number;
  };
  status: MatchStatus;
  isLive: boolean;
  minute?: number;
  venue: string;
  isDemoData?: boolean;
  events?: MatchEvent[];
}
