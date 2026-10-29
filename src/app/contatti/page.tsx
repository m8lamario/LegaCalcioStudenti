import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_CHANNELS } from "@/data/homeData";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contatti — Lega Calcio Studenti",
  description:
    "Pagina contatti della Lega Calcio Studenti. I recapiti ufficiali saranno pubblicati quando disponibili.",
};

export default function ContactsPage() {
  return (
    <section className={styles.page} aria-labelledby="contatti-heading">
      <div className="lcs-container">
        <div className={styles.intro}>
          <div className={styles.eyebrowRow}>
            <span className={styles.sidelineTick} aria-hidden="true" />
            <span className={styles.eyebrow}>Lega Calcio Studenti</span>
          </div>
          <h1 id="contatti-heading" className={styles.title}>
            <span>I </span>
            <span className={styles.titleScript}>Contatti</span>
          </h1>
        </div>

        {CONTACT_CHANNELS.length > 0 ? (
          <ul className={styles.channels}>
            {CONTACT_CHANNELS.map((channel) => (
              <li key={channel.id} className={styles.channel}>
                <span className={styles.channelLabel}>{channel.label}</span>
                {channel.href ? (
                  <a href={channel.href} className={styles.channelValue}>
                    {channel.value}
                  </a>
                ) : (
                  <span className={styles.channelValue}>{channel.value}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.notice}>
            I recapiti ufficiali non sono ancora pubblicati su questo sito.
          </p>
        )}

        <Link href="/#mission" className={styles.backLink}>
          <span aria-hidden="true">←</span>
          <span>Torna alla mission</span>
        </Link>
      </div>
    </section>
  );
}
