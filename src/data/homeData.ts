export interface NavItem {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  index: string;
  title: string;
  cup: string;
  city: string;
  caption: string;
  image: string;
  imageAlt: string;
}

export interface TerritorialCompetition {
  id: string;
  name: string;
  city: string;
  regionTag: string;
  stageLabel: string;
  logo: string;
  image: string;
  href: string;
}

export interface MatchPreview {
  id: string;
  round: string;
  dateLabel: string;
  homeSchool: string;
  awaySchool: string;
  homeScore?: number;
  awayScore?: number;
  status: "FINALE" | "IN PROGRAMMA";
  venue: string;
}

export interface StandingRow {
  rank: number;
  school: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDiff: string;
  points: number;
  qualifiedZone?: boolean;
}

export interface TournamentSnapshot {
  id: string;
  cupName: string;
  city: string;
  logo: string;
  stageNote: string;
  matches: MatchPreview[];
  standings: StandingRow[];
}

export interface EditorialArticle {
  id: string;
  category: string;
  cityTag: string;
  dateLabel: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Competizioni", href: "#competizioni" },
  { label: "Risultati", href: "#risultati" },
  { label: "News", href: "#news" },
  { label: "La Lega", href: "#la-lega" },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "cerimoniale-notturno",
    index: "01",
    title: "L'ingresso in campo",
    cup: "Circuito Nazionale LCS",
    city: "Turno Serale",
    caption: "Riflettori accesi, terna arbitrale e colori d'istituto prima del fischio d'inizio.",
    image: "/eslHome/DSCF6614-Migliorato-NR.webp",
    imageAlt: "Ingresso in campo notturno delle squadre liceali con fontane luminose e arbitro",
  },
  {
    id: "agonismo-istituti",
    index: "02",
    title: "Orgoglio di maglia",
    cup: "Fase a Gironi Cittadina",
    city: "Sfida tra Licei",
    caption: "Ogni contrasto vale il primato cittadino e l'accesso al tabellone finale.",
    image: "/eslHome/20.webp",
    imageAlt: "Giocatori liceali schierati sul terreno di gioco durante una gara ufficiale LCS",
  },
  {
    id: "calore-spalti",
    index: "03",
    title: "La voce degli spalti",
    cup: "Rivalità Studentesca",
    city: "Curve d'Istituto",
    caption: "Cori, bandiere e compagni di scuola trasformano ogni impianto in uno stadio.",
    image: "/eslHome/19.webp",
    imageAlt: "Tifoseria studentesca sugli spalti durante una partita della Lega Calcio Studenti",
  },
];

export const TERRITORIAL_COMPETITIONS: TerritorialCompetition[] = [
  {
    id: "mole-cup",
    name: "Mole Cup",
    city: "Torino",
    regionTag: "Piemonte",
    stageLabel: "Fase a Gironi",
    logo: "/logoCities/molecup.png",
    image: "/backgroundCities/molecup.jpg",
    href: "#risultati",
  },
  {
    id: "leonessa-cup",
    name: "Leonessa Cup",
    city: "Brescia",
    regionTag: "Lombardia",
    stageLabel: "Fase a Gironi",
    logo: "/logoCities/leonessacup.png",
    image: "/backgroundCities/leonessacup.jpg",
    href: "#risultati",
  },
  {
    id: "ferrea-cup",
    name: "Ferrea Cup",
    city: "Monza",
    regionTag: "Lombardia",
    stageLabel: "Fase a Gironi",
    logo: "/logoCities/ferreacup.png",
    image: "/backgroundCities/ferreacup.jpg",
    href: "#risultati",
  },
  {
    id: "olympius-cup",
    name: "Olympius Cup",
    city: "Modena",
    regionTag: "Emilia-Romagna",
    stageLabel: "Fase a Gironi",
    logo: "/logoCities/olympiuscup.png",
    image: "/backgroundCities/olympiuscup.jpg",
    href: "#risultati",
  },
  {
    id: "turas-cup",
    name: "Turàs Cup",
    city: "Cremona",
    regionTag: "Lombardia",
    stageLabel: "Fase a Gironi",
    logo: "/logoCities/turascup.png",
    image: "/backgroundCities/turascup.jpg",
    href: "#risultati",
  },
  {
    id: "bora-cup",
    name: "Bora Cup",
    city: "Trieste",
    regionTag: "Friuli-Venezia Giulia",
    stageLabel: "Nuova Tappa",
    logo: "/logoCities/boracup.png",
    image: "/backgroundCities/boracup.jpg",
    href: "#risultati",
  },
];

