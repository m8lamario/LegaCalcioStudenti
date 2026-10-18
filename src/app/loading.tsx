import React from 'react';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer} role="status" aria-label="Caricamento contenuti in corso">
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinnerRing} />
        <span className={styles.logoAcronym}>LCS</span>
      </div>
      <p className={styles.loadingText}>CARICAMENTO DATI UFFICIALI...</p>
    </div>
  );
}
