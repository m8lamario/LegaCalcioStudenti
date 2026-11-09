import { computeScorers } from "@/lib/match-stats";
import { computeStandings, type StandingMatchInput, type StandingTeamInput } from "@/lib/standings";
import type { MatchScore, ScoreEvent } from "./types";

export function computeMatchScore(
  events: ScoreEvent[],
  homeTeamId: string,
  awayTeamId: string,
): MatchScore {
  const score: MatchScore = {
    homeScore: 0,
    awayScore: 0,
    homePenaltyScore: 0,
    awayPenaltyScore: 0,
  };
  for (const event of events) {
    if (event.deletedAt || event.type !== "goal" || !event.teamId) continue;
    const ownGoal = event.goalKind === "own_goal";
    const beneficiary = ownGoal
      ? event.teamId === homeTeamId
        ? awayTeamId
        : homeTeamId
      : event.teamId;
    if (event.shootout) {
      if (beneficiary === homeTeamId) score.homePenaltyScore += 1;
      else if (beneficiary === awayTeamId) score.awayPenaltyScore += 1;
      continue;
    }
    if (beneficiary === homeTeamId) score.homeScore += 1;
    else if (beneficiary === awayTeamId) score.awayScore += 1;
  }
  return score;
}

export function standingsAfterClose(
  teams: StandingTeamInput[],
  matches: StandingMatchInput[],
) {
  return computeStandings(teams, matches);
}

export function scorersAfterClose(
  events: Parameters<typeof computeScorers>[0],
) {
  return computeScorers(events);
}

export function isStatGoal(event: {
  type: string;
  goalKind?: string | null;
  shootout?: boolean;
  deletedAt?: string | Date | null;
}) {
  return (
    !event.deletedAt &&
    event.type === "goal" &&
    event.goalKind !== "own_goal" &&
    !event.shootout
  );
}
