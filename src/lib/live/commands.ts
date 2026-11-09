import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import {
  competitions,
  liveCommands,
  matchEvents,
  matches,
  phases,
  players,
} from "@/db/schema";
import { writeAudit } from "@/lib/admin/audit";
import { revalidateCupById, revalidateLive } from "@/lib/admin/revalidate";
import { canManageMatches, type CityScopedUser } from "@/lib/auth/access";
import { applyClockAction, clockFromMatch, displayMinute } from "./clock";
import { computeMatchScore } from "./score";
import { loadLiveSnapshot } from "./snapshot";
import type { ClockAction, EventType, GoalKind, LiveCommandKind } from "./types";

const commandSchema = z.object({
  clientId: z.string().min(8).max(80),
  matchId: z.string().uuid(),
  kind: z.enum([
    "clock.start",
    "clock.interval",
    "clock.resume",
    "clock.extra",
    "clock.penalties",
    "clock.finish",
    "clock.reopen",
    "event.add",
    "event.update",
    "event.delete",
    "event.undo",
  ]),
  payload: z.record(z.string(), z.unknown()).optional(),
});

const eventPayloadSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["goal", "yellow_card", "red_card", "substitution", "note"]).optional(),
  teamId: z.string().uuid().nullable().optional(),
  playerId: z.string().uuid().nullable().optional(),
  assistPlayerId: z.string().uuid().nullable().optional(),
  playerOutId: z.string().uuid().nullable().optional(),
  shirtNumber: z.number().int().min(0).max(99).nullable().optional(),
  note: z.string().max(280).nullable().optional(),
  goalKind: z.enum(["regular", "penalty", "own_goal"]).optional(),
  shootout: z.boolean().optional(),
  minute: z.number().int().min(0).max(200).nullable().optional(),
});

export type LiveCommandInput = z.infer<typeof commandSchema>;

async function refreshScore(
  tx: {
    select: ReturnType<typeof getDb>["select"];
    update: ReturnType<typeof getDb>["update"];
  },
  match: typeof matches.$inferSelect,
) {
  if (!match.homeTeamId || !match.awayTeamId) return match;
  const events = await tx
    .select()
    .from(matchEvents)
    .where(eq(matchEvents.matchId, match.id));
  const score = computeMatchScore(events, match.homeTeamId, match.awayTeamId);
  const [updated] = await tx
    .update(matches)
    .set({
      homeScore: score.homeScore,
      awayScore: score.awayScore,
      homePenaltyScore: score.homePenaltyScore,
      awayPenaltyScore: score.awayPenaltyScore,
      updatedAt: new Date(),
    })
    .where(eq(matches.id, match.id))
    .returning();
  return updated ?? match;
}

function clockColumns(clock: ReturnType<typeof clockFromMatch>, status: typeof matches.$inferSelect.status) {
  return {
    clockPeriod: clock.period,
    periodStartedAt: clock.periodStartedAt ? new Date(clock.periodStartedAt) : null,
    elapsedSeconds: clock.elapsedSeconds,
    status,
    updatedAt: new Date(),
  };
}

