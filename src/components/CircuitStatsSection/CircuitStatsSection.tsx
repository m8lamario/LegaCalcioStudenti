import React from "react";
import type { CircuitStat } from "@/data/homeData";
import { RevealOnScroll } from "@/components/RevealOnScroll/RevealOnScroll";
import styles from "./CircuitStatsSection.module.css";

export const CircuitStatsSection: React.FC<{ stats: CircuitStat[] }> = ({
  stats: incoming,
}) => {
  const stats = incoming.filter(
    (stat) => stat.value.trim().length > 0 && stat.label.trim().length > 0
  );

  if (stats.length === 0) return null;

  return (
    <section
      id="numeri"
      className={`lcs-section ${styles.section}`}
      aria-labelledby="numeri-heading"
    >
      <div className="lcs-container">
        <RevealOnScroll>
          <header className={styles.header}>
            <div className={styles.eyebrowRow}>
              <span className={styles.sidelineTick} aria-hidden="true" />
              <p className={styles.eyebrow}>La dimensione del circuito</p>
            </div>
            <h2 id="numeri-heading" className={styles.title}>
              <span>LCS in </span>
              <span className={styles.titleScript}>numeri</span>
            </h2>
          </header>

          <ul className={styles.stats}>
            {stats.map((stat) => (
              <li key={stat.id} className={styles.stat}>
                <p className={styles.value}>{stat.value}</p>
                <p className={styles.label}>{stat.label}</p>
                {stat.note ? <p className={styles.note}>{stat.note}</p> : null}
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
};
