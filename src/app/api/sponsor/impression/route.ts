import { connection } from "next/server";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { sponsorImpressions, sponsorSlots } from "@/db/schema";
import { isUuid, todayIsoDate } from "@/lib/slug";

export async function POST(request: Request) {
  await connection();
  let slotIds: string[] = [];
  const contentType = request.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { slotIds?: string[]; slotId?: string };
      slotIds = body.slotIds ?? (body.slotId ? [body.slotId] : []);
    } else {
      const text = await request.text();
      const parsed = JSON.parse(text) as { slotIds?: string[]; slotId?: string };
      slotIds = parsed.slotIds ?? (parsed.slotId ? [parsed.slotId] : []);
    }
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const unique = [...new Set(slotIds.filter((id) => isUuid(id)))];
  if (unique.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const db = getDb();
  const day = todayIsoDate();
  for (const slotId of unique) {
    const [slot] = await db
      .select({ sponsorId: sponsorSlots.sponsorId })
      .from(sponsorSlots)
      .where(eq(sponsorSlots.id, slotId))
      .limit(1);
    if (!slot) continue;
    await db
      .insert(sponsorImpressions)
      .values({ slotId, sponsorId: slot.sponsorId, day, count: 1 })
      .onConflictDoUpdate({
        target: [sponsorImpressions.slotId, sponsorImpressions.day],
        set: { count: sql`${sponsorImpressions.count} + 1` },
      });
  }

  return NextResponse.json({ ok: true });
}
