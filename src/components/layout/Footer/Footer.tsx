import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Fascia Superiore Istituzionale */}
      <div className={styles.topBanner}>
        <div className={styles.container}>
          <div className={styles.topBannerInner}>
            <div className={styles.topBannerCopy}>
              <span className={styles.topBannerKicker}>ISCRIZIONI & COLLABORAZIONI ISTITUZIONALI</span>
              <h2 className={styles.topBannerTitle}>
                VUOI ISCRIVERE IL TUO LICEO O PORTARE UN TORNEO LCS NELLA TUA CITTÀ?
              </h2>
            </div>
            <div className={styles.topBannerActions}>
              <Link href="/contatti" className={styles.ctaAqua}>
                CONTATTA LA SEGRETERIA LCS &rarr;
              </Link>
              <Link href="/competitions" className={styles.ctaSecondary}>
                ESPLORA I TORNEI
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Corpo Principale del Footer */}
      <div className={styles.container}>
        <div className={styles.mainGrid}>
          {/* Colonna 1: Identità & Sede */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandHeader}>
              <div className={styles.logoFrame}>
                <Image
                  src="/logoCities/lcsw.png"
                  alt="Lega Calcio Studenti"
                  width={36}
                  height={36}
                  className={styles.logoImg}
                />
              </div>
              <div className={styles.brandNames}>
                <span className={styles.brandMain}>LEGA CALCIO STUDENTI</span>
                <span className={styles.brandSub}>PORTALE UFFICIALE NAZIONALE</span>
              </div>
            </Link>

            <span className={styles.scriptMotto}>
              Il calcio dei licei
            </span>

            <p className={styles.brandDesc}>
              L&apos;ecosistema calcistico dedicato alle scuole superiori italiane. Tornei cittadini ufficiali, graduatoria generale nazionale e finali Knockout Day.
            </p>

            <address className={styles.addressBox}>
              <strong>SEDE OPERATIVA</strong>
              <span>Corso Vinzaglio 24, 10121 Torino (TO) — Italia</span>
            </address>

            <div className={styles.socialRow}>
              <a
                href="https://www.instagram.com/legacalciostudenti/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="Profilo ufficiale Instagram Lega Calcio Studenti"
              >
                INSTAGRAM ↗
              </a>
              <a
                href="https://www.tiktok.com/@legacalciostudenti"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="Profilo ufficiale TikTok Lega Calcio Studenti"
              >
                TIKTOK ↗
              </a>
            </div>
          </div>

          {/* Colonna 2: Competizioni Territoriali */}
          <div className={styles.navCol}>
            <h3 className={styles.colHeading}>COMPETIZIONI TERRITORIALI</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/competitions/molecup" className={styles.footerLink}>
                  <span>Mole Cup</span>
                  <span className={styles.cityTag}>Torino</span>
                </Link>
              </li>
              <li>
                <Link href="/competitions/leonessacup" className={styles.footerLink}>
                  <span>Leonessa Cup</span>
                  <span className={styles.cityTag}>Brescia</span>
                </Link>
              </li>
              <li>
                <Link href="/competitions/ferreacup" className={styles.footerLink}>
                  <span>Ferrea Cup</span>
                  <span className={styles.cityTag}>Modena</span>
                </Link>
              </li>
              <li>
                <Link href="/competitions/olympiuscup" className={styles.footerLink}>
                  <span>Olympius Cup</span>
                  <span className={styles.cityTag}>Cremona</span>
                </Link>
              </li>
              <li>
                <Link href="/competitions/turascup" className={styles.footerLink}>
                  <span>Turàs Cup</span>
                  <span className={styles.cityTag}>Milano</span>
                </Link>
              </li>
              <li>
                <Link href="/competitions/boracup" className={styles.footerLink}>
                  <span>Bora Cup</span>
                  <span className={styles.cityTag}>Trieste</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonna 3: Match Center & Classifiche */}
          <div className={styles.navCol}>
            <h3 className={styles.colHeading}>CAMPIONATO & DATI</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/partite" className={styles.footerLinkSimple}>
                  Calendario e Match Center
                </Link>
              </li>
              <li>
                <Link href="/classifica" className={styles.footerLinkSimple}>
                  Classifica Generale Scuole
                </Link>
              </li>
              <li>
                <Link href="/squadre" className={styles.footerLinkSimple}>
                  Albo Istituti e Squadre
                </Link>
              </li>
              <li>
                <Link href="/competitions" className={styles.footerLinkSimple}>
                  Regolamento e Format Gironi
                </Link>
              </li>
              <li>
                <Link href="/#racconto-editoriale" className={styles.footerLinkSimple}>
                  Cronache e Momenti Salienti
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonna 4: Istituzionale & Contatti */}
          <div className={styles.navCol}>
            <h3 className={styles.colHeading}>ISTITUZIONALE</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/#identita-nazionale" className={styles.footerLinkSimple}>
                  Identità Nazionale LCS
                </Link>
              </li>
              <li>
                <Link href="/contatti" className={styles.footerLinkSimple}>
                  Contatti & Segreteria Organizzativa
                </Link>
              </li>
              <li>
                <Link href="/contatti" className={styles.footerLinkSimple}>
                  Diventa Partner Ufficiale
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={styles.footerLinkSimple}>
                  Informativa Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={styles.footerLinkSimple}>
                  Termini e Condizioni
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferiore Copyright */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear} Lega Calcio Studenti (LCS). Tutti i diritti riservati.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <span className={styles.sep} aria-hidden="true">•</span>
            <Link href="/terms" className={styles.legalLink}>Termini d&apos;Uso</Link>
            <span className={styles.sep} aria-hidden="true">•</span>
            <a href="#top" className={styles.backToTop}>Torna su ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
