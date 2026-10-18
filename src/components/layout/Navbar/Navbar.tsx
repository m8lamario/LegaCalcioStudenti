'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CITY_NAVIGATION, MAIN_NAV_ITEMS, TERRITORIAL_COMPETITIONS } from '@/data/mock/lcsMockData';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cupsDropdownOpen, setCupsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Rileva se siamo dentro una specifica competizione territoriale (/competitions/[city])
  const activeCitySlug = React.useMemo(() => {
    if (!pathname) return null;
    const match = pathname.match(/^\/competitions\/([^/?#]+)/i);
    return match ? decodeURIComponent(match[1]).toLowerCase() : null;
  }, [pathname]);

  const activeCompetition = React.useMemo(() => {
    if (!activeCitySlug) return null;
    return (
      TERRITORIAL_COMPETITIONS.find((c) => c.slug.toLowerCase() === activeCitySlug) ||
      null
    );
  }, [activeCitySlug]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Chiude menu mobile e dropdown al cambio rotta
  useEffect(() => {
    setMobileMenuOpen(false);
    setCupsDropdownOpen(false);
  }, [pathname]);

  // Gestione tasto Escape e click esterno per il megamenu competizioni
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setCupsDropdownOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCupsDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Blocco scroll del body quando il drawer mobile è aperto
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActiveLink = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}
      role="banner"
    >
      {/* ====================================================================
          TIER 1: BARRA BROADCAST CIRCUITO NAZIONALE & TORNEI TERRITORIALI
          ==================================================================== */}
      <div className={styles.networkBar} aria-label="Circuito Nazionale e Tornei Territoriali">
        <div className={styles.networkContainer}>
          <div className={styles.networkLeft}>
            <span className={styles.seasonBadge}>
              <span className={styles.seasonPulse} aria-hidden="true" />
              <span>LCS 2025/26</span>
            </span>
            <span className={styles.networkLabel}>COPPE UFFICIALI:</span>
          </div>

          <ul className={styles.cupStrip} aria-label="Accesso rapido ai tornei cittadini">
            {CITY_NAVIGATION.map((cup) => {
              const cupHref = `/competitions/${cup.slug}`;
              const isCupActive = activeCitySlug === cup.slug.toLowerCase();
              return (
                <li key={cup.slug} className={styles.cupStripItem}>
                  <Link
                    href={cupHref}
                    className={`${styles.cupPill} ${isCupActive ? styles.cupPillActive : ''}`}
                    aria-current={isCupActive ? 'page' : undefined}
                  >
                    {cup.badgeUrl && (
                      <Image
                        src={cup.badgeUrl}
                        alt=""
                        width={20}
                        height={20}
                        className={styles.cupPillLogo}
                      />
                    )}
                    <span className={styles.cupPillName}>{cup.cupName}</span>
                    <span className={styles.cupPillCity}>{cup.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={styles.networkRight}>
            <Link href="/staff" className={styles.utilityLink}>
              Staff
            </Link>
            <span className={styles.utilitySep} aria-hidden="true">/</span>
            <a
              href="https://www.instagram.com/legacalciostudenti/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.utilityLink}
              aria-label="Instagram ufficiale Lega Calcio Studenti"
            >
              IG ↗
            </a>
            <a
              href="https://www.tiktok.com/@legacalciostudenti"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.utilityLink}
              aria-label="TikTok ufficiale Lega Calcio Studenti"
            >
              TT ↗
            </a>
          </div>
        </div>
      </div>

      {/* ====================================================================
          TIER 2: BARRA PRINCIPALE ISTITUZIONALE CON GRADIENTE UFFICIALE LCS
          (#011674 -> #012BFD -> #00EDAF — unico gradiente consentito)
          ==================================================================== */}
      <div className={styles.gradientBar}>
        <div className={styles.mainContainer}>
          {/* 1. Scudetto & Identità Lega */}
          <div className={styles.brandCluster}>
            <Link
              href="/"
              className={styles.brandLink}
              aria-label="Vai alla Homepage di Lega Calcio Studenti"
            >
              <div className={styles.crestShield}>
                <Image
                  src="/logoCities/lcsw.png"
                  alt="Stemma ufficiale Lega Calcio Studenti"
                  width={48}
                  height={48}
                  priority
                  className={styles.crestImage}
                />
              </div>

              <div className={styles.brandLockup}>
                <div className={styles.brandTitleRow}>
                  <span className={styles.brandName}>LEGA CALCIO STUDENTI</span>
                  <span className={styles.brandTag}>ITA</span>
                </div>
                <span className={styles.brandPayoff}>
                  CAMPIONATO NAZIONALE DEI LICEI
                </span>
              </div>
            </Link>

            {/* Badge contestuale se l'utente sta esplorando un torneo cittadino */}
            {activeCompetition && (
              <div className={styles.contextCupBadge}>
                <span className={styles.contextDivider} aria-hidden="true">/</span>
                <Link
                  href={`/competitions/${activeCompetition.slug}`}
                  className={styles.contextCupLink}
                >
                  {activeCompetition.logoImage && (
                    <Image
                      src={activeCompetition.logoImage}
                      alt=""
                      width={24}
                      height={24}
                      className={styles.contextCupIcon}
                    />
                  )}
                  <div className={styles.contextCupText}>
                    <span className={styles.contextCupName}>{activeCompetition.name}</span>
                    <span className={styles.contextCupCity}>{activeCompetition.city}</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 2. Navigazione Principale (racchiusa in dock ad alto contrasto) */}
          <nav className={styles.primaryNav} aria-label="Navigazione principale di lega">
            <ul className={styles.navDock}>
              {MAIN_NAV_ITEMS.map((item) => {
                const active = isActiveLink(item.href);
                const isCompetitionsItem = item.href === '/competitions';

                if (isCompetitionsItem) {
                  return (
                    <li
                      key={item.href}
                      ref={dropdownRef}
                      className={`${styles.navItem} ${styles.navItemWithMenu}`}
                    >
                      <div className={styles.splitNavControl}>
                        <Link
                          href={item.href}
                          className={`${styles.navLink} ${styles.navLinkSplitMain} ${
                            active ? styles.navLinkActive : ''
                          }`}
                          aria-current={active ? 'page' : undefined}
                        >
                          <span>{item.label}</span>
                        </Link>
                        <button
                          type="button"
                          className={`${styles.dropdownToggleBtn} ${
                            cupsDropdownOpen ? styles.dropdownToggleActive : ''
                          }`}
                          onClick={() => setCupsDropdownOpen((prev) => !prev)}
                          aria-expanded={cupsDropdownOpen}
                          aria-label="Mostra elenco rapido competizioni territoriali"
                        >
                          <span className={styles.chevronIcon} aria-hidden="true">▾</span>
                        </button>
                      </div>

                      {/* Mega-Dropdown Tornei Territoriali */}
                      <div
                        className={`${styles.megaDropdown} ${
                          cupsDropdownOpen ? styles.megaDropdownOpen : ''
                        }`}
                        role="region"
                        aria-label="Selettore rapido tornei territoriali"
                      >
                        <div className={styles.megaHeader}>
                          <div>
                            <span className={styles.megaEyebrow}>CIRCUITO UFFICIALE LCS</span>
                            <h3 className={styles.megaTitle}>SELEZIONA UNA COMPETIZIONE TERRITORIALE</h3>
                          </div>
                          <Link
                            href="/competitions"
                            className={styles.megaAllLink}
                            onClick={() => setCupsDropdownOpen(false)}
                          >
                            Vedi tutte le sedi &rarr;
                          </Link>
                        </div>

                        <div className={styles.megaGrid}>
                          {TERRITORIAL_COMPETITIONS.map((comp) => (
                            <div key={comp.id} className={styles.megaCupCard}>
                              <Link
                                href={`/competitions/${comp.slug}`}
                                className={styles.megaCupMainLink}
                                onClick={() => setCupsDropdownOpen(false)}
                              >
                                <div className={styles.megaCupLogoWrap}>
                                  {comp.logoImage && (
                                    <Image
                                      src={comp.logoImage}
                                      alt=""
                                      width={32}
                                      height={32}
                                      className={styles.megaCupLogo}
                                    />
                                  )}
                                </div>
                                <div className={styles.megaCupMeta}>
                                  <span className={styles.megaCupCity}>{comp.city}</span>
                                  <span className={styles.megaCupName}>{comp.name}</span>
                                  <span className={styles.megaCupStats}>
                                    {comp.teamsCount} Scuole • {comp.matchesCount} Match
                                  </span>
                                </div>
                              </Link>
                              <div className={styles.megaCupSublinks}>
                                <Link
                                  href={`/competitions/${comp.slug}/partite`}
                                  onClick={() => setCupsDropdownOpen(false)}
                                >
                                  Partite
                                </Link>
                                <Link
                                  href={`/competitions/${comp.slug}/classifica`}
                                  onClick={() => setCupsDropdownOpen(false)}
                                >
                                  Classifica
                                </Link>
                                <Link
                                  href={`/competitions/${comp.slug}/squadre`}
                                  onClick={() => setCupsDropdownOpen(false)}
                                >
                                  Squadre
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.href} className={styles.navItem}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 3. Cluster CTA Broadcast ad Alto Contrasto */}
          <div className={styles.ctaCluster}>
            <Link
              href="/classifica"
              className={styles.standingsQuickBtn}
              aria-label="Consulta la Classifica Generale Top 14 Scuole"
            >
              <span className={styles.standingsRankTag}>TOP 14</span>
              <span className={styles.standingsBtnText}>CLASSIFICA</span>
            </Link>

            <Link
              href="/partite"
              className={styles.matchCenterCta}
              aria-label="Vai al Match Center ufficiale"
            >
              <span className={styles.liveDot} aria-hidden="true" />
              <span className={styles.matchCenterLabel}>MATCH CENTER</span>
              <span className={styles.matchCenterArrow} aria-hidden="true">&rarr;</span>
            </Link>

            {/* Pulsante Hamburger Mobile */}
            <button
              type="button"
              className={`${styles.mobileMenuBtn} ${
                mobileMenuOpen ? styles.mobileMenuBtnActive : ''
              }`}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="lcs-mobile-drawer"
              aria-label={
                mobileMenuOpen ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione'
              }
            >
              <span className={styles.mobileMenuLabel}>
                {mobileMenuOpen ? 'CHIUDI' : 'MENU'}
              </span>
              <span className={styles.hamburgerBox} aria-hidden="true">
                <span
                  className={`${styles.hamburgerLine} ${
                    mobileMenuOpen ? styles.hamburgerLineOpen : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          TIER 3 (CONTESTUALE): SOTTO-NAVIGAZIONE TORNEO CITTADINO ATTIVO
          ==================================================================== */}
      {activeCompetition && (
        <div
          className={styles.contextSubBar}
          aria-label={`Menu torneo ${activeCompetition.name}`}
        >
          <div className={styles.contextSubContainer}>
            <div className={styles.contextSubTitle}>
              <span className={styles.contextSubDot} aria-hidden="true" />
              <span>TORNEO ATTIVO:</span>
              <strong>
                {activeCompetition.name.toUpperCase()} ({activeCompetition.city})
              </strong>
            </div>

            <ul className={styles.contextSubList}>
              <li>
                <Link
                  href={`/competitions/${activeCompetition.slug}`}
                  className={
                    pathname === `/competitions/${activeCompetition.slug}`
                      ? styles.contextSubLinkActive
                      : styles.contextSubLink
                  }
                >
                  Panoramica
                </Link>
              </li>
              <li>
                <Link
                  href={`/competitions/${activeCompetition.slug}/partite`}
                  className={
                    pathname?.includes(`/competitions/${activeCompetition.slug}/partite`)
                      ? styles.contextSubLinkActive
                      : styles.contextSubLink
                  }
                >
                  Partite
                </Link>
              </li>
              <li>
                <Link
                  href={`/competitions/${activeCompetition.slug}/classifica`}
                  className={
                    pathname?.includes(`/competitions/${activeCompetition.slug}/classifica`)
                      ? styles.contextSubLinkActive
                      : styles.contextSubLink
                  }
                >
                  Classifica
                </Link>
              </li>
              <li>
                <Link
                  href={`/competitions/${activeCompetition.slug}/squadre`}
                  className={
                    pathname?.includes(`/competitions/${activeCompetition.slug}/squadre`)
                      ? styles.contextSubLinkActive
                      : styles.contextSubLink
                  }
                >
                  Squadre
                </Link>
              </li>
              <li>
                <Link
                  href={`/competitions/${activeCompetition.slug}/sorteggio`}
                  className={
                    pathname?.includes(`/competitions/${activeCompetition.slug}/sorteggio`)
                      ? styles.contextSubLinkActive
                      : styles.contextSubLink
                  }
                >
                  Sorteggio
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ====================================================================
          MOBILE DRAWER INTUITIVO CON ANIMAZIONE FLUIDA
          ==================================================================== */}
      <div
        id="lcs-mobile-drawer"
        className={`${styles.mobileDrawerBackdrop} ${
          mobileMenuOpen ? styles.mobileDrawerBackdropOpen : ''
        }`}
        aria-hidden={!mobileMenuOpen}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`${styles.mobileDrawerPanel} ${
            mobileMenuOpen ? styles.mobileDrawerPanelOpen : ''
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu di navigazione Lega Calcio Studenti"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.mobileDrawerBody}>
            {/* Navigazione Principale Numerata */}
            <nav aria-label="Menu principale mobile" className={styles.mobilePrimarySection}>
              <div className={styles.mobileSectionHeader}>
                <span className={styles.mobileSectionKicker}>NAVIGAZIONE LEGA</span>
                <span className={styles.mobileSeasonTag}>STAGIONE 2025/26</span>
              </div>

              <ul className={styles.mobileNavList}>
                {MAIN_NAV_ITEMS.map((item, idx) => {
                  const active = isActiveLink(item.href);
                  return (
                    <li key={item.href} className={styles.mobileNavItem}>
                      <Link
                        href={item.href}
                        className={`${styles.mobileNavLink} ${
                          active ? styles.mobileNavLinkActive : ''
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className={styles.mobileNavLeft}>
                          <span className={styles.mobileNavIndex}>
                            0{idx + 1}
                          </span>
                          <span className={styles.mobileNavText}>{item.label}</span>
                        </div>
                        <span className={styles.mobileNavArrow} aria-hidden="true">
                          &rarr;
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Griglia Tornei Territoriali */}
            <div className={styles.mobileCupsSection}>
              <div className={styles.mobileSectionHeader}>
                <span className={styles.mobileSectionKicker}>SEDI &amp; COPPE TERRITORIALI</span>
                <Link
                  href="/competitions"
                  className={styles.mobileAllCupsLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Vedi tutte &rarr;
                </Link>
              </div>

              <div className={styles.mobileCupsGrid}>
                {TERRITORIAL_COMPETITIONS.map((comp) => {
                  const isCupSelected = activeCitySlug === comp.slug.toLowerCase();
                  return (
                    <Link
                      key={comp.id}
                      href={`/competitions/${comp.slug}`}
                      className={`${styles.mobileCupCard} ${
                        isCupSelected ? styles.mobileCupCardActive : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className={styles.mobileCupLogoBox}>
                        {comp.logoImage && (
                          <Image
                            src={comp.logoImage}
                            alt=""
                            width={28}
                            height={28}
                            className={styles.mobileCupLogo}
                          />
                        )}
                      </div>
                      <div className={styles.mobileCupInfo}>
                        <span className={styles.mobileCupName}>{comp.name}</span>
                        <span className={styles.mobileCupCity}>{comp.city}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer Azioni Rapide Mobile */}
            <div className={styles.mobileDrawerFooter}>
              <div className={styles.mobileCtaRow}>
                <Link
                  href="/partite"
                  className={styles.mobilePrimaryCta}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={styles.liveDot} aria-hidden="true" />
                  <span>VAI AL MATCH CENTER</span>
                </Link>
                <Link
                  href="/classifica"
                  className={styles.mobileSecondaryCta}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  CLASSIFICA GENERALE
                </Link>
              </div>

              <div className={styles.mobileSocialBar}>
                <span className={styles.mobileAddress}>
                  Corso Vinzaglio 24, Torino
                </span>
                <div className={styles.mobileSocialLinks}>
                  <a
                    href="https://www.instagram.com/legacalciostudenti/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram ↗
                  </a>
                  <a
                    href="https://www.tiktok.com/@legacalciostudenti"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TikTok ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
