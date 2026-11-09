import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { sponsorClicks, sponsorImpressions, sponsors } from "@/db/schema";
import { requireUser } from "@/lib/auth/guards";
import { todayIsoDate } from "@/lib/slug";

export async function GET(request: Request) {
  await requireUser();
  const url = new URL(request.url);
  const from = url.searchParams.get("from") ?? "2020-01-01";
  const to = url.searchParams.get("to") ?? todayIsoDate();
  const db = getDb();
  const rows = await db.select().from(sponsors);
  const clicks = await db
    .select({
      sponsorId: sponsorClicks.sponsorId,
      clicks: sql<number>`count(*)`,
    })
    .from(sponsorClicks)
    .groupBy(sponsorClicks.sponsorId);
  const views = await db
    .select({
      sponsorId: sponsorImpressions.sponsorId,
      views: sql<number>`coalesce(sum(${sponsorImpressions.count}), 0)`,
    })
    .from(sponsorImpressions)
    .groupBy(sponsorImpressions.sponsorId);
  const clickMap = new Map(clicks.map((row) => [row.sponsorId, Number(row.clicks)]));
  const viewMap = new Map(views.map((row) => [row.sponsorId, Number(row.views)]));
  const header = "sponsor,clicks,impressions,from,to";
  const body = rows
    .map(
      (row) =>
        `${JSON.stringify(row.name)},${clickMap.get(row.id) ?? 0},${viewMap.get(row.id) ?? 0},${from},${to}`,
    )
    .join("\n");
  return new Response(`${header}\n${body}\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=sponsor-report.csv",
    },
  });
}
