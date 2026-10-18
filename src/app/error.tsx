'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button/Button';
import styles from './error.module.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('LCS Application Error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer} role="alert" aria-live="assertive">
      <div className={styles.card}>
        <span className={styles.errorCode}>ERRORE DI CARICAMENTO</span>
        <h1 className={styles.title}>Si è verificato un imprevisto</h1>
        <p className={styles.description}>
          Non è stato possibile caricare i dati della lega in questo momento.
          Puoi riprovare oppure tornare alla pagina principale delle competizioni.
        </p>

        <div className={styles.actions}>
          <Button onClick={reset} variant="primary">
            Riprova
          </Button>
          <Button href="/" variant="outline">
            Torna alla Home
          </Button>
        </div>
      </div>
    </div>
  );
}