export const COMPACT_LEAGUE_SNAPSHOTS: TournamentSnapshot[] = [
  {
    id: "mole-cup",
    cupName: "Mole Cup",
    city: "Torino",
    logo: "/logoCities/molecup.png",
    stageNote: "Girone Unico Cittadino · Giornata 03 (Dati dimostrativi)",
    matches: [
      {
        id: "to-1",
        round: "Giornata 3",
        dateLabel: "Ven 20:45",
        homeSchool: "Liceo Sant'Anna",
        awaySchool: "Liceo Valsalice",
        homeScore: 2,
        awayScore: 1,
        status: "FINALE",
        venue: "Centro Sportivo Cit Turin",
      },
      {
        id: "to-2",
        round: "Giornata 3",
        dateLabel: "Ven 21:45",
        homeSchool: "Liceo Cattaneo",
        awaySchool: "Liceo Galileo Ferraris",
        homeScore: 1,
        awayScore: 1,
        status: "FINALE",
        venue: "Centro Sportivo Cit Turin",
      },
      {
        id: "to-3",
        round: "Giornata 4",
        dateLabel: "Mer 20:30",
        homeSchool: "Liceo Massimo D'Azeglio",
        awaySchool: "Liceo Cavour",
        status: "IN PROGRAMMA",
        venue: "Campo Comunale Pozzo Strada",
      },
      {
        id: "to-4",
        round: "Giornata 4",
        dateLabel: "Gio 21:15",
        homeSchool: "Liceo Alfieri",
        awaySchool: "Liceo Gobetti",
        status: "IN PROGRAMMA",
        venue: "Campo Comunale Pozzo Strada",
      },
    ],
    standings: [
      { rank: 1, school: "Liceo Sant'Anna", played: 3, won: 3, drawn: 0, lost: 0, goalDiff: "+6", points: 9, qualifiedZone: true },
      { rank: 2, school: "Liceo Valsalice", played: 3, won: 2, drawn: 0, lost: 1, goalDiff: "+3", points: 6, qualifiedZone: true },
      { rank: 3, school: "Liceo Galileo Ferraris", played: 3, won: 1, drawn: 2, lost: 0, goalDiff: "+2", points: 5, qualifiedZone: true },
      { rank: 4, school: "Liceo Cattaneo", played: 3, won: 1, drawn: 1, lost: 1, goalDiff: "0", points: 4, qualifiedZone: true },
      { rank: 5, school: "Liceo Massimo D'Azeglio", played: 3, won: 1, drawn: 0, lost: 2, goalDiff: "-2", points: 3 },
      { rank: 6, school: "Liceo Cavour", played: 3, won: 0, drawn: 1, lost: 2, goalDiff: "-4", points: 1 },
    ],
  },
  {
    id: "leonessa-cup",
    cupName: "Leonessa Cup",
    city: "Brescia",
    logo: "/logoCities/leonessacup.png",
    stageNote: "Girone Unico Cittadino · Giornata 03 (Dati dimostrativi)",
    matches: [
      {
        id: "bs-1",
        round: "Giornata 3",
        dateLabel: "Sab 20:30",
        homeSchool: "Istituto Lunardi",
        awaySchool: "Liceo Leonardo",
        homeScore: 3,
        awayScore: 1,
        status: "FINALE",
        venue: "Centro Sportivo San Filippo",
      },
      {
        id: "bs-2",
        round: "Giornata 3",
        dateLabel: "Sab 21:30",
        homeSchool: "Liceo Calini",
        awaySchool: "Liceo Arnaldo",
        homeScore: 0,
        awayScore: 2,
        status: "FINALE",
        venue: "Centro Sportivo San Filippo",
      },
      {
        id: "bs-3",
        round: "Giornata 4",
        dateLabel: "Gio 20:30",
        homeSchool: "Istituto Tartaglia",
        awaySchool: "Liceo Copernico",
        status: "IN PROGRAMMA",
        venue: "Stadio Rigamonti Buffalora",
      },
      {
        id: "bs-4",
        round: "Giornata 4",
        dateLabel: "Ven 21:00",
        homeSchool: "Liceo Leonardo",
        awaySchool: "Liceo Arnaldo",
        status: "IN PROGRAMMA",
        venue: "Stadio Rigamonti Buffalora",
      },
    ],
    standings: [
      { rank: 1, school: "Istituto Lunardi", played: 3, won: 3, drawn: 0, lost: 0, goalDiff: "+7", points: 9, qualifiedZone: true },
      { rank: 2, school: "Liceo Arnaldo", played: 3, won: 2, drawn: 1, lost: 0, goalDiff: "+4", points: 7, qualifiedZone: true },
      { rank: 3, school: "Liceo Leonardo", played: 3, won: 2, drawn: 0, lost: 1, goalDiff: "+2", points: 6, qualifiedZone: true },
      { rank: 4, school: "Liceo Copernico", played: 3, won: 1, drawn: 1, lost: 1, goalDiff: "0", points: 4, qualifiedZone: true },
      { rank: 5, school: "Liceo Calini", played: 3, won: 0, drawn: 1, lost: 2, goalDiff: "-4", points: 1 },
      { rank: 6, school: "Istituto Tartaglia", played: 3, won: 0, drawn: 1, lost: 2, goalDiff: "-5", points: 1 },
    ],
  },
  {
    id: "olympius-cup",
    cupName: "Olympius Cup",
    city: "Modena",
    logo: "/logoCities/olympiuscup.png",
    stageNote: "Girone Unico Cittadino · Giornata 03 (Dati dimostrativi)",
    matches: [
      {
        id: "mo-1",
        round: "Giornata 3",
        dateLabel: "Ven 20:30",
        homeSchool: "Istituto Barozzi",
        awaySchool: "Istituto Corni",
        homeScore: 2,
        awayScore: 0,
        status: "FINALE",
        venue: "Polisportiva Saliceta",
      },
      {
        id: "mo-2",
        round: "Giornata 3",
        dateLabel: "Ven 21:30",
        homeSchool: "Liceo Tassoni",
        awaySchool: "Liceo Wiligelmo",
        homeScore: 2,
        awayScore: 2,
        status: "FINALE",
        venue: "Polisportiva Saliceta",
      },
      {
        id: "mo-3",
        round: "Giornata 4",
        dateLabel: "Mer 20:45",
        homeSchool: "Liceo Muratori San Carlo",
        awaySchool: "Istituto Fermi",
        status: "IN PROGRAMMA",
        venue: "Campo Manfredini",
      },
      {
        id: "mo-4",
        round: "Giornata 4",
        dateLabel: "Gio 21:15",
        homeSchool: "Istituto Corni",
        awaySchool: "Liceo Tassoni",
        status: "IN PROGRAMMA",
        venue: "Campo Manfredini",
      },
    ],
    standings: [
      { rank: 1, school: "Istituto Barozzi", played: 3, won: 3, drawn: 0, lost: 0, goalDiff: "+5", points: 9, qualifiedZone: true },
      { rank: 2, school: "Liceo Tassoni", played: 3, won: 2, drawn: 1, lost: 0, goalDiff: "+3", points: 7, qualifiedZone: true },
      { rank: 3, school: "Istituto Corni", played: 3, won: 1, drawn: 1, lost: 1, goalDiff: "+1", points: 4, qualifiedZone: true },
      { rank: 4, school: "Liceo Wiligelmo", played: 3, won: 1, drawn: 1, lost: 1, goalDiff: "0", points: 4, qualifiedZone: true },
      { rank: 5, school: "Liceo Muratori San Carlo", played: 3, won: 0, drawn: 1, lost: 2, goalDiff: "-3", points: 1 },
      { rank: 6, school: "Istituto Fermi", played: 3, won: 0, drawn: 0, lost: 3, goalDiff: "-6", points: 0 },
    ],
  },
];