export async function applyLiveCommand(
  user: CityScopedUser & { id: string },
  raw: unknown,
) {
  const command = commandSchema.parse(raw);
  const db = getDb();

  const [context] = await db
    .select({
      match: matches,
      competition: competitions,
      phase: phases,
    })
    .from(matches)
    .innerJoin(competitions, eq(matches.competitionId, competitions.id))
    .leftJoin(phases, eq(matches.phaseId, phases.id))
    .where(eq(matches.id, command.matchId))
    .limit(1);

  if (!context) {
    return { ok: false as const, status: 404, error: "Partita non trovata." };
  }
  if (!canManageMatches(user, context.competition.cityId)) {
    return { ok: false as const, status: 403, error: "Non hai i permessi per questa città." };
  }
  if (command.kind === "clock.reopen" && user.role !== "admin") {
    return { ok: false as const, status: 403, error: "Solo un admin può riaprire la partita." };
  }

  const applied = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(liveCommands)
      .values({
        clientId: command.clientId,
        matchId: command.matchId,
        userId: user.id,
        kind: command.kind,
        payload: command.payload ?? {},
      })
      .onConflictDoNothing()
      .returning({ clientId: liveCommands.clientId });

    if (inserted.length === 0) {
      return { duplicate: true as const };
    }

    const now = Date.now();
    let match = context.match;
    let didMutate = true;

    if (command.kind.startsWith("clock.")) {
      const action = command.kind.slice("clock.".length) as ClockAction;
      if (action === "start") {
        match = (
          await tx
            .update(matches)
            .set({
              halfMinutes: context.phase?.halfMinutes ?? context.competition.halfMinutes,
              extraHalfMinutes:
                context.phase?.extraHalfMinutes ?? context.competition.extraHalfMinutes,
              allowExtraTime: context.phase?.allowExtraTime ?? false,
              allowPenalties: context.phase?.allowPenalties ?? false,
            })
            .where(eq(matches.id, match.id))
            .returning()
        )[0] ?? match;
      }
      const result = applyClockAction(clockFromMatch(match), action, now);
      didMutate = result.applied;
      if (result.applied) {
        match = (
          await tx
            .update(matches)
            .set(clockColumns(result.clock, result.status))
            .where(eq(matches.id, match.id))
            .returning()
        )[0] ?? match;
      }
    } else {
      const payload = eventPayloadSchema.parse(command.payload ?? {});
      if (command.kind === "event.add") {
        const type = (payload.type ?? "note") as EventType;
        const clock = clockFromMatch(match);
        const minute = payload.minute ?? displayMinute(clock, now).minute;
        let shirtNumber = payload.shirtNumber ?? null;
        if (!shirtNumber && payload.playerId) {
          const [player] = await tx
            .select()
            .from(players)
            .where(eq(players.id, payload.playerId))
            .limit(1);
          shirtNumber = player?.number ?? null;
        }
        await tx.insert(matchEvents).values({
          matchId: match.id,
          teamId: payload.teamId ?? null,
          playerId: payload.playerId ?? null,
          assistPlayerId: payload.assistPlayerId ?? null,
          playerOutId: payload.playerOutId ?? null,
          type,
          minute,
          note: payload.note ?? null,
          goalKind: (payload.goalKind ?? "regular") as GoalKind,
          shirtNumber,
          clientId: command.clientId,
          shootout: Boolean(payload.shootout) || match.clockPeriod === "penalties",
        });
        match = await refreshScore(tx, match);
      } else if (command.kind === "event.update" && payload.id) {
        await tx
          .update(matchEvents)
          .set({
            type: (payload.type as EventType | undefined) ?? undefined,
            teamId: payload.teamId === undefined ? undefined : payload.teamId,
            playerId: payload.playerId === undefined ? undefined : payload.playerId,
            assistPlayerId:
              payload.assistPlayerId === undefined ? undefined : payload.assistPlayerId,
            playerOutId: payload.playerOutId === undefined ? undefined : payload.playerOutId,
            note: payload.note === undefined ? undefined : payload.note,
            goalKind: payload.goalKind,
            shirtNumber: payload.shirtNumber === undefined ? undefined : payload.shirtNumber,
            minute: payload.minute === undefined ? undefined : payload.minute,
            shootout: payload.shootout,
          })
          .where(and(eq(matchEvents.id, payload.id), eq(matchEvents.matchId, match.id)));
        match = await refreshScore(tx, match);
      } else if (command.kind === "event.delete" && payload.id) {
        await tx
          .update(matchEvents)
          .set({ deletedAt: new Date() })
          .where(and(eq(matchEvents.id, payload.id), eq(matchEvents.matchId, match.id)));
        match = await refreshScore(tx, match);
      } else if (command.kind === "event.undo") {
        const [last] = await tx
          .select()
          .from(matchEvents)
          .where(and(eq(matchEvents.matchId, match.id), isNull(matchEvents.deletedAt)))
          .orderBy(desc(matchEvents.createdAt))
          .limit(1);
        if (last) {
          await tx
            .update(matchEvents)
            .set({ deletedAt: new Date() })
            .where(eq(matchEvents.id, last.id));
          match = await refreshScore(tx, match);
        }
      }
    }

    return { duplicate: false as const, match, kind: command.kind, didMutate };
  });

  if (!applied.duplicate) {
    await writeAudit({
      userId: user.id,
      action: applied.didMutate ? command.kind : `${command.kind}:noop`,
      entity: "matches",
      entityId: command.matchId,
      summary: `${command.kind} su partita`,
    });
  }

  const snapshot = await loadLiveSnapshot(command.matchId);
  try {
    revalidateLive(command.matchId);
    if (!applied.duplicate) {
      const closed = applied.kind === "clock.finish" && applied.didMutate;
      const started = applied.kind === "clock.start" && applied.didMutate;
      const reopened = applied.kind === "clock.reopen" && applied.didMutate;
      if (closed || started || reopened) {
        await revalidateCupById(context.competition.id, {
          matchId: command.matchId,
          teamIds: [context.match.homeTeamId, context.match.awayTeamId].filter(
            Boolean,
          ) as string[],
        });
      } else {
        await revalidateCupById(context.competition.id, { matchId: command.matchId });
      }
    }
  } catch {
    // scripts and tests may run outside a Next request
  }

  return {
    ok: true as const,
    duplicate: applied.duplicate,
    snapshot,
  };
}

export type { LiveCommandKind };
export { commandSchema };
