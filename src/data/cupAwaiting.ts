export type CupAwaitingCopy = {
  eyebrow: string;
  title: string;
  lead: string;
};

/** Coppe che pubblicano calendario, risultati e classifica. Le altre restano in preparazione. */
export const CUPS_WITH_PUBLIC_RESULTS = ["mole-cup"] as const;

export function hasPublicCupResults(slug: string) {
  return (CUPS_WITH_PUBLIC_RESULTS as readonly string[]).includes(slug);
}

export const CUP_PREP = [
  {
    key: "squadre",
    href: (slug: string) => `/competizioni/${slug}/squadre`,
    title: "Squadre",
    lead: "Le rose stanno per essere ufficiali.",
  },
  {
    key: "partite",
    href: (slug: string) => `/competizioni/${slug}/partite`,
    title: "Calendario",
    lead: "Il primo impegno è in arrivo.",
  },
  {
    key: "classifica",
    href: (slug: string) => `/competizioni/${slug}/classifica`,
    title: "Classifica",
    lead: "Ogni punto è ancora da scrivere.",
  },
] as const;

export const CUP_AWAITING = {
  teams: {
    eyebrow: "Istituti",
    title: "Prendete posto",
    lead: "Le squadre stanno per scendere in campo. Prendete posto, lo spettacolo sta per iniziare!",
  },
  standings: {
    eyebrow: "Gironi",
    title: "Tutto da scrivere",
    lead: "La classifica è ancora tutta da scrivere. Ogni punto farà la differenza.",
  },
  results: {
    eyebrow: "Campo",
    title: "Il fischio si avvicina",
    lead: "Il fischio d'inizio si avvicina. Presto scoprirete chi si contenderà il titolo.",
  },
  upcoming: {
    eyebrow: "Calendario",
    title: "Le date arrivano",
    lead: "Il calendario si sta componendo. Giornate, orari e campi compariranno qui, uno dopo l'altro.",
  },
  matches: {
    eyebrow: "Calendario",
    title: "Il campo è pronto",
    lead: "La stagione sta per aprire le danze. Il primo impegno ufficiale non tarderà a comparire.",
  },
  matchesFilter: {
    eyebrow: "Calendario",
    title: "Altro taglio, stesso torneo",
    lead: "Con questo filtro il calendario resta in silenzio. Provate un altro girone o un'altra squadra: la coppa è più larga di una sola griglia.",
  },
  scorers: {
    eyebrow: "Marcatori",
    title: "Reti ancora da firmare",
    lead: "I gol arriveranno con le prime giornate. Chi aprirà le marcature è ancora un mistero da campo.",
  },
  cards: {
    eyebrow: "Disciplina",
    title: "Registro ancora pulito",
    lead: "Gialli e rossi si annoteranno partita dopo partita. Per ora il taccuino è intonso.",
  },
  attack: {
    eyebrow: "Attacco",
    title: "Chi farà più male",
    lead: "Quando il pallone inizierà a rotolare, sapremo quali istituti pesano di più davanti.",
  },
  defense: {
    eyebrow: "Difesa",
    title: "Porte da difendere",
    lead: "Le gerarchie tra le retrovie nasceranno sul prato, non prima del primo fischio.",
  },
  news: {
    eyebrow: "Cronache",
    title: "Le storie arriveranno dal campo",
    lead: "Le cronache prenderanno vita con le prime sfide. Tornate dopo il fischio d'inizio: racconteremo ogni derby.",
  },
  info: {
    eyebrow: "Info",
    title: "Dettagli in preparazione",
    lead: "Campi e recapiti compariranno qui appena definiti.",
  },
  stats: {
    eyebrow: "Numeri",
    title: "I numeri arrivano dal campo",
    lead: "Marcatori, cartellini e gerarchie si scrivono dopo il primo fischio.",
  },
  roster: {
    eyebrow: "Rosa",
    title: "La formazione si sta componendo",
    lead: "I nominativi compariranno quando la scuola li avrà comunicati. L'undici è in costruzione.",
  },
  teamResults: {
    eyebrow: "Campo",
    title: "Ancora nessuna gara in archivio",
    lead: "I risultati di questa squadra arriveranno con il primo impegno ufficiale. Il cammino parte da qui.",
  },
  schoolTeams: {
    eyebrow: "Istituto",
    title: "La squadra è in costruzione",
    lead: "Quando l'istituto scenderà in una coppa del circuito, la troverete qui a rappresentare i propri colori.",
  },
} as const satisfies Record<string, CupAwaitingCopy>;
