'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/types/editorial';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { Badge } from '@/components/ui/Badge/Badge';
import { NewsCard } from '../NewsCard/NewsCard';
import styles from './EditorialGrid.module.css';

export interface EditorialGridProps {
  articles: NewsArticle[];
  className?: string;
}

const PHOTO_HIGHLIGHTS = [
  {
    id: 'hl-1',
    image: '/eslHome/13.jpeg',
    tag: 'CERIMONIA PRE-GARA',
    title: 'Ingresso in campo in notturna',
    caption: 'Terna arbitrale, fontane luminose e spalti gremiti per i big match cittadini.'
  },
  {
    id: 'hl-2',
    image: '/eslHome/20.webp',
    tag: 'AGONISMO IN CAMPO',
    title: 'La maglia del proprio istituto',
    caption: 'Ogni contrasto vale punti preziosi nella corsa verso la qualificazione nazionale.'
  },
  {
    id: 'hl-3',
    image: '/eslHome/19.webp',
    tag: 'TECNICA E TATTICA',
    title: 'Calcio vero sui campi regolamentari',
    caption: 'Partite ufficiali, riprese dedicate e statistiche di squadra aggiornate.'
  },
  {
    id: 'hl-4',
    image: '/eslHome/DSCF6614-Migliorato-NR.webp',
    tag: 'TIFO SCOLASTICO',
    title: 'Coreografie e cori delle tribune',
    caption: 'Centinaia di compagni di scuola trasformano ogni turno in una festa cittadina.'
  }
];

export const EditorialGrid: React.FC<EditorialGridProps> = ({
  articles,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const categories = ['ALL', ...Array.from(new Set(articles.map((a) => a.category)))];

  const filteredArticles = selectedCategory === 'ALL'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const featuredArticle = filteredArticles.find((a) => a.featured) || filteredArticles[0];
  const secondaryArticles = filteredArticles.filter((a) => a.id !== featuredArticle?.id);

  return (
    <section
      id="racconto-editoriale"
      className={`${styles.section} ${className}`}
      aria-labelledby="heading-editoriale"
    >
      <div className={styles.container}>
        <SectionHeader
          eyebrow="REDAZIONE LEGA CALCIO STUDENTI"
          scriptAccent="Diario di Lega"
          title="STORIE, NEWS E"
          titleHighlight="Momenti"
          subtitle="Il racconto settimanale dei tornei inter-liceali: cronache dai campi, focus sulle capolista, rivalità storiche e preparativi verso il Knockout Day."
          actionText="Esplora tutte le competizioni"
          actionHref="/competitions"
        />

        {/* Barra Filtro Categorie Editoriali */}
        <div className={styles.categoryBar} role="tablist" aria-label="Filtra articoli per categoria">
          <div className={styles.categoryList}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`${styles.catBtn} ${isSelected ? styles.catBtnActive : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'ALL' ? 'TUTTI I RACCONTI' : cat}
                </button>
              );
            })}
          </div>
          <span className={styles.demoNote}>
            Fotografie ufficiali LCS • Testi redazionali dimostrativi
          </span>
        </div>

        {/* Griglia Editoriale Asimmetrica */}
        {featuredArticle && (
          <div className={styles.editorialGrid}>
            <div className={styles.featuredColumn}>
              <NewsCard
                article={featuredArticle}
                featured
                onSelectArticle={setActiveArticle}
              />
            </div>

            {secondaryArticles.length > 0 && (
              <div className={styles.secondaryColumn}>
                {secondaryArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onSelectArticle={setActiveArticle}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Striscia Fotografie & Momenti Salienti dal Campo */}
        <div className={styles.highlightsBlock}>
          <div className={styles.highlightsHeader}>
            <div>
              <span className={styles.highlightsEyebrow}>GALLERIA UFFICIALE DAL CAMPO</span>
              <h3 className={styles.highlightsTitle}>ATMOSFERA E MOMENTI SALIENTI LCS</h3>
            </div>
            <Link href="/squadre" className={styles.highlightsLink}>
              Scopri tutti gli istituti protagonisti &rarr;
            </Link>
          </div>

          <div className={styles.highlightsGrid}>
            {PHOTO_HIGHLIGHTS.map((item) => (
              <figure key={item.id} className={styles.highlightCard}>
                <div className={styles.highlightImgWrap}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className={styles.highlightImg}
                  />
                  <span className={styles.highlightTag}>{item.tag}</span>
                </div>
                <figcaption className={styles.highlightCaption}>
                  <strong className={styles.highlightCardTitle}>{item.title}</strong>
                  <span className={styles.highlightCardDesc}>{item.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Modale di Lettura Approfondimento Editoriale */}
        {activeArticle && (
          <div
            className={styles.modalBackdrop}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-article-title"
            onClick={() => setActiveArticle(null)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalImageWrap}>
                <Image
                  src={activeArticle.coverImage.src}
                  alt={activeArticle.coverImage.alt || activeArticle.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className={styles.modalImage}
                />
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setActiveArticle(null)}
                  aria-label="Chiudi approfondimento"
                >
                  ✕ CHIUDI
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.modalMeta}>
                  <Badge variant="aqua" size="sm">{activeArticle.category}</Badge>
                  <span>{activeArticle.publishedAt}</span>
                  {activeArticle.city && <span>• {activeArticle.city}</span>}
                  {activeArticle.isDemoData && (
                    <span className={styles.modalDemoBadge}>ARTICOLO DIMOSTRATIVO</span>
                  )}
                </div>

                <h3 id="modal-article-title" className={styles.modalTitle}>
                  {activeArticle.title}
                </h3>

                <p className={styles.modalLead}>{activeArticle.excerpt}</p>

                <p className={styles.modalParagraph}>
                  La stagione 2025/26 della Lega Calcio Studenti prosegue sui campi regolamentari delle città aderenti al circuito. Ogni settimana le rappresentative d&apos;istituto si affrontano davanti alle proprie tifoserie scolastiche, accumulando punti validi sia per il trofeo cittadino sia per il piazzamento nella Classifica Generale Nazionale.
                </p>

                <div className={styles.modalActions}>
                  <Link
                    href={activeArticle.href || '/competitions'}
                    className={styles.modalPrimaryCta}
                    onClick={() => setActiveArticle(null)}
                  >
                    VAI ALLA SEZIONE CORRELATA &rarr;
                  </Link>
                  <button
                    type="button"
                    className={styles.modalSecondaryBtn}
                    onClick={() => setActiveArticle(null)}
                  >
                    Torna alla Homepage
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
