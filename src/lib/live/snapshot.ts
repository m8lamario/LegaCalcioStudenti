import { and, asc, eq, isNull } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getDb } from "@/db";
import { cities, competitions, matchEvents, matches, players, teams } from "@/db/schema";
import { publicPlayerName } from "@/lib/player-name";
import { clockFromMatch, displayMinute } from "./clock";
import { LIVE_ACTIVE_CACHE_KEY, rememberLive } from "./memory-cache";
import type { LiveActiveItem, LiveSnapshot, PublicLiveEvent } from "./types";

const homeTeams = alias(teams, "live_home_teams");
const awayTeams = alias(teams, "live_away_teams");
const eventPlayers = alias(players, "live_event_players");
const assistPlayers = alias(players, "live_assist_players");

function mapEvent(
  event: typeof matchEvents.$inferSelect,
  player: typeof players.$inferSelect | null,
  assist: typeof players.$inferSelect | null,
): PublicLiveEvent {
  return {
    id: event.id,
    type: event.type,
    minute: event.minute,
    note: event.note,
    teamId: event.teamId,
    playerName: player
      ? publicPlayerName(player)
      : event.shirtNumber != null
        ? `#${event.shirtNumber}`
        : "Giocatore",
    assistName: assist ? publicPlayerName(assist) : null,
    goalKind: event.goalKind,
    shootout: event.shootout,
    shirtNumber: event.shirtNumber,
  };
}

export async function loadLiveSnapshot(matchId: string): Promise<LiveSnapshot | null> {
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
  if (!row) return null;

  const eventRows = await db
    .select({
      event: matchEvents,
      player: eventPlayers,
      assist: assistPlayers,
    })
    .from(matchEvents)
    .leftJoin(eventPlayers, eq(matchEvents.playerId, eventPlayers.id))
    .leftJoin(assistPlayers, eq(matchEvents.assistPlayerId, assistPlayers.id))
    .where(and(eq(matchEvents.matchId, matchId), isNull(matchEvents.deletedAt)))
    .orderBy(asc(matchEvents.minute), asc(matchEvents.createdAt));

  const clock = clockFromMatch(row.match);
  const serverNow = Date.now();
  return {
    matchId: row.match.id,
    status: row.match.status,
    homeName: row.homeTeam?.name ?? "Casa",
    awayName: row.awayTeam?.name ?? "Trasferta",
    homeScore: row.match.homeScore ?? 0,
    awayScore: row.match.awayScore ?? 0,
    homePenaltyScore: row.match.homePenaltyScore,
    awayPenaltyScore: row.match.awayPenaltyScore,
    competitionId: row.competition.id,
    competitionSlug: row.competition.slug,
    competitionName: row.competition.name,
    clock,
    serverNow,
    minute: displayMinute(clock, serverNow),
    events: eventRows.map((item) => mapEvent(item.event, item.player, item.assist)),
    updatedAt: row.match.updatedAt.toISOString(),
    allowExtraTime: row.match.allowExtraTime,
    allowPenalties: row.match.allowPenalties,
  };
}

export async function getLiveSnapshot(matchId: string) {
  return rememberLive(matchId, () => loadLiveSnapshot(matchId));
}

export async function loadLiveActive(): Promise<LiveActiveItem[]> {
  const db = getDb();
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
    .where(and(eq(matches.status, "live"), eq(competitions.status, "published")));

  const serverNow = Date.now();
  return rows.map((row) => {
    const clock = clockFromMatch(row.match);
    return {
      matchId: row.match.id,
      competitionId: row.competition.id,
      competitionSlug: row.competition.slug,
      competitionName: row.competition.name,
      homeName: row.homeTeam?.name ?? "Casa",
      awayName: row.awayTeam?.name ?? "Trasferta",
      homeScore: row.match.homeScore ?? 0,
      awayScore: row.match.awayScore ?? 0,
      clock,
      serverNow,
      minute: displayMinute(clock, serverNow),
    };
  });
}

export async function getLiveActive() {
  return rememberLive(LIVE_ACTIVE_CACHE_KEY, loadLiveActive);
}

export async function loadMatchCityId(matchId: string) {
  const [row] = await getDb()
    .select({ cityId: competitions.cityId, competitionId: competitions.id })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .leftJoin(cities, eq(competitions.cityId, cities.id))
    .where(eq(matches.id, matchId))
    .limit(1);
  return row ?? null;
}
