import { existsSync } from "node:fs";
import { join } from "node:path";
import { cacheTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { cities, competitions } from "@/db/schema";
import { cacheTags } from "@/lib/cache-tags";
import { LOCAL_COMPETITIONS, type LocalCompetition } from "@/data/homeData";

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
  const codeMatch = LOCAL_COMPETITIONS.find((item) => item.slug === competition.slug);
  const publicFile = (path: string | null | undefined) => {
    if (!path) return { path, exists: false };
    const relative = path.replace(/^\//, "");
    return { path, exists: existsSync(join(process.cwd(), "public", relative)) };
  };

  // #region agent log
  fetch("http://127.0.0.1:7290/ingest/2cc69b13-f623-451a-9fcc-7fcd9d8725f7", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "7a42a0" },
    body: JSON.stringify({
      sessionId: "7a42a0",
      runId: "post-fix",
      hypothesisId: "A",
      location: "src/lib/queries/competitions.ts:toLocalCompetition",
      message: "image path from DB vs homeData vs disk",
      data: {
        slug: competition.slug,
        dbImage: competition.image,
        dbLogo: competition.logo,
        codeImage: codeMatch?.image ?? null,
        dbImageOnDisk: publicFile(competition.image),
        codeImageOnDisk: publicFile(codeMatch?.image),
        pathsDiffer: (competition.image ?? null) !== (codeMatch?.image ?? null),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

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
