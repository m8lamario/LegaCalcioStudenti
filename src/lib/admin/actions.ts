"use server";

import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import {
  cities,
  competitions,
  homeBlocks,
  matches,
  phases,
  players,
  posts,
  schools,
  siteSettings,
  sponsorSlots,
  sponsors,
  teams,
  userCities,
  users,
  venues,
} from "@/db/schema";
import { writeAudit } from "@/lib/admin/audit";
import { revalidateCupById, revalidatePublic } from "@/lib/admin/revalidate";
import { assertAdmin, assertCityAccess, assertContentAccess, requireUser } from "@/lib/auth/guards";
import { slugify } from "@/lib/slug";

function formString(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export async function saveCompetition(form: FormData) {
  const user = await requireUser();
  const parsed = z
    .object({
      id: z.string().uuid().optional().or(z.literal("")),
      slug: z.string().min(2),
      name: z.string().min(2),
      cityId: z.string().uuid().optional().or(z.literal("")),
      regionTag: z.string().optional(),
      season: z.string().optional(),
      status: z.enum(["draft", "published", "archived"]),
      stageLabel: z.string().optional(),
      logo: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      description: z.string().optional(),
      ticketsUrl: z.string().optional(),
      ticketsActive: z.boolean().optional(),
      regulationsUrl: z.string().optional(),
      contactEmail: z.string().optional(),
      contactPhone: z.string().optional(),
      contactAddress: z.string().optional(),
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      halfMinutes: z.coerce.number().int().min(5).max(45).default(25),
      extraHalfMinutes: z.coerce.number().int().min(5).max(20).default(10),
      sortOrder: z.coerce.number().int().default(0),
    })
    .parse({
      id: formString(form, "id"),
      slug: formString(form, "slug"),
      name: formString(form, "name"),
      cityId: formString(form, "cityId"),
      regionTag: formString(form, "regionTag"),
      season: formString(form, "season"),
      status: formString(form, "status") || "published",
      stageLabel: formString(form, "stageLabel"),
      logo: formString(form, "logo"),
      image: formString(form, "image"),
      imageAlt: formString(form, "imageAlt"),
      description: formString(form, "description"),
      ticketsUrl: formString(form, "ticketsUrl"),
      ticketsActive: form.get("ticketsActive") === "on",
      regulationsUrl: formString(form, "regulationsUrl"),
      contactEmail: formString(form, "contactEmail"),
      contactPhone: formString(form, "contactPhone"),
      contactAddress: formString(form, "contactAddress"),
      instagram: formString(form, "instagram"),
      facebook: formString(form, "facebook"),
      halfMinutes: formString(form, "halfMinutes") || "25",
      extraHalfMinutes: formString(form, "extraHalfMinutes") || "10",
      sortOrder: formString(form, "sortOrder") || "0",
    });

  assertContentAccess(user, parsed.cityId || null);
  const db = getDb();
  const values = {
    slug: parsed.slug,
    name: parsed.name,
    cityId: parsed.cityId || null,
    regionTag: parsed.regionTag || null,
    season: parsed.season || null,
    status: parsed.status,
    stageLabel: parsed.stageLabel || null,
    logo: parsed.logo || null,
    image: parsed.image || null,
    imageAlt: parsed.imageAlt || null,
    description: parsed.description || null,
    ticketsUrl: parsed.ticketsUrl || null,
    ticketsActive: Boolean(parsed.ticketsActive),
    regulationsUrl: parsed.regulationsUrl || null,
    contacts: {
      email: parsed.contactEmail || undefined,
      phone: parsed.contactPhone || undefined,
      address: parsed.contactAddress || undefined,
    },
    social: {
      ...(parsed.instagram ? { instagram: parsed.instagram } : {}),
      ...(parsed.facebook ? { facebook: parsed.facebook } : {}),
    },
    halfMinutes: parsed.halfMinutes,
    extraHalfMinutes: parsed.extraHalfMinutes,
    sortOrder: parsed.sortOrder,
    updatedAt: new Date(),
  };

  if (parsed.id) {
    await db.update(competitions).set(values).where(eq(competitions.id, parsed.id));
  } else {
    await db.insert(competitions).values(values);
  }

  await writeAudit({
    userId: user.id,
    action: parsed.id ? "update" : "create",
    entity: "competitions",
    entityId: parsed.id || parsed.slug,
    summary: `Salvata coppa ${parsed.name}`,
  });
  if (parsed.id) await revalidateCupById(parsed.id);
  else await revalidatePublic();
}

export async function saveCity(form: FormData) {
  const user = await requireUser();
  assertAdmin(user);
  const parsed = z
    .object({
      id: z.string().uuid().optional().or(z.literal("")),
      slug: z.string().min(2),
      name: z.string().min(2),
      region: z.string().optional(),
      lat: z.coerce.number().optional(),
      lon: z.coerce.number().optional(),
      mapCalloutDx: z.coerce.number().optional(),
      mapCalloutDy: z.coerce.number().optional(),
    })
    .parse({
      id: formString(form, "id"),
      slug: formString(form, "slug"),
      name: formString(form, "name"),
      region: formString(form, "region"),
      lat: form.get("lat") || undefined,
      lon: form.get("lon") || undefined,
      mapCalloutDx: form.get("mapCalloutDx") || undefined,
      mapCalloutDy: form.get("mapCalloutDy") || undefined,
    });

  const db = getDb();
  const values = {
    slug: parsed.slug,
    name: parsed.name,
    region: parsed.region || null,
    lat: parsed.lat,
    lon: parsed.lon,
    mapCalloutDx: parsed.mapCalloutDx,
    mapCalloutDy: parsed.mapCalloutDy,
    updatedAt: new Date(),
  };
  if (parsed.id) {
    await db.update(cities).set(values).where(eq(cities.id, parsed.id));
  } else {
    await db.insert(cities).values(values);
  }
  await writeAudit({
    userId: user.id,
    action: parsed.id ? "update" : "create",
    entity: "cities",
    entityId: parsed.id || parsed.slug,
    summary: `Salvata città ${parsed.name}`,
  });
  await revalidatePublic();
}

export async function savePhase(form: FormData) {
  const user = await requireUser();
  const competitionId = formString(form, "competitionId");
  const [competition] = await getDb()
    .select()
    .from(competitions)
    .where(eq(competitions.id, competitionId))
    .limit(1);
  assertContentAccess(user, competition?.cityId);
  const id = formString(form, "id");
  const values = {
    competitionId,
    slug: formString(form, "slug"),
    name: formString(form, "name"),
    kind: (formString(form, "kind") || "group") as "group" | "knockout",
    startsOn: formString(form, "startsOn") || null,
    endsOn: formString(form, "endsOn") || null,
    halfMinutes: formString(form, "halfMinutes") ? Number(formString(form, "halfMinutes")) : null,
    extraHalfMinutes: formString(form, "extraHalfMinutes")
      ? Number(formString(form, "extraHalfMinutes"))
      : null,
    allowExtraTime: form.get("allowExtraTime") === "on",
    allowPenalties: form.get("allowPenalties") === "on",
    sortOrder: Number(formString(form, "sortOrder") || "0"),
  };
  if (id) await getDb().update(phases).set(values).where(eq(phases.id, id));
  else await getDb().insert(phases).values(values);
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "phases",
    entityId: id || values.slug,
    summary: `Salvata fase ${values.name}`,
  });
  await revalidateCupById(competitionId);
}

