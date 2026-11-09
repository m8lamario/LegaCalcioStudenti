# Diretta partite

## Scelta

La diretta pubblica è un **polling di 4 secondi** su una snapshot JSON cacheable. Il cronometro vive sul server: in database restano periodo, `period_started_at` e `elapsed_seconds`. Ogni snapshot porta `serverNow`. Tutti i dispositivi calcolano lo stesso minuto con la stessa funzione. Tra un poll e l’altro il client fa scorrere il minuto in locale da quegli ancoraggi.

Il refertista scrive con `POST /api/live/commands`. Ogni azione ha un `clientId` unico. Un secondo invio dello stesso id non riapplica l’azione.

## Perché non il resto

| Alternativa | Perché no |
| --- | --- |
| SSE / WebSocket su Vercel | Una funzione aperta per spettatore. Qualche centinaio di connessioni per partita allunga la durata e i costi, e si scontra con i timeout. |
| Ably / Pusher | Vendor e costo per un ritardo che il polling già rispetta (obiettivo ≤ 10 s). |
| Logical replication Neon | Sposta i dati tra database, non verso i browser. Servirebbe comunque un fan-out. |

Il client pubblico passa da `LiveSubscriber`. Oggi c’è solo `createPollingSubscriber`. Un adapter push può sostituirlo senza toccare pannello o pagina. Senza variabili nuove il sito continua a funzionare.

## Percorso dei dati

```
telefono  --coda + clientId-->  POST /api/live/commands
                                    |
                                    v
                              transazione Postgres
                              eventi, cronometro, audit
                              revalidateTag live:{id}
                                    |
spettatori --poll 4s--> CDN / cache dati --snapshot--> stessa lettura Neon
```

## Cache e carico

- `GET /api/live/snapshot/[id]` e `GET /api/live/active` sono senza cookie.
- Header richiesti: `Cache-Control: public, s-maxage=4, stale-while-revalidate=8` e `CDN-Cache-Control` uguale, così Vercel non lo ribalta in `no-store`.
- Dietro, cache in memoria da 4 secondi per istanza + tag `live:{id}` / `live:active`.
- Caso peggiore verso lo spettatore: ~8 s (4 di cache + 4 al poll successivo), sotto i 10 s.
- Se il poll fallisce, l’HTML già renderizzato resta valido e la pagina mostra «ultimo aggiornamento alle hh:mm».

Carico nominale: 10 partite live × 200 spettatori × 1 richiesta / 4 s ≈ **500 req/s sul CDN**, **~2,5 letture/s su Neon** (una ogni 4 s per URL snapshot + una per `/active`). Le scritture arrivano solo dal refertista.

La home e le coppe restano nella cache lunga. La striscia live è un isolotto client che parte dopo l’idratazione e si ferma se la scheda è nascosta, così Lighthouse delle pagine pubbliche non cambia.

La cartella `node_modules/next/dist/docs/` in Next 16.4.2 è vuota e `cacheLife` non è esportato dal package. La cache dati è quindi la mappa in memoria da 4 s per istanza (`src/lib/live/memory-cache.ts`), più gli header HTTP. `"use cache"` resta sulle pagine pubbliche lunghe (home, coppa, `getMatchPage`).

Header reali misurati in locale dopo `npm run start` (`curl -I`):

| URL | Cache-Control | CDN-Cache-Control |
| --- | --- | --- |
| `/api/live/active` | `public, s-maxage=4, stale-while-revalidate=8` | uguale |
| `/api/live/snapshot/[id]` | `public, s-maxage=4, stale-while-revalidate=8` | uguale |

Next non ha sovrascritto con `no-store`. I `vary` RSC restano, ma la risposta JSON è pubblica.

## Permessi

`canManageMatches` (città assegnate). Il refertista usa `/admin/live` e non può toccare altre città. Solo `admin` riapre una partita chiusa. Tutto finisce in `audit_log`.

## Fine partita

Alla chiusura si ricalcolano punteggio, classifica (solo `finished`), marcatori (niente autogol né rigori di serie) e si invalidano i tag `match`, `cup`, `standings`, `home`, squadre e scuole.

## Costi stimati (ordine di grandezza)

Con il carico nominale sopra, il traffico è quasi tutto CDN. Le Function Vercel restano poche (miss ogni 4 s per URL). Neon resta su poche query al secondo. Nessuna chiave a pagamento. Un eventuale Ably/Pusher resterebbe dietro `LiveSubscriber` e sarebbe opzionale.

## Cosa configurare a mano

Niente di nuovo rispetto al gestionale. La diretta non aggiunge variabili obbligatorie. Copiare su Vercel Preview le stesse già usate (`DATABASE_URL`, `AUTH_SECRET`, …) quando si pubblica. Non toccare dominio, DNS né produzione da qui. Applicare la migrazione `0002` sul branch Neon di lavoro prima del build.

## Test di carico

Vedi `scripts/live-load.ts`. Eseguito contro `http://localhost:3000` (`npm run start` dopo `next build`), 480 GET concorrenti su `/api/live/active`:

| Metrica | Valore |
| --- | --- |
| OK | 480 / 480 |
| Latenza media | 44 ms |
| Latenza max | 119 ms |
| Header `Cache-Control` | `public, s-maxage=4, stale-while-revalidate=8` |

Le 480 richieste condividono la stessa lettura in memoria (TTL 4 s). Su Neon, con N partite live, restano ~N+1 query ogni 4 s (snapshot per id + lista active), non una per spettatore.

`scripts/live-simulate.ts` sul branch Neon `cup-page-complete`: partita `2424bdf8-f53c-438c-b694-1a90fc7464c1`, avvio ok, secondo invio dello stesso `clientId` = no-op, 2-0 a fine gara (gol + autogol), minuto `FT`.

`scripts/live-poll-minute.ts`: due GET a 8 s di distanza su una partita in corso (`9fd02c35-6b2f-4785-9e15-db60e1134f09`) hanno restituito entrambe `1'`.
