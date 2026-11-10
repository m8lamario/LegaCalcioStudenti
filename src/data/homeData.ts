export interface NavItem {
  label: string;
  href: string;
}

export interface HeroImage {
  id: string;
  image: string;
  imageAlt: string;
}

export interface LocalCompetition {
  id: string;
  slug: string;
  name: string;
  city?: string;
  regionTag?: string;
  stageLabel?: string;
  logo?: string;
  image?: string;
  imageAlt?: string;
  description?: string;
  /** Coordinate della città di riferimento: senza, la competizione non compare sulla mappa. */
  coordinates?: { lat: number; lon: number };
  /** Posizione del logo rispetto alla città, in unità della mappa (`ITALY_MAP`). */
  mapCallout?: { dx: number; dy: number };
}

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href?: string;
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

export const COLLABORA_NAV_ITEM: NavItem = {
  label: "Collabora",
  href: "/collabora",
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Competizioni", href: "/#competizioni" },
  { label: "News", href: "/#news" },
  { label: "Mission", href: "/#mission" },
  COLLABORA_NAV_ITEM,
];

export function withCollaboraNav(items: NavItem[]): NavItem[] {
  const source = items.length > 0 ? items : NAV_ITEMS;
  if (source.some((item) => item.href === COLLABORA_NAV_ITEM.href)) {
    return source;
  }
  const next = source.filter((item) => item.href !== "/#partner");
  const afterMission = next.findIndex((item) => item.href.includes("#mission"));
  if (afterMission >= 0) {
    return [
      ...next.slice(0, afterMission + 1),
      COLLABORA_NAV_ITEM,
      ...next.slice(afterMission + 1),
    ];
  }
  return [...next, COLLABORA_NAV_ITEM];
}

export const HERO_IMAGES: HeroImage[] = [
  {
    id: "cerimoniale-notturno",
    image: "/eslHome/DSCF6614-Migliorato-NR.webp",
    imageAlt:
      "Squadre liceali in campo di sera, con fontane luminose e la terna arbitrale",
  },
  {
    id: "ingresso-in-campo",
    image: "/eslHome/13.jpeg",
    imageAlt:
      "Giocatori liceali entrano in campo di sera, tra fontane luminose, prima del fischio d'inizio",
  },
  {
    id: "agonismo-istituti",
    image: "/eslHome/20.webp",
    imageAlt:
      "Giocatori liceali schierati sul terreno di gioco durante una gara della Lega Calcio Studenti",
  },
  {
    id: "calore-spalti",
    image: "/eslHome/19.webp",
    imageAlt:
      "Studenti sugli spalti durante una partita della Lega Calcio Studenti",
  },
];

export function mergeHeroImages(current: HeroImage[]): HeroImage[] {
  if (current.length === 0) return HERO_IMAGES;
  const byId = new Map(current.map((item) => [item.id, item]));
  const ordered = HERO_IMAGES.map((item) => byId.get(item.id) ?? item);
  const extras = current.filter(
    (item) => !HERO_IMAGES.some((canonical) => canonical.id === item.id),
  );
  return extras.length > 0 ? [...ordered, ...extras] : ordered;
}

export const SITE_MOTTO = "Una lega. Tante città. Un'unica passione.";

export const MISSION_LINES = [
  { id: "lega", text: "Una lega.", tone: "display" },
  { id: "citta", text: "Tante città.", tone: "display" },
  { id: "passione", text: "Un'unica passione.", tone: "script" },
] as const;

/**
 * Testo di identità già presente nel sito.
 * Sostituire `statement` quando sarà disponibile la dichiarazione ufficiale.
 */
export const MISSION = {
  id: "mission",
  eyebrow: "Chi siamo",
  statement:
    "Lega Calcio Studenti riunisce i tornei calcistici inter-scolastici italiani sotto un'unica identità sportiva, valorizzando il senso di appartenenza ai licei e agli istituti superiori.",
};

export const MISSION_PILLARS = [
  {
    index: "01",
    title: "Competizioni locali",
    text: "Coppe cittadine, radicate nel territorio.",
  },
  {
    index: "02",
    title: "Circuiti nazionali",
    text: "I tornei inter-scolastici riuniti sotto un'unica identità sportiva.",
  },
  {
    index: "03",
    title: "Finali nazionali",
    text: "I migliori istituti conquistano sul campo la qualificazione.",
  },
] as const;

export const SCHOOL_INVITE = {
  id: "scuole",
  concept: "Porta la tua scuola in campo",
  titleLines: ["La prossima squadra", "potrebbe essere", "la tua"] as const,
  statement:
    "La tua scuola ha una squadra? Oppure vuoi crearne una? Entra nel circuito Lega Calcio Studenti e porta il tuo istituto a competere con le altre scuole. Scopri le competizioni disponibili e diventa protagonista della prossima stagione.",
  ctaLabel: "Candida la tua scuola",
  ctaHref: "https://registration.legacalciostudenti.com/",
  closer: "Un'unica lega. Tante città. La tua scuola.",
} as const;

