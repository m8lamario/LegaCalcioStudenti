# Gestionale LCS

Il sito pubblico legge i contenuti da Neon Postgres. `/admin` è il gestionale.

## Setup locale

1. Le variabili Neon arrivano con `neon deploy` in `.env.local`.
2. Aggiungi in `.env.local`:
   - `AUTH_SECRET` (stringa lunga casuale)
   - `AUTH_URL` (`http://localhost:3000` in locale)
   - `RESEND_API_KEY` (senza questa chiave, in locale il link magico viene scritto nei log del server)
   - `BLOB_READ_WRITE_TOKEN` (solo per upload immagini)
3. Applica schema e dati:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npx tsx scripts/create-admin.ts tua@email "Mario"
```

4. Avvia `npm run dev` e apri `/admin/login`.

## Login magico

- Accedono solo email già presenti in `users`.
- La scheda di login resta su “Controlla la tua email” e interroga lo stato ogni 2 secondi.
- Il link apre `/admin/login/confirm`, conferma il token e **non** crea la sessione.
- La sessione nasce solo nella scheda originale.

## Ruoli

- `admin`: tutto
- `staff_citta`: solo le città assegnate
- `refertista`: solo partite delle città assegnate

## Diretta (`/admin/live`)

Pannello telefono per lo staff a bordo campo. Nessuna variabile extra.

1. Assegna la città al refertista da **Utenti**.
2. In **Coppe** imposta i minuti per tempo (default 25 + 10 di supplementari).
3. In **Fasi** di eliminazione spunta supplementari e/o rigori.
4. Apri **Diretta**: vedi le partite di oggi (fuso `Europe/Rome`) e quelle già `live`.
5. Sulla partita: Avvio, Intervallo, Ripresa, Fine. Gli eventi (gol, autogol, rigore, cartellini, cambio, nota) restano in coda se la rete cade e partono al ritorno, senza duplicati.
6. Solo un admin può riaprire una partita chiusa. La card social è `/partite/{id}/opengraph-image`.

Il refertista non vede le partite di altre città. Dettagli in `docs/live-architecture.md`.

## Variabili su Vercel

Imposta su Production e Preview:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `AUTH_SECRET`
- `AUTH_URL` (`https://www.legacalciostudenti.com` in produzione)
- `RESEND_API_KEY`
- `AUTH_FROM_EMAIL`
- `BLOB_READ_WRITE_TOKEN`

Non modificare dominio, DNS o protezione del progetto da qui: copia le variabili nel pannello Vercel.
