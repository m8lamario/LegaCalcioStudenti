import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { SmoothScroll } from "@/components/SmoothScroll/SmoothScroll";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_ALT,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  isProductionIndexable,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description:
      "Oltre la scuola, oltre lo sport. Competizioni locali e racconti della Lega Calcio Studenti.",
    siteName: SITE_NAME,
    locale: "it_IT",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: isProductionIndexable()
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <link rel="stylesheet" href="https://use.typekit.net/ajb7nmd.css" />
        <link
          rel="preload"
          href="/font/Machton%20TTF.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div className="lcs-pitch" aria-hidden="true" />
        <a href="#main-content" className="skip-to-content">
          Salta al contenuto principale
        </a>
        <SmoothScroll>
          <div className="lcs-page-shell">
            <Navbar />
            <main id="main-content" className="lcs-main">
              {children}
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
