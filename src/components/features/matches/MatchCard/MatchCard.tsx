import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Match } from '@/types/matches';
import { Badge } from '@/components/ui/Badge/Badge';
import styles from './MatchCard.module.css';

export interface MatchCardProps {
  match: Match;
  compact?: boolean;
  className?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  compact = false,
  className = ''
}) => {
  const hasScore = typeof match.score === 'object' && match.score !== null;
  const href = `/partite`;

  return (
    <Link
      href={href}
      className={`${styles.card} ${compact ? styles.compact : ''} ${className}`}
      aria-label={`${match.home.name} contro ${match.away.name} — ${match.competitionName}`}
    >
      <div className={styles.header}>
        <div className={styles.compInfo}>
          <span className={styles.compBadge}>{match.competitionName}</span>
          <span className={styles.matchday}>{match.matchday}</span>
        </div>

        {match.isLive ? (
          <Badge variant="aqua" size="sm" dot>
            LIVE {match.minute ? `${match.minute}'` : ''}
          </Badge>
        ) : match.isDemoData ? (
          <span className={styles.demoTag} title="Incontro dimostrativo in attesa del calendario ufficiale">
            DEMO • {match.time}
          </span>
        ) : (
          <span className={styles.timeTag}>{match.time}</span>
        )}
      </div>

      <div className={styles.teamsContainer}>
        {/* Squadra di Casa */}
        <div className={styles.teamRow}>
          <div className={styles.teamIdentity}>
            {match.home.logo && (
              <Image
                src={match.home.logo}
                alt=""
                width={20}
                height={20}
                className={styles.teamLogo}
              />
            )}
            <span className={styles.teamName}>{match.home.name}</span>
            {match.home.city && <span className={styles.teamCity}>{match.home.city}</span>}
          </div>
          <span className={styles.teamScore}>
            {hasScore ? match.score?.home : 'VS'}
          </span>
        </div>

        {/* Squadra Ospite */}
        <div className={styles.teamRow}>
          <div className={styles.teamIdentity}>
            {match.away.logo && (
              <Image
                src={match.away.logo}
                alt=""
                width={20}
                height={20}
                className={styles.teamLogo}
              />
            )}
            <span className={styles.teamName}>{match.away.name}</span>
            {match.away.city && <span className={styles.teamCity}>{match.away.city}</span>}
          </div>
          <span className={styles.teamScore}>
            {hasScore ? match.score?.away : match.time}
          </span>
        </div>
      </div>

      {!compact && (
        <div className={styles.footer}>
          <span className={styles.venue}>{match.venue}</span>
          <span className={styles.detailAction}>Scheda &rarr;</span>
        </div>
      )}
    </Link>
  );
};
