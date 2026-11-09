import { cacheTag } from "next/cache";
import { and, asc, eq, isNull, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getDb } from "@/db";
import {
  cities,
  competitionBlocks,
  competitions,
  CUP_BLOCK_KEYS,
  groups,
  matchdayAwards,
  matchEvents,
  matches,
  phases,
  players,
  schools,
  siteSettings,
  staffMembers,
  teams,
  venues,
  type CupBlockKey,
  type StandingsRules,
} from "@/db/schema";
import { cacheTags, cupTag, matchTag, schoolTag, standingsTag, teamTag } from "@/lib/cache-tags";
import type { LocalCompetition } from "@/data/homeData";
import { DEFAULT_STANDINGS_RULES } from "@/lib/standings";
import { computeStandings } from "@/lib/standings";
import { computeAttackDefense, computeCards, computeScorers } from "@/lib/match-stats";
import { publicPlayerName } from "@/lib/player-name";
import { isUuid } from "@/lib/slug";
import { getPublishedPostsByCompetition } from "@/lib/queries/posts";
import type {
  CupCompetition,
  CupGroupStandings,
  CupMatchView,
  CupMvp,
  CupPageData,
  CupSchoolCard,
  CupStaffMember,
  CupStatsData,
  CupTeamPageData,
  CupTeamRef,
  CupVenueInfo,
  MatchEventView,
  MatchPageData,
  SchoolPageData,
} from "@/lib/cup-types";

const homeTeams = alias(teams, "home_teams");
const awayTeams = alias(teams, "away_teams");
const homeSchools = alias(schools, "home_schools");
const awaySchools = alias(schools, "away_schools");

function toLocalCompetition(
  competition: typeof competitions.$inferSelect,
  city: typeof cities.$inferSelect | null,
): LocalCompetition {
  return {
    id: competition.slug,
    slug: competition.slug,
    name: competition.name,
    city: city?.name ?? undefined,
    regionTag: competition.regionTag ?? city?.region ?? undefined,
    stageLabel: competition.stageLabel ?? undefined,
    logo: competition.logo ?? undefined,
    image: competition.image ?? undefined,
    imageAlt: competition.imageAlt ?? undefined,
    description: competition.description ?? undefined,
    coordinates:
      city?.lat != null && city?.lon != null
        ? { lat: city.lat, lon: city.lon }
        : undefined,
    mapCallout:
      city?.mapCalloutDx != null && city?.mapCalloutDy != null
        ? { dx: city.mapCalloutDx, dy: city.mapCalloutDy }
        : undefined,
  };
}

function toCupCompetition(
  competition: typeof competitions.$inferSelect,
  city: typeof cities.$inferSelect | null,
): CupCompetition {
  return {
    ...toLocalCompetition(competition, city),
    dbId: competition.id,
    season: competition.season,
    ticketsUrl: competition.ticketsUrl,
    ticketsActive: competition.ticketsActive,
    regulationsUrl: competition.regulationsUrl,
    contacts: competition.contacts,
    social: competition.social ?? {},
    standingsRules: competition.standingsRules,
  };
}

function teamRef(
  team: typeof teams.$inferSelect | null,
  school: typeof schools.$inferSelect | null,
): CupTeamRef | null {
  if (!team) return null;
  return {
    id: team.id,
    slug: team.slug,
    name: team.name,
    logo: team.logo,
    schoolSlug: school?.slug ?? null,
  };
}

function mapMatch(row: {
  match: typeof matches.$inferSelect;
  competitionSlug: string;
  homeTeam: typeof teams.$inferSelect | null;
  awayTeam: typeof teams.$inferSelect | null;
  homeSchool: typeof schools.$inferSelect | null;
  awaySchool: typeof schools.$inferSelect | null;
  venue: typeof venues.$inferSelect | null;
  group: typeof groups.$inferSelect | null;
  phase: typeof phases.$inferSelect | null;
}): CupMatchView {
  return {
    id: row.match.id,
    competitionSlug: row.competitionSlug,
    roundLabel: row.match.roundLabel,
    roundNumber: row.match.roundNumber,
    dateLabel: row.match.dateLabel,
    kickoffAt: row.match.kickoffAt ? row.match.kickoffAt.toISOString() : null,
    status: row.match.status,
    homeTeam: teamRef(row.homeTeam, row.homeSchool),
    awayTeam: teamRef(row.awayTeam, row.awaySchool),
    homeScore: row.match.homeScore,
    awayScore: row.match.awayScore,
    venueName: row.venue?.name ?? null,
    venueMapsUrl: row.venue?.mapsUrl ?? null,
    groupId: row.match.groupId,
    groupSlug: row.group?.slug ?? null,
    groupName: row.group?.name ?? null,
    phaseId: row.match.phaseId,
    phaseName: row.phase?.name ?? null,
    phaseKind: row.phase?.kind ?? null,
  };
}

