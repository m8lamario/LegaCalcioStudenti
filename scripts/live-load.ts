import { config } from "dotenv";

config({ path: ".env.local" });

const base = process.env.LIVE_LOAD_URL ?? "http://localhost:3000";
const concurrency = Number(process.env.LIVE_LOAD_CONCURRENCY ?? "80");
const rounds = Number(process.env.LIVE_LOAD_ROUNDS ?? "6");

async function fetchTimed(url: string) {
  const started = Date.now();
  const response = await fetch(url);
  return { status: response.status, ms: Date.now() - started, cache: response.headers.get("cache-control") };
}

async function main() {
  const active = await fetch(`${base}/api/live/active`);
  const activeJson = (await active.json()) as { matches?: { matchId: string }[] };
  const matchId = activeJson.matches?.[0]?.matchId;
  const target = matchId ? `${base}/api/live/snapshot/${matchId}` : `${base}/api/live/active`;

  const results: { status: number; ms: number; cache: string | null }[] = [];
  for (let round = 0; round < rounds; round += 1) {
    const batch = await Promise.all(
      Array.from({ length: concurrency }, () => fetchTimed(target)),
    );
    results.push(...batch);
  }

  const ok = results.filter((item) => item.status === 200);
  const avg = ok.reduce((sum, item) => sum + item.ms, 0) / Math.max(ok.length, 1);
  const max = ok.reduce((best, item) => Math.max(best, item.ms), 0);
  const summary = {
    base,
    target,
    requests: results.length,
    ok: ok.length,
    avgMs: Math.round(avg),
    maxMs: max,
    cacheControl: ok[0]?.cache ?? active.headers.get("cache-control"),
  };
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
