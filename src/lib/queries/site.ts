import { cacheTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { homeBlocks, siteSettings } from "@/db/schema";
import { cacheTags } from "@/lib/cache-tags";
import {
  CIRCUIT_PARTNERS,
  HERO_IMAGES,
  MISSION,
  MISSION_LINES,
  MISSION_PILLARS,
  NAV_ITEMS,
  SCHOOL_INVITE,
  mergeHeroImages,
  withCollaboraNav,
  getCompetitionHref,
  type CircuitPartner,
  type CircuitStat,
  type ContactChannel,
  type EditorialArticle,
  type HeroImage,
  type LocalCompetition,
  type NavItem,
} from "@/data/homeData";
import {
  getCompetitionWithCity,
  getCompetitionsWithCities,
} from "@/lib/queries/competitions";
import { getPublishedPostsByCompetition } from "@/lib/queries/posts";

export type MissionContent = {
  id: string;
  eyebrow: string;
  statement: string;
};

export type MissionLine = { id: string; text: string; tone: "display" | "script" };

export type MissionPillar = { index: string; title: string; text: string };

export type SchoolInviteContent = {
  id: string;
  concept: string;
  titleLines: string[];
  statement: string;
  ctaLabel: string;
  ctaHref: string;
  closer: string;
};

export type NationalFinalsContent = {
  id: string;
  href: string;
  eyebrow: string;
  titleLead: string;
  titleScript: string;
  lead: string;
  steps: { index: string; title: string; text: string }[];
  ctaLabel: string;
  pageEyebrow: string;
  pageTitleLead: string;
  pageTitleScript: string;
  pageLead: string;
  pageMeaning: string;
  unpublishedNote: string;
};

export type HomePageContent = {
  motto: string;
  navItems: NavItem[];
  heroImages: HeroImage[];
  mission: MissionContent;
  missionLines: MissionLine[];
  missionPillars: MissionPillar[];
  schoolInvite: SchoolInviteContent;
  circuitStats: CircuitStat[];
  nationalFinals: NationalFinalsContent;
  partners: CircuitPartner[];
  editorialNews: EditorialArticle[];
  competitions: LocalCompetition[];
  contactChannels: ContactChannel[];
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function blockPayload<T>(blocks: { key: string; payload: unknown }[], key: string, fallback: T): T {
  const block = blocks.find((item) => item.key === key);
  return (block?.payload as T | undefined) ?? fallback;
}

export async function getHomePageContent(): Promise<HomePageContent> {
  "use cache";
  cacheTag(cacheTags.home, cacheTags.site, cacheTags.competitions, cacheTags.partners);

  const db = getDb();
  const [settingRows, blockRows, competitionRows] = await Promise.all([
    db.select().from(siteSettings),
    db.select().from(homeBlocks),
    getCompetitionsWithCities(),
  ]);

  const settings = Object.fromEntries(settingRows.map((row) => [row.key, row.value]));
  const mottoSetting = settings.motto;
  const motto =
    typeof mottoSetting === "string"
      ? mottoSetting
      : typeof asRecord(mottoSetting).text === "string"
        ? (asRecord(mottoSetting).text as string)
        : "Una lega. Tante città. Un'unica passione.";

  return {
    motto,
    navItems: withCollaboraNav(blockPayload(blockRows, "nav_items", NAV_ITEMS)),
    heroImages: mergeHeroImages(blockPayload(blockRows, "hero", HERO_IMAGES)),
    mission: {
      ...MISSION,
      ...blockPayload(blockRows, "mission", MISSION),
    },
    missionLines: blockPayload(blockRows, "mission_lines", [...MISSION_LINES]),
    missionPillars: [...MISSION_PILLARS],
    schoolInvite: blockPayload(blockRows, "school_invite", {
      ...SCHOOL_INVITE,
      titleLines: [...SCHOOL_INVITE.titleLines],
    }),
    circuitStats: blockPayload(blockRows, "circuit_stats", []),
    nationalFinals: blockPayload(blockRows, "national_finals", {
      id: "finali",
      href: "/finali-nazionali",
      eyebrow: "",
      titleLead: "",
      titleScript: "",
      lead: "",
      steps: [],
      ctaLabel: "",
      pageEyebrow: "",
      pageTitleLead: "",
      pageTitleScript: "",
      pageLead: "",
      pageMeaning: "",
      unpublishedNote: "",
    }),
    partners: blockPayload(blockRows, "partners", CIRCUIT_PARTNERS),
    editorialNews: blockPayload(blockRows, "editorial_news", []),
    contactChannels: blockPayload(blockRows, "contact_channels", []),
    competitions: competitionRows,
  };
}

export async function getPublishedCompetitions(): Promise<LocalCompetition[]> {
  return getCompetitionsWithCities();
}

export async function getCompetitionBySlug(slug: string): Promise<LocalCompetition | null> {
  return getCompetitionWithCity(slug);
}

export async function getSiteMotto(): Promise<string> {
  "use cache";
  cacheTag(cacheTags.site);

  const [row] = await getDb()
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "motto"))
    .limit(1);

  if (typeof row?.value === "string") return row.value;
  const record = asRecord(row?.value);
  if (typeof record.text === "string") return record.text;
  return "Una lega. Tante città. Un'unica passione.";
}

export async function competitionHasPublishedPosts(competitionSlug: string): Promise<boolean> {
  const list = await getPublishedPostsByCompetition(competitionSlug);
  return list.length > 0;
}

export { getCompetitionHref };
