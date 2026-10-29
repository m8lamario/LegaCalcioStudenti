import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCompetitionHref,
  LOCAL_COMPETITIONS,
  SITE_MOTTO,
} from "@/data/homeData";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  { label: "Mission", href: "/#mission" },
  { label: "News", href: "/#news" },
  { label: "Contatti", href: "/contatti" },
];

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="lcs-container">
        <div className={styles.topGrid}>
          <div className={styles.identityCol}>
            <Link href="/#top" className={styles.brandRow}>
              <Image
                src="/logoCities/lcsw.png"
                alt=""
                width={39}
                height={52}
                className={styles.logoSymbol}
              />
              <span className={styles.brandName}>LEGA CALCIO STUDENTI</span>
            </Link>

            <p className={styles.scriptMotto}>{SITE_MOTTO}</p>

            <Link href="/#mission" className={styles.missionLink}>
              <span>Leggi la mission</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className={styles.linksCol}>
            <h2 className={styles.colTitle}>COMPETIZIONI LOCALI</h2>
            <ul className={styles.linkList}>
              {LOCAL_COMPETITIONS.map((cup) => (
                <li key={cup.id}>
                  <Link href={getCompetitionHref(cup.slug)} className={styles.footerLink}>
                    <span>{cup.name}</span>
                    {cup.city ? <span className={styles.linkCity}>{cup.city}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h2 className={styles.colTitle}>COLLEGAMENTI</h2>
            <ul className={styles.linkList}>
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span className={styles.copyright}>
            © 2026 Lega Calcio Studenti (LCS). Tutti i diritti riservati.
          </span>
        </div>
      </div>
    </footer>
  );
};
