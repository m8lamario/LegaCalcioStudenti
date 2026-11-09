import React from "react";
import { Hero } from "@/components/Hero/Hero";
import { MissionSection } from "@/components/MissionSection/MissionSection";
import { CompetitionsSection } from "@/components/CompetitionsSection/CompetitionsSection";
import { CompetitionsMapSection } from "@/components/CompetitionsMapSection/CompetitionsMapSection";
import { NationalFinalsSection } from "@/components/NationalFinalsSection/NationalFinalsSection";
import { SchoolInviteSection } from "@/components/SchoolInviteSection/SchoolInviteSection";
import { CircuitStatsSection } from "@/components/CircuitStatsSection/CircuitStatsSection";
import { NewsSection } from "@/components/NewsSection/NewsSection";
import { PartnersSection } from "@/components/PartnersSection/PartnersSection";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { sportsOrganizationJsonLd } from "@/lib/jsonLd";
import { getHomePageContent } from "@/lib/queries/site";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default async function HomePage() {
  const content = await getHomePageContent();

  return (
    <>
      <JsonLd data={sportsOrganizationJsonLd(content.motto)} />
      <Hero images={content.heroImages} />
      <MissionSection
        mission={content.mission}
        lines={content.missionLines}
        pillars={content.missionPillars}
      />
      <CompetitionsMapSection competitions={content.competitions} />
      <CompetitionsSection competitions={content.competitions} />
      <NationalFinalsSection content={content.nationalFinals} />
      <SchoolInviteSection invite={content.schoolInvite} />
      <CircuitStatsSection stats={content.circuitStats} />
      <NewsSection articles={content.editorialNews} />
      <PartnersSection partners={content.partners} />
    </>
  );
}
