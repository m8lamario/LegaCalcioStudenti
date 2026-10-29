"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCompetitionHref, LOCAL_COMPETITIONS } from "@/data/homeData";
import { gsap, ScrollTrigger } from "@/lib/gsapClient";
import styles from "./CompetitionsSection.module.css";

export const CompetitionsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motion = gsap.matchMedia();

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-comp-line]", {
          y: 18,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "[data-comp-title]",
            start: "top 85%",
            once: true,
          },
        });

        gsap.from("[data-comp-lead]", {
          y: 22,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.12,
          scrollTrigger: {
            trigger: "[data-comp-title]",
            start: "top 82%",
            once: true,
          },
        });

        gsap.set("[data-comp-card]", { y: 32, opacity: 0 });
        ScrollTrigger.batch("[data-comp-card]", {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.08,
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
      id="competizioni"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="competizioni-heading"
    >
      <div className="lcs-container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Il circuito nazionale LCS</p>
          <h2 id="competizioni-heading" className={styles.title} data-comp-title>
            <span className={styles.displayMask}>
              <span className={styles.titleLine} data-comp-line>
                Le competizioni
              </span>
            </span>
            <span className={styles.scriptMask}>
              <span className={styles.titleScript} data-comp-line>
                Locali
              </span>
            </span>
          </h2>
          <p className={styles.lead} data-comp-lead>
            Coppe cittadine con identità e storia propria. I migliori istituti
            conquistano sul campo la qualificazione alle finali nazionali.
          </p>
        </header>

        <div className={styles.grid}>
          {LOCAL_COMPETITIONS.map((cup) => {
            const place = [cup.city, cup.regionTag].filter(Boolean).join(" · ");

            return (
              <Link
                key={cup.id}
                href={getCompetitionHref(cup.slug)}
                className={styles.card}
                data-comp-card
                aria-label={place ? `${cup.name}, ${place}` : cup.name}
              >
                <div className={styles.mediaWrapper}>
                  {cup.image ? (
                    <>
                      <Image
                        src={cup.image}
                        alt={cup.imageAlt ?? ""}
                        fill
                        sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw"
                        className={styles.cardImage}
                      />
                      <div className={styles.mediaShade} aria-hidden="true" />
                    </>
                  ) : (
                    <div className={styles.mediaFallback}>
                      <span className={styles.mediaPending}>Immagine in arrivo</span>
                    </div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardInfo}>
                    {place ? <span className={styles.cityLabel}>{place}</span> : null}
                    <h3 className={styles.cupName}>{cup.name}</h3>
                    {cup.stageLabel ? (
                      <span className={styles.stageLabel}>{cup.stageLabel}</span>
                    ) : null}
                  </div>
                  <span className={styles.cardAction}>
                    <span>Esplora</span>
                    <span className={styles.cardArrow} aria-hidden="true">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