async function loadCompetition(slug: string) {
  const [row] = await getDb()
    .select({ competition: competitions, city: cities })
    .from(competitions)
    .leftJoin(cities, eq(competitions.cityId, cities.id))
    .where(eq(competitions.slug, slug))
    .limit(1);
  if (!row || row.competition.status !== "published") return null;
  return row;
}

async function loadMatches(competitionId: string, competitionSlug: string) {
  const rows = await getDb()
    .select({
      match: matches,
      homeTeam: homeTeams,
      awayTeam: awayTeams,
      homeSchool: homeSchools,
      awaySchool: awaySchools,
      venue: venues,
      group: groups,
      phase: phases,
    })
    .from(matches)
    .leftJoin(homeTeams, eq(matches.homeTeamId, homeTeams.id))
    .leftJoin(awayTeams, eq(matches.awayTeamId, awayTeams.id))
    .leftJoin(homeSchools, eq(homeTeams.schoolId, homeSchools.id))
    .leftJoin(awaySchools, eq(awayTeams.schoolId, awaySchools.id))
    .leftJoin(venues, eq(matches.venueId, venues.id))
    .leftJoin(groups, eq(matches.groupId, groups.id))
    .leftJoin(phases, eq(matches.phaseId, phases.id))
    .where(eq(matches.competitionId, competitionId))
    .orderBy(asc(matches.roundNumber), asc(matches.kickoffAt), asc(matches.dateLabel));

  return rows.map((row) => mapMatch({ ...row, competitionSlug }));
}

function sortFinished(a: CupMatchView, b: CupMatchView) {
  const aTime = a.kickoffAt ? Date.parse(a.kickoffAt) : 0;
  const bTime = b.kickoffAt ? Date.parse(b.kickoffAt) : 0;
  if (aTime !== bTime) return bTime - aTime;
  return (b.roundNumber ?? 0) - (a.roundNumber ?? 0);
}

function sortUpcoming(a: CupMatchView, b: CupMatchView) {
  const aTime = a.kickoffAt ? Date.parse(a.kickoffAt) : Number.MAX_SAFE_INTEGER;
  const bTime = b.kickoffAt ? Date.parse(b.kickoffAt) : Number.MAX_SAFE_INTEGER;
  if (aTime !== bTime) return aTime - bTime;
  return (a.roundNumber ?? 0) - (b.roundNumber ?? 0);
}

async function loadStandingsRules(competition: typeof competitions.$inferSelect) {
  if (competition.standingsRules) return competition.standingsRules;
  const [row] = await getDb()
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "standings_rules"))
    .limit(1);
  const value = row?.value as StandingsRules | undefined;
  if (value && Array.isArray(value.tieBreakers)) return value;
  return DEFAULT_STANDINGS_RULES;
}

async function loadEventsForCompetition(competitionId: string) {
  return getDb()
    .select({
      event: matchEvents,
      player: players,
      match: matches,
    })
    .from(matchEvents)
    .innerJoin(matches, eq(matchEvents.matchId, matches.id))
    .leftJoin(players, eq(matchEvents.playerId, players.id))
    .where(eq(matches.competitionId, competitionId));
}

function toStatEvents(
  rows: {
    event: typeof matchEvents.$inferSelect;
    player: typeof players.$inferSelect | null;
  }[],
) {
  return rows
    .filter((row) => !row.event.deletedAt)
    .map((row) => ({
      type: row.event.type,
      playerId: row.event.playerId,
      teamId: row.event.teamId,
      playerName: row.player?.name ?? null,
      playerNumber: row.player?.number ?? null,
      publicationConsent: row.player?.publicationConsent ?? false,
      goalKind: row.event.goalKind,
      shootout: row.event.shootout,
      deletedAt: row.event.deletedAt,
    }));
}

