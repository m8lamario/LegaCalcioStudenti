"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { HERO_IMAGES } from "@/data/homeData";
import styles from "./Hero.module.css";

const SLIDE_DURATION_MS = 7000;

export const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-hero-media]",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1.15 },
        0,
      )
        .fromTo(
          "[data-hero-sideline]",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.7 },
          0.12,
        )
        .fromTo(
          "[data-hero-reveal]",
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 },
          0.2,
        );
    }, heroEl);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || paused || HERO_IMAGES.length < 2) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setActiveIndex((current) => (current + 1) % HERO_IMAGES.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      id="top"
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="lcs-hero-headline"
    >
      <div className={styles.stage}>
        <div className={styles.media} data-hero-media>
          {HERO_IMAGES.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={slide.id}
                className={`${styles.slide} ${isActive ? styles.slideActive : ""}`}
                aria-hidden={!isActive}
              >
                <Image
                  src={slide.image}
                  alt={isActive ? slide.imageAlt : ""}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={styles.image}
                />
              </div>
            );
          })}
          <div className={styles.scrim} aria-hidden="true" />
        </div>

        <div className={`lcs-container ${styles.content}`}>
          <span className={styles.sideline} data-hero-sideline aria-hidden="true" />

          <h1 id="lcs-hero-headline" className={styles.headline}>
            <span className={styles.headlineLine} data-hero-reveal>
              Oltre la scuola,
            </span>
            <span className={styles.headlineLine} data-hero-reveal>
              Oltre lo sport
              <span className={styles.headlineDot}>.</span>
            </span>
          </h1>

          <div className={styles.actions} data-hero-reveal>
            <Link href="/#competizioni" className={styles.primaryCta}>
              <span>Esplora le Competizioni</span>
              <span className={styles.ctaArrow} aria-hidden="true">
                →
              </span>
            </Link>

            {HERO_IMAGES.length > 1 && (
              <button
                type="button"
                className={styles.playback}
                aria-pressed={paused}
                onClick={() => setPaused((current) => !current)}
              >
                {paused ? "Riprendi le immagini" : "Pausa immagini"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
