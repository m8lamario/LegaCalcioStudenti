import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";
import { applyLiveCommand } from "../src/lib/live/commands";
import { computeMatchScore } from "../src/lib/live/score";
import { loadLiveSnapshot } from "../src/lib/live/snapshot";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL is required");

async function main() {
  const pool = new Pool({ connectionString: url, max: 2 });
  const db = drizzle({ client: pool, schema });
  let [admin] = await db.select().from(schema.users).where(eq(schema.users.role, "admin")).limit(1);
  if (!admin) {
    const [created] = await db
      .insert(schema.users)
      .values({ email: "live-sim@local.test", name: "Live Sim", role: "admin" })
      .returning();
    admin = created;
  }

  const [row] = await db
    .select({ match: schema.matches, competition: schema.competitions })
    .from(schema.matches)
    .innerJoin(schema.competitions, eq(schema.matches.competitionId, schema.competitions.id))
    .where(eq(schema.matches.status, "scheduled"))
    .limit(1);
  if (!row?.match.homeTeamId || !row.match.awayTeamId) {
    throw new Error("Nessuna partita scheduled con due squadre.");
  }

  const user = { id: admin.id, role: "admin" as const, cityIds: [] as string[] };
  const matchId = row.match.id;
  const home = row.match.homeTeamId;
  const away = row.match.awayTeamId;

  const send = (kind: string, payload: Record<string, unknown> = {}) =>
    applyLiveCommand(user, {
      clientId: crypto.randomUUID(),
      matchId,
      kind,
      payload,
    });

  const start = await send("clock.start");
  await send("event.add", { type: "goal", teamId: home, goalKind: "regular" });
  await send("event.add", { type: "yellow_card", teamId: away });
  await send("event.add", { type: "substitution", teamId: home });
  const firstDup = await applyLiveCommand(user, {
    clientId: "same-client-id-xxxxxxxx",
    matchId,
    kind: "event.add",
    payload: { type: "goal", teamId: home, goalKind: "regular" },
  });
  const again = await applyLiveCommand(user, {
    clientId: "same-client-id-xxxxxxxx",
    matchId,
    kind: "event.add",
    payload: { type: "goal", teamId: home, goalKind: "regular" },
  });
  if (!firstDup.ok) throw new Error("idempotent insert failed");
  await send("event.undo");
  await send("clock.interval");
  await send("clock.resume");
  await send("event.add", { type: "goal", teamId: away, goalKind: "own_goal" });
  const finished = await send("clock.finish");

  const snapshot = await loadLiveSnapshot(matchId);
  const events = await db.select().from(schema.matchEvents).where(eq(schema.matchEvents.matchId, matchId));
  const score = computeMatchScore(events, home, away);

  const summary = {
    matchId,
    startOk: start.ok,
    duplicateSecond: "duplicate" in again ? again.duplicate : false,
    snapshot,
    score,
    finished: finished.ok,
  };
  console.log(
    JSON.stringify(
      {
        matchId,
        startOk: summary.startOk,
        idempotent: again.ok && again.duplicate,
        homeScore: score.homeScore,
        awayScore: score.awayScore,
        status: snapshot?.status,
        minute: snapshot?.minute.label,
      },
      null,
      2,
    ),
  );
  await pool.end();
  if (snapshot?.status !== "finished" || score.homeScore < 1) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