async function loadGroupStandings(
  competitionId: string,
  competitionMatches: CupMatchView[],
  rules: StandingsRules,
): Promise<CupGroupStandings[]> {
  const groupRows = await getDb()
    .select({ group: groups, phase: phases })
    .from(groups)
    .innerJoin(phases, eq(groups.phaseId, phases.id))
    .where(eq(phases.competitionId, competitionId))
    .orderBy(asc(groups.sortOrder), asc(groups.name));

  const teamRows = await getDb()
    .select()
    .from(teams)
    .where(eq(teams.competitionId, competitionId));

  return groupRows
    .filter((row) => row.phase.kind === "group")
    .map(({ group }) => {
      const groupTeams = teamRows.filter((team) => team.groupId === group.id);
      const groupMatches = competitionMatches.filter(
        (match) => match.groupId === group.id && match.status === "finished",
      );
      const rows = computeStandings(
        groupTeams.map((team) => ({ id: team.id, name: team.name })),
        groupMatches.map((match) => ({
          homeTeamId: match.homeTeam?.id ?? "",
          awayTeamId: match.awayTeam?.id ?? "",
          homeScore: match.homeScore ?? 0,
          awayScore: match.awayScore ?? 0,
          status: match.status,
        })),
        rules,
      );
      return {
        groupId: group.id,
        groupSlug: group.slug,
        groupName: group.name,
        rows,
      };
    })
    .filter((table) => table.rows.length > 0);
}

function visibleBlocksFromRows(
  rows: { key: string; visible: boolean }[],
): Record<CupBlockKey, boolean> {
  const map = Object.fromEntries(
    CUP_BLOCK_KEYS.map((key) => [key, true]),
  ) as Record<CupBlockKey, boolean>;
  for (const row of rows) {
    if ((CUP_BLOCK_KEYS as readonly string[]).includes(row.key)) {
      map[row.key as CupBlockKey] = row.visible;
    }
  }
  return map;
}

export async function getCupPageData(slug: string): Promise<CupPageData | null> {
  "use cache";
  cacheTag(cupTag(slug), standingsTag(slug), cacheTags.competitions, cacheTags.posts);

  const loaded = await loadCompetition(slug);
  if (!loaded) return null;
  const competition = toCupCompetition(loaded.competition, loaded.city);
  const [matchList, eventRows, blockRows, awardRows, schoolRows, venueRows, rules] =
    await Promise.all([
      loadMatches(loaded.competition.id, slug),
      loadEventsForCompetition(loaded.competition.id),
      getDb()
        .select()
        .from(competitionBlocks)
        .where(eq(competitionBlocks.competitionId, loaded.competition.id)),
      getDb()
        .select({ award: matchdayAwards, player: players })
        .from(matchdayAwards)
        .leftJoin(players, eq(matchdayAwards.playerId, players.id))
        .where(eq(matchdayAwards.competitionId, loaded.competition.id)),
      getDb()
        .select({ school: schools, team: teams })
        .from(teams)
        .innerJoin(schools, eq(teams.schoolId, schools.id))
        .where(eq(teams.competitionId, loaded.competition.id)),
      getDb()
        .select({ venue: venues })
        .from(venues)
        .innerJoin(matches, eq(matches.venueId, venues.id))
        .where(eq(matches.competitionId, loaded.competition.id)),
      loadStandingsRules(loaded.competition),
    ]);

  const liveMatches = matchList.filter((match) => match.status === "live");
  const lastResults = matchList.filter((match) => match.status === "finished").sort(sortFinished);
  const upcoming = matchList
    .filter((match) => match.status === "scheduled")
    .sort(sortUpcoming);
  const nextMatch = upcoming[0] ?? null;

  const schoolsMap = new Map<string, CupSchoolCard>();
  for (const row of schoolRows) {
    if (!schoolsMap.has(row.school.slug)) {
      schoolsMap.set(row.school.slug, {
        slug: row.school.slug,
        name: row.school.name,
        logo: row.team.logo,
      });
    }
  }

  const venuesMap = new Map<string, CupVenueInfo>();
  for (const row of venueRows) {
    venuesMap.set(row.venue.id, {
      id: row.venue.id,
      name: row.venue.name,
      address: row.venue.address,
      mapsUrl: row.venue.mapsUrl,
    });
  }

  const latestAward = awardRows[0];
  const mvp: CupMvp | null = latestAward
    ? {
        roundLabel: latestAward.award.roundLabel,
        name: publicPlayerName({
          name: latestAward.player?.name,
          number: latestAward.player?.number,
          publicationConsent: latestAward.player?.publicationConsent,
        }),
        note: latestAward.award.note,
      }
    : null;

  return {
    competition,
    visibleBlocks: visibleBlocksFromRows(blockRows),
    liveMatches,
    nextMatch,
    lastResults: lastResults.slice(0, 6),
    upcoming: upcoming.slice(0, 6),
    standings: await loadGroupStandings(loaded.competition.id, matchList, rules),
    scorers: computeScorers(toStatEvents(eventRows), 5),
    mvp,
    posts: (await getPublishedPostsByCompetition(slug)).slice(0, 3),
    schools: [...schoolsMap.values()].sort((a, b) => a.name.localeCompare(b.name, "it")),
    venues: [...venuesMap.values()],
  };
}

