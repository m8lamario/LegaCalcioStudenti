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
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={sportsOrganizationJsonLd()} />
      <Hero />
      <MissionSection />
      <CompetitionsMapSection />
      <CompetitionsSection />
      <NationalFinalsSection />
      <SchoolInviteSection />
      <CircuitStatsSection />
      <NewsSection />
      <PartnersSection />
    </>
  );
}
