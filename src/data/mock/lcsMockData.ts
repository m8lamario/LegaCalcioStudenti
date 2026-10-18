/**
 * Lega Calcio Studenti (LCS) — Dataset Ufficiale & Contenuti Dimostrativi
 *
 * - Riutilizza gli asset fotografici e i loghi ufficiali presenti in /public.
 * - Preserva le 14 squadre e i punteggi ufficiali della Classifica Generale LCS.
 * - Identifica esplicitamente con `isDemoData: true` le partite e gli approfondimenti
 *   dimostrativi utilizzati come fallback quando il backend API non è raggiungibile.
 */

import { Competition } from '@/types/competitions';
import { Match } from '@/types/matches';
import { StandingRow } from '@/types/standings';
import { NewsArticle } from '@/types/editorial';
import { NavItem, CityNavItem } from '@/types/navigation';

export const CITY_NAVIGATION: CityNavItem[] = [
  {
    slug: 'molecup',
    name: 'Torino',
    cupName: 'Mole Cup',
    badgeUrl: '/logoCities/molecup.png',
    active: true
  },
  {
    slug: 'leonessacup',
    name: 'Brescia',
    cupName: 'Leonessa Cup',
    badgeUrl: '/logoCities/leonessacup.png',
    active: true
  },
  {
    slug: 'ferreacup',
    name: 'Monza',
    cupName: 'Ferrea Cup',
    badgeUrl: '/logoCities/ferreacup.png',
    active: true
  },
  {
    slug: 'olympiuscup',
    name: 'Modena',
    cupName: 'Olympius Cup',
    badgeUrl: '/logoCities/olympiuscup.png',
    active: true
  },
  {
    slug: 'turascup',
    name: 'Cremona',
    cupName: 'Turàs Cup',
    badgeUrl: '/logoCities/turascup.png',
    active: true
  },
  {
    slug: 'boracup',
    name: 'Sud / Nazionale',
    cupName: 'Bora Cup',
    badgeUrl: '/logoCities/boracup.png',
    active: true
  }
];

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Competizioni', href: '/competitions' },
  { label: 'Partite', href: '/partite' },
  { label: 'Classifica', href: '/classifica' },
  { label: 'Squadre', href: '/squadre' },
  { label: 'Contatti', href: '/contatti' }
];