export async function getCupMatches(slug: string) {
  "use cache";
  cacheTag(cupTag(slug), cacheTags.competitions);
  const loaded = await loadCompetition(slug);
  if (!loaded) return null;
  const matchList = await loadMatches(loaded.competition.id, slug);
  const groupOptions = [...new Map(
    matchList
      .filter((match) => match.groupSlug && match.groupName)
      .map((match) => [match.groupSlug, { slug: match.groupSlug as string, name: match.groupName as string }]),
  ).values()];
  const teamOptions = [...new Map(
    matchList
      .flatMap((match) => [match.homeTeam, match.awayTeam])
      .filter((team): team is CupTeamRef => Boolean(team))
      .map((team) => [team.slug, team]),
  ).values()].sort((a, b) => a.name.localeCompare(b.name, "it"));
  return {
    competition: toCupCompetition(loaded.competition, loaded.city),
    matches: matchList,
    groups: groupOptions,
    teams: teamOptions,
  };
}

export async function getCupStandingsPage(slug: string) {
  "use cache";
  cacheTag(cupTag(slug), standingsTag(slug), cacheTags.competitions);
  const loaded = await loadCompetition(slug);
  if (!loaded) return null;
  const matchList = await loadMatches(loaded.competition.id, slug);
  const rules = await loadStandingsRules(loaded.competition);
  return {
    competition: toCupCompetition(loaded.competition, loaded.city),
    standings: await loadGroupStandings(loaded.competition.id, matchList, rules),
    knockout: matchList.filter((match) => match.phaseKind === "knockout"),
  };
}

export async function getCupTeams(slug: string) {
  "use cache";
  cacheTag(cupTag(slug), cacheTags.competitions);
  const loaded = await loadCompetition(slug);
  if (!loaded) return null;
  const rows = await getDb()
    .select({ team: teams, school: schools, group: groups })
    .from(teams)
    .innerJoin(schools, eq(teams.schoolId, schools.id))
    .leftJoin(groups, eq(teams.groupId, groups.id))
    .where(eq(teams.competitionId, loaded.competition.id))
    .orderBy(asc(teams.name));
  return {
    competition: toCupCompetition(loaded.competition, loaded.city),
    teams: rows.map((row) => ({
      ...teamRef(row.team, row.school)!,
      groupName: row.group?.name ?? null,
    })),
  };
}

export async function getCupTeamPage(
  competitionSlug: string,
  teamSlug: string,
): Promise<CupTeamPageData | null> {
  "use cache";
  cacheTag(
    teamTag(competitionSlug, teamSlug),
    cupTag(competitionSlug),
    standingsTag(competitionSlug),
  );
  const loaded = await loadCompetition(competitionSlug);
  if (!loaded) return null;
  const [teamRow] = await getDb()
    .select({ team: teams, school: schools, group: groups })
    .from(teams)
    .innerJoin(schools, eq(teams.schoolId, schools.id))
    .leftJoin(groups, eq(teams.groupId, groups.id))
    .where(and(eq(teams.competitionId, loaded.competition.id), eq(teams.slug, teamSlug)))
    .limit(1);
  if (!teamRow) return null;

  const [playerRows, matchList, eventRows] = await Promise.all([
    getDb().select().from(players).where(eq(players.teamId, teamRow.team.id)).orderBy(asc(players.number)),
    loadMatches(loaded.competition.id, competitionSlug),
    loadEventsForCompetition(loaded.competition.id),
  ]);

  const teamMatches = matchList.filter(
    (match) => match.homeTeam?.id === teamRow.team.id || match.awayTeam?.id === teamRow.team.id,
  );
  const teamEvents = eventRows.filter((row) => row.event.teamId === teamRow.team.id);

  return {
    competition: toCupCompetition(loaded.competition, loaded.city),
    team: {
      ...teamRef(teamRow.team, teamRow.school)!,
      groupName: teamRow.group?.name ?? null,
    },
    players: playerRows.map((player) => ({
      id: player.id,
      name: publicPlayerName(player),
      number: player.number,
      position: player.position,
    })),
    matches: teamMatches,
    scorers: computeScorers(toStatEvents(teamEvents)),
    cards: computeCards(toStatEvents(teamEvents)),
  };
}

