import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { SmoothScroll } from "@/components/SmoothScroll/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lega Calcio Studenti (LCS)",
  description:
    "Oltre la scuola, oltre lo sport. Il circuito nazionale delle competizioni calcistiche tra licei e istituti superiori italiani.",
  openGraph: {
    title: "Lega Calcio Studenti (LCS)",
    description:
      "Oltre la scuola, oltre lo sport. Competizioni locali e racconti della Lega Calcio Studenti.",
    locale: "it_IT",
    type: "website",
  },
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
