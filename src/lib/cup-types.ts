import type { CupBlogPost } from "@/data/cupBlog";
import type { LocalCompetition } from "@/data/homeData";
import type {
  CompetitionContacts,
  CupBlockKey,
  StandingsRules,
} from "@/db/schema";
import type { StandingRow } from "@/lib/standings";
import type { CardRow, ScorerRow, TeamAttackDefense } from "@/lib/match-stats";

export type CupTeamRef = {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  schoolSlug: string | null;
};

export type CupMatchView = {
  id: string;
  competitionSlug: string;
  roundLabel: string | null;
  roundNumber: number | null;
  dateLabel: string | null;
  kickoffAt: string | null;
  status: "scheduled" | "live" | "finished" | "postponed";
  homeTeam: CupTeamRef | null;
  awayTeam: CupTeamRef | null;
  homeScore: number | null;
  awayScore: number | null;
  venueName: string | null;
  venueMapsUrl: string | null;
  groupId: string | null;
  groupSlug: string | null;
  groupName: string | null;
  phaseId: string | null;
  phaseName: string | null;
  phaseKind: "group" | "knockout" | null;
};

export type CupGroupStandings = {
  groupId: string;
  groupSlug: string;
  groupName: string;
  rows: StandingRow[];
};

export type CupSchoolCard = {
  slug: string;
  name: string;
  logo: string | null;
};

export type CupStaffMember = {
  id: string;
  name: string;
  role: string;
  photo: string | null;
};

export type CupVenueInfo = {
  id: string;
  name: string;
  address: string | null;
  mapsUrl: string | null;
};

export type CupMvp = {
  roundLabel: string;
  name: string;
  note: string | null;
};

export type CupCompetition = LocalCompetition & {
  dbId: string;
  season: string | null;
  ticketsUrl: string | null;
  ticketsActive: boolean;
  regulationsUrl: string | null;
  contacts: CompetitionContacts | null;
  social: Record<string, string>;
  standingsRules: StandingsRules | null;
};

export type CupPageData = {
  competition: CupCompetition;
  visibleBlocks: Record<CupBlockKey, boolean>;
  liveMatches: CupMatchView[];
  nextMatch: CupMatchView | null;
  lastResults: CupMatchView[];
  upcoming: CupMatchView[];
  standings: CupGroupStandings[];
  scorers: ScorerRow[];
  mvp: CupMvp | null;
  posts: CupBlogPost[];
  schools: CupSchoolCard[];
  venues: CupVenueInfo[];
};

export type CupTeamPageData = {
  competition: CupCompetition;
  team: CupTeamRef & { groupName: string | null };
  players: {
    id: string;
    name: string;
    number: number | null;
    position: string | null;
  }[];
  matches: CupMatchView[];
  scorers: ScorerRow[];
  cards: CardRow[];
};

export type CupStatsData = {
  competition: CupCompetition;
  scorers: ScorerRow[];
  cards: CardRow[];
  attack: TeamAttackDefense[];
  defense: TeamAttackDefense[];
};

export type MatchEventView = {
  id: string;
  type: "goal" | "yellow_card" | "red_card" | "substitution" | "note";
  minute: number | null;
  note: string | null;
  teamId: string | null;
  playerName: string;
  goalKind?: "regular" | "penalty" | "own_goal" | null;
  shootout?: boolean;
};

export type MatchPageData = {
  match: CupMatchView;
  competition: CupCompetition;
  events: MatchEventView[];
};

export type SchoolPageData = {
  slug: string;
  name: string;
  cityName: string | null;
  teams: {
    id: string;
    slug: string;
    name: string;
    logo: string | null;
    competitionSlug: string;
    competitionName: string;
  }[];
};
