import React from "react";
import Image from "next/image";
import { EDITORIAL_NEWS } from "@/data/homeData";
import { RevealOnScroll } from "@/components/RevealOnScroll/RevealOnScroll";
import styles from "./NewsSection.module.css";

export const NewsSection: React.FC = () => {
  const featuredArticle = EDITORIAL_NEWS[0];
  const secondaryArticles = EDITORIAL_NEWS.slice(1);

  return (
    <section
      id="news"
      className={`lcs-section ${styles.section}`}
      aria-labelledby="news-heading"
    >
      <div className="lcs-container">
        <RevealOnScroll>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.eyebrowRow}>
                <span className={styles.sidelineTick} aria-hidden="true" />
                <span className={styles.eyebrow}>REDAZIONE SPORTIVA LCS</span>
              </div>
              <h2 id="news-heading" className={styles.title}>
                <span>CRONACHE E </span>
                <span className={styles.titleScript}>Racconti</span>
              </h2>
            </div>

            <p className={styles.lead}>
              Dentro il campionato studentesco: le sfide serali, la passione
              delle curve d&apos;istituto e il cammino verso le finali nazionali.
            </p>
          </header>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className={styles.editorialGrid}>
            {/* Notizia Principale (Featured) */}
            {featuredArticle && (
              <article className={styles.featuredCard}>
                <a href={featuredArticle.href} className={styles.featuredLink}>
                  <div className={styles.featuredMedia}>
                    <Image
                      src={featuredArticle.image}
                      alt={featuredArticle.imageAlt}
                      fill
                      sizes="(max-width: 960px) 100vw, 58vw"
                      className={styles.articleImage}
                    />
                    <div className={styles.mediaShade} aria-hidden="true" />
                    <span className={styles.featuredBadge}>
                      {featuredArticle.category}
                    </span>
                  </div>

                  <div className={styles.featuredBody}>
                    <div className={styles.articleMeta}>
                      <span className={styles.cityTag}>
                        {featuredArticle.cityTag}
                      </span>
                      <span className={styles.metaDot} aria-hidden="true">
                        ·
                      </span>
                      <span>{featuredArticle.dateLabel}</span>
                      <span className={styles.metaDot} aria-hidden="true">
                        ·
                      </span>
                      <span>Lettura {featuredArticle.readTime}</span>
                    </div>

                    <h3 className={styles.featuredTitle}>
                      {featuredArticle.title}
                    </h3>

                    <p className={styles.featuredExcerpt}>
                      {featuredArticle.excerpt}
                    </p>

                    <span className={styles.readMore}>
                      <span>Leggi l&apos;approfondimento</span>
                      <span className={styles.readArrow} aria-hidden="true">
                        →
                      </span>
                    </span>
                  </div>
                </a>
              </article>
            )}

            {/* Notizie Secondarie */}
            <div className={styles.secondaryStack}>
              {secondaryArticles.map((article) => (
                <article key={article.id} className={styles.secondaryCard}>
                  <a href={article.href} className={styles.secondaryLink}>
                    <div className={styles.secondaryMedia}>
                      <Image
                        src={article.image}
                        alt={article.imageAlt}
                        fill
                        sizes="(max-width: 960px) 100vw, 35vw"
                        className={styles.articleImage}
                      />
                      <div className={styles.mediaShade} aria-hidden="true" />
                    </div>

                    <div className={styles.secondaryBody}>
                      <div className={styles.articleMeta}>
                        <span className={styles.cityTag}>
                          {article.category}
                        </span>
                        <span className={styles.metaDot} aria-hidden="true">
                          ·
                        </span>
                        <span>{article.readTime}</span>
                      </div>

                      <h3 className={styles.secondaryTitle}>{article.title}</h3>

                      <p className={styles.secondaryExcerpt}>
                        {article.excerpt}
                      </p>

                      <span className={styles.readMore}>
                        <span>Approfondisci</span>
                        <span className={styles.readArrow} aria-hidden="true">
                          →
                        </span>
                      </span>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
