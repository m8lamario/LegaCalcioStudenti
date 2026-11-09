export type StatEvent = {
  type: "goal" | "yellow_card" | "red_card" | "substitution";
  playerId: string | null;
  teamId: string | null;
  playerName?: string | null;
  playerNumber?: number | null;
  publicationConsent?: boolean;
};

export type ScorerRow = {
  playerId: string;
  name: string;
  number: number | null;
  teamId: string | null;
  goals: number;
};

export type CardRow = {
  playerId: string;
  name: string;
  number: number | null;
  teamId: string | null;
  yellow: number;
  red: number;
};

export type TeamAttackDefense = {
  teamId: string;
  teamName: string;
  goalsFor: number;
  goalsAgainst: number;
};

function publicName(event: StatEvent) {
  if (event.publicationConsent) return event.playerName ?? "Giocatore";
  return event.playerNumber != null ? `#${event.playerNumber}` : "Giocatore";
}

export function computeScorers(events: StatEvent[], limit = 5): ScorerRow[] {
  const map = new Map<string, ScorerRow>();
  for (const event of events) {
    if (event.type !== "goal" || !event.playerId) continue;
    const current = map.get(event.playerId) ?? {
      playerId: event.playerId,
      name: publicName(event),
      number: event.playerNumber ?? null,
      teamId: event.teamId,
      goals: 0,
    };
    current.goals += 1;
    map.set(event.playerId, current);
  }
  return [...map.values()].sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name, "it")).slice(0, limit);
}

export function computeCards(events: StatEvent[]): CardRow[] {
  const map = new Map<string, CardRow>();
  for (const event of events) {
    if ((event.type !== "yellow_card" && event.type !== "red_card") || !event.playerId) {
      continue;
    }
    const current = map.get(event.playerId) ?? {
      playerId: event.playerId,
      name: publicName(event),
      number: event.playerNumber ?? null,
      teamId: event.teamId,
      yellow: 0,
      red: 0,
    };
    if (event.type === "yellow_card") current.yellow += 1;
    else current.red += 1;
    map.set(event.playerId, current);
  }
  return [...map.values()].sort(
    (a, b) => b.red - a.red || b.yellow - a.yellow || a.name.localeCompare(b.name, "it"),
  );
}

export function computeAttackDefense(
  teams: { id: string; name: string }[],
  matches: {
    status: string;
    homeTeamId: string | null;
    awayTeamId: string | null;
    homeScore: number | null;
    awayScore: number | null;
  }[],
): { attack: TeamAttackDefense[]; defense: TeamAttackDefense[] } {
  const rows = new Map(
    teams.map((team) => [
      team.id,
      { teamId: team.id, teamName: team.name, goalsFor: 0, goalsAgainst: 0 },
    ]),
  );
  for (const match of matches) {
    if (match.status !== "finished" || match.homeScore == null || match.awayScore == null) {
      continue;
    }
    const home = match.homeTeamId ? rows.get(match.homeTeamId) : undefined;
    const away = match.awayTeamId ? rows.get(match.awayTeamId) : undefined;
    if (home) {
      home.goalsFor += match.homeScore;
      home.goalsAgainst += match.awayScore;
    }
    if (away) {
      away.goalsFor += match.awayScore;
      away.goalsAgainst += match.homeScore;
    }
  }
  const list = [...rows.values()];
  return {
    attack: [...list].sort((a, b) => b.goalsFor - a.goalsFor || a.teamName.localeCompare(b.teamName, "it")),
    defense: [...list]
      .filter((row) => row.goalsFor + row.goalsAgainst > 0)
      .sort((a, b) => a.goalsAgainst - b.goalsAgainst || a.teamName.localeCompare(b.teamName, "it")),
  };
}