export interface CircuitStat {
  id: string;
  value: string;
  label: string;
  note?: string;
}

/**
 * Solo cifre verificabili in produzione. Valori sotto contrassegnati come test
 * servono a verificare il layout; sostituirli prima della pubblicazione.
 */
export const CIRCUIT_STATS: CircuitStat[] = [
  {
    id: "schools",
    value: "120+",
    label: "Scuole partecipanti",
    note: "Anteprima layout · dato di test",
  },
  {
    id: "students",
    value: "2.400+",
    label: "Studenti coinvolti",
    note: "Anteprima layout · dato di test",
  },
  {
    id: "cities",
    value: "6",
    label: "Città del circuito",
    note: "Coppe con sede territoriale pubblicata",
  },
  {
    id: "competitions",
    value: "6",
    label: "Competizioni organizzate",
    note: "Elenco competizioni locali + Colosseo Cup",
  },
  {
    id: "matches",
    value: "180+",
    label: "Partite disputate",
    note: "Anteprima layout · dato di test",
  },
];

export const PARTNER_KINDS = [
  "istituzionale",
  "sponsor",
  "media",
  "tecnico",
] as const;

export type PartnerKind = (typeof PARTNER_KINDS)[number];

export const PARTNER_KIND_LABELS: Record<PartnerKind, string> = {
  istituzionale: "Partner istituzionali",
  sponsor: "Sponsor",
  media: "Media partner",
  tecnico: "Collaborazioni tecniche",
};

export interface CircuitPartner {
  id: string;
  name: string;
  kind: PartnerKind;
  logo?: string;
  href?: string;
}

export const COLLABORATION_PAGE = {
  eyebrow: "Al fianco del circuito",
  titleLead: "Collabora",
  titleScript: "con LCS",
  lead: "Istituzioni, sponsor, media e realtà tecniche possono sostenere il circuito e far crescere le coppe cittadine.",
  meaning:
    "Ogni collaborazione resta visibile sul campo, nelle coppe e nei racconti della Lega Calcio Studenti.",
  opportunities: [
    {
      index: "01",
      title: "Istituzioni",
      text: "Enti e territori che riconoscono il valore educativo e sportivo delle coppe cittadine.",
    },
    {
      index: "02",
      title: "Sponsor",
      text: "Marchi che accompagnano le squadre, gli eventi e la stagione del circuito.",
    },
    {
      index: "03",
      title: "Media",
      text: "Redazioni e voci che raccontano partite, istituti e il cammino verso le finali.",
    },
    {
      index: "04",
      title: "Tecnico",
      text: "Piattaforme e servizi che rendono possibile organizzare, iscriversi e comunicare.",
    },
  ],
  ctaLabel: "Contatti",
  ctaHref: "/contatti",
} as const;

/**
 * Collaborazioni reali in produzione. Voci di test per anteprima UI — rimuovere o
 * sostituire prima del go-live. `logo` in /public, `href` facoltativo.
 */
export const CIRCUIT_PARTNERS: CircuitPartner[] = [
  {
    id: "lcs-identity",
    name: "Lega Calcio Studenti",
    kind: "istituzionale",
    logo: "/logoCities/lcsw.png",
    href: "/#mission",
  },
  {
    id: "partner-gold-test",
    name: "Partner gold (test)",
    kind: "sponsor",
    logo: "/logoCities/molecup.png",
  },
  {
    id: "partner-silver-test",
    name: "Partner silver (test)",
    kind: "sponsor",
    logo: "/logoCities/leonessacup.png",
  },
  {
    id: "media-test",
    name: "Redazione LCS (test)",
    kind: "media",
  },
  {
    id: "registration-platform",
    name: "Registrazione scuole",
    kind: "tecnico",
    href: "https://registration.legacalciostudenti.com/",
  },
];

