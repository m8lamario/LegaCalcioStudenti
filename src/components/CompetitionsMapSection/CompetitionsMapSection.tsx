"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCompetitionHref, type LocalCompetition } from "@/data/homeData";
import { ITALY_MAP, projectToMap } from "@/data/italyMap";
import { gsap, ScrollTrigger } from "@/lib/gsapClient";
import styles from "./CompetitionsMapSection.module.css";

const DEFAULT_CALLOUT = { dx: 0, dy: -140 };

type CardAlign = "start" | "center" | "end";

interface MapSite {
  id: string;
  href: string;
  name: string;
  city: string;
  place: string;
  logo?: string;
  coordsLabel: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  align: CardAlign;
}

function buildMapSites(competitions: LocalCompetition[]): MapSite[] {
  return competitions
    .flatMap((cup): MapSite[] => {
      if (!cup.coordinates) return [];

      const { lat, lon } = cup.coordinates;
      const { x, y } = projectToMap(lat, lon);
      const { dx, dy } = cup.mapCallout ?? DEFAULT_CALLOUT;
      const calloutX = (x + dx) / ITALY_MAP.width;

      return [
        {
          id: cup.id,
          href: getCompetitionHref(cup.slug),
          name: cup.name,
          city: cup.city ?? "",
          place: [cup.city, cup.regionTag].filter(Boolean).join(" · "),
          logo: cup.logo,
          coordsLabel: `${lat.toFixed(2)}° N · ${lon.toFixed(2)}° E`,
          x,
          y,
          dx,
          dy,
          align: calloutX < 0.28 ? "start" : calloutX > 0.72 ? "end" : "center",
        },
      ];
    })
    .sort((a, b) => a.x - b.x);
}

const pad = (value: number) => String(value).padStart(2, "0");

