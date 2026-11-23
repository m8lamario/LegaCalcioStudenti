import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { CIRCUIT_STATS, NATIONAL_FINALS } from "../src/data/homeData";
import * as schema from "../src/db/schema";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL is required");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function updateHomeCopy() {
  const pool = new Pool({ connectionString: url, max: 1 });
  const db = drizzle({ client: pool, schema });

  try {
    const rows = await db.select().from(schema.homeBlocks);
    const statsRow = rows.find((row) => row.key === "circuit_stats");
    const finalsRow = rows.find((row) => row.key === "national_finals");
    if (!statsRow || !finalsRow) {
      throw new Error("Mancano i blocchi circuit_stats o national_finals");
    }

    const nextStats = CIRCUIT_STATS.map(({ id, value, label }) => ({ id, value, label }));

    const currentFinals = isRecord(finalsRow.payload) ? finalsRow.payload : {};
    const existingSteps = Array.isArray(currentFinals.steps) ? currentFinals.steps : [];
    const nextSteps = NATIONAL_FINALS.steps.map((step, index) => {
      const byIndex = existingSteps.find(
        (item) => isRecord(item) && item.index === step.index,
      );
      const prev = isRecord(byIndex) ? byIndex : isRecord(existingSteps[index]) ? existingSteps[index] : {};
      return {
        ...prev,
        index: step.index,
        title: step.title,
        text: step.text,
      };
    });
    const nextFinals = {
      ...currentFinals,
      lead: NATIONAL_FINALS.lead,
      steps: nextSteps,
    };

    await db.transaction(async (tx) => {
      await tx
        .update(schema.homeBlocks)
        .set({ payload: nextStats, updatedAt: new Date() })
        .where(eq(schema.homeBlocks.key, "circuit_stats"));
      await tx
        .update(schema.homeBlocks)
        .set({ payload: nextFinals, updatedAt: new Date() })
        .where(eq(schema.homeBlocks.key, "national_finals"));
    });

    const saved = await db.select().from(schema.homeBlocks);
    const savedStats = saved.find((row) => row.key === "circuit_stats");
    const savedFinals = saved.find((row) => row.key === "national_finals");
    const savedStatRows = Array.isArray(savedStats?.payload) ? savedStats.payload : [];
    console.log("circuit_stats");
    for (const stat of savedStatRows) {
      if (!isRecord(stat)) continue;
      console.log(
        `- ${String(stat.id)}: ${String(stat.value)} | ${String(stat.label)} | note=${"note" in stat ? "presente" : "assente"}`,
      );
    }
    const savedLead = isRecord(savedFinals?.payload) ? savedFinals.payload.lead : "";
    const savedSteps = isRecord(savedFinals?.payload) && Array.isArray(savedFinals.payload.steps)
      ? savedFinals.payload.steps
      : [];
    console.log("national_finals.lead");
    console.log(savedLead);
    for (const step of savedSteps) {
      if (!isRecord(step)) continue;
      console.log(`- ${String(step.index)} ${String(step.title)}: ${String(step.text)}`);
    }
  } finally {
    await pool.end();
  }
}

updateHomeCopy().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