export async function saveVenue(form: FormData) {
  const user = await requireUser();
  const cityId = formString(form, "cityId") || null;
  assertContentAccess(user, cityId);
  const id = formString(form, "id");
  const values = {
    cityId,
    name: formString(form, "name"),
    address: formString(form, "address") || null,
    lat: formString(form, "lat") ? Number(formString(form, "lat")) : null,
    lon: formString(form, "lon") ? Number(formString(form, "lon")) : null,
    mapsUrl: formString(form, "mapsUrl") || null,
  };
  if (id) await getDb().update(venues).set(values).where(eq(venues.id, id));
  else await getDb().insert(venues).values(values);
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "venues",
    entityId: id,
    summary: `Salvato campo ${values.name}`,
  });
}

export async function saveSchool(form: FormData) {
  const user = await requireUser();
  const cityId = formString(form, "cityId") || null;
  assertContentAccess(user, cityId);
  const id = formString(form, "id");
  const values = {
    cityId,
    name: formString(form, "name"),
    slug: formString(form, "slug"),
  };
  if (id) await getDb().update(schools).set(values).where(eq(schools.id, id));
  else await getDb().insert(schools).values(values);
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "schools",
    entityId: id || values.slug,
    summary: `Salvata scuola ${values.name}`,
  });
}

