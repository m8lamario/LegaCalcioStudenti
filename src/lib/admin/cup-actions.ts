"use server";

import { and, eq, gte, lte, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  CUP_BLOCK_KEYS,
  competitionBlocks,
  competitions,
  groups,
  matchEvents,
  matchdayAwards,
  matches,
  phases,
  sponsorClicks,
  sponsorImpressions,
  sponsorSlots,
  staffMembers,
} from "@/db/schema";
import { writeAudit } from "@/lib/admin/audit";
import { revalidateCupById, revalidatePublic } from "@/lib/admin/revalidate";
import { assertAdmin, assertCityAccess, assertContentAccess, requireUser } from "@/lib/auth/guards";
import { slugify } from "@/lib/slug";

function formString(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

async function competitionCity(competitionId: string) {
  const [row] = await getDb()
    .select({ cityId: competitions.cityId })
    .from(competitions)
    .where(eq(competitions.id, competitionId))
    .limit(1);
  return row?.cityId ?? null;
}

export async function saveMatchEvent(form: FormData) {
  const user = await requireUser();
  const matchId = formString(form, "matchId");
  const [match] = await getDb().select().from(matches).where(eq(matches.id, matchId)).limit(1);
  if (!match) throw new Error("Partita non trovata.");
  const cityId = await competitionCity(match.competitionId);
  assertCityAccess(user, cityId);

  const id = formString(form, "id");
  const values = {
    matchId,
    teamId: formString(form, "teamId") || null,
    playerId: formString(form, "playerId") || null,
    type: formString(form, "type") as "goal" | "yellow_card" | "red_card" | "substitution",
    minute: formString(form, "minute") ? Number(formString(form, "minute")) : null,
    note: formString(form, "note") || null,
  };
  if (id) await getDb().update(matchEvents).set(values).where(eq(matchEvents.id, id));
  else await getDb().insert(matchEvents).values(values);

  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "match_events",
    entityId: id || matchId,
    summary: `Evento ${values.type} sulla partita`,
  });
  await revalidateCupById(match.competitionId, {
    matchId,
    teamIds: [match.homeTeamId, match.awayTeamId].filter(Boolean) as string[],
  });
}

export async function deleteMatchEvent(form: FormData) {
  const user = await requireUser();
  const id = formString(form, "id");
  const [event] = await getDb()
    .select({ event: matchEvents, match: matches })
    .from(matchEvents)
    .innerJoin(matches, eq(matchEvents.matchId, matches.id))
    .where(eq(matchEvents.id, id))
    .limit(1);
  if (!event) return;
  const cityId = await competitionCity(event.match.competitionId);
  assertCityAccess(user, cityId);
  await getDb().delete(matchEvents).where(eq(matchEvents.id, id));
  await writeAudit({
    userId: user.id,
    action: "delete",
    entity: "match_events",
    entityId: id,
    summary: "Eliminato evento partita",
  });
  await revalidateCupById(event.match.competitionId, {
    matchId: event.match.id,
    teamIds: [event.match.homeTeamId, event.match.awayTeamId].filter(Boolean) as string[],
  });
}

export async function saveGroup(form: FormData) {
  const user = await requireUser();
  const phaseId = formString(form, "phaseId");
  const [phase] = await getDb()
    .select({ phase: phases, cityId: competitions.cityId })
    .from(phases)
    .innerJoin(competitions, eq(phases.competitionId, competitions.id))
    .where(eq(phases.id, phaseId))
    .limit(1);
  assertContentAccess(user, phase?.cityId ?? null);
  const id = formString(form, "id");
  const name = formString(form, "name");
  const values = {
    phaseId,
    name,
    slug: formString(form, "slug") || slugify(name),
    sortOrder: Number(formString(form, "sortOrder") || "0"),
  };
  if (id) await getDb().update(groups).set(values).where(eq(groups.id, id));
  else await getDb().insert(groups).values(values);
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "groups",
    entityId: id || values.slug,
    summary: `Salvato girone ${values.name}`,
  });
  if (phase) await revalidateCupById(phase.phase.competitionId);
}