export async function getCupStats(slug: string): Promise<CupStatsData | null> {
  "use cache";
  cacheTag(cupTag(slug), standingsTag(slug), cacheTags.competitions);
  const loaded = await loadCompetition(slug);
  if (!loaded) return null;
  const [matchList, eventRows, teamRows] = await Promise.all([
    loadMatches(loaded.competition.id, slug),
    loadEventsForCompetition(loaded.competition.id),
    getDb().select().from(teams).where(eq(teams.competitionId, loaded.competition.id)),
  ]);
  const { attack, defense } = computeAttackDefense(
    teamRows.map((team) => ({ id: team.id, name: team.name })),
    matchList.map((match) => ({
      status: match.status,
      homeTeamId: match.homeTeam?.id ?? null,
      awayTeamId: match.awayTeam?.id ?? null,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    })),
  );
  const stats = toStatEvents(eventRows);
  return {
    competition: toCupCompetition(loaded.competition, loaded.city),
    scorers: computeScorers(stats, 50),
    cards: computeCards(stats),
    attack,
    defense,
  };
}

export async function getCupStaff(slug: string) {
  "use cache";
  cacheTag(cupTag(slug), cacheTags.competitions);
  const loaded = await loadCompetition(slug);
  if (!loaded) return null;
  const rows = await getDb()
    .select()
    .from(staffMembers)
    .where(eq(staffMembers.competitionId, loaded.competition.id))
    .orderBy(asc(staffMembers.sortOrder), asc(staffMembers.name));
  return {
    competition: toCupCompetition(loaded.competition, loaded.city),
    staff: rows as CupStaffMember[],
  };
}

export async function getCupInfo(slug: string) {
  "use cache";
  cacheTag(cupTag(slug), cacheTags.competitions);
  const data = await getCupPageData(slug);
  if (!data) return null;
  return {
    competition: data.competition,
    venues: data.venues,
    social: data.competition.social,
    contacts: data.competition.contacts,
    regulationsUrl: data.competition.regulationsUrl,
  };
}

export async function matchExists(idOrSlug: string) {
  const db = getDb();
  if (isUuid(idOrSlug)) {
    const [byId] = await db
      .select({ id: matches.id })
      .from(matches)
      .where(eq(matches.id, idOrSlug))
      .limit(1);
    if (byId) return true;
  }
  const [bySlug] = await db
    .select({ id: matches.id })
    .from(matches)
    .where(eq(matches.legacySlug, idOrSlug))
    .limit(1);
  return Boolean(bySlug);
}

export async function getMatchPage(idOrSlug: string): Promise<MatchPageData | null> {
  "use cache";
  cacheTag(matchTag(idOrSlug), cacheTags.competitions);

  const db = getDb();
  const where = isUuid(idOrSlug)
    ? or(eq(matches.id, idOrSlug), eq(matches.legacySlug, idOrSlug))
    : eq(matches.legacySlug, idOrSlug);

  const [row] = await db
    .select({
      match: matches,
      competition: competitions,
      city: cities,
      homeTeam: homeTeams,
      awayTeam: awayTeams,
      homeSchool: homeSchools,
      awaySchool: awaySchools,
      venue: venues,
      group: groups,
      phase: phases,
    })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .leftJoin(cities, eq(competitions.cityId, cities.id))
    .leftJoin(homeTeams, eq(matches.homeTeamId, homeTeams.id))
    .leftJoin(awayTeams, eq(matches.awayTeamId, awayTeams.id))
    .leftJoin(homeSchools, eq(homeTeams.schoolId, homeSchools.id))
    .leftJoin(awaySchools, eq(awayTeams.schoolId, awaySchools.id))
    .leftJoin(venues, eq(matches.venueId, venues.id))
    .leftJoin(groups, eq(matches.groupId, groups.id))
    .leftJoin(phases, eq(matches.phaseId, phases.id))
    .where(where)
    .limit(1);

  if (!row || row.competition.status !== "published") return null;

  const eventRows = await db
    .select({ event: matchEvents, player: players })
    .from(matchEvents)
    .leftJoin(players, eq(matchEvents.playerId, players.id))
    .where(and(eq(matchEvents.matchId, row.match.id), isNull(matchEvents.deletedAt)))
    .orderBy(asc(matchEvents.minute), asc(matchEvents.createdAt));

  const events: MatchEventView[] = eventRows.map((item) => ({
    id: item.event.id,
    type: item.event.type,
    minute: item.event.minute,
    note: item.event.note,
    teamId: item.event.teamId,
    playerName: publicPlayerName({
      name: item.player?.name,
      number: item.player?.number,
      publicationConsent: item.player?.publicationConsent,
    }),
    goalKind: item.event.goalKind,
    shootout: item.event.shootout,
  }));

  return {
    match: mapMatch({ ...row, competitionSlug: row.competition.slug }),
    competition: toCupCompetition(row.competition, row.city),
    events,
  };
}