export async function saveTeam(form: FormData) {
  const user = await requireUser();
  const competitionId = formString(form, "competitionId");
  const [competition] = await getDb()
    .select()
    .from(competitions)
    .where(eq(competitions.id, competitionId))
    .limit(1);
  assertContentAccess(user, competition?.cityId);
  const id = formString(form, "id");
  const values = {
    schoolId: formString(form, "schoolId"),
    competitionId,
    phaseId: formString(form, "phaseId") || null,
    groupId: formString(form, "groupId") || null,
    name: formString(form, "name"),
    slug: formString(form, "slug") || slugify(formString(form, "name")),
    logo: formString(form, "logo") || null,
  };
  if (id) await getDb().update(teams).set(values).where(eq(teams.id, id));
  else await getDb().insert(teams).values(values);
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "teams",
    entityId: id,
    summary: `Salvata squadra ${values.name}`,
  });
  await revalidateCupById(competitionId, { teamIds: id ? [id] : [] });
}

export async function savePlayer(form: FormData) {
  const user = await requireUser();
  const teamId = formString(form, "teamId");
  const [team] = await getDb()
    .select({
      cityId: competitions.cityId,
    })
    .from(teams)
    .innerJoin(competitions, eq(teams.competitionId, competitions.id))
    .where(eq(teams.id, teamId))
    .limit(1);
  assertContentAccess(user, team?.cityId);
  const id = formString(form, "id");
  const values = {
    teamId,
    name: formString(form, "name"),
    number: formString(form, "number") ? Number(formString(form, "number")) : null,
    position: formString(form, "position") || null,
    publicationConsent: form.get("publicationConsent") === "on",
  };
  if (id) await getDb().update(players).set(values).where(eq(players.id, id));
  else await getDb().insert(players).values(values);
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "players",
    entityId: id,
    summary: `Salvato giocatore ${values.name}`,
  });
}

export async function saveMatch(form: FormData) {
  const user = await requireUser();
  const competitionId = formString(form, "competitionId");
  const [competition] = await getDb()
    .select()
    .from(competitions)
    .where(eq(competitions.id, competitionId))
    .limit(1);
  assertCityAccess(user, competition?.cityId);
  const id = formString(form, "id");
  const values = {
    competitionId,
    phaseId: formString(form, "phaseId") || null,
    groupId: formString(form, "groupId") || null,
    venueId: formString(form, "venueId") || null,
    roundLabel: formString(form, "roundLabel") || null,
    roundNumber: formString(form, "roundNumber")
      ? Number(formString(form, "roundNumber"))
      : null,
    dateLabel: formString(form, "dateLabel") || null,
    homeTeamId: formString(form, "homeTeamId") || null,
    awayTeamId: formString(form, "awayTeamId") || null,
    homeScore: formString(form, "homeScore") ? Number(formString(form, "homeScore")) : null,
    awayScore: formString(form, "awayScore") ? Number(formString(form, "awayScore")) : null,
    status: (formString(form, "status") || "scheduled") as
      | "scheduled"
      | "live"
      | "finished"
      | "postponed",
  };
  const kickoffRaw = formString(form, "kickoffAt");
  const payload = {
    ...values,
    ...(kickoffRaw ? { kickoffAt: new Date(kickoffRaw) } : {}),
  };
  let matchId = id;
  if (id) {
    await getDb().update(matches).set(payload).where(eq(matches.id, id));
  } else {
    const [created] = await getDb().insert(matches).values(payload).returning();
    matchId = created.id;
  }
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "matches",
    entityId: matchId,
    summary: `Salvata partita ${values.roundLabel ?? ""}`,
  });
  await revalidateCupById(competitionId, {
    matchId,
    teamIds: [values.homeTeamId, values.awayTeamId].filter(Boolean) as string[],
  });
}

