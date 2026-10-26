import React from "react";
import { Navbar } from "@/components/Navbar/Navbar";
import { Hero } from "@/components/Hero/Hero";
import { CompetitionsSection } from "@/components/CompetitionsSection/CompetitionsSection";
import { ResultsStandingsSection } from "@/components/ResultsStandingsSection/ResultsStandingsSection";
import { NewsSection } from "@/components/NewsSection/NewsSection";
import { Footer } from "@/components/Footer/Footer";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.pageShell}>
      <Navbar />
      <main id="main-content" className={styles.main}>
        <Hero />
        <CompetitionsSection />
        <ResultsStandingsSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}
