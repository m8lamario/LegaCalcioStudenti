import { cacheTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { cities, competitions } from "@/db/schema";
import { cacheTags } from "@/lib/cache-tags";
import type { LocalCompetition } from "@/data/homeData";

export async function getCompetitionsWithCities(): Promise<LocalCompetition[]> {
  "use cache";
  cacheTag(cacheTags.competitions);

  const rows = await getDb()
    .select({
      competition: competitions,
      city: cities,
    })
    .from(competitions)
    .leftJoin(cities, eq(competitions.cityId, cities.id))
    .orderBy(competitions.sortOrder, competitions.name);

  return rows
    .filter((row) => row.competition.status === "published")
    .map(({ competition, city }) => toLocalCompetition(competition, city));
}

export async function getCompetitionWithCity(
  slug: string,
): Promise<LocalCompetition | null> {
  "use cache";
  cacheTag(cacheTags.competitions);

  const [row] = await getDb()
    .select({
      competition: competitions,
      city: cities,
    })
    .from(competitions)
    .leftJoin(cities, eq(competitions.cityId, cities.id))
    .where(eq(competitions.slug, slug))
    .limit(1);

  if (!row || row.competition.status !== "published") return null;
  return toLocalCompetition(row.competition, row.city);
}

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