export const TERRITORIAL_COMPETITIONS: Competition[] = [
  {
    id: 'molecup',
    slug: 'molecup',
    name: 'Mole Cup',
    title: 'Mole Cup',
    subtitle: 'Torneo interscolastico dei licei torinesi',
    city: 'Torino',
    edition: 'Edizione Ufficiale',
    season: 'Stagione 2025/26',
    teamsCount: 24,
    matchesCount: 46,
    activeStatus: 'active',
    venue: 'Impianti CUS Torino — Grugliasco',
    logoImage: '/logoCities/molecup.png',
    bannerImage: '/backgroundCities/molecup.jpg'
  },
  {
    id: 'leonessacup',
    slug: 'leonessacup',
    name: 'Leonessa Cup',
    title: 'Leonessa Cup',
    subtitle: 'Campionato studentesco degli istituti di Brescia',
    city: 'Brescia',
    edition: 'Edizione Ufficiale',
    season: 'Stagione 2025/26',
    teamsCount: 16,
    matchesCount: 32,
    activeStatus: 'active',
    venue: 'Centro Sportivo Cittadino — Brescia',
    logoImage: '/logoCities/leonessacup.png',
    bannerImage: '/backgroundCities/leonessacup.jpg'
  },
  {
    id: 'ferreacup',
    slug: 'ferreacup',
    name: 'Ferrea Cup',
    title: 'Ferrea Cup',
    subtitle: 'Sfida tra i licei e gli istituti del territorio',
    city: 'Monza',
    edition: 'Edizione Ufficiale',
    season: 'Stagione 2025/26',
    teamsCount: 12,
    matchesCount: 24,
    activeStatus: 'active',
    venue: 'Impianto Sportivo Territoriale — Monza',
    logoImage: '/logoCities/ferreacup.png',
    bannerImage: '/backgroundCities/ferreacup.jpg'
  },
  {
    id: 'olympiuscup',
    slug: 'olympiuscup',
    name: 'Olympius Cup',
    title: 'Olympius Cup',
    subtitle: 'Girone liceale territoriale emiliano',
    city: 'Modena',
    edition: 'Edizione Ufficiale',
    season: 'Stagione 2025/26',
    teamsCount: 12,
    matchesCount: 22,
    activeStatus: 'active',
    venue: 'Polo Sportivo Studentesco — Modena',
    logoImage: '/logoCities/olympiuscup.png',
    bannerImage: '/backgroundCities/olympiuscup.jpg'
  },
  {
    id: 'turascup',
    slug: 'turascup',
    name: 'Turàs Cup',
    title: 'Turàs Cup',
    subtitle: 'Torneo cittadino delle scuole secondarie superiori',
    city: 'Cremona',
    edition: 'Edizione Ufficiale',
    season: 'Stagione 2025/26',
    teamsCount: 10,
    matchesCount: 18,
    activeStatus: 'active',
    venue: 'Campo Sportivo Comunale — Cremona',
    logoImage: '/logoCities/turascup.png',
    bannerImage: '/backgroundCities/turascup.jpg'
  },
  {
    id: 'boracup',
    slug: 'boracup',
    name: 'Bora Cup',
    title: 'Bora Cup',
    subtitle: 'Nuova tappa territoriale del circuito nazionale LCS',
    city: 'Nuovo Polo',
    edition: 'Espansione LCS',
    season: 'Stagione 2025/26',
    teamsCount: 8,
    matchesCount: 15,
    activeStatus: 'upcoming',
    venue: 'Sede in via di ufficializzazione',
    logoImage: '/logoCities/boracup.png',
    bannerImage: '/backgroundCities/boracup.jpg'
  }
];

/**
 * Graduatoria ufficiale presente in src/app/page.js (14 scuole in classifica generale)
 */
