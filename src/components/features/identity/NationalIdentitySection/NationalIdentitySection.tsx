import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { NATIONAL_FORMAT_PILLARS } from '@/data/mock/lcsMockData';
import styles from './NationalIdentitySection.module.css';

const NATIONAL_CITIES = [
  { city: 'TORINO', cup: 'Mole Cup', slug: 'molecup', logo: '/logoCities/molecup.png' },
  { city: 'BRESCIA', cup: 'Leonessa Cup', slug: 'leonessacup', logo: '/logoCities/leonessacup.png' },
  { city: 'MONZA', cup: 'Ferrea Cup', slug: 'ferreacup', logo: '/logoCities/ferreacup.png' },
  { city: 'MODENA', cup: 'Olympius Cup', slug: 'olympiuscup', logo: '/logoCities/olympiuscup.png' },
  { city: 'CREMONA', cup: 'Turàs Cup', slug: 'turascup', logo: '/logoCities/turascup.png' },
  { city: 'NUOVO POLO', cup: 'Bora Cup', slug: 'boracup', logo: '/logoCities/boracup.png' }
];

export const NationalIdentitySection: React.FC = () => {
  return (
    <section
      id="identita-nazionale"
      className={styles.section}
      aria-labelledby="heading-identita-nazionale"
    >
      <div className={styles.container}>
        <SectionHeader
          eyebrow="IL FORMATO E LA MISSIONE LCS"
          scriptAccent="Format Ufficiale"
          title="IDENTITÀ NAZIONALE E"
          titleHighlight="Spirito d'Istituto"
          subtitle="La Lega Calcio Studenti trasforma la storica rivalità tra licei e istituti superiori in un campionato strutturato, regolamentato e raccontato con standard professionistici."
        />

        {/* I 3 Pilastri Ufficiali del Format LCS */}
        <div className={styles.pillarsGrid}>
          {NATIONAL_FORMAT_PILLARS.map((pillar) => (
            <article key={pillar.step} className={styles.pillarCard}>
              <div className={styles.pillarTop}>
                <span className={styles.pillarStep}>{pillar.step}</span>
                <span className={styles.pillarScriptBadge}>{pillar.scriptTag}</span>
              </div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDescription}>{pillar.description}</p>
            </article>
          ))}
        </div>

        {/* Blocco Scenografico: Manifesto Nazionale + Road to Knockout Day */}
        <div className={styles.manifestoPanel}>
          <div className={styles.manifestoCopy}>
            <div className={styles.manifestoBadges}>
              <Badge variant="aqua" size="md" dot>
                ROAD TO KNOCKOUT DAY
              </Badge>
              <Badge variant="outline" size="md">
                CIRCUITO INTER-SCOLASTICO ITALIANO
              </Badge>
            </div>

            <h3 className={styles.manifestoHeadline}>
              <span>SEI TORNEI, UN UNICO TRICOLORE: DAL GIRONE CITTADINO ALLE </span>
              <span className={styles.manifestoScriptWord}>Finali Nazionali.</span>
            </h3>

            <p className={styles.manifestoText}>
              Ogni istituto scende in campo con i propri colori, i propri capitani e la propria curva di studenti. Dalle qualificazioni cittadine fino al <strong>Knockout Day</strong> di fine stagione, la Lega Calcio Studenti promuove aggregazione, cultura sportiva e senso di appartenenza tra migliaia di ragazze e ragazzi in tutta Italia.
            </p>

            {/* Rete delle Sedi Territoriali */}
            <div className={styles.networkBox}>
              <span className={styles.networkLabel}>RETE UFFICIALE SEDI E COPPE LCS</span>
              <div className={styles.networkPills}>
                {NATIONAL_CITIES.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/competitions/${item.slug}`}
                    className={styles.networkPill}
                  >
                    <Image
                      src={item.logo}
                      alt=""
                      width={18}
                      height={18}
                      className={styles.networkLogo}
                    />
                    <span className={styles.networkCity}>{item.city}</span>
                    <span className={styles.networkCup}>{item.cup}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.manifestoActions}>
              <Button href="/contatti" variant="primary" size="lg">
                PORTA LCS NELLA TUA SCUOLA O CITTÀ
              </Button>
              <Button href="/squadre" variant="secondary" size="lg">
                ESPLORA GLI ISTITUTI PARTECIPANTI
              </Button>
            </div>
          </div>

          {/* Colonna Fotografica e Partner Istituzionali */}
          <div className={styles.manifestoVisual}>
            <div className={styles.photoCard}>
              <div className={styles.photoWrapper}>
                <Image
                  src="/eslHome/19.webp"
                  alt="Azione di gioco ufficiale sul prato verde durante un incontro della Lega Calcio Studenti"
                  fill
                  sizes="(max-width: 1080px) 100vw, 45vw"
                  className={styles.photo}
                />
                <div className={styles.photoOverlay} aria-hidden="true" />
                <div className={styles.photoBadgeBottom}>
                  <span className={styles.photoBadgeKicker}>FINALI NAZIONALI LCS</span>
                  <span className={styles.photoBadgeTitle}>
                    Le migliori 8 scuole della classifica generale si contendono il titolo
                  </span>
                </div>
              </div>
            </div>

            {/* Riquadro Partner & Supporto Tecnico */}
            <div className={styles.partnerBar}>
              <div className={styles.partnerInfo}>
                <span className={styles.partnerEyebrow}>ECOSISTEMA & PARTNER</span>
                <p className={styles.partnerText}>
                  Impianti omologati, arbitri federali, produzione media dedicata e partner al fianco dello sport studentesco.
                </p>
              </div>
              <div className={styles.partnerLogoBox}>
                <Image
                  src="/partners/supbres.webp"
                  alt="Partner ufficiale LCS"
                  width={90}
                  height={42}
                  className={styles.partnerLogo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
