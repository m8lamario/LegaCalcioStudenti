import { revalidateTag } from "next/cache";
import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { competitions, schools, teams } from "@/db/schema";
import {
  cacheTags,
  cupTag,
  matchTag,
  schoolTag,
  standingsTag,
  teamTag,
} from "@/lib/cache-tags";

export async function revalidatePublic() {
  revalidateTag(cacheTags.home, "max");
  revalidateTag(cacheTags.site, "max");
  revalidateTag(cacheTags.competitions, "max");
  revalidateTag(cacheTags.posts, "max");
  revalidateTag(cacheTags.partners, "max");
}

export async function revalidateCupById(
  competitionId: string | null | undefined,
  extra?: {
    matchId?: string | null;
    teamIds?: string[];
    schoolSlugs?: string[];
  },
) {
  await revalidatePublic();
  if (!competitionId) return;

  const db = getDb();
  const [cup] = await db
    .select({ slug: competitions.slug })
    .from(competitions)
    .where(eq(competitions.id, competitionId))
    .limit(1);
  if (!cup) return;

  revalidateTag(cupTag(cup.slug), "max");
  revalidateTag(standingsTag(cup.slug), "max");

  if (extra?.matchId) {
    revalidateTag(matchTag(extra.matchId), "max");
  }

  const teamIds = extra?.teamIds?.filter(Boolean) ?? [];
  if (teamIds.length > 0) {
    const teamRows = await db
      .select({ slug: teams.slug, schoolId: teams.schoolId })
      .from(teams)
      .where(inArray(teams.id, teamIds));
    for (const team of teamRows) {
      revalidateTag(teamTag(cup.slug, team.slug), "max");
    }
    const schoolIds = teamRows.map((row) => row.schoolId).filter(Boolean);
    if (schoolIds.length > 0) {
      const schoolRows = await db
        .select({ slug: schools.slug })
        .from(schools)
        .where(inArray(schools.id, schoolIds));
      for (const school of schoolRows) {
        revalidateTag(schoolTag(school.slug), "max");
      }
    }
  }

  for (const slug of extra?.schoolSlugs ?? []) {
    revalidateTag(schoolTag(slug), "max");
  }
}
