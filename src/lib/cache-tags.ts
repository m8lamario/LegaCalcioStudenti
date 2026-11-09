export const cacheTags = {
  site: "site",
  competitions: "competitions",
  posts: "posts",
  home: "home",
  partners: "partners",
} as const;

export type CacheTag = (typeof cacheTags)[keyof typeof cacheTags];

export function cupTag(slug: string) {
  return `cup:${slug}`;
}

export function standingsTag(slug: string) {
  return `standings:${slug}`;
}

export function matchTag(id: string) {
  return `match:${id}`;
}

export function teamTag(competitionSlug: string, teamSlug: string) {
  return `team:${competitionSlug}:${teamSlug}`;
}

export function schoolTag(slug: string) {
  return `school:${slug}`;
}
