import React from "react";
import Image from "next/image";
import { NAV_ITEMS, TERRITORIAL_COMPETITIONS } from "@/data/homeData";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer id="la-lega" className={styles.footer} role="contentinfo">
      <div className="lcs-container">
        {/* Fascia Istituzionale Superiore: Identità LCS + navigazione essenziale */}
        <div className={styles.topGrid}>
          <div className={styles.identityCol}>
            <div className={styles.brandRow}>
              <Image
                src="/logoCities/lcsw.png"
                alt="Simbolo ufficiale Lega Calcio Studenti"
                width={39}
                height={71}
                className={styles.logoSymbol}
              />
              <div className={styles.brandLockup}>
                <span className={styles.brandName}>LEGA CALCIO STUDENTI</span>
                <span className={styles.brandSub}>
                  CAMPIONATO NAZIONALE DEGLI ISTITUTI SUPERIORI
                </span>
              </div>
            </div>

            <p className={styles.scriptMotto}>
              Una lega. Tante città. Un&apos;unica passione.
            </p>

            <p className={styles.missionText}>
              Lega Calcio Studenti riunisce i tornei calcistici inter-scolastici
              italiani sotto un&apos;unica identità sportiva, valorizzando il
              senso di appartenenza ai licei e agli istituti superiori.
            </p>
          </div>

          <div className={styles.linksCol}>
            <h3 className={styles.colTitle}>COMPETIZIONI TERRITORIALI</h3>
            <ul className={styles.linkList}>
              {TERRITORIAL_COMPETITIONS.map((cup) => (
                <li key={cup.id}>
                  <a href={cup.href} className={styles.footerLink}>
                    <span>{cup.name}</span>
                    <span className={styles.linkCity}>{cup.city}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h3 className={styles.colTitle}>LA LEGA</h3>
            <ul className={styles.linkList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.footerLink}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#top" className={styles.footerLink}>
                  Torna all&apos;apertura ↑
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Fascia Inferiore: Copyright e nota trasparenza concept */}
        <div className={styles.bottomBar}>
          <span className={styles.copyright}>
            © 2026 Lega Calcio Studenti (LCS). Tutti i diritti riservati.
          </span>
          <span className={styles.conceptNote}>
            Concept Editoriale Preliminare · Risultati e classifiche a scopo
            dimostrativo
          </span>
        </div>
      </div>
    </footer>
  );
};