export const OFFICIAL_HOME_STANDINGS: StandingRow[] = [
  {
    position: 1,
    team: {
      name: 'Lunardi',
      shortName: 'LUN',
      city: 'Brescia',
      competitionSlug: 'leonessacup',
      competitionName: 'Leonessa Cup',
      logo: '/logoCities/leonessacup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+12',
    points: 9,
    qualificationZone: 'podium'
  },
  {
    position: 2,
    team: {
      name: 'Barozzi',
      shortName: 'BAR',
      city: 'Modena',
      competitionSlug: 'olympiuscup',
      competitionName: 'Olympius Cup',
      logo: '/logoCities/olympiuscup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+7',
    points: 9,
    qualificationZone: 'podium'
  },
  {
    position: 3,
    team: {
      name: 'Leonardo',
      shortName: 'LEO',
      city: 'Brescia',
      competitionSlug: 'leonessacup',
      competitionName: 'Leonessa Cup',
      logo: '/logoCities/leonessacup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+6',
    points: 9,
    qualificationZone: 'podium'
  },
  {
    position: 4,
    team: {
      name: 'Aselli',
      shortName: 'ASE',
      city: 'Cremona',
      competitionSlug: 'turascup',
      competitionName: 'Turàs Cup',
      logo: '/logoCities/turascup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+4',
    points: 9,
    qualificationZone: 'knockout'
  },
  {
    position: 5,
    team: {
      name: 'Cattaneo',
      shortName: 'CAT',
      city: 'Torino',
      competitionSlug: 'molecup',
      competitionName: 'Mole Cup',
      logo: '/logoCities/molecup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+4',
    points: 9,
    qualificationZone: 'knockout'
  },
  {
    position: 6,
    team: {
      name: 'Luzzago',
      shortName: 'LUZ',
      city: 'Brescia',
      competitionSlug: 'leonessacup',
      competitionName: 'Leonessa Cup',
      logo: '/logoCities/leonessacup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+19',
    points: 8,
    qualificationZone: 'knockout'
  },
  {
    position: 7,
    team: {
      name: 'Curie Levi',
      shortName: 'CLE',
      city: 'Torino',
      competitionSlug: 'molecup',
      competitionName: 'Mole Cup',
      logo: '/logoCities/molecup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+15',
    points: 8,
    qualificationZone: 'knockout'
  },
  {
    position: 8,
    team: {
      name: 'Galfer',
      shortName: 'GAL',
      city: 'Torino',
      competitionSlug: 'molecup',
      competitionName: 'Mole Cup',
      logo: '/logoCities/molecup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+7',
    points: 8,
    qualificationZone: 'knockout'
  },
  {
    position: 9,
    team: {
      name: 'Calvesi Baracca',
      shortName: 'CBA',
      city: 'Brescia',
      competitionSlug: 'leonessacup',
      competitionName: 'Leonessa Cup',
      logo: '/logoCities/leonessacup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+7',
    points: 8,
    qualificationZone: 'playoff'
  },
  {
    position: 10,
    team: {
      name: 'Valsalice',
      shortName: 'VAL',
      city: 'Torino',
      competitionSlug: 'molecup',
      competitionName: 'Mole Cup',
      logo: '/logoCities/molecup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+5',
    points: 8,
    qualificationZone: 'playoff'
  },
  {
    position: 11,
    team: {
      name: 'Brera',
      shortName: 'BRE',
      city: 'Monza',
      competitionSlug: 'ferreacup',
      competitionName: 'Ferrea Cup',
      logo: '/logoCities/ferreacup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+5',
    points: 8,
    qualificationZone: 'playoff'
  },
  {
    position: 12,
    team: {
      name: 'Santanna',
      shortName: 'SAN',
      city: 'Torino',
      competitionSlug: 'molecup',
      competitionName: 'Mole Cup',
      logo: '/logoCities/molecup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+4',
    points: 8,
    qualificationZone: 'playoff'
  },
  {
    position: 13,
    team: {
      name: 'Corni',
      shortName: 'COR',
      city: 'Modena',
      competitionSlug: 'olympiuscup',
      competitionName: 'Olympius Cup',
      logo: '/logoCities/olympiuscup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+4',
    points: 8,
    qualificationZone: 'neutral'
  },
  {
    position: 14,
    team: {
      name: 'Alfieri',
      shortName: 'ALF',
      city: 'Torino',
      competitionSlug: 'molecup',
      competitionName: 'Mole Cup',
      logo: '/logoCities/molecup.png'
    },
    record: '3-0',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalDifference: '+2',
    points: 8,
    qualificationZone: 'neutral'
  }
];

/**
 * Incontri dimostrativi per il Match Center (identificati da `isDemoData: true`
 * finché il feed API live non espone le partite della giornata corrente).
 */
export const DEMO_FEATURED_MATCHES: Match[] = [
  {
    id: 'lp-live',
    stage: 'Fase Cittadina — Girone Unico',
    matchday: 'Giornata 4 (Esempio)',
    competitionSlug: 'molecup',
    competitionName: 'Mole Cup',
    date: 'In programma',
    time: '20:30',
    home: {
      name: 'Santanna',
      shortName: 'SAN',
      city: 'Torino',
      logo: '/logoCities/molecup.png'
    },
    away: {
      name: 'Valsalice',
      shortName: 'VAL',
      city: 'Torino',
      logo: '/logoCities/molecup.png'
    },
    status: 'SCHEDULED',
    isLive: false,
    venue: 'CUS Torino — Grugliasco',
    isDemoData: true
  },
  {
    id: 'lp-semi',
    stage: 'Fase Cittadina — Girone Unico',
    matchday: 'Giornata 4 (Esempio)',
    competitionSlug: 'leonessacup',
    competitionName: 'Leonessa Cup',
    date: 'In programma',
    time: '19:00',
    home: {
      name: 'Lunardi',
      shortName: 'LUN',
      city: 'Brescia',
      logo: '/logoCities/leonessacup.png'
    },
    away: {
      name: 'Leonardo',
      shortName: 'LEO',
      city: 'Brescia',
      logo: '/logoCities/leonessacup.png'
    },
    status: 'SCHEDULED',
    isLive: false,
    venue: 'Centro Sportivo — Brescia',
    isDemoData: true
  },
  {
    id: 'lp-finale',
    stage: 'Fase Cittadina — Girone Unico',
    matchday: 'Giornata 4 (Esempio)',
    competitionSlug: 'olympiuscup',
    competitionName: 'Olympius Cup',
    date: 'In programma',
    time: '18:30',
    home: {
      name: 'Barozzi',
      shortName: 'BAR',
      city: 'Modena',
      logo: '/logoCities/olympiuscup.png'
    },
    away: {
      name: 'Corni',
      shortName: 'COR',
      city: 'Modena',
      logo: '/logoCities/olympiuscup.png'
    },
    status: 'SCHEDULED',
    isLive: false,
    venue: 'Polo Sportivo — Modena',
    isDemoData: true
  },
  {
    id: 'demo-match-4',
    stage: 'Fase Cittadina — Girone Unico',
    matchday: 'Giornata 4 (Esempio)',
    competitionSlug: 'molecup',
    competitionName: 'Mole Cup',
    date: 'In programma',
    time: '21:00',
    home: {
      name: 'Cattaneo',
      shortName: 'CAT',
      city: 'Torino',
      logo: '/logoCities/molecup.png'
    },
    away: {
      name: 'Galfer',
      shortName: 'GAL',
      city: 'Torino',
      logo: '/logoCities/molecup.png'
    },
    status: 'SCHEDULED',
    isLive: false,
    venue: 'CUS Torino — Grugliasco',
    isDemoData: true
  },
  {
    id: 'demo-match-5',
    stage: 'Fase Cittadina — Girone Unico',
    matchday: 'Giornata 4 (Esempio)',
    competitionSlug: 'turascup',
    competitionName: 'Turàs Cup',
    date: 'In programma',
    time: '17:45',
    home: {
      name: 'Aselli',
      shortName: 'ASE',
      city: 'Cremona',
      logo: '/logoCities/turascup.png'
    },
    away: {
      name: 'Brera',
      shortName: 'BRE',
      city: 'Monza',
      logo: '/logoCities/ferreacup.png'
    },
    status: 'SCHEDULED',
    isLive: false,
    venue: 'Campo Comunale — Cremona',
    isDemoData: true
  }
];

/**
 * Articoli e Momenti Salienti Editoriali (con fotografie autentiche LCS da /public/eslHome/)
 */
export const EDITORIAL_HIGHLIGHTS: NewsArticle[] = [
  {
    id: 'editorial-1',
    slug: 'atmosfera-notturna-ingresso-in-campo-lcs',
    title: 'Luci dei riflettori e orgoglio d’istituto: il calcio dei licei entra nel vivo',
    subtitle: 'Dal tunnel degli spogliatoi al boato delle tribune studentesche: il racconto della stagione.',
    excerpt:
      'Ogni settimana gli impianti cittadini si trasformano in arene gremite di compagni di scuola. Scopri il formato dei gironi dinamici e il cammino che porta le migliori squadre verso il Knockout Day nazionale.',
    publishedAt: 'Contenuto Editoriale Demo',
    category: 'CRONACA GARA',
    competitionSlug: 'molecup',
    competitionName: 'Mole Cup',
    city: 'Torino',
    featured: true,
    isDemoData: true,
    href: '/competitions/molecup',
    readTimeMinutes: 4,
    coverImage: {
      src: '/eslHome/13.jpeg',
      alt: 'Ingresso in campo notturno dei giocatori della Lega Calcio Studenti tra fontane luminose e direttore di gara',
      caption: 'Ingresso in campo ufficiale durante il turno serale — Archivio fotografico LCS'
    }
  },
  {
    id: 'editorial-2',
    slug: 'tifo-studentesco-spalti-colorati',
    title: 'Oltre il novantesimo: il calore delle curve scolastiche accende i tornei cittadini',
    excerpt:
      'Cori, bandiere d’istituto e partecipazione: come i tornei territoriali uniscono studenti, docenti e intere comunità liceali sugli spalti.',
    publishedAt: 'Contenuto Editoriale Demo',
    category: 'CULTURA SPORTIVA',
    competitionSlug: 'leonessacup',
    competitionName: 'Leonessa Cup',
    city: 'Brescia',
    isDemoData: true,
    href: '/competitions/leonessacup',
    readTimeMinutes: 3,
    coverImage: {
      src: '/eslHome/DSCF6614-Migliorato-NR.webp',
      alt: 'Tifoseria studentesca sugli spalti con fumogeni rossoblù durante una gara LCS',
      caption: 'Il pubblico studentesco sugli spalti — Archivio fotografico LCS'
    }
  },
  {
    id: 'editorial-3',
    slug: 'identita-di-maglia-sfida-sul-campo',
    title: 'Difendere i colori della propria scuola: identità e agonismo in campo',
    excerpt:
      'Dietro ogni maglia c’è un liceo intero. Il racconto ravvicinato dei protagonisti a bordo campo prima del fischio d’inizio.',
    publishedAt: 'Contenuto Editoriale Demo',
    category: 'TORNEI CITTADINI',
    competitionSlug: 'molecup',
    competitionName: 'Mole Cup',
    city: 'Torino',
    isDemoData: true,
    href: '/squadre',
    readTimeMinutes: 3,
    coverImage: {
      src: '/eslHome/20.webp',
      alt: 'Giocatore di spalle con maglia numero 5 davanti alla tribuna gremita di studenti',
      caption: 'Bordo campo prima del calcio d’inizio — Archivio fotografico LCS'
    }
  },
  {
    id: 'editorial-4',
    slug: 'formato-knockout-day-finali-nazionali',
    title: 'Road to Knockout Day: come funziona la qualificazione alla fase finale',
    excerpt:
      'Tre giornate di girone cittadino, classifica unica e accesso diretto a semifinali e finale secca nella giornata conclusiva della stagione.',
    publishedAt: 'Contenuto Editoriale Demo',
    category: 'KNOCKOUT DAY',
    competitionName: 'Circuito Nazionale',
    city: 'Italia',
    isDemoData: true,
    href: '/classifica',
    readTimeMinutes: 5,
    coverImage: {
      src: '/eslHome/19.webp',
      alt: 'Dettaglio del pallone e scarpino sul manto erboso durante un incontro ufficiale LCS',
      caption: 'Terreno di gioco ufficiale — Archivio fotografico LCS'
    }
  }
];

export const NATIONAL_FORMAT_PILLARS = [
  {
    step: '01',
    title: 'Gironi Dinamici Cittadini',
    scriptTag: 'Fase Territoriale',
    description:
      'Ogni città struttura i propri gironi in base alle scuole superiori iscritte, con calendario ufficiale e classifiche aggiornate settimanalmente.'
  },
  {
    step: '02',
    title: 'Cronache & Match Center',
    scriptTag: 'Tempo Reale',
    description:
      'Timeline degli eventi, marcatori e punteggi vengono seguiti per raccontare ogni sfida come un grande campionato professionistico.'
  },
  {
    step: '03',
    title: 'Knockout Day Nazionale',
    scriptTag: 'Fase Finale',
    description:
      'Le migliori squadre dei tornei territoriali accedono a semifinali e finale secca in una giornata evento dedicata a decretare i campioni.'
  }
];