export const CompetitionsMapSection: React.FC<{
  competitions: LocalCompetition[];
}> = ({ competitions }) => {
  const MAP_SITES = useMemo(() => buildMapSites(competitions), [competitions]);
  const CITY_COUNT = new Set(MAP_SITES.map((site) => site.city).filter(Boolean)).size;
  const sectionRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const pointerTypeRef = useRef("mouse");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const map = mapRef.current;
    if (!section || !map || MAP_SITES.length === 0) return;

    const motion = gsap.matchMedia();

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(section);
        const intro = q("[data-map-intro]");
        const [mainland, ...islands] = q("[data-map-outline]");
        const dots = q("[data-map-dot]");
        const rings = q("[data-map-ring]");
        const leaders = q("[data-map-leader]");
        const markers = q("[data-map-marker]");
        const legendItems = q("[data-map-legend]");

        gsap.set(intro, { y: 18, autoAlpha: 0 });
        gsap.set([mainland, ...islands, ...leaders], { drawSVG: "0% 0%" });
        gsap.set(dots, { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(rings, { scale: 0.4, opacity: 0, transformOrigin: "50% 50%" });
        gsap.set(markers, { autoAlpha: 0 });
        gsap.set(legendItems, { x: -14, autoAlpha: 0 });

        const idlePulse = gsap.fromTo(
          rings,
          { scale: 1, opacity: 0.55 },
          {
            scale: 2.8,
            opacity: 0,
            duration: 2.4,
            ease: "power1.out",
            stagger: { each: 0.5, repeat: -1 },
            paused: true,
            immediateRender: false,
          }
        );

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: map, start: "top 72%", once: true },
          onComplete: () => {
            idlePulse.play();
          },
        });

        tl.to(intro, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, 0)
          .to(mainland, { drawSVG: "0% 100%", duration: 2.3, ease: "power2.inOut" }, 0.15)
          .to(
            islands,
            { drawSVG: "0% 100%", duration: 1.1, ease: "power2.inOut", stagger: 0.18 },
            1.35
          );

        const sitesStart = 2.35;

        MAP_SITES.forEach((site, index) => {
          const at = sitesStart + index * 0.42;
          const fromX = () => (-site.dx / ITALY_MAP.width) * map.offsetWidth;
          const fromY = () => (-site.dy / ITALY_MAP.height) * map.offsetHeight;

          tl.to(dots[index], { scale: 1, duration: 0.45, ease: "back.out(3)" }, at)
            .fromTo(
              rings[index],
              { scale: 0.4, opacity: 0.9 },
              { scale: 3, opacity: 0, duration: 1, ease: "power2.out" },
              at
            )
            .to(
              leaders[index],
              { drawSVG: "0% 100%", duration: 0.8, ease: "power3.inOut" },
              at + 0.18
            )
            .fromTo(
              markers[index],
              { x: fromX, y: fromY, scale: 0.2, rotation: -8, autoAlpha: 0 },
              {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                autoAlpha: 1,
                duration: 0.8,
                ease: "power3.inOut",
                immediateRender: false,
              },
              at + 0.18
            )
            .to(legendItems[index], { x: 0, autoAlpha: 1, duration: 0.5 }, at + 0.55);
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
  }, [MAP_SITES]);

  useEffect(() => {
    if (!activeId) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest("[data-map-target]")) setActiveId(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeId]);

  if (MAP_SITES.length === 0) return null;

  const hoverHandlers = (id: string) => ({
    onPointerDown: (event: React.PointerEvent) => {
      pointerTypeRef.current = event.pointerType;
    },
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") setActiveId(id);
    },
    onPointerLeave: (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") setActiveId(null);
    },
  });

  const stateClass = (id: string) =>
    activeId === null ? "" : activeId === id ? styles.isActive : styles.isDimmed;

  return (
    <section
      id="mappa"
      ref={sectionRef}
      className={`lcs-section ${styles.section}`}
      aria-labelledby="mappa-heading"
    >
      <div className="lcs-container">
        <div className={styles.layout}>
          <header className={styles.head}>
            <div className={styles.eyebrowRow} data-map-intro>
              <span className={styles.sidelineTick} aria-hidden="true" />
              <p className={styles.eyebrow}>Il circuito sul territorio</p>
            </div>
            <h2 id="mappa-heading" className={styles.title} data-map-intro>
              <span>Dove si </span>
              <span className={styles.titleScript}>gioca</span>
            </h2>
            <p className={styles.lead} data-map-intro>
              Ogni coppa nasce in una città e ne porta i colori. Insieme
              disegnano la geografia di Lega Calcio Studenti.
            </p>
            <dl className={styles.figures} data-map-intro>
              <div>
                <dt>Città</dt>
                <dd>{pad(CITY_COUNT)}</dd>
              </div>
              <div>
                <dt>Competizioni sulla mappa</dt>
                <dd>{pad(MAP_SITES.length)}</dd>
              </div>
            </dl>
          </header>

          <div className={styles.mapColumn}>
            <div
              ref={mapRef}
              className={styles.map}
              style={
                {
                  "--map-ratio": `${ITALY_MAP.width} / ${ITALY_MAP.height}`,
                } as React.CSSProperties
              }
            >
              <svg
                className={styles.svg}
                viewBox={`0 0 ${ITALY_MAP.width} ${ITALY_MAP.height}`}
                aria-hidden="true"
                focusable="false"
              >
                <g className={styles.outline}>
                  {ITALY_MAP.shapes.map((shape) => (
                    <path key={shape.id} d={shape.d} data-map-outline />
                  ))}
                </g>

                {MAP_SITES.map((site) => (
                  <g key={site.id} className={`${styles.site} ${stateClass(site.id)}`}>
                    <line
                      className={styles.leader}
                      x1={site.x}
                      y1={site.y}
                      x2={site.x + site.dx}
                      y2={site.y + site.dy}
                      data-map-leader
                    />
                    <circle className={styles.ring} cx={site.x} cy={site.y} r={7} data-map-ring />
                    <circle className={styles.dot} cx={site.x} cy={site.y} r={6.5} data-map-dot />
                  </g>
                ))}
              </svg>

              <div className={styles.markers}>
                {MAP_SITES.map((site) => (
                  <div
                    key={site.id}
                    className={`${styles.marker} ${stateClass(site.id)}`}
                    style={{
                      left: `${((site.x + site.dx) / ITALY_MAP.width) * 100}%`,
                      top: `${((site.y + site.dy) / ITALY_MAP.height) * 100}%`,
                    }}
                  >
                    <div data-map-marker>
                      <Link
                        href={site.href}
                        className={styles.markerLink}
                        tabIndex={-1}
                        aria-hidden="true"
                        data-map-target
                        {...hoverHandlers(site.id)}
                        onClick={(event) => {
                          if (pointerTypeRef.current !== "mouse" && activeId !== site.id) {
                            event.preventDefault();
                            setActiveId(site.id);
                          }
                        }}
                      >
                        <span className={styles.plate}>
                          {site.logo ? (
                            <Image
                              src={site.logo}
                              alt=""
                              fill
                              sizes="80px"
                              className={styles.logo}
                            />
                          ) : (
                            <span className={styles.plateFallback}>{site.name.charAt(0)}</span>
                          )}
                        </span>
                        <span className={styles.cityLabel}>{site.city}</span>
                        <span className={`${styles.card} ${styles[`card-${site.align}`]}`}>
                          <span className={styles.cardName}>{site.name}</span>
                          <span className={styles.cardPlace}>{site.place}</span>
                          <span className={styles.cardCoords}>{site.coordsLabel}</span>
                          <span className={styles.cardAction}>
                            Esplora <span aria-hidden="true">→</span>
                          </span>
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ol className={styles.legend}>
            {MAP_SITES.map((site, index) => (
              <li key={site.id} data-map-legend>
                <Link
                  href={site.href}
                  className={`${styles.legendLink} ${activeId === site.id ? styles.isActive : ""}`}
                  data-map-target
                  {...hoverHandlers(site.id)}
                  onFocus={() => setActiveId(site.id)}
                  onBlur={() => setActiveId(null)}
                >
                  <span className={styles.legendIndex}>{pad(index + 1)}</span>
                  <span className={styles.legendText}>
                    <span className={styles.legendName}>{site.name}</span>
                    <span className={styles.legendPlace}>{site.place}</span>
                  </span>
                  <span className={styles.legendArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
