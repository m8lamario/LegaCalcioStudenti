'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Match } from '@/types/matches';
import { MatchCard } from '../MatchCard/MatchCard';
import styles from './MatchTicker.module.css';

export interface MatchTickerProps {
  matches: Match[];
  title?: string;
  className?: string;
}

export const MatchTicker: React.FC<MatchTickerProps> = ({
  matches,
  title = 'CALENDARIO & INCONTRI',
  className = ''
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`${styles.tickerWrapper} ${className}`} aria-label="Barra incontri e prossimi turni">
      <div className={styles.inner}>
        <div className={styles.labelCol}>
          <div className={styles.statusBox}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.tickerTitle}>{title}</span>
          </div>
          <Link href="/partite" className={styles.allMatchesLink}>
            Vedi calendario &rarr;
          </Link>
        </div>

        <div className={styles.scrollTrackWrapper}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => scroll('left')}
            aria-label="Scorri incontri a sinistra"
          >
            &#8249;
          </button>

          <div className={styles.scrollTrack} ref={scrollRef}>
            {matches.map((match) => (
              <div key={match.id} className={styles.matchItem}>
                <MatchCard match={match} compact />
              </div>
            ))}
          </div>

          <button
            type="button"
            className={styles.navButton}
            onClick={() => scroll('right')}
            aria-label="Scorri incontri a destra"
          >
            &#8250;
          </button>
        </div>
      </div>
    </div>
  );
};
