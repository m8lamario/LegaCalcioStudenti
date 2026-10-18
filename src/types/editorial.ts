/**
 * Definizioni di tipo TypeScript per articoli editoriali, news e momenti salienti di lega.
 */

export type EditorialCategory =
  | 'TUTTI'
  | 'CRONACA GARA'
  | 'TORNEI CITTADINI'
  | 'KNOCKOUT DAY'
  | 'CULTURA SPORTIVA';

export interface NewsArticle {
  id: string | number;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  publishedAt: string;
  category: Exclude<EditorialCategory, 'TUTTI'>;
  competitionSlug?: string;
  competitionName?: string;
  city?: string;
  featured?: boolean;
  isDemoData?: boolean;
  href: string;
  coverImage: {
    src: string;
    alt: string;
    caption?: string;
  };
  readTimeMinutes?: number;
}
