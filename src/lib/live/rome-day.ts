const ROME = "Europe/Rome";

function formatDay(ms: number) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ROME,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));
}

function hourInRome(ms: number) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: ROME,
    hour: "2-digit",
    hourCycle: "h23",
  }).format(new Date(ms));
}

export function romeDayBounds(nowMs = Date.now()) {
  const day = formatDay(nowMs);
  for (const offset of ["+01:00", "+02:00"] as const) {
    const start = new Date(`${day}T00:00:00${offset}`);
    if (formatDay(start.getTime()) === day && hourInRome(start.getTime()) === "00") {
      return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000), day };
    }
  }
  const start = new Date(`${day}T00:00:00+01:00`);
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000), day };
}
