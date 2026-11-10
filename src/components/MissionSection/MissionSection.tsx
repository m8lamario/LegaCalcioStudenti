"use client";

import React, { useEffect, useRef } from "react";
import type { MissionContent, MissionLine, MissionPillar } from "@/lib/queries/site";
import { gsap, ScrollTrigger } from "@/lib/gsapClient";
import { withKeptCompounds } from "@/lib/typography";
import styles from "./MissionSection.module.css";

export const MissionSection: React.FC<{
  mission: MissionContent;
  lines: MissionLine[];
  pillars: MissionPillar[];
}> = ({ mission, lines, pillars }) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motion = gsap.matchMedia();

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-claim-line]", {
          y: 18,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: "[data-claim]",
            start: "top 85%",
            once: true,
          },
        });

        gsap.from("[data-statement]", {
          y: 16,
          opacity: 0,
          duration: 0.48,
          delay: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-claim]",
            start: "top 85%",
            once: true,
          },
        });

        gsap.set("[data-pillar]", { y: 22, opacity: 0 });
        ScrollTrigger.batch("[data-pillar]", {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              duration: 0.48,
              stagger: 0.07,
              ease: "power3.out",
              overwrite: true,
            });
          },
        });
      }, section);

      let active = true;
      document.fonts?.ready.then(() => {
        if (active) ScrollTrigger.refresh();
      });

      return () => {
        active = false;
        ctx.revert();
      };
    });

    return () => motion.revert();
  }, []);

  return (
    <section
      id={mission.id}
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="mission-heading"
    >
      <div className="lcs-container">
        <p className={styles.eyebrow}>{mission.eyebrow}</p>

        <h2 id="mission-heading" className={styles.claim} data-claim>
          {lines.map((line) => (
            <span
              key={line.id}
              className={line.tone === "script" ? styles.scriptMask : styles.displayMask}
            >
              <span
                className={
                  line.tone === "script" ? styles.claimScript : styles.claimDisplay
                }
                data-claim-line
              >
                {line.text}
              </span>
            </span>
          ))}
        </h2>

        <p className={styles.statement} data-statement>
          {withKeptCompounds(mission.statement, styles.nowrap)}
        </p>

        <ul className={styles.pillars} data-pillars>
          {pillars.map((pillar) => (
            <li key={pillar.index} className={styles.pillar} data-pillar>
              <span className={styles.pillarIndex}>{pillar.index}</span>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarText}>
                {withKeptCompounds(pillar.text, styles.nowrap)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
