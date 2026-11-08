const SITEMAP_URL = "https://www.legacalciostudenti.com/sitemap.xml";
const ORIGIN = process.env.VERIFY_ORIGIN ?? "http://localhost:3002";

function classify(pathname) {
  if (pathname === "/" || pathname === "") return "home";
  if (pathname === "/contatti") return "contatti";
  if (pathname === "/privacy") return "privacy";
  if (pathname === "/terms") return "terms";
  if (pathname === "/competitions") return "competitions-index";
  if (pathname === "/squadre") return "squadre";
  if (pathname === "/classifica") return "classifica";
  if (pathname === "/team") return "team";
  if (pathname === "/partite") return "partite-index";
  if (pathname.startsWith("/partite/")) return "partite";
  if (pathname.startsWith("/competitions/roma-school-cup")) return "roma-school-cup";
  if (/^\/competitions\/[^/]+\/blog\/[^/]+$/.test(pathname)) return "articoli";
  if (/^\/competitions\/[^/]+\/blog$/.test(pathname)) return "blog-index";
  if (/^\/competitions\/[^/]+\/(partite|squadre)$/.test(pathname)) return "sottopagine-coppe";
  if (/^\/competitions\/[^/]+$/.test(pathname)) return "coppe";
  return "altro";
}

async function request(url) {
  const res = await fetch(url, { redirect: "manual" });
  return {
    status: res.status,
    location: res.headers.get("location"),
  };
}

async function follow(pathname) {
  const first = await request(`${ORIGIN}${pathname || "/"}`);
  if (first.status < 300 || first.status >= 400 || !first.location) {
    return { first: first.status, final: first.status, location: first.location };
  }

  const nextUrl = new URL(first.location, ORIGIN);
  const second = await request(nextUrl.toString());
  return {
    first: first.status,
    final: second.status,
    location: first.location,
  };
}

const xml = await fetch(SITEMAP_URL).then((res) => res.text());
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const unique = [...new Set(urls)];

const rows = [];
for (const loc of unique) {
  const pathname = new URL(loc).pathname;
  const result = await follow(pathname);
  rows.push({
    loc,
    pathname,
    group: classify(pathname),
    ...result,
  });
}

const ok = rows.filter(
  (row) => row.final === 200 && (row.first === 200 || row.first === 301),
);
const failed = rows.filter((row) => !ok.includes(row));

const groups = {};
for (const row of rows) {
  groups[row.group] ??= { total: 0, ok: 0, first: new Map(), destinations: new Map() };
  groups[row.group].total += 1;
  if (ok.includes(row)) groups[row.group].ok += 1;
  groups[row.group].first.set(row.first, (groups[row.group].first.get(row.first) ?? 0) + 1);
  if (row.location) {
    groups[row.group].destinations.set(
      row.location,
      (groups[row.group].destinations.get(row.location) ?? 0) + 1,
    );
  }
}

console.log(`SITEMAP ${unique.length}`);
console.log(`OK ${ok.length}`);
console.log(`FAIL ${failed.length}`);
console.log("");
console.log("GROUP\tTOTAL\tOK\tSTATUSES\tDESTINATIONS");
for (const [name, group] of Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))) {
  const statuses = [...group.first.entries()].map(([code, count]) => `${code}×${count}`).join(",");
  const dest = [...group.destinations.entries()].map(([to, count]) => `${to}×${count}`).join(",");
  console.log(`${name}\t${group.total}\t${group.ok}\t${statuses}\t${dest}`);
}

if (failed.length) {
  console.log("\nFAILED");
  for (const row of failed) {
    console.log(`${row.pathname}\t${row.first}\t${row.final}\t${row.location ?? ""}`);
  }
  process.exitCode = 1;
}
