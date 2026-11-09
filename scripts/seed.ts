import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { CUP_BLOG_POSTS } from "../src/data/cupBlog";
import {
  CIRCUIT_PARTNERS,
  CIRCUIT_STATS,
  COMPACT_LEAGUE_SNAPSHOTS,
  CONTACT_CHANNELS,
  EDITORIAL_NEWS,
  HERO_IMAGES,
  LOCAL_COMPETITIONS,
  MISSION,
  MISSION_LINES,
  MISSION_PILLARS,
  NATIONAL_FINALS,
  NAV_ITEMS,
  SCHOOL_INVITE,
  SITE_MOTTO,
} from "../src/data/homeData";
import * as schema from "../src/db/schema";
import { CUP_BLOCK_KEYS } from "../src/db/schema";
import { DEFAULT_STANDINGS_RULES } from "../src/lib/standings";
import { parseRoundNumber, slugify } from "../src/lib/slug";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL is required");
}

async function seed() {
  const pool = new Pool({ connectionString: url, max: 1 });
  const db = drizzle({ client: pool, schema });

  await db.delete(schema.sponsorClicks);
  await db.delete(schema.sponsorImpressions);
  await db.delete(schema.liveCommands);
  await db.delete(schema.matchEvents);
  await db.delete(schema.matchdayAwards);
  await db.delete(schema.competitionBlocks);
  await db.delete(schema.staffMembers);
  await db.delete(schema.matches);
  await db.delete(schema.players);
  await db.delete(schema.teams);
  await db.delete(schema.groups);
  await db.delete(schema.schools);
  await db.delete(schema.venues);
  await db.delete(schema.phases);
  await db.delete(schema.posts);
  await db.delete(schema.sponsorSlots);
  await db.delete(schema.sponsors);
  await db.delete(schema.homeBlocks);
  await db.delete(schema.siteSettings);
  await db.delete(schema.competitions);
  await db.delete(schema.cities);

  const cityRows = [];
  for (const cup of LOCAL_COMPETITIONS) {
    if (!cup.city) continue;
    const slug = slugify(cup.city);
    const [existing] = await db
      .select()
      .from(schema.cities)
      .where(eq(schema.cities.slug, slug))
      .limit(1);
    if (existing) {
      cityRows.push(existing);
      continue;
    }
    const [created] = await db
      .insert(schema.cities)
      .values({
        slug,
        name: cup.city,
        region: cup.regionTag,
        lat: cup.coordinates?.lat,
        lon: cup.coordinates?.lon,
        mapCalloutDx: cup.mapCallout?.dx,
        mapCalloutDy: cup.mapCallout?.dy,
      })
      .returning();
    cityRows.push(created);
  }

  const cityByName = new Map(cityRows.map((city) => [city.name, city]));
  const competitionBySlug = new Map<string, typeof schema.competitions.$inferSelect>();

  for (const [index, cup] of LOCAL_COMPETITIONS.entries()) {
    const city = cup.city ? cityByName.get(cup.city) : undefined;
    const [created] = await db
      .insert(schema.competitions)
      .values({
        slug: cup.slug,
        name: cup.name,
        cityId: city?.id,
        regionTag: cup.regionTag,
        season: "2025/2026",
        status: "published",
        stageLabel: cup.stageLabel,
        logo: cup.logo,
        image: cup.image,
        imageAlt: cup.imageAlt,
        description: cup.description,
        social:
          cup.slug === "mole-cup"
            ? { instagram: "https://www.instagram.com/legacalciostudenti/" }
            : {},
        contacts:
          cup.slug === "mole-cup"
            ? { email: "privacy@legacalciostudenti.it" }
            : undefined,
        regulationsUrl: cup.slug === "mole-cup" ? "/terms" : null,
        standingsRules: DEFAULT_STANDINGS_RULES,
        sortOrder: index,
      })
      .returning();
    competitionBySlug.set(cup.slug, created);

    await db.insert(schema.phases).values({
      competitionId: created.id,
      slug: "gironi",
      name: cup.stageLabel ?? "Fase a Gironi",
      kind: "group",
      sortOrder: 0,
    });

    await db.insert(schema.competitionBlocks).values(
      CUP_BLOCK_KEYS.map((key, order) => ({
        competitionId: created.id,
        key,
        visible: true,
        sortOrder: order,
      })),
    );
  }

  for (const post of CUP_BLOG_POSTS) {
    const competition = competitionBySlug.get(post.competitionSlug);
    if (!competition) continue;
    await db.insert(schema.posts).values({
      competitionId: competition.id,
      kind: "blog",
      slug: post.slug,
      title: post.title,
      dek: post.dek,
      authors: post.authors,
      dateLabel: post.dateLabel,
      dateIso: post.dateIso,
      image: post.image,
      imageAlt: post.imageAlt,
      imageCredit: post.imageCredit,
      body: post.body,
      published: true,
    });
  }

  const sponsorByName = new Map<string, typeof schema.sponsors.$inferSelect>();
  for (const partner of CIRCUIT_PARTNERS) {
    const [created] = await db
      .insert(schema.sponsors)
      .values({
        name: partner.name,
        kind: partner.kind,
        logo: partner.logo,
        href: partner.href,
      })
      .returning();
    sponsorByName.set(partner.name, created);
    await db.insert(schema.sponsorSlots).values({
      sponsorId: created.id,
      placement: "nazionale",
      sortOrder: CIRCUIT_PARTNERS.indexOf(partner),
    });
  }

  await db.insert(schema.siteSettings).values([
    { key: "motto", value: SITE_MOTTO },
    { key: "site_name", value: "Lega Calcio Studenti" },
    { key: "standings_rules", value: DEFAULT_STANDINGS_RULES },
  ]);

  await db.insert(schema.homeBlocks).values([
    { key: "nav_items", payload: NAV_ITEMS, sortOrder: 0 },
    { key: "hero", payload: HERO_IMAGES, sortOrder: 1 },
    { key: "mission", payload: MISSION, sortOrder: 2 },
    { key: "mission_lines", payload: MISSION_LINES, sortOrder: 3 },
    { key: "mission_pillars", payload: MISSION_PILLARS, sortOrder: 4 },
    { key: "school_invite", payload: SCHOOL_INVITE, sortOrder: 5 },
    { key: "circuit_stats", payload: CIRCUIT_STATS, sortOrder: 6 },
    { key: "national_finals", payload: NATIONAL_FINALS, sortOrder: 7 },
    { key: "partners", payload: CIRCUIT_PARTNERS, sortOrder: 8 },
    { key: "editorial_news", payload: EDITORIAL_NEWS, sortOrder: 9 },
    { key: "contact_channels", payload: CONTACT_CHANNELS, sortOrder: 10 },
  ]);

  const firstFinishedByCup = new Map<string, typeof schema.matches.$inferSelect>();
  const teamsByCup = new Map<string, typeof schema.teams.$inferSelect[]>();

  for (const snapshot of COMPACT_LEAGUE_SNAPSHOTS) {
    const competition = competitionBySlug.get(snapshot.id);
    const city = cityByName.get(snapshot.city);
    if (!competition) continue;

    const [phase] = await db
      .select()
      .from(schema.phases)
      .where(eq(schema.phases.competitionId, competition.id))
      .limit(1);

    const [group] = await db
      .insert(schema.groups)
      .values({
        phaseId: phase.id,
        slug: "girone-unico",
        name: "Girone unico",
        sortOrder: 0,
      })
      .returning();

    const venueByName = new Map<string, typeof schema.venues.$inferSelect>();
    const teamBySchool = new Map<string, typeof schema.teams.$inferSelect>();

    for (const match of snapshot.matches) {
      if (!venueByName.has(match.venue)) {
        const [venue] = await db
          .insert(schema.venues)
          .values({
            cityId: city?.id,
            name: match.venue,
            mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.venue)}`,
          })
          .returning();
        venueByName.set(match.venue, venue);
      }

      for (const schoolName of [match.homeSchool, match.awaySchool]) {
        if (teamBySchool.has(schoolName)) continue;
        const [school] = await db
          .insert(schema.schools)
          .values({
            cityId: city?.id,
            name: schoolName,
            slug: `${slugify(schoolName)}-${snapshot.id}`,
          })
          .returning();
        const [team] = await db
          .insert(schema.teams)
          .values({
            schoolId: school.id,
            competitionId: competition.id,
            phaseId: phase?.id,
            groupId: group.id,
            slug: slugify(schoolName),
            name: schoolName,
            logo: snapshot.logo,
          })
          .returning();
        teamBySchool.set(schoolName, team);
      }

      const homeTeam = teamBySchool.get(match.homeSchool);
      const awayTeam = teamBySchool.get(match.awaySchool);
      const venue = venueByName.get(match.venue);
      const finished = match.status === "FINALE";
      const kickoffAt = finished
        ? new Date("2026-03-20T19:45:00+01:00")
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const [createdMatch] = await db
        .insert(schema.matches)
        .values({
          competitionId: competition.id,
          phaseId: phase?.id,
          groupId: group.id,
          venueId: venue?.id,
          roundLabel: match.round,
          roundNumber: parseRoundNumber(match.round),
          dateLabel: match.dateLabel,
          kickoffAt,
          homeTeamId: homeTeam?.id,
          awayTeamId: awayTeam?.id,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          status: finished ? "finished" : "scheduled",
        })
        .returning();

      if (finished && !firstFinishedByCup.has(snapshot.id)) {
        firstFinishedByCup.set(snapshot.id, createdMatch);
      }
    }

    teamsByCup.set(snapshot.id, [...teamBySchool.values()]);
  }

  const mole = competitionBySlug.get("mole-cup");
  const moleTeams = teamsByCup.get("mole-cup") ?? [];
  const moleMatch = firstFinishedByCup.get("mole-cup");
  if (mole && moleTeams.length >= 2 && moleMatch) {
    const [scorer] = await db
      .insert(schema.players)
      .values({
        teamId: moleTeams[0].id,
        name: "Chiara Conti",
        number: 9,
        position: "Attaccante",
        publicationConsent: true,
      })
      .returning();
    const [silent] = await db
      .insert(schema.players)
      .values({
        teamId: moleTeams[1].id,
        name: "Nome Riservato",
        number: 7,
        position: "Centrocampista",
        publicationConsent: false,
      })
      .returning();

    await db.insert(schema.matchEvents).values([
      {
        matchId: moleMatch.id,
        teamId: moleTeams[0].id,
        playerId: scorer.id,
        type: "goal",
        minute: 12,
      },
      {
        matchId: moleMatch.id,
        teamId: moleTeams[0].id,
        playerId: scorer.id,
        type: "goal",
        minute: 67,
      },
      {
        matchId: moleMatch.id,
        teamId: moleTeams[1].id,
        playerId: silent.id,
        type: "goal",
        minute: 81,
      },
      {
        matchId: moleMatch.id,
        teamId: moleTeams[1].id,
        playerId: silent.id,
        type: "yellow_card",
        minute: 40,
      },
    ]);

    await db.insert(schema.matchdayAwards).values({
      competitionId: mole.id,
      roundLabel: moleMatch.roundLabel ?? "Giornata 3",
      playerId: scorer.id,
      note: "Doppietta e partita in controllo",
    });

    await db.insert(schema.staffMembers).values([
      {
        competitionId: mole.id,
        name: "Giulia Ferrero",
        role: "Responsabile coppa",
        sortOrder: 0,
      },
      {
        competitionId: mole.id,
        name: "Marco Pellico",
        role: "Referto e campo",
        sortOrder: 1,
      },
    ]);

    const titleSponsor = [...sponsorByName.values()][0];
    const goldSponsor = [...sponsorByName.values()][1] ?? titleSponsor;
    const silverSponsor = [...sponsorByName.values()][2] ?? titleSponsor;
    if (titleSponsor) {
      await db.insert(schema.sponsorSlots).values([
        {
          sponsorId: titleSponsor.id,
          competitionId: mole.id,
          placement: "title_coppa",
          sortOrder: 0,
        },
        {
          sponsorId: goldSponsor.id,
          competitionId: mole.id,
          placement: "gold_locale",
          sortOrder: 0,
        },
        {
          sponsorId: silverSponsor.id,
          competitionId: mole.id,
          placement: "silver_locale",
          sortOrder: 0,
        },
        {
          sponsorId: titleSponsor.id,
          competitionId: mole.id,
          placement: "mvp",
          sortOrder: 0,
        },
      ]);
    }
  }

  console.log(
    JSON.stringify({
      cities: cityRows.length,
      competitions: competitionBySlug.size,
      posts: CUP_BLOG_POSTS.length,
      sponsors: sponsorByName.size,
      snapshots: COMPACT_LEAGUE_SNAPSHOTS.length,
    }),
  );

  await pool.end();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