export async function getSchoolPage(slug: string): Promise<SchoolPageData | null> {
  "use cache";
  cacheTag(schoolTag(slug), cacheTags.competitions);
  const [schoolRow] = await getDb()
    .select({ school: schools, city: cities })
    .from(schools)
    .leftJoin(cities, eq(schools.cityId, cities.id))
    .where(eq(schools.slug, slug))
    .limit(1);
  if (!schoolRow) return null;

  const teamRows = await getDb()
    .select({ team: teams, competition: competitions })
    .from(teams)
    .innerJoin(competitions, eq(teams.competitionId, competitions.id))
    .where(and(eq(teams.schoolId, schoolRow.school.id), eq(competitions.status, "published")))
    .orderBy(asc(competitions.name));

  return {
    slug: schoolRow.school.slug,
    name: schoolRow.school.name,
    cityName: schoolRow.city?.name ?? null,
    teams: teamRows.map((row) => ({
      id: row.team.id,
      slug: row.team.slug,
      name: row.team.name,
      logo: row.team.logo,
      competitionSlug: row.competition.slug,
      competitionName: row.competition.name,
    })),
  };
}

export async function getPublishedMatchParams() {
  "use cache";
  cacheTag(cacheTags.competitions);
  const rows = await getDb()
    .select({ id: matches.id, legacySlug: matches.legacySlug })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .where(eq(competitions.status, "published"));
  return rows.flatMap((row) => {
    const params = [{ id: row.id }];
    if (row.legacySlug) params.push({ id: row.legacySlug });
    return params;
  });
}

export async function getPublishedTeamParams() {
  "use cache";
  cacheTag(cacheTags.competitions);
  const rows = await getDb()
    .select({ competitionSlug: competitions.slug, teamSlug: teams.slug })
    .from(teams)
    .innerJoin(competitions, eq(teams.competitionId, competitions.id))
    .where(eq(competitions.status, "published"));
  return rows.map((row) => ({ slug: row.competitionSlug, team: row.teamSlug }));
}

export async function getPublishedSchoolParams() {
  "use cache";
  cacheTag(cacheTags.competitions);
  const rows = await getDb()
    .selectDistinct({ slug: schools.slug })
    .from(schools)
    .innerJoin(teams, eq(teams.schoolId, schools.id))
    .innerJoin(competitions, eq(teams.competitionId, competitions.id))
    .where(eq(competitions.status, "published"));
  return rows.map((row) => ({ slug: row.slug }));
}

export async function getPublishedCupSlugs() {
  "use cache";
  cacheTag(cacheTags.competitions);
  const rows = await getDb()
    .select({ slug: competitions.slug })
    .from(competitions)
    .where(eq(competitions.status, "published"));
  return rows.map((row) => ({ slug: row.slug }));
}

export async function getSitemapCupPaths() {
  const [cups, teamsParams, matchParams, schoolParams] = await Promise.all([
    getPublishedCupSlugs(),
    getPublishedTeamParams(),
    getPublishedMatchParams(),
    getPublishedSchoolParams(),
  ]);
  const subpages = ["partite", "classifica", "squadre", "statistiche", "blog", "staff", "info"];
  const paths = cups.flatMap(({ slug }) => [
    `/competizioni/${slug}`,
    ...subpages.map((page) => `/competizioni/${slug}/${page}`),
  ]);
  paths.push(
    ...teamsParams.map((row) => `/competizioni/${row.slug}/squadre/${row.team}`),
    ...matchParams.map((row) => `/partite/${row.id}`),
    ...schoolParams.map((row) => `/scuole/${row.slug}`),
  );
  return paths;
}
