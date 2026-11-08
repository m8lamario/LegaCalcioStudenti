import type { Metadata } from "next";

export const SITE_URL = "https://www.legacalciostudenti.com";
export const SITE_NAME = "Lega Calcio Studenti";
export const DEFAULT_OG_IMAGE = "/eslHome/19.webp";
export const DEFAULT_OG_ALT =
  "Studenti sugli spalti durante una partita della Lega Calcio Studenti";

export const DEFAULT_TITLE = "Lega Calcio Studenti (LCS)";
export const DEFAULT_DESCRIPTION =
  "Oltre la scuola, oltre lo sport. Il circuito nazionale delle competizioni calcistiche tra licei e istituti superiori italiani.";

export function isProductionIndexable() {
  return process.env.VERCEL_ENV === "production";
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
  authors,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image ?? DEFAULT_OG_IMAGE);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "it_IT",
      type,
      images: [{ url: imageUrl, alt: DEFAULT_OG_ALT }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors?.length ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
