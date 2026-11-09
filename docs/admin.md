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
