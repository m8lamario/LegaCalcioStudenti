import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/types/editorial';
import { Badge } from '@/components/ui/Badge/Badge';
import styles from './NewsCard.module.css';

export interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
  onSelectArticle?: (article: NewsArticle) => void;
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  featured = false,
  onSelectArticle,
  className = ''
}) => {
  const destinationHref = article.href || '/competitions';

  return (
    <article
      className={`${styles.card} ${featured ? styles.featured : ''} ${className}`}
    >
      <div className={styles.imageBox}>
        <Image
          src={article.coverImage.src}
          alt={article.coverImage.alt || article.title}
          fill
          sizes={featured ? '(max-width: 1024px) 100vw, 60vw' : '(max-width: 768px) 100vw, 35vw'}
          className={styles.image}
        />
        <div className={styles.imageTint} aria-hidden="true" />

        <div className={styles.topBadges}>
          <Badge variant={featured ? 'aqua' : 'blue'} size="sm">
            {article.category}
          </Badge>
          {article.isDemoData && (
            <span className={styles.demoChip}>EDITORIALE DEMO</span>
          )}
        </div>

        {article.city && (
          <span className={styles.locationChip}>
            {article.competitionName ? `${article.competitionName} • ${article.city}` : article.city}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.metaBar}>
          <time className={styles.date}>{article.publishedAt}</time>
          {article.readTimeMinutes && (
            <>
              <span className={styles.sep} aria-hidden="true">•</span>
              <span className={styles.readTime}>Lettura {article.readTimeMinutes} min</span>
            </>
          )}
        </div>

        <h3 className={styles.title}>
          <Link href={destinationHref} className={styles.titleLink}>
            {article.title}
          </Link>
        </h3>

        <p className={styles.excerpt}>{article.excerpt}</p>

        <div className={styles.footer}>
          {onSelectArticle ? (
            <button
              type="button"
              className={styles.readPreviewBtn}
              onClick={() => onSelectArticle(article)}
            >
              <span>LEGGI APPROFONDIMENTO</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          ) : (
            <Link href={destinationHref} className={styles.readMoreLink}>
              <span>APPROFONDISCI</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}

          <Link href={destinationHref} className={styles.contextLink}>
            Vai alla sezione
          </Link>
        </div>
      </div>
    </article>
  );
};
