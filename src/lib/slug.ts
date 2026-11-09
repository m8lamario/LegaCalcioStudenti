export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function parseRoundNumber(label: string | null | undefined) {
  if (!label) return null;
  const match = label.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