export const NATIONAL_FINALS = {
  id: "finali",
  href: "/finali-nazionali",
  eyebrow: "Un solo circuito",
  titleLead: "Verso le",
  titleScript: "finali nazionali",
  lead: "Le coppe cittadine di Lega Calcio Studenti non sono tornei isolati. Appartengono a un'unica lega: ogni istituto costruisce la propria stagione nella competizione del territorio, con l'orizzonte delle finali nazionali.",
  steps: [
    {
      index: "01",
      title: "Competizioni territoriali",
      text: "Ogni coppa resta legata alla propria città e alla propria identità, dentro lo stesso circuito.",
    },
    {
      index: "02",
      title: "Il percorso delle squadre",
      text: "La stagione si gioca nelle competizioni locali. È lì che una scuola misura il proprio cammino.",
    },
    {
      index: "03",
      title: "L'appuntamento nazionale",
      text: "Le finali riuniscono gli istituti che conquistano sul campo la qualificazione.",
    },
  ],
  ctaLabel: "Le finali nazionali",
  pageEyebrow: "Lega Calcio Studenti",
  pageTitleLead: "Finali",
  pageTitleScript: "nazionali",
  pageLead:
    "Le competizioni territoriali sono tappe di un progetto più ampio. Le finali nazionali sono l'appuntamento in cui il circuito si ritrova, oltre la singola città.",
  pageMeaning:
    "Per le scuole partecipanti, arrivare alle finali significa portare l'istituto oltre il proprio territorio e misurarsi con le altre realtà della lega.",
  unpublishedNote:
    "Format, criteri di qualificazione, date e regolamento non sono ancora pubblicati: compariranno su questa pagina quando saranno definiti.",
} as const;

/** Recapiti ufficiali. Vuoto finché non sono presenti nel progetto. */
export const CONTACT_CHANNELS: ContactChannel[] = [];

export const LOCAL_COMPETITIONS: LocalCompetition[] = [
  {
    id: "mole-cup",
    slug: "mole-cup",
    name: "Mole Cup",
    city: "Torino",
    regionTag: "Piemonte",
    stageLabel: "Fase a Gironi",
    logo: "/logoCities/molecup.png",
    image: "/backgroundCities/molecup.png",
    imageAlt: "Atmosfera della Mole Cup a Torino",
    coordinates: { lat: 45.0703, lon: 7.6869 },
    mapCallout: { dx: -150, dy: 10 },
  },
  {
    id: "leonessa-cup",
    slug: "leonessa-cup",
    name: "Leonessa Cup",
    city: "Brescia",
    regionTag: "Lombardia",
    stageLabel: "Fase a Gironi",
    logo: "/logoCities/leonessacup.png",
    image: "/backgroundCities/leonessacup.jpg",
    imageAlt: "Atmosfera della Leonessa Cup a Brescia",
    coordinates: { lat: 45.5416, lon: 10.2118 },
    mapCallout: { dx: 95, dy: -175 },
  },
  {
    id: "ferrea-cup",
    slug: "ferrea-cup",
    name: "Ferrea Cup",
    city: "Monza",
    regionTag: "Lombardia",
    stageLabel: "Fase a Gironi",
    logo: "/logoCities/ferreacup.png",
    image: "/backgroundCities/ferreacup.jpg",
    imageAlt: "Atmosfera della Ferrea Cup a Monza",
    coordinates: { lat: 45.5845, lon: 9.2744 },
    mapCallout: { dx: -95, dy: -175 },
  },
  {
    id: "olympius-cup",
    slug: "olympius-cup",
    name: "Olympius Cup",
    city: "Modena",
    regionTag: "Emilia-Romagna",
    stageLabel: "Fase a Gironi",
    logo: "/logoCities/olympiuscup.png",
    image: "/backgroundCities/olympiuscup.jpg",
    imageAlt: "Atmosfera della Olympius Cup a Modena",
    coordinates: { lat: 44.6471, lon: 10.9252 },
    mapCallout: { dx: 190, dy: 5 },
  },
  {
    id: "turas-cup",
    slug: "turas-cup",
    name: "Turàs Cup",
    city: "Cremona",
    regionTag: "Lombardia",
    stageLabel: "Fase a Gironi",
    logo: "/logoCities/turascup.png",
    image: "/backgroundCities/turascup.png",
    imageAlt: "Atmosfera della Turàs Cup a Cremona",
    coordinates: { lat: 45.1335, lon: 10.0222 },
    mapCallout: { dx: -125, dy: 175 },
  },
  {
    id: "colosseo-cup",
    slug: "colosseo-cup",
    name: "Colosseo Cup",
    city: "Roma",
    regionTag: "Lazio",
    stageLabel: "Fase a Gironi",
    logo: "/logoCities/colosseocup.png",
    image: "/backgroundCities/colosseocup.png",
    imageAlt: "Atmosfera della Colosseo Cup a Roma",
    coordinates: { lat: 41.9028, lon: 12.4964 },
    mapCallout: { dx: -155, dy: 165 },
  },
];

export function getLocalCompetition(slug: string) {
  return LOCAL_COMPETITIONS.find((competition) => competition.slug === slug);
}

export function getCompetitionHref(slug: string) {
  return `/competizioni/${slug}`;
}

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
    href: "/#mission",
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
    href: "/#competizioni",
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
    href: "/#competizioni",
  },
];
