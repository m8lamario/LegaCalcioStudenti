import React from "react";
import { Hero } from "@/components/Hero/Hero";
import { MissionSection } from "@/components/MissionSection/MissionSection";
import { CompetitionsSection } from "@/components/CompetitionsSection/CompetitionsSection";
import { NewsSection } from "@/components/NewsSection/NewsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MissionSection />
      <CompetitionsSection />
      <NewsSection />
    </>
  );
}
