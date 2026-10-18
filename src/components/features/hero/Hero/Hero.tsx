'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import styles from './Hero.module.css';

export interface HeroStat {
  label: string;
  value: string | number;
  hint: string;
}

export interface HeroSlide {
  id: string;
  code: string;
  tabLabel: string;
  scriptTag: string;
  location: string;
  caption: string;
  src: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'match-night',
    code: '01',
    tabLabel: 'Cerimoniale di Gara',
    scriptTag: 'Notte di Gara',
    location: 'Turno Serale Ufficiale LCS',
    caption: 'L’ingresso in campo delle squadre liceali sotto i riflettori',
    src: '/eslHome/13.jpeg',
    alt: 'Giocatori della Lega Calcio Studenti fanno il loro ingresso sul campo illuminato di notte con fontane luminose e direttore di gara'
  },
  {
    id: 'pitch-side',
    code: '02',
    tabLabel: 'Identità di Maglia',
    scriptTag: 'Maglia & Onore',
    location: 'Bordo Campo — Fase Cittadina',
    caption: 'Difendere il nome del proprio istituto davanti a centinaia di compagni',
    src: '/eslHome/20.webp',
    alt: 'Calciatore studentesco di spalle davanti alla tribuna gremita di tifosi liceali'
  },
  {
    id: 'student-stands',
    code: '03',
    tabLabel: 'Passione sugli Spalti',
    scriptTag: 'Cuore Studentesco',
    location: 'Tifoserie Studentesche',
    caption: 'Cori, bandiere e colori scolastici: la spinta delle comunità liceali',
    src: '/eslHome/DSCF6614-Migliorato-NR.webp',
    alt: 'Spalti gremiti di studenti in festa con fumogeni colorati durante un incontro della lega'
  }
];

export interface HeroProps {
  stats?: HeroStat[];
}

const DEFAULT_STATS: HeroStat[] = [
  { label: 'Tornei Territoriali', value: '06', hint: 'Circuito nazionale attivo' },
  { label: 'Top Scuole in Classifica', value: '14', hint: 'Graduatoria generale LCS' },
  { label: 'Match in Archivio & Demo', value: '46+', hint: 'Calendario tornei cittadini' },
  { label: 'Fase Finale', value: 'KO', hint: 'Semifinali e finale secca' }
];

export const Hero: React.FC<HeroProps> = ({ stats = DEFAULT_STATS }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentSlide = HERO_SLIDES[activeIndex] || HERO_SLIDES[0];

  return (
    <section className={styles.hero} aria-label="Apertura principale Lega Calcio Studenti">
      <div className={styles.container}>
        {/* Composizione editoriale asimmetrica */}
        <div className={styles.editorialGrid}>
          {/* Colonna Tipografica & Manifesto */}
          <div className={styles.copyColumn}>
            <div className={styles.metaTop}>
              <Badge variant="blue" size="sm">
                LEGA NAZIONALE CALCIO A 11
              </Badge>
              <span className={styles.scriptMotto}>Il calcio dei licei</span>
            </div>

            <h1 className={styles.headline}>
              <span className={styles.headlineTop}>DOVE OGNI LICEO</span>
              <span className={styles.headlineAccent}>SCENDE IN CAMPO</span>
              <span className={styles.headlineBottom}>
                PER LA <span className={styles.headlineScriptWord}>Storia.</span>
              </span>
            </h1>

            <p className={styles.payoff}>
              <strong>Lega Calcio Studenti (LCS)</strong> riunisce i principali tornei calcistici
              studenteschi italiani in un unico circuito nazionale. Dalle sfide cittadine fino al
              prestigio del <em>Knockout Day</em>, valorizziamo lo sport scolastico e il senso di
              appartenenza di migliaia di studenti.
            </p>

            <div className={styles.ctaGroup}>
              <Button href="/competitions" variant="primary" size="lg">
                ESPLORA I TORNEI &rarr;
              </Button>
              <Button href="#risultati-classifiche" variant="outline" size="lg">
                RISULTATI &amp; CLASSIFICA
              </Button>
            </div>

            {/* Riferimento rapido ai tornei storici */}
            <div className={styles.featuredCupsNote}>
              <span className={styles.noteLabel}>COPPE UFFICIALI:</span>
              <div className={styles.noteLinks}>
                <Link href="/competitions/molecup" className={styles.noteLink}>Mole Cup</Link>
                <span className={styles.sep} aria-hidden="true">/</span>
                <Link href="/competitions/leonessacup" className={styles.noteLink}>Leonessa Cup</Link>
                <span className={styles.sep} aria-hidden="true">/</span>
                <Link href="/competitions/ferreacup" className={styles.noteLink}>Ferrea Cup</Link>
                <span className={styles.sep} aria-hidden="true">/</span>
                <Link href="/competitions/olympiuscup" className={styles.noteLink}>Olympius Cup</Link>
                <span className={styles.sep} aria-hidden="true">/</span>
                <Link href="/competitions/turascup" className={styles.noteLink}>Turàs Cup</Link>
              </div>
            </div>
          </div>

          {/* Colonna Fotografica Scenografica con selettore interattivo */}
          <div className={styles.stageColumn}>
            <div className={styles.photoFrame}>
              <div className={styles.imageAspect}>
                <Image
                  key={currentSlide.src}
                  src={currentSlide.src}
                  alt={currentSlide.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className={styles.stageImage}
                />
                {/* Overlay solido editoriale (nessun gradiente) */}
                <div className={styles.solidTint} aria-hidden="true" />
              </div>

              {/* Etichetta superiore su foto */}
              <div className={styles.photoBadgeBar}>
                <span className={styles.photoCode}>LCS // {currentSlide.code}</span>
                <span className={styles.photoLocation}>{currentSlide.location}</span>
              </div>

              {/* Didascalia inferiore solida con dettaglio Machton */}
              <div className={styles.photoCaptionBox}>
                <div className={styles.captionCopy}>
                  <span className={styles.captionScriptTag}>{currentSlide.scriptTag}</span>
                  <p className={styles.captionTitle}>{currentSlide.caption}</p>
                </div>
                <Link href="/partite" className={styles.captionLink}>
                  Vai al Match Center &rarr;
                </Link>
              </div>
            </div>

            {/* Controlli interattivi per cambiare fotografia autentica */}
            <div className={styles.slideSelector} role="tablist" aria-label="Seleziona scatto fotografico">
              {HERO_SLIDES.map((slide, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`${styles.slideTab} ${isSelected ? styles.slideTabActive : ''}`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <span className={styles.slideTabNum}>{slide.code}</span>
                    <span className={styles.slideTabText}>{slide.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Barra Statistiche & Numeri Chiave di Lega */}
        <div className={styles.statsStrip} aria-label="Numeri chiave Lega Calcio Studenti">
          {stats.map((stat, idx) => (
            <div key={stat.label} className={styles.statCell}>
              <div className={styles.statTop}>
                <span className={styles.statIndex}>0{idx + 1}</span>
                <span className={styles.statHint}>{stat.hint}</span>
              </div>
              <div className={styles.statMain}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
