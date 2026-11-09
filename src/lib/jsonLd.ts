import type { LocalCompetition } from "@/data/homeData";
import type { CupBlogPost } from "@/data/cupBlog";
import { SITE_MOTTO } from "@/data/homeData";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function sportsOrganizationJsonLd(motto = SITE_MOTTO) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: "LCS",
    url: SITE_URL,
    description: motto,
    logo: absoluteUrl("/logoCities/lcsw.png"),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    sport: "Soccer",
    email: "privacy@legacalciostudenti.it",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Corso Vinzaglio 24",
      addressLocality: "Torino",
      postalCode: "10121",
      addressCountry: "IT",
    },
  };
}

export function sportsEventJsonLd(competition: LocalCompetition) {
  const place = [competition.city, competition.regionTag].filter(Boolean).join(", ");

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: competition.name,
    url: absoluteUrl(`/competizioni/${competition.slug}`),
    description:
      competition.description ??
      `${competition.name}, competizione locale della Lega Calcio Studenti.`,
    sport: "Soccer",
    image: absoluteUrl(competition.image ?? competition.logo ?? DEFAULT_OG_IMAGE),
    organizer: {
      "@id": ORGANIZATION_ID,
      "@type": "SportsOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(place
      ? {
          location: {
            "@type": "Place",
            name: place,
            address: {
              "@type": "PostalAddress",
              addressLocality: competition.city,
              addressRegion: competition.regionTag,
              addressCountry: "IT",
            },
          },
        }
      : {}),
  };
}

export function matchSportsEventJsonLd(input: {
  id: string;
  homeName: string;
  awayName: string;
  startDate?: string | null;
  venueName?: string | null;
  competitionName: string;
  competitionSlug: string;
  status: string;
  homeScore?: number | null;
  awayScore?: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${input.homeName} vs ${input.awayName}`,
    url: absoluteUrl(`/partite/${input.id}`),
    startDate: input.startDate ?? undefined,
    eventStatus:
      input.status === "postponed"
        ? "https://schema.org/EventPostponed"
        : "https://schema.org/EventScheduled",
    description:
      input.homeScore != null && input.awayScore != null
        ? `${input.homeName} ${input.homeScore}-${input.awayScore} ${input.awayName}`
        : undefined,
    sport: "Soccer",
    location: input.venueName
      ? { "@type": "Place", name: input.venueName }
      : undefined,
    homeTeam: { "@type": "SportsTeam", name: input.homeName },
    awayTeam: { "@type": "SportsTeam", name: input.awayName },
    superEvent: {
      "@type": "SportsEvent",
      name: input.competitionName,
      url: absoluteUrl(`/competizioni/${input.competitionSlug}`),
    },
    organizer: {
      "@id": ORGANIZATION_ID,
      "@type": "SportsOrganization",
      name: SITE_NAME,
    },
  };
}

export function sportsTeamJsonLd(input: {
  name: string;
  slug: string;
  competitionSlug: string;
  competitionName: string;
  logo?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: input.name,
    sport: "Soccer",
    url: absoluteUrl(`/competizioni/${input.competitionSlug}/squadre/${input.slug}`),
    logo: input.logo ? absoluteUrl(input.logo) : undefined,
    memberOf: {
      "@type": "SportsEvent",
      name: input.competitionName,
      url: absoluteUrl(`/competizioni/${input.competitionSlug}`),
    },
    parentOrganization: {
      "@id": ORGANIZATION_ID,
      "@type": "SportsOrganization",
      name: SITE_NAME,
    },
  };
}

export function newsArticleJsonLd(post: CupBlogPost, competitionName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.dek,
    datePublished: post.dateIso,
    dateModified: post.dateIso,
    inLanguage: "it-IT",
    url: absoluteUrl(`/competizioni/${post.competitionSlug}/blog/${post.slug}`),
    image: absoluteUrl(post.image),
    author: post.authors.map((name) => ({
      "@type": "Person",
      name,
    })),
    publisher: {
      "@id": ORGANIZATION_ID,
      "@type": "SportsOrganization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logoCities/lcsw.png"),
      },
    },
    isPartOf: {
      "@type": "SportsEvent",
      name: competitionName,
      url: absoluteUrl(`/competizioni/${post.competitionSlug}`),
    },
  };
}