export async function saveStaffMember(form: FormData) {
  const user = await requireUser();
  const competitionId = formString(form, "competitionId");
  assertContentAccess(user, await competitionCity(competitionId));
  const id = formString(form, "id");
  const values = {
    competitionId,
    name: formString(form, "name"),
    role: formString(form, "role"),
    photo: formString(form, "photo") || null,
    sortOrder: Number(formString(form, "sortOrder") || "0"),
  };
  if (id) await getDb().update(staffMembers).set(values).where(eq(staffMembers.id, id));
  else await getDb().insert(staffMembers).values(values);
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "staff_members",
    entityId: id,
    summary: `Salvato staff ${values.name}`,
  });
  await revalidateCupById(competitionId);
}

export async function saveMatchdayAward(form: FormData) {
  const user = await requireUser();
  const competitionId = formString(form, "competitionId");
  assertContentAccess(user, await competitionCity(competitionId));
  const id = formString(form, "id");
  const values = {
    competitionId,
    roundLabel: formString(form, "roundLabel"),
    playerId: formString(form, "playerId") || null,
    note: formString(form, "note") || null,
  };
  if (id) await getDb().update(matchdayAwards).set(values).where(eq(matchdayAwards.id, id));
  else await getDb().insert(matchdayAwards).values(values);
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "matchday_awards",
    entityId: id,
    summary: `Salvato MVP ${values.roundLabel}`,
  });
  await revalidateCupById(competitionId);
}

export async function saveCompetitionBlocks(form: FormData) {
  const user = await requireUser();
  const competitionId = formString(form, "competitionId");
  assertContentAccess(user, await competitionCity(competitionId));
  const db = getDb();
  for (const [index, key] of CUP_BLOCK_KEYS.entries()) {
    const visible = form.get(`visible_${key}`) === "on";
    const sortOrder = Number(formString(form, `order_${key}`) || String(index));
    const [existing] = await db
      .select()
      .from(competitionBlocks)
      .where(and(eq(competitionBlocks.competitionId, competitionId), eq(competitionBlocks.key, key)))
      .limit(1);
    if (existing) {
      await db
        .update(competitionBlocks)
        .set({ visible, sortOrder })
        .where(eq(competitionBlocks.id, existing.id));
    } else {
      await db.insert(competitionBlocks).values({ competitionId, key, visible, sortOrder });
    }
  }
  await writeAudit({
    userId: user.id,
    action: "update",
    entity: "competition_blocks",
    entityId: competitionId,
    summary: "Aggiornati blocchi coppa",
  });
  await revalidateCupById(competitionId);
}

export async function saveSponsorSlot(form: FormData) {
  const user = await requireUser();
  assertAdmin(user);
  const id = formString(form, "id");
  const values = {
    sponsorId: formString(form, "sponsorId"),
    competitionId: formString(form, "competitionId") || null,
    placement: formString(form, "placement") || "nazionale",
    startsOn: formString(form, "startsOn") || null,
    endsOn: formString(form, "endsOn") || null,
    sortOrder: Number(formString(form, "sortOrder") || "0"),
  };
  if (id) await getDb().update(sponsorSlots).set(values).where(eq(sponsorSlots.id, id));
  else await getDb().insert(sponsorSlots).values(values);
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "sponsor_slots",
    entityId: id,
    summary: `Salvato slot ${values.placement}`,
  });
  await revalidatePublic();
  if (values.competitionId) await revalidateCupById(values.competitionId);
}

export async function getSponsorReport(from: string, to: string) {
  const db = getDb();
  const clickRows = await db
    .select({
      sponsorId: sponsorClicks.sponsorId,
      clicks: sql<number>`count(*)`,
    })
    .from(sponsorClicks)
    .where(and(gte(sponsorClicks.createdAt, new Date(from)), lte(sponsorClicks.createdAt, new Date(to))))
    .groupBy(sponsorClicks.sponsorId);

  const impressionRows = await db
    .select({
      sponsorId: sponsorImpressions.sponsorId,
      views: sql<number>`sum(${sponsorImpressions.count})`,
    })
    .from(sponsorImpressions)
    .where(and(gte(sponsorImpressions.day, from), lte(sponsorImpressions.day, to)))
    .groupBy(sponsorImpressions.sponsorId);

  return { clickRows, impressionRows };
}
