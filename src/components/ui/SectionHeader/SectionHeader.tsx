import React from 'react';
import Link from 'next/link';
import styles from './SectionHeader.module.css';

export interface SectionHeaderProps {
  eyebrow?: string;
  scriptAccent?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  align?: 'left' | 'center' | 'between';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  scriptAccent,
  title,
  titleHighlight,
  subtitle,
  actionText,
  actionHref,
  align = 'between',
  className = ''
}) => {
  return (
    <div className={`${styles.header} ${styles[align]} ${className}`}>
      <div className={styles.titles}>
        {(eyebrow || scriptAccent) && (
          <div className={styles.eyebrowRow}>
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            {scriptAccent && (
              <>
                {eyebrow && <span className={styles.eyebrowDivider} aria-hidden="true">/</span>}
                <span className={styles.scriptAccent}>{scriptAccent}</span>
              </>
            )}
          </div>
        )}
        <h2 className={styles.title}>
          <span>{title}</span>
          {titleHighlight && (
            <span className={styles.titleHighlight}>{titleHighlight}</span>
          )}
        </h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actionText && actionHref && (
        <Link href={actionHref} className={styles.action}>
          <span>{actionText}</span>
          <span className={styles.arrow} aria-hidden="true">&rarr;</span>
        </Link>
      )}
    </div>
  );
};
