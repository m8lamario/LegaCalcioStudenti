export const CLOCK_PERIODS = [
  "idle",
  "first",
  "interval",
  "second",
  "extra_first",
  "extra_interval",
  "extra_second",
  "penalties",
  "closed",
] as const;

export type ClockPeriod = (typeof CLOCK_PERIODS)[number];

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed";

export type GoalKind = "regular" | "penalty" | "own_goal";

export type EventType = "goal" | "yellow_card" | "red_card" | "substitution" | "note";

export type ClockState = {
  period: ClockPeriod;
  periodStartedAt: number | null;
  elapsedSeconds: number;
  halfMinutes: number;
  extraHalfMinutes: number;
  allowExtraTime: boolean;
  allowPenalties: boolean;
};

export type MinuteView = {
  minute: number;
  label: string;
  stoppage: number;
};

export type ScoreEvent = {
  type: EventType;
  teamId: string | null;
  goalKind?: GoalKind | null;
  shootout?: boolean;
  deletedAt?: string | Date | null;
};

export type MatchScore = {
  homeScore: number;
  awayScore: number;
  homePenaltyScore: number;
  awayPenaltyScore: number;
};

export type ClockAction =
  | "start"
  | "interval"
  | "resume"
  | "extra"
  | "penalties"
  | "finish"
  | "reopen";

export type LiveCommandKind =
  | `clock.${ClockAction}`
  | "event.add"
  | "event.update"
  | "event.delete"
  | "event.undo";

export type QueueStatus = "queued" | "sending" | "synced" | "offline";

export type QueuedCommand = {
  clientId: string;
  matchId: string;
  kind: LiveCommandKind;
  payload: Record<string, unknown>;
  status: QueueStatus;
  createdAt: number;
};

export type PublicLiveEvent = {
  id: string;
  type: EventType;
  minute: number | null;
  note: string | null;
  teamId: string | null;
  playerName: string;
  assistName: string | null;
  goalKind: GoalKind | null;
  shootout: boolean;
  shirtNumber: number | null;
};

export type LiveSnapshot = {
  matchId: string;
  status: MatchStatus;
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  homePenaltyScore: number;
  awayPenaltyScore: number;
  competitionId: string;
  competitionSlug: string;
  competitionName: string;
  clock: ClockState;
  serverNow: number;
  minute: MinuteView;
  events: PublicLiveEvent[];
  updatedAt: string;
  allowExtraTime: boolean;
  allowPenalties: boolean;
};

export type LiveActiveItem = {
  matchId: string;
  competitionId: string;
  competitionSlug: string;
  competitionName: string;
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  clock: ClockState;
  serverNow: number;
  minute: MinuteView;
};