export const EDITORIAL_NEWS: EditorialArticle[] = [
  {
    id: "editoriale-apertura-stagione",
    category: "STORIA DI COPERTINA",
    cityTag: "CIRCUITO NAZIONALE",
    dateLabel: "REDAZIONE LCS · CONTENUTO DIMOSTRATIVO",
    readTime: "3 min",
    title: "Sotto i riflettori della sera: quando il derby tra licei diventa il centro della città",
    excerpt:
      "Dalla Mole Cup di Torino alla Leonessa Cup di Brescia, gli impianti cittadini accolgono centinaia di compagni d'istituto per un campionato che unisce agonismo, appartenenza e cultura sportiva.",
    image: "/eslHome/20.webp",
    imageAlt: "Squadre liceali schierate in campo sotto i riflettori durante il turno serale LCS",
    featured: true,
    href: "#la-lega",
  },
  {
    id: "curve-studentesche",
    category: "CULTURA SUGLI SPALTI",
    cityTag: "TIFOSERIE D'ISTITUTO",
    dateLabel: "FOCUS · DEMO",
    readTime: "2 min",
    title: "Cori, striscioni e colori sociali: il rito collettivo delle tribune scolastiche",
    excerpt:
      "Dietro ogni undici titolare c'è un intero istituto che organizza la trasferta cittadina e sostiene i propri compagni per novanta minuti.",
    image: "/eslHome/19.webp",
    imageAlt: "Studenti sugli spalti con bandiere e cori durante una partita della Lega Calcio Studenti",
    href: "#competizioni",
  },
  {
    id: "verso-il-knockout-day",
    category: "FORMAT & REGOLAMENTO",
    cityTag: "FASE FINALE",
    dateLabel: "GUIDA · DEMO",
    readTime: "2 min",
    title: "Dai gironi cittadini al Knockout Day: come si conquista il titolo studentesco",
    excerpt:
      "Tre turni di qualificazione territoriale, classifica di merito e accesso diretto a semifinali e finale secca in un'unica giornata evento.",
    image: "/eslHome/13.jpeg",
    imageAlt: "Azione di gioco e celebrazione sul campo della Lega Calcio Studenti",
    href: "#risultati",
  },
];
