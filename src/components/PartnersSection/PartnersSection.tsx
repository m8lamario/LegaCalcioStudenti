import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PARTNER_KINDS,
  PARTNER_KIND_LABELS,
  type CircuitPartner,
} from "@/data/homeData";
import { RevealOnScroll } from "@/components/RevealOnScroll/RevealOnScroll";
import styles from "./PartnersSection.module.css";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export const PartnersSection: React.FC<{ partners: CircuitPartner[] }> = ({
  partners: incoming,
}) => {
  const partners = incoming.filter((partner) => partner.name.trim().length > 0);

  if (partners.length === 0) return null;

  const groups = PARTNER_KINDS.map((kind, index) => ({
    kind,
    index: String(index + 1).padStart(2, "0"),
    label: PARTNER_KIND_LABELS[kind],
    items: partners.filter((partner) => partner.kind === kind),
  })).filter((group) => group.items.length > 0);

  return (
    <section
      id="partner"
      className={`lcs-section ${styles.section}`}
      aria-labelledby="partner-heading"
    >
      <div className="lcs-container">
        <RevealOnScroll>
          <header className={styles.header}>
            <div>
              <div className={styles.eyebrowRow}>
                <span className={styles.sidelineTick} aria-hidden="true" />
                <p className={styles.eyebrow}>Chi cammina con il circuito</p>
              </div>
              <h2 id="partner-heading" className={styles.title}>
                <span>Partner e </span>
                <span className={styles.titleScript}>collaborazioni</span>
              </h2>
            </div>
            <p className={styles.lead}>
              Le realtà che sostengono il circuito, dalle istituzioni agli
              sponsor, fino a chi racconta e organizza le competizioni.
            </p>
          </header>

          <div className={styles.board}>
            {groups.map((group) => (
              <div key={group.kind} className={styles.group}>
                <div className={styles.groupMeta}>
                  <span className={styles.groupIndex}>{group.index}</span>
                  <h3 className={styles.groupLabel}>{group.label}</h3>
                </div>
                <ul className={styles.list}>
                  {group.items.map((partner) => (
                    <li key={partner.id}>
                      <PartnerMark partner={partner} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

function PartnerMark({ partner }: { partner: CircuitPartner }) {
  const content = (
    <>
      <span className={styles.markFace}>
        {partner.logo ? (
          <Image
            src={partner.logo}
            alt=""
            fill
            sizes="120px"
            className={styles.logo}
          />
        ) : (
          <span className={styles.wordmark} aria-hidden="true">
            {initials(partner.name)}
          </span>
        )}
      </span>
      <span className={styles.name}>{partner.name}</span>
      {partner.href ? (
        <span className={styles.arrow} aria-hidden="true">
          {isExternal(partner.href) ? "↗" : "→"}
        </span>
      ) : null}
    </>
  );

  if (!partner.href) {
    return <div className={styles.mark}>{content}</div>;
  }

  if (isExternal(partner.href)) {
    return (
      <a
        className={`${styles.mark} ${styles.markLink}`}
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
        <span className={styles.srOnly}>Si apre in una nuova scheda</span>
      </a>
    );
  }

  return (
    <Link className={`${styles.mark} ${styles.markLink}`} href={partner.href}>
      {content}
    </Link>
  );
}

function initials(name: string) {
  const words = name
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
