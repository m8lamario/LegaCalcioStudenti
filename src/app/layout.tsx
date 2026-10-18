import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.legacalciostudenti.com'),
  title: {
    default: 'Lega Calcio Studenti (LCS) — Il Campionato Italiano dei Licei',
    template: '%s | Lega Calcio Studenti'
  },
  description:
    'Lega Calcio Studenti (LCS) è la lega sportiva studentesca nazionale tra licei e istituti superiori d’Italia: tornei territoriali, classifica generale, cronache e Knockout Day.',
  keywords: [
    'Lega Calcio Studenti',
    'LCS',
    'Mole Cup',
    'Leonessa Cup',
    'Ferrea Cup',
    'Olympius Cup',
    'Turàs Cup',
    'Bora Cup',
    'calcio studentesco',
    'tornei liceali'
  ],
  authors: [{ name: 'Lega Calcio Studenti' }],
  creator: 'Lega Calcio Studenti',
  publisher: 'LCS',
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://www.legacalciostudenti.com',
    title: 'Lega Calcio Studenti (LCS) — Il Campionato Italiano dei Licei',
    description:
      'Il torneo nazionale che unisce gli studenti delle scuole superiori italiane: competizione, appartenenza d’istituto e passione sportiva autentica.',
    siteName: 'Lega Calcio Studenti',
    images: [
      {
        url: '/eslHome/13.jpeg',
        width: 1200,
        height: 630,
        alt: 'Lega Calcio Studenti - Ingresso in campo ufficiale'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lega Calcio Studenti (LCS)',
    description: 'Il campionato nazionale tra licei e istituti superiori d’Italia.',
    images: ['/eslHome/13.jpeg']
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
};

export const viewport: Viewport = {
  themeColor: '#0E1016',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <link
          rel="preload"
          href="/font/Machton%20TTF.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://maps.gstatic.com" />
        <link rel="preconnect" href="https://django-backend-lcs-storage.s3.amazonaws.com" />
        <link rel="stylesheet" href="https://use.typekit.net/ajb7nmd.css" />
      </head>
      <body id="top">
        <Navbar />
        <main className="main" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
