import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import styles from "../legal.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Termini e condizioni — Lega Calcio Studenti",
  description: "Condizioni di iscrizione e uso della piattaforma ESL Player Hub e delle competizioni della Lega Calcio Studenti, stagione 2026/2027.",
  path: "/terms",
});

export default function LegalPage() {
  return (
    <article className={styles.page} aria-labelledby="legal-heading">
      <div className={`lcs-container ${styles.inner}`}>
        <header className={styles.intro}>
          <div className={styles.eyebrowRow}>
            <span className={styles.sidelineTick} aria-hidden="true" />
            <p className={styles.eyebrow}>Informative</p>
          </div>
          <h1 id="legal-heading" className={styles.title}>
            <span>Termini e </span>
            <span className={styles.titleScript}>condizioni</span>
          </h1>
        </header>
        <div className={styles.prose}>
          <p className={styles.paragraph}><strong>Condizioni di iscrizione e uso</strong>, compilate con i dati forniti da European Students League S.r.l. il 5 ottobre 2026. La casella T1 è «Accetto il regolamento e le condizioni di iscrizione». Foro competente: Torino.</p>
          <p className={styles.paragraph}><strong>Mole Cup, Leonessa Cup, Colosseo Cup, Ferrea Cup, Olympius e Turas Cup</strong>, stagione 2026/2027, versione 1.0 del 5 ottobre 2026. Data di entrata in vigore su questa piattaforma: <strong>5 ottobre 2026</strong>.</p> <h2 className={styles.heading}>1. Che cosa regola questo documento</h2>
          <p className={styles.paragraph}>L’uso dell’area personale di iscrizione (ESL Player Hub) e il rapporto di iscrizione a un’edizione.</p>
          <p className={styles.paragraph}>È previsto un Regolamento Generale ESL applicabile alle competizioni, integrato da un Regolamento Specifico per ciascun torneo. Il regolamento specifico disciplina le modalità e le regole proprie della singola competizione. In caso di contrasto, il regolamento specifico prevale limitatamente alle materie da esso disciplinate; il Regolamento Generale ESL continua ad applicarsi per le disposizioni generali. La gerarchia definitiva rispetto a questi Termini deve essere validata dal legale.</p>
          <p className={styles.paragraph}>Privacy, documenti e foto/video sono regolati da:</p>
          <ul className={styles.list}>
          <li><a href="/privacy">Informativa privacy</a></li>
          <li><a href="https://registration.legacalciostudenti.com/privacy/minori" target="_blank" rel="noopener noreferrer">Informativa per minori</a></li>
          <li><a href="https://registration.legacalciostudenti.com/privacy/documenti" target="_blank" rel="noopener noreferrer">Informativa documenti</a></li>
          <li><a href="https://registration.legacalciostudenti.com/liberatorie" target="_blank" rel="noopener noreferrer">Liberatoria</a></li>
          <li><a href="/cookie">Cookie</a></li>
          </ul> <h2 className={styles.heading}>2. Soggetti</h2>
          <ul className={styles.list}>
          <li>Organizzazione: European Students League S.r.l., Corso Vinzaglio 24, 10121 Torino, P.IVA IT12974200011, C.F. 12974200011.</li>
          <li>Giocatore: titolare dell’account, anche se minore. L’iscrizione è ammessa dai 14 anni compiuti.</li>
          <li>Genitore/tutore: contatto collegato, non titolare del login. Per i minorenni l’accettazione di questi Termini avviene dall’account del giocatore, secondo la procedura della piattaforma. Nel passo tutore il contatto dichiara di essere genitore o tutore (casella G1).</li>
          <li>Rappresentante di squadra e amministratori: ruoli distinti, con permessi diversi.</li>
          </ul> <h2 className={styles.heading}>3. Ingresso solo su invito</h2>
          <p className={styles.paragraph}>Non esiste iscrizione pubblica da catalogo. Si entra con l’invito del rappresentante di squadra (o processo equivalente dello staff). L’invito può essere inoltrato ai giocatori della propria squadra. Ogni giocatore deve utilizzare un proprio account associato a un indirizzo email univoco. Non sono consentiti account condivisi tra più giocatori.</p> <h2 className={styles.heading}>4. Account</h2>
          <p className={styles.paragraph}>Una persona, un account. Email e password; l’email va verificata prima di caricare il certificato e di confermare i consensi vincolanti. Sei responsabile delle credenziali.</p>
          <p className={styles.paragraph}>Ogni account è personale e può essere utilizzato esclusivamente dal giocatore a cui è associato. È vietato utilizzare l’account di un’altra persona o fornire informazioni false sulla propria identità. Il recupero dell’accesso avviene tramite l’indirizzo email associato all’account, con il link di reimpostazione della password.</p>
          <p className={styles.paragraph}>Il codice fiscale è obbligatorio e deve essere coerente con la data di nascita. L’email e il telefono del giocatore restano obbligatori anche se il giocatore è minorenne.</p> <h2 className={styles.heading}>5. Iscrizione e requisiti</h2>
          <p className={styles.paragraph}>Ogni edizione definisce i requisiti (anagrafica, tutore se minore, certificato, privacy, invio della liberatoria, pagamento se previsto). Lo stato iscrizione è una checklist, non una spunta libera.</p>
          <p className={styles.paragraph}>L’iscrizione si perfeziona con il completamento della registrazione, la trasmissione dei dati richiesti e, ove previsto, il pagamento della quota. La partecipazione alle gare è subordinata ai requisiti del regolamento, incluso il certificato medico agonistico valido e approvato. Iscrizione e idoneità non garantiscono la convocazione o l’impiego in gara, che restano di competenza dello staff tecnico secondo le regole della competizione.</p>
          <p className={styles.paragraph}>In caso di dati falsi o dichiarazioni non veritiere, l’account può essere sospeso e, nei casi previsti dal regolamento, il giocatore può essere escluso. Se il certificato è autentico ma scaduto, illeggibile, incompleto o non conforme, il giocatore deve sostituirlo. Fino alla regolarizzazione non partecipa alle gare per le quali il documento è richiesto.</p> <h2 className={styles.heading}>6. Certificato medico</h2>
          <p className={styles.paragraph}>Per partecipare è richiesto un certificato medico di idoneità sportiva agonistica per il calcio, in corso di validità alla data della gara. Deve essere leggibile e consentire di verificare l’idoneità e la scadenza.</p>
          <p className={styles.paragraph}>Chi si iscrive carica il file in piattaforma. European Students League S.r.l. ne conserva una copia fino a 90 giorni dopo la conclusione del torneo locale, poi la cancella. Si conserva l’ultimo file approvato. Dettaglio: <a href="https://registration.legacalciostudenti.com/privacy/documenti" target="_blank" rel="noopener noreferrer">informativa documenti</a>.</p>
          <p className={styles.paragraph}>La piattaforma verifica presenza, formato e revisione umana; non sostituisce il giudizio sanitario.</p> <h2 className={styles.heading}>7. Pagamenti</h2>
          <p className={styles.paragraph}>Se l’edizione lo prevede, la quota è di <strong>40 euro per partecipante</strong> e si paga tramite Stripe, dal partecipante, dal genitore/tutore o, ove previsto, dalla scuola o dal rappresentante della squadra. Questa piattaforma non salva numero di carta, CVV o PIN.</p>
          <p className={styles.paragraph}>A seguito del pagamento, la piattaforma invia una conferma elettronica all’email dell’iscrizione, con almeno importo, data, stato e identificativo della transazione.</p>
          <p className={styles.paragraph}>Il rimborso può essere richiesto fino a 5 mesi prima dell’inizio del torneo locale. Decorso quel termine la quota non è rimborsabile, salvo i casi previsti dalla legge o da questi Termini.</p>
          <p className={styles.paragraph}>Restano in ogni caso ammessi, previa adeguata certificazione medica e verifica da parte dell’organizzazione, i <strong>rimborsi integrali</strong> della quota nei casi seguenti:</p>
          <ul className={styles.list}>
          <li><strong>condizioni di salute certificate nel corso del 2027</strong> che impediscano la partecipazione alla competizione per la quale è stata versata la quota;</li>
          <li><strong>infortunio certificato</strong> almeno <strong>quarantacinque (45) giorni</strong> prima dell’inizio del torneo locale;</li>
          <li><strong>altre condizioni di salute</strong> che impediscano la partecipazione alla competizione, qualora la documentazione medica sia adeguata a comprovare l’impedimento.</li>
          </ul>
          <p className={styles.paragraph}>La richiesta di rimborso per i casi di cui sopra va presentata secondo le modalità indicate dall’organizzazione (contatti al punto 15), con la documentazione medica idonea. L’organizzazione valuta la richiesta nei limiti di questi Termini.</p>
          <p className={styles.paragraph}>La documentazione fiscale della quota segue gli obblighi applicabili, previa verifica con il commercialista.</p> <h2 className={styles.heading}>8. Condotta</h2>
          <p className={styles.paragraph}>L’utente usa la piattaforma in modo conforme a questi Termini, al regolamento della competizione e alla normativa applicabile.</p>
          <p className={styles.paragraph}>I file non pertinenti, illeciti, offensivi o non conformi alle finalità della piattaforma possono essere rimossi. Caricare solo il certificato medico sportivo agonistico: non referti, cartelle cliniche, risultati di esami, prescrizioni o altra documentazione sanitaria non richiesta.</p>
          <p className={styles.paragraph}>In caso di violazioni, l’organizzazione può adottare provvedimenti proporzionati, inclusa la sospensione o l’esclusione dalla competizione e, nei casi previsti, la sospensione o il blocco dell’account. La sospensione o squalifica sportiva riguarda la partecipazione alle gare e non comporta automaticamente il blocco dell’account. La sospensione o il blocco dell’account riguarda l’accesso alla piattaforma.</p> <h2 className={styles.heading}>9. Disponibilità del servizio</h2>
          <p className={styles.paragraph}>La piattaforma non garantisce la disponibilità continua e ininterrotta del servizio. Il servizio può essere sospeso o non disponibile per manutenzione, aggiornamenti, malfunzionamenti, problemi tecnici o cause dipendenti da fornitori e servizi esterni.</p> <h2 className={styles.heading}>10. Proprietà intellettuale</h2>
          <p className={styles.paragraph}>Il software della piattaforma, il marchio LCS, gli elementi grafici, i testi e gli altri contenuti proprietari sviluppati per la piattaforma sono di proprietà di European Students League S.r.l., salvo i materiali di terzi usati nel rispetto delle relative licenze o autorizzazioni. È vietata la riproduzione, modifica, distribuzione o utilizzazione di quegli elementi al di fuori degli usi consentiti, senza autorizzazione del titolare.</p> <h2 className={styles.heading}>11. Limitazione di responsabilità</h2>
          <p className={styles.paragraph}>European Students League S.r.l. non è responsabile delle conseguenze derivanti dalla documentazione fornita dal partecipante se risulta errata, scaduta, incompleta, illeggibile o non conforme, fermo l’impegno a comunicare le irregolarità rilevate e, ove previsto, a consentirne la regolarizzazione.</p>
          <p className={styles.paragraph}>Le decisioni su convocazione, partecipazione alle gare e sanzioni sportive seguono il regolamento della competizione. ESL non risponde delle conseguenze delle decisioni arbitrali o tecniche adottate nella competizione, fermo l’impegno a rispettare i regolamenti e le decisioni applicabili.</p>
          <p className={styles.paragraph}>Per i servizi di soggetti terzi, inclusi i pagamenti, ESL non è responsabile dei malfunzionamenti o delle indisponibilità imputabili a quei soggetti. ESL si impegna, nei limiti delle proprie possibilità, a dare assistenza e a collaborare alla risoluzione dei problemi che impediscono le procedure sulla piattaforma.</p>
          <p className={styles.paragraph}>In caso di ritiro oltre il termine di rimborso, la quota non è rimborsabile, salvo quanto previsto dalla legge o da questi Termini.</p>
          <p className={styles.paragraph}>Queste limitazioni non si applicano nei casi in cui la responsabilità di European Students League S.r.l. non possa essere esclusa o limitata ai sensi della normativa applicabile.</p> <h2 className={styles.heading}>12. Sospensione, ritiro, cancellazione</h2>
          <p className={styles.paragraph}>Il partecipante può chiedere il ritiro dalla competizione secondo le modalità della piattaforma. Può chiedere la cancellazione dell’account secondo le procedure previste. La cancellazione non comporta la cancellazione immediata di tutti i dati se la conservazione serve a obblighi di legge, a pagamenti e adempimenti amministrativi, alla tutela dei diritti del titolare o a controversie.</p>
          <p className={styles.paragraph}>Le condizioni economiche del ritiro e del rimborso sono in questi Termini e nella competizione specifica. In piattaforma è previsto lo stato di ritiro dell’iscrizione.</p> <h2 className={styles.heading}>13. Modifiche</h2>
          <p className={styles.paragraph}>Queste condizioni possono essere aggiornate. La versione in vigore è su <a href="/terms">/termini</a>. Se il testo cambia, in iscrizione va riletta la versione corrente (casella T1).</p> <h2 className={styles.heading}>14. Legge applicabile e foro</h2>
          <p className={styles.paragraph}>Questi Termini sono disciplinati dalla legge italiana.</p>
          <p className={styles.paragraph}>Foro competente: Torino.</p> <h2 className={styles.heading}>15. Contatti</h2>
          <ul className={styles.list}>
          <li>Segreteria / contratti: <a href="mailto:support@legacalciostudenti.it">support@legacalciostudenti.it</a></li>
          <li>Privacy: <a href="mailto:privacy@legacalciostudenti.it">privacy@legacalciostudenti.it</a></li>
          <li>PEC: <a href="mailto:europeanstudentsleague@legalmail.it">europeanstudentsleague@legalmail.it</a></li>
          </ul>
        </div>
        <Link href="/" className={styles.backLink}>
          <span aria-hidden="true">←</span>
          <span>Torna alla home</span>
        </Link>
      </div>
    </article>
  );
}
