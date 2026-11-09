import type { StandingsRules, StandingsTieBreaker } from "@/db/schema";

export const DEFAULT_STANDINGS_RULES: StandingsRules = {
  winPoints: 3,
  drawPoints: 1,
  lossPoints: 0,
  tieBreakers: ["points", "head_to_head", "goal_difference", "goals_for", "name"],
};

export type StandingMatchInput = {
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: "scheduled" | "live" | "finished" | "postponed";
};

export type StandingTeamInput = {
  id: string;
  name: string;
};

export type StandingRow = {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  rank: number;
};

function emptyRow(team: StandingTeamInput): StandingRow {
  return {
    teamId: team.id,
    teamName: team.name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
    rank: 0,
  };
}

function applyResult(
  row: StandingRow,
  scored: number,
  conceded: number,
  rules: StandingsRules,
) {
  row.played += 1;
  row.goalsFor += scored;
  row.goalsAgainst += conceded;
  row.goalDiff = row.goalsFor - row.goalsAgainst;
  if (scored > conceded) {
    row.won += 1;
    row.points += rules.winPoints;
  } else if (scored === conceded) {
    row.drawn += 1;
    row.points += rules.drawPoints;
  } else {
    row.lost += 1;
    row.points += rules.lossPoints;
  }
}

function compareBy(
  a: StandingRow,
  b: StandingRow,
  key: StandingsTieBreaker,
  tiedIds: Set<string>,
  matches: StandingMatchInput[],
  rules: StandingsRules,
): number {
  switch (key) {
    case "points":
      return b.points - a.points;
    case "goal_difference":
      return b.goalDiff - a.goalDiff;
    case "goals_for":
      return b.goalsFor - a.goalsFor;
    case "name":
      return a.teamName.localeCompare(b.teamName, "it");
    case "head_to_head": {
      const mini = computeStandings(
        [
          { id: a.teamId, name: a.teamName },
          { id: b.teamId, name: b.teamName },
        ],
        matches.filter(
          (match) =>
            match.status === "finished" &&
            tiedIds.has(match.homeTeamId) &&
            tiedIds.has(match.awayTeamId),
        ),
        { ...rules, tieBreakers: ["points", "goal_difference", "goals_for", "name"] },
        { skipHeadToHead: true },
      );
      const rankA = mini.find((row) => row.teamId === a.teamId)?.rank ?? 0;
      const rankB = mini.find((row) => row.teamId === b.teamId)?.rank ?? 0;
      return rankA - rankB;
    }
    default:
      return 0;
  }
}

export function computeStandings(
  teams: StandingTeamInput[],
  matches: StandingMatchInput[],
  rules: StandingsRules = DEFAULT_STANDINGS_RULES,
  options?: { skipHeadToHead?: boolean },
): StandingRow[] {
  const rows = new Map(teams.map((team) => [team.id, emptyRow(team)]));

  for (const match of matches) {
    if (match.status !== "finished") continue;
    const home = rows.get(match.homeTeamId);
    const away = rows.get(match.awayTeamId);
    if (!home || !away) continue;
    applyResult(home, match.homeScore, match.awayScore, rules);
    applyResult(away, match.awayScore, match.homeScore, rules);
  }

  const list = [...rows.values()];
  const tieBreakers = options?.skipHeadToHead
    ? rules.tieBreakers.filter((item) => item !== "head_to_head")
    : rules.tieBreakers;

  list.sort((a, b) => {
    for (const key of tieBreakers) {
      const tiedIds = new Set(
        list
          .filter((row) => row.points === a.points && row.points === b.points)
          .map((row) => row.teamId),
      );
      const diff = compareBy(a, b, key, tiedIds, matches, rules);
      if (diff !== 0) return diff;
    }
    return a.teamName.localeCompare(b.teamName, "it");
  });

  return list.map((row, index) => ({ ...row, rank: index + 1 }));
}
