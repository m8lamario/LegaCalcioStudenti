import { and, asc, eq, gte, inArray, lt, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getDb } from "@/db";
import { competitions, matches, players, teams } from "@/db/schema";
import type { CityScopedUser } from "@/lib/auth/access";
import { canManageMatches } from "@/lib/auth/access";
import { romeDayBounds } from "./rome-day";

const homeTeams = alias(teams, "admin_live_home");
const awayTeams = alias(teams, "admin_live_away");

export async function listLiveDeskMatches(user: CityScopedUser) {
  const db = getDb();
  const { start, end } = romeDayBounds();
  const rows = await db
    .select({
      match: matches,
      competition: competitions,
      homeTeam: homeTeams,
      awayTeam: awayTeams,
    })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .leftJoin(homeTeams, eq(matches.homeTeamId, homeTeams.id))
    .leftJoin(awayTeams, eq(matches.awayTeamId, awayTeams.id))
    .where(
      or(
        eq(matches.status, "live"),
        and(gte(matches.kickoffAt, start), lt(matches.kickoffAt, end)),
      ),
    )
    .orderBy(asc(matches.kickoffAt), asc(competitions.name));

  return rows.filter((row) => canManageMatches(user, row.competition.cityId));
}

export async function getLiveDeskMatch(matchId: string, user: CityScopedUser) {
  const db = getDb();
  const [row] = await db
    .select({
      match: matches,
      competition: competitions,
      homeTeam: homeTeams,
      awayTeam: awayTeams,
    })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .leftJoin(homeTeams, eq(matches.homeTeamId, homeTeams.id))
    .leftJoin(awayTeams, eq(matches.awayTeamId, awayTeams.id))
    .where(eq(matches.id, matchId))
    .limit(1);
  if (!row || !canManageMatches(user, row.competition.cityId)) return null;

  const teamIds = [row.match.homeTeamId, row.match.awayTeamId].filter(Boolean) as string[];
  const playerRows =
    teamIds.length > 0
      ? await db.select().from(players).where(inArray(players.teamId, teamIds))
      : [];

  return { ...row, players: playerRows };
}
