import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.page} aria-labelledby="not-found-heading">
      <div className="lcs-container">
        <p className={styles.eyebrow}>Errore 404</p>
        <h1 id="not-found-heading" className={styles.title}>
          Pagina non trovata
        </h1>
        <p className={styles.text}>
          Il contenuto richiesto non è presente su questo sito.
        </p>
        <Link href="/" className={styles.link}>
          <span>Torna alla homepage</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
