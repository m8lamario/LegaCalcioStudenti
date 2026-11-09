import { cacheTag } from "next/cache";
import { and, asc, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { sponsorSlots, sponsors, type SponsorPlacement } from "@/db/schema";
import { cacheTags } from "@/lib/cache-tags";
import { todayIsoDate } from "@/lib/slug";

export type ActiveSponsorSlot = {
  slotId: string;
  sponsorId: string;
  name: string;
  logo: string | null;
  href: string | null;
  kind: string;
  placement: string;
};

function isActive(startsOn: string | null, endsOn: string | null, today: string) {
  if (startsOn && startsOn > today) return false;
  if (endsOn && endsOn < today) return false;
  return true;
}

export async function getActiveSponsorSlots(
  placement: SponsorPlacement | string,
  competitionId?: string | null,
): Promise<ActiveSponsorSlot[]> {
  "use cache";
  cacheTag(cacheTags.partners);
  if (competitionId) cacheTag(`cup-sponsors:${competitionId}`);

  const db = getDb();
  const rows = await db
    .select({ slot: sponsorSlots, sponsor: sponsors })
    .from(sponsorSlots)
    .innerJoin(sponsors, eq(sponsorSlots.sponsorId, sponsors.id))
    .where(
      and(
        eq(sponsorSlots.placement, placement),
        competitionId
          ? eq(sponsorSlots.competitionId, competitionId)
          : isNull(sponsorSlots.competitionId),
      ),
    )
    .orderBy(asc(sponsorSlots.sortOrder), asc(sponsors.name));

  const today = todayIsoDate();
  return rows
    .filter((row) => isActive(row.slot.startsOn, row.slot.endsOn, today))
    .map((row) => ({
      slotId: row.slot.id,
      sponsorId: row.sponsor.id,
      name: row.sponsor.name,
      logo: row.sponsor.logo,
      href: row.sponsor.href,
      kind: row.sponsor.kind,
      placement: row.slot.placement,
    }));
}

export async function getSponsorSlotById(slotId: string) {
  const [row] = await getDb()
    .select({ slot: sponsorSlots, sponsor: sponsors })
    .from(sponsorSlots)
    .innerJoin(sponsors, eq(sponsorSlots.sponsorId, sponsors.id))
    .where(eq(sponsorSlots.id, slotId))
    .limit(1);
  if (!row) return null;
  return {
    slotId: row.slot.id,
    sponsorId: row.sponsor.id,
    href: row.sponsor.href,
    name: row.sponsor.name,
  };
}

