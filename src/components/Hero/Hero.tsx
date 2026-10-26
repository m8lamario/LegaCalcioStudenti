"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { HERO_SLIDES } from "@/data/homeData";
import styles from "./Hero.module.css";

export const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const mediaFrameRef = useRef<HTMLDivElement | null>(null);
  const mediaInnerRef = useRef<HTMLDivElement | null>(null);

  const activeSlide = HERO_SLIDES[activeIndex] ?? HERO_SLIDES[0];

  // Sequenza d'ingresso GSAP (1.35s, cleanup compatibile con React Strict Mode e prefers-reduced-motion)
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // 1. Comparsa discreta della sideline verde acqua #00EDAF
      tl.fromTo(
        "[data-hero-sideline-v]",
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 0.75 },
        0
      ).fromTo(
        "[data-hero-sideline-h]",
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.85 },
        0.1
      );

      // 2. Rivelazione progressiva della fotografia tramite clip-path + leggero movimento di scala
      if (mediaFrameRef.current && mediaInnerRef.current) {
        tl.fromTo(
          mediaFrameRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.95, ease: "power3.inOut" },
          0.05
        ).fromTo(
          mediaInnerRef.current,
          { scale: 1.08 },
          { scale: 1, duration: 1.35, ease: "power2.out" },
          0.05
        );
      }

      // 3. Ingresso sequenziale di eyebrow, accento Machton, headline Komu New C, payoff e CTA
      tl.fromTo(
        "[data-hero-reveal]",
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          stagger: 0.075,
        },
        0.18
      );

      // 4. Ingresso dei controlli editoriali integrati alla base della hero
      tl.fromTo(
        "[data-hero-controls]",
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.55 },
        0.65
      );
    }, heroEl);

    return () => {
      ctx.revert();
    };
  }, []);

  // Micro-transizione discreta al cambio frame fotografico
  const handleSelectSlide = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !mediaInnerRef.current) return;

    gsap.fromTo(
      mediaInnerRef.current,
      { scale: 1.04, opacity: 0.82 },
      { scale: 1, opacity: 1, duration: 0.55, ease: "power2.out", overwrite: "auto" }
    );
  };

  return (
    <section
      id="top"
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="lcs-hero-headline"
    >
      <div className={`lcs-container ${styles.container}`}>
        {/* Griglia principale editoriale: Colonna tipografica + Palcoscenico fotografico */}
        <div className={styles.stageGrid}>
          {/* Colonna Sinistra: Tipografia editoriale, sideline #00EDAF e azioni */}
          <div className={styles.editorialColumn}>
            {/* Linea Sideline verticale verde acqua */}
            <span
              className={styles.sidelineVertical}
              data-hero-sideline-v
              aria-hidden="true"
            />

            <div className={styles.metaRow} data-hero-reveal>
              <span className={styles.seasonTag}>STAGIONE 2025/26</span>
              <span className={styles.metaDivider} aria-hidden="true" />
              <span className={styles.leagueTag}>CAMPIONATO NAZIONALE STUDENTESCO</span>
            </div>

            {/* Headline enorme in Komu New C con interruzioni di riga intenzionali */}
            <h1 id="lcs-hero-headline" className={styles.headline}>
              <span className={styles.headlineLine} data-hero-reveal>
                IL CALCIO
              </span>
              <span className={styles.headlineLineAccent} data-hero-reveal>
                <span>DEI LICEI</span>
                <span className={styles.headlineDot}>.</span>
              </span>
            </h1>

            {/* Sideline orizzontale verde acqua */}
            <div
              className={styles.sidelineHorizontal}
              data-hero-sideline-h
              aria-hidden="true"
            />

            {/* Payoff memorabile + descrizione essenziale */}
            <p className={styles.payoff} data-hero-reveal>
              Una lega. Tante città.{" "}
              <span className={styles.payoffScript}>Un&apos;unica passione.</span>
            </p>

            <p className={styles.description} data-hero-reveal>
              Dalle sfide cittadine fino alle finali nazionali del Knockout Day:
              gli istituti superiori scendono in campo per difendere il nome
              della propria scuola e della propria città.
            </p>

            {/* Azione primaria (#012BFD) e seconda azione discreta */}
            <div className={styles.ctaGroup} data-hero-reveal>
              <a href="#competizioni" className={styles.primaryCta}>
                <span>Esplora le Competizioni</span>
                <span className={styles.ctaArrow} aria-hidden="true">
                  →
                </span>
              </a>
              <a href="#risultati" className={styles.secondaryCta}>
                <span>Risultati e Classifiche</span>
              </a>
            </div>
          </div>

          {/* Colonna Destra: Fotografia calcistica dominante con cornice sideline */}
          <div className={styles.visualColumn}>
            <div className={styles.photoFrame} ref={mediaFrameRef}>
              {/* Dettaglio sideline angolare #00EDAF */}
              <span className={styles.frameCornerAqua} aria-hidden="true" />

              <div className={styles.photoInner} ref={mediaInnerRef}>
                <Image
                  key={activeSlide.image}
                  src={activeSlide.image}
                  alt={activeSlide.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 95vw, 60vw"
                  className={styles.heroImage}
                />
                <div className={styles.photoToneOverlay} aria-hidden="true" />
              </div>

              {/* Badge superiore sul frame fotografico */}
              <div className={styles.photoTopBar}>
                <span className={styles.photoBadge}>
                  <span className={styles.photoLiveDot} aria-hidden="true" />
                  <span>{activeSlide.cup}</span>
                </span>
                <span className={styles.photoIndexTag}>
                  FRAME // {activeSlide.index}
                </span>
              </div>

              {/* Didascalia editoriale integrata sul bordo inferiore dell'immagine */}
              <div className={styles.photoCaptionBox}>
                <div className={styles.captionHeader}>
                  <span className={styles.captionCity}>{activeSlide.city}</span>
                  <span className={styles.captionTitle}>{activeSlide.title}</span>
                </div>
                <p className={styles.captionText}>{activeSlide.caption}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra di controllo integrata nel layout della Hero: selettore scatti + ancore rapide */}
        <div
          className={styles.controlBar}
          data-hero-controls
          aria-label="Racconto fotografico della giornata di gara"
        >
          <div className={styles.slideTabs} role="tablist" aria-label="Momenti partita">
            {HERO_SLIDES.map((slide, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`${styles.slideTab} ${
                    isSelected ? styles.slideTabActive : ""
                  }`}
                  onClick={() => handleSelectSlide(idx)}
                >
                  <span className={styles.slideTabIndex}>{slide.index}</span>
                  <span className={styles.slideTabBody}>
                    <strong className={styles.slideTabTitle}>{slide.title}</strong>
                    <small className={styles.slideTabMeta}>{slide.city}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <a href="#competizioni" className={styles.scrollCue}>
            <span className={styles.scrollCueLabel}>SCORRI IL CAMPIONATO</span>
            <span className={styles.scrollCueLine} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};