export async function savePost(form: FormData) {
  const user = await requireUser();
  const competitionId = formString(form, "competitionId") || null;
  if (competitionId) {
    const [competition] = await getDb()
      .select()
      .from(competitions)
      .where(eq(competitions.id, competitionId))
      .limit(1);
    assertContentAccess(user, competition?.cityId);
  } else {
    assertAdmin(user);
  }

  let image = formString(form, "image");
  const file = form.get("imageFile");
  if (file instanceof File && file.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
    const uploaded = await put(`blog/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    image = uploaded.url;
  }

  const id = formString(form, "id");
  const bodyRaw = formString(form, "body");
  const values = {
    competitionId,
    kind: (formString(form, "kind") || "blog") as "blog" | "news",
    slug: formString(form, "slug"),
    title: formString(form, "title"),
    dek: formString(form, "dek"),
    authors: formString(form, "authors")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    dateLabel: formString(form, "dateLabel"),
    dateIso: formString(form, "dateIso"),
    image,
    imageAlt: formString(form, "imageAlt"),
    imageCredit: formString(form, "imageCredit") || null,
    body: JSON.parse(bodyRaw || "[]"),
    published: form.get("published") === "on",
    updatedAt: new Date(),
  };
  if (id) await getDb().update(posts).set(values).where(eq(posts.id, id));
  else await getDb().insert(posts).values(values);
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "posts",
    entityId: id || values.slug,
    summary: `Salvato articolo ${values.title}`,
  });
  await revalidatePublic();
}

export async function saveSponsor(form: FormData) {
  const user = await requireUser();
  assertAdmin(user);
  const id = formString(form, "id");
  const values = {
    name: formString(form, "name"),
    kind: formString(form, "kind") || "sponsor",
    logo: formString(form, "logo") || null,
    href: formString(form, "href") || null,
  };
  let sponsorId = id;
  if (id) {
    await getDb().update(sponsors).set(values).where(eq(sponsors.id, id));
  } else {
    const [created] = await getDb().insert(sponsors).values(values).returning();
    sponsorId = created.id;
  }
  const placement = formString(form, "placement") || "home";
  const competitionId = formString(form, "competitionId") || null;
  await getDb().insert(sponsorSlots).values({
    sponsorId,
    placement,
    competitionId,
  });
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "sponsors",
    entityId: sponsorId,
    summary: `Salvato sponsor ${values.name}`,
  });
  await revalidatePublic();
}

export async function saveHomeBlock(form: FormData) {
  const user = await requireUser();
  assertAdmin(user);
  const key = formString(form, "key");
  const payload = JSON.parse(formString(form, "payload") || "{}");
  await getDb()
    .update(homeBlocks)
    .set({ payload, updatedAt: new Date() })
    .where(eq(homeBlocks.key, key));
  await writeAudit({
    userId: user.id,
    action: "update",
    entity: "home_blocks",
    entityId: key,
    summary: `Aggiornato blocco home ${key}`,
  });
  await revalidatePublic();
}

export async function saveSetting(form: FormData) {
  const user = await requireUser();
  assertAdmin(user);
  const key = formString(form, "key");
  const value = formString(form, "value");
  await getDb()
    .insert(siteSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedAt: new Date() },
    });
  await writeAudit({
    userId: user.id,
    action: "update",
    entity: "site_settings",
    entityId: key,
    summary: `Aggiornata impostazione ${key}`,
  });
  await revalidatePublic();
}

export async function saveUser(form: FormData) {
  const user = await requireUser();
  assertAdmin(user);
  const id = formString(form, "id");
  const email = formString(form, "email").toLowerCase();
  const name = formString(form, "name");
  const role = formString(form, "role") as "admin" | "staff_citta" | "refertista";
  const cityIds = form.getAll("cityIds").map(String);
  let userId = id;
  if (id) {
    await getDb().update(users).set({ email, name, role, updatedAt: new Date() }).where(eq(users.id, id));
  } else {
    const [created] = await getDb().insert(users).values({ email, name, role }).returning();
    userId = created.id;
  }
  await getDb().delete(userCities).where(eq(userCities.userId, userId));
  if (cityIds.length > 0) {
    await getDb().insert(userCities).values(cityIds.map((cityId) => ({ userId, cityId })));
  }
  await writeAudit({
    userId: user.id,
    action: id ? "update" : "create",
    entity: "users",
    entityId: userId,
    summary: `Salvato utente ${email}`,
  });
}

export async function deleteEntity(form: FormData) {
  const user = await requireUser();
  const entity = formString(form, "entity");
  const id = formString(form, "id");
  const confirm = formString(form, "confirm");
  if (confirm !== "ELIMINA") {
    throw new Error("Conferma l'eliminazione scrivendo ELIMINA.");
  }

  const db = getDb();
  switch (entity) {
    case "competitions":
      assertContentAccess(user, null);
      if (user.role !== "admin") throw new Error("Solo admin può eliminare una coppa.");
      await db.delete(competitions).where(eq(competitions.id, id));
      break;
    case "posts":
      await db.delete(posts).where(eq(posts.id, id));
      break;
    case "matches":
      await db.delete(matches).where(eq(matches.id, id));
      break;
    default:
      throw new Error("Entità non eliminabile da qui.");
  }
  await writeAudit({
    userId: user.id,
    action: "delete",
    entity,
    entityId: id,
    summary: `Eliminato ${entity} ${id}`,
  });
  await revalidatePublic();
}
