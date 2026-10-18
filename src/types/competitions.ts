/**
 * Definizioni di tipo TypeScript per le competizioni e le leghe cittadine di LCS.
 */

export interface CompetitionPartner {
  id: string | number;
  name: string;
  logo: string;
  url?: string;
}

export interface CompetitionStadium {
  id: string | number;
  name: string;
  address: string;
  latitude?: string | number;
  longitude?: string | number;
}

export interface CompetitionTeamSummary {
  id: string | number;
  slug: string;
  name: string;
  shortName?: string;
  logo?: string;
  schoolName?: string;
  coach?: string;
  points?: number;
  record?: string;
}

export interface Competition {
  id: string | number;
  slug: string;
  name: string;
  title: string;
  subtitle?: string;
  city: string;
  edition?: string;
  season?: string;
  teamsCount?: number;
  matchesCount?: number;
  activeStatus?: 'active' | 'upcoming' | 'completed';
  venue?: string;
  bannerImage?: string;
  logoImage?: string;
  partners?: CompetitionPartner[];
  stadiums?: CompetitionStadium[];
  teams?: CompetitionTeamSummary[];
}
