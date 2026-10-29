"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCompetitionHref,
  LOCAL_COMPETITIONS,
  NAV_ITEMS,
} from "@/data/homeData";
import styles from "./Navbar.module.css";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""} ${
        mobileOpen ? styles.headerMenuOpen : ""
      }`}
      role="banner"
    >
      {/* Unico gradiente ufficiale LCS come firma superiore della Navbar */}
      <div className={styles.gradientSignature} aria-hidden="true" />

      <div className={`lcs-container ${styles.inner}`}>
        {/* 1. Brand LCS a sinistra: simbolo originale diretto accanto al logotipo testuale */}
        <Link
          href="/#top"
          className={styles.brand}
          aria-label="Lega Calcio Studenti — Torna all'inizio"
          onClick={closeMobileMenu}
        >
          <Image
            src="/logoCities/lcsw.png"
            alt=""
            width={36}
            height={48}
            priority
            className={styles.logoSymbol}
          />
          <span className={styles.brandTitle}>LEGA CALCIO STUDENTI</span>
        </Link>

        <div className={styles.trailing}>
          <nav className={styles.desktopNav} aria-label="Navigazione principale">
            <ul className={styles.navList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className={styles.navItem}>
                  <Link href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className={`${styles.menuButton} ${
              mobileOpen ? styles.menuButtonActive : ""
            }`}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="lcs-mobile-menu"
            aria-label={
              mobileOpen ? "Chiudi menu di navigazione" : "Apri menu di navigazione"
            }
          >
            <span className={styles.menuButtonLabel}>
              {mobileOpen ? "CHIUDI" : "MENU"}
            </span>
            <span className={styles.burgerLines} aria-hidden="true">
              <span className={styles.burgerLineTop} />
              <span className={styles.burgerLineBottom} />
            </span>
          </button>
        </div>
      </div>

      {/* Menu Mobile progettato specificamente */}
        <div
          id="lcs-mobile-menu"
          className={`${styles.mobileOverlay} ${
            mobileOpen ? styles.mobileOverlayOpen : ""
          }`}
          data-lenis-prevent
          aria-hidden={!mobileOpen}
        >
        <div
          className={styles.mobileBackdrop}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
        <nav
          className={styles.mobilePanel}
          aria-label="Menu mobile Lega Calcio Studenti"
        >
          <div className={`lcs-container ${styles.mobilePanelInner}`}>
            <div className={styles.mobilePanelTop}>
              <span className={styles.mobileEyebrow}>NAVIGAZIONE UFFICIALE</span>
              <ul className={styles.mobileNavList}>
                {NAV_ITEMS.map((item, idx) => (
                  <li key={item.href} className={styles.mobileNavItem}>
                    <Link
                      href={item.href}
                      className={styles.mobileNavLink}
                      onClick={closeMobileMenu}
                    >
                      <span className={styles.mobileNavIndex}>0{idx + 1}</span>
                      <span className={styles.mobileNavTitle}>{item.label}</span>
                      <span className={styles.mobileNavArrow} aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.mobileCupsBlock}>
              <span className={styles.mobileEyebrow}>COMPETIZIONI LOCALI</span>
              <div className={styles.mobileCupsGrid}>
                {LOCAL_COMPETITIONS.map((cup) => (
                  <Link
                    key={cup.id}
                    href={getCompetitionHref(cup.slug)}
                    className={styles.mobileCupChip}
                    onClick={closeMobileMenu}
                  >
                    {cup.logo ? (
                      <Image
                        src={cup.logo}
                        alt=""
                        width={22}
                        height={22}
                        className={styles.mobileCupLogo}
                      />
                    ) : (
                      <span className={styles.mobileCupMark} aria-hidden="true" />
                    )}
                    <span className={styles.mobileCupText}>
                      <strong className={styles.mobileCupName}>{cup.name}</strong>
                      {cup.city ? (
                        <small className={styles.mobileCupCity}>{cup.city}</small>
                      ) : null}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
