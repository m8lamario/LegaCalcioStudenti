import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lega Calcio Studenti (LCS) — Il Calcio dei Licei",
  description:
    "Una lega. Tante città. Un'unica passione. Il circuito nazionale ufficiale delle competizioni calcistiche tra licei e istituti superiori italiani.",
  openGraph: {
    title: "Lega Calcio Studenti (LCS) — Il Calcio dei Licei",
    description:
      "Una lega. Tante città. Un'unica passione. Competizioni territoriali, risultati e racconti dal campionato studentesco italiano.",
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
        <a href="#main-content" className="skip-to-content">
          Salta al contenuto principale
        </a>
        {children}
      </body>
    </html>
  );
}
