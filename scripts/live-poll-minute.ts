import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";
import { applyLiveCommand } from "../src/lib/live/commands";
import { displayMinute } from "../src/lib/live/clock";
import type { ClockState } from "../src/lib/live/types";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL is required");

const base = process.env.LIVE_LOAD_BASE ?? "http://localhost:3000";

type Snapshot = {
  matchId: string;
  clock: ClockState;
  serverNow: number;
  minute: { minute: number; label: string; stoppage: number };
};

async function main() {
  const pool = new Pool({ connectionString: url, max: 2 });
  const db = drizzle({ client: pool, schema });
  const [admin] = await db.select().from(schema.users).where(eq(schema.users.role, "admin")).limit(1);
  const [row] = await db
    .select({ match: schema.matches })
    .from(schema.matches)
    .where(eq(schema.matches.status, "scheduled"))
    .limit(1);
  if (!admin || !row) throw new Error("Need admin and a scheduled match");

  const user = { id: admin.id, role: "admin" as const, cityIds: [] as string[] };
  const matchId = row.match.id;
  await applyLiveCommand(user, {
    clientId: crypto.randomUUID(),
    matchId,
    kind: "clock.start",
    payload: {},
  });

  const fetchSnap = async (): Promise<Snapshot> => {
    const res = await fetch(`${base}/api/live/snapshot/${matchId}`);
    if (!res.ok) throw new Error(`snapshot ${res.status}`);
    return (await res.json()) as Snapshot;
  };

  const a = await fetchSnap();
  await new Promise((r) => setTimeout(r, 8000));
  const b = await fetchSnap();

  const minuteA = displayMinute(a.clock, a.serverNow);
  const minuteB = displayMinute(b.clock, b.serverNow);

  await applyLiveCommand(user, {
    clientId: crypto.randomUUID(),
    matchId,
    kind: "clock.finish",
    payload: {},
  });
  await pool.end();

  const summary = {
    matchId,
    labelA: minuteA.label,
    labelB: minuteB.label,
    sameMinute: minuteA.minute === minuteB.minute,
  };
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.sameMinute) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
