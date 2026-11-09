export const CUP_TABS = [
  { key: "partite", label: "Partite", href: (slug: string) => `/competizioni/${slug}/partite` },
  { key: "classifica", label: "Classifica", href: (slug: string) => `/competizioni/${slug}/classifica` },
  { key: "squadre", label: "Squadre", href: (slug: string) => `/competizioni/${slug}/squadre` },
  { key: "statistiche", label: "Statistiche", href: (slug: string) => `/competizioni/${slug}/statistiche` },
  { key: "news", label: "News", href: (slug: string) => `/competizioni/${slug}/blog` },
  { key: "staff", label: "Staff", href: (slug: string) => `/competizioni/${slug}/staff` },
  { key: "info", label: "Info", href: (slug: string) => `/competizioni/${slug}/info` },
] as const;

export type CupTabKey = (typeof CUP_TABS)[number]["key"];
