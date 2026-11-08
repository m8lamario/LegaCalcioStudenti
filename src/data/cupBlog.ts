export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export interface CupBlogPost {
  slug: string;
  competitionSlug: string;
  title: string;
  dek: string;
  authors: string[];
  dateLabel: string;
  dateIso: string;
  image: string;
  imageAlt: string;
  imageCredit?: string;
  body: BlogBlock[];
}

export const CUP_BLOG_POSTS: CupBlogPost[] = [
  {
    slug: "fabbrini-regala-la-semifinale-allo-juvarra",
    competitionSlug: "mole-cup",
    title:
      "Fabbrini regala la semifinale allo Juvarra, il Curie ne fa 3 ai danni del Cop/Lux",
    dek: "Gli “Oranges” piegano l’Agnelli con due gol nella ripresa targate Emiliano Fabbrini; i nerazzurri subiscono la prima rete nel torneo ma raggiungono ugualmente la semifinale",
    authors: ["D. Dessi"],
    dateLabel: "07 maggio 2026",
    dateIso: "2026-05-07",
    image: "/blog/fabbrini-regala-la-semifinale-allo-juvarra.webp",
    imageAlt:
      "Fabbrini regala la semifinale allo Juvarra, il Curie ne fa 3 ai danni del Cop/Lux",
    body: [
      {
        type: "p",
        text: "Dopo il tour de force di domenica scorsa, il tabellone si sta iniziando a delineare in modo sempre più fitto. Ad inaugurare il primo turno dei quarti di finale troviamo quattro squadre in gran forma, tutte alla prima esperienza nella competizione e colte da un entusiasmo singolare.",
      },
      { type: "h2", text: "Juvarra-Agnelli" },
      {
        type: "p",
        text: "Le due squadre approcciano il match in modo simile: possesso palla lento e prolungato in attesa del varco giusto. I minuti iniziali sono molto equilibrati, dove le due contendenti si studiano senza scopristi troppo. L’unica occasione potenzialmente pericolosa arriva verso il 15’ con il colpo di testa di Cottone, scaltro ad anticipare l’uscita di Dubois, ma poco preciso nell’impatto. All’incornata del capitano dello Juvarra risponde Salvatore 5 minuti dopo, sempre di testa, sempre da corner, ma l’azione termina nuovamente con la palla sopra la traversa. Queste le due uniche occasioni da palla inattiva, a testimonianza di un primo parziale sciapo e privo di emozioni.",
      },
      {
        type: "p",
        text: "Visti i primi 25’ non c’erano troppi prospetti per un secondo tempo più spumeggiante, ma nella ripresa l’inerzia cambia gradualmente. I ritmi si alzano notevolmente, le squadre iniziano a combattere con più agonismo, ma di conclusioni nello specchio neanche l’ombra. Considerato l’equilibrio prolungato, i tecnici iniziano ad apportare i primi cambi in fase offensiva, con l’obbiettivo di chiudere la pratica nei tempi regolamentari. Dentro D’abbene per sostenere l’attacco Juvarrino mentre nell’Agnelli Giuliani lascia il posto a Plano. Dal loro ingresso, infatti, i due attaccanti si procurano subito una palla gol a testa: Il 99 dello Juvarra semina il panico nell’area di rigore avversaria ma conclude centrale; poco dopo, invece, il 17 gialloverde sfiora il palo con una volé magistrale in area di rigore. Qualche minuto dopo, però, è la squadra di Venaria a passare in vantaggio: Fabbrini decide di mettersi in proprio e partendo dalla sinistra conduce portandosi verso il centro, il numero 11 salta due avversari e lascia partire il destro che finisce all’incrocio senza lasciare scampo a Dubois. Gli Juvarrini, passati in vantaggio a 5’ dalla fine, difendono fino all’ultimo con le unghie e con i denti, ma non senza soffrire. L’agnelli nel finale prende una traversa ma proprio all’ultimo minuto di recupero gli “oranges” trovano il raddoppio in contropiede: Fabbrini, autore della rete precedente, parte nuovamente palla al piede e scaglia un destro secco che si stampa sulla traversa, per sua fortuna, però, sulla ribattuta si avventa Bottero, che in scivolata sigla il 2-0 e chiude definitivamente la gara. Lo Juvarra è in semifinale, decisivo lo strapotere di Fabbrini in campo aperto, assoluto man of the match, adesso alla squadra di Sgró spetterà una tra Gobetti e Cattaneo.",
      },
      { type: "h2", text: "Curie-Cop/Lux" },
      {
        type: "p",
        text: "Nel secondo match di giornata troviamo i temutissimi nerazzurri del Curie Levi, favoriti e con 18 gol fatti in 4 partite, contro un Cop/Lux partito in sordina ma che sta facendo grandi cose finora. Come prevedibile che fosse, i collegnesi partono molto forte e al 6’ di gioco passano già in vantaggio. Pittavino si divincola al limite dell’area e calcia trovando la risposta di Cupoli, il quale, però, non trattiene e sulla respinta arriva Vada che prontamente trafigge l’estremo difensore del Cop. Nonostante lo svantaggio, i torinesi provano comunque a mettere la testa nell’area difensiva avversaria, ma le ripartenze e le punizioni dalla trequarti si dimostrano sempre poco efficaci. Nel frattempo il Curie continua ad imporre il proprio gioco, ma senza mai riuscire a raddoppiare. Al 15’ arriva il lampo che squarcia il cielo: il Cop pareggia, bucando per la prima volta nel torneo la porta di Losi. L’arbitro assegna un penalty per un fallo di mano discutibile e dal dischetto va Cottino che chiude il destro e gonfia la rete. A questo punto i ritmi si alzano ulteriormente e nessuna delle due squadre riesce a prevalere sull’altra. Giusto all’ultimo minuto di recupero i nerazzurri si riportano in vantaggio con la rete di Corsini, astuto nel mettere la zampata vincente nella mischia in mezzo all’area. Nel secondo tempo il Levi vuole subito chiudere la pratica, dunque pressa alto e attacca forte, concedendo molto di meno agli avversari rispetto al primo tempo. Infatti, ai nerazzurri bastano solo 7 minuti per allungare le distanze grazie al tap-in vincente del solito Delle Cave. I collegnesi, non sazi e spinti dall’entusiasmo sia del risultato che della curva, continuano ad attaccare senza sosta opprimendo i bianco blu nella propria metà campo, ma senza mai trovare un’ulteriore gol. Verso gli ultimi minuti il Cop inizia ad accennare qualche avanzata per riaprirla, ma sempre in modo timido e poco preciso. Il Curie, quindi, mantiene il pallino del gioco e al triplice fischio sono proprio i nerazzurri di collegno a poter festeggiare l’approdo in semifinale.",
      },
    ],
  },
  {
    slug: "psicodramma-nellultima-giornata-dei-quarti",
    competitionSlug: "mole-cup",
    title:
      "Psicodramma nell’ultima giornata dei quarti di finale: Volta e Cattaneo eliminate ai rigori.",
    dek: "I gialloneri la riagguantano nel finale, ma dagli 11 metri passa il Desa; De Fazio mette la firma sulla qualificazione del Gobe.",
    authors: ["D. Dessi", "A. Roggero"],
    dateLabel: "15 maggio 2026",
    dateIso: "2026-05-15",
    image: "/blog/psicodramma-nellultima-giornata-dei-quarti.webp",
    imageAlt:
      "Psicodramma nell’ultima giornata dei quarti di finale: Volta e Cattaneo eliminate ai rigori.",
    body: [
      {
        type: "p",
        text: "L’anno scorso ci avevano pensato Santorre e Valsalice, quest’anno è toccato a Des Ambrois e Gobetti, ma la sostanza non cambia: Volta e Cattaneo sono ufficialmente fuori dal torneo. Sempre ai quarti di finale, sempre dagli 11 metri, le ultime storiche corazzate rimaste ancora in gara vengono sbattute fuori da due delle tante outsider che si sono prese la scena: Des Ambrois e Gobetti.",
      },
      { type: "h2", text: "Volta-Des Ambrois" },
      {
        type: "p",
        text: "Come da programma, la partita si accende fin dai primi minuti: dopo un inizio con qualche errore di misura, le squadre iniziano a prendere confidenza sul terreno di gioco e a collocarsi meglio in campo. L’alta velocità del gioco, però, non si tramuta mai in occasioni da gol, se non qualche tiro impreciso dalla distanza. Solo a 5’ dalla fine del primo tempo, si segnala l’unica vera emozione: Melloni riceve spalle alla porta, calcola il rimbalzo e si coordina alla perfezione in mezza rovesciata, ma la palla viene messa in corner. Nella ripresa si sale sia di intensità che di agonismo, con il Volta che recrimina un mancato penalty su Melloni e l’arbitro si vede costretto a dover estrarre più volte i cartellini. Nervosismo a parte, il Desa spazza via ogni dubbio e al 4’ di gioco la sblocca da calcio d’angolo grazie al colpo di testa di Sapienza, lasciato libero dalla difesa giallonera. La rete subita scuote un po’ gli equilibri della squadra torinese, ma la retroguardia del Des Ambrois si piazza sempre molto bene, provando talvolta a ripartire in contropiede. Proprio nel finale, infatti, i giallorossi vanno vicino al gol del raddoppio, quando Molon sfrutta un’incomprensione difensiva avversaria e si invola verso la porta, ma una volta arrivato in area, chiude troppo il destro e la palla termina fuori. Nei minuti finali é puro assedio da parte del Volta, che proprio al 4’ minuto di recupero, su uno dei tanti campanili lanciati in mezzo, riesce a trovare il pareggio. Regano fa da torre per l’inserimento di Melloni, il bomber giallonero anticipa tutti e la insacca di testa, portando, così, la gara ai rigori. Dagli 11 metri la squadra di provincia non ne sbaglia neanche uno: Maffei, Pedrazzi e Mandrini gonfiano la rete, mentre il Volta sbaglia i primi due. La formazione di provincia si affida a Montabone per il rigore decisivo, il quale segue la striscia positiva dei suoi compagni e la insacca dove Villasco non può arrivare. La cenerentola delle valli é in semifinale, la favola più bella del torneo continua.",
      },
      { type: "h3", text: "Top 3" },
      { type: "h2", text: "Volta" },
      {
        type: "ul",
        items: [
          "Ariet: Capitano e punto fermo della formazione giallonera. Sempre pronto a smarcarsi per farsi dare palla e attento nel chiudere le incursioni avversarie.",
          "Melloni: Nei momenti decisivi si sa prendere la squadra sulle spalle: davanti é il riferimento principale, capace di risolvere la gara quando le cose non vanno bene.",
          "Crepaldi: Con personalità sulla fascia sinistra tenta sempre il dribbling per creare superiorità e collabora bene coi compagni di reparto.",
        ],
      },
      { type: "h2", text: "Des Ambrois" },
      {
        type: "ul",
        items: [
          "Sapienza: Ottima prestazione in fase difensiva, ma fa impazzire di gioia la sua squadra quando ad inizio ripresa trova il guizzo giusto per portare in vantaggio i suoi.",
          "Montabone: prestazione magistrale per il numero 4: ricopre entrambe le fasi alla perfezione e mette il punto esclamativa segnando il rigore decisivo.",
          "Scotto: Il solito leader del reparto difensivo del Desa non lascia passare niente dietro: marca sempre stretto Melloni e vince ogni duello aereo.",
        ],
      },
      { type: "h2", text: "Cattaneo-Gobetti" },
      {
        type: "p",
        text: "Nel quarto di finale più atteso l’atmosfera è incandescente, con le curve numerosissime a fare da cornice ad una partita che si prospetta molto interessante. Parte decisamente meglio il Catta, che nei primi 5’ di gioco registra già tre conclusioni verso la porta. Intorno al 15’ anche il Gobetti si fa vedere dalle parti della teriguardua neroverde, quando Sciavello tira da posizione ravvicinata ma la palla viene prontamente deviata da un difensore. Negli ultimi minuti del primo parziale le due squadre sfiorano il vantaggio nella stessa azione. Il Catta prende una traversa con Chiantia e, poco dopo, sulla ripartenza bianconera viene fischiata una punizione a due nell’area del Cattaneo, ma la barriera neroverde neutralizza la minaccia. Ad inizio ripresa parte più forte il Gobe, che si vede annullare un gol dopo 3 giri d’orologio. La partita, però, prosegue in modo equilibrato, dove le due rivali abbassano un po’ il ritmo e iniziano a far entrare i rinforzi. Dei subentrati, si contraddistingue più di tutti Pietro Prochet, sponda neroverde, eroe di assoluto che aveva siglato una doppietta nel turno precedente. Dal suo ingresso, infatti, il 18 del Catta sfiora la rete in due occasioni. Nel finale il Gobe sembra non averne più e i neroverdi ne approfittano, spinti anche dalla voce della curva, ma le occasioni più pericolose arrivano solo da palla inattiva. Al triplice fischio, quindi, la gara si conclude a reti bianche e si decide tutto dagli . La lotteria dei rigori va ad oltranza, segnano tutti i primi cinque, ma al sesto Cappello si fa ipnotizzare da De Fazio, che mette letteralmente mani e piedi sulla qualificazione del Gobetti. Gran prestazione dei bianconeri, i quali anche se partiti da sfavoriti, sono riusciti ad eliminare la storica corazzata, adesso in semifinale li aspetta lo Juvarra.",
      },
      { type: "h3", text: "Top 3" },
      { type: "h2", text: "Gobetti" },
      {
        type: "ul",
        items: [
          "Mennuti: Il numero 10 bianconero fa vedere sempre la sua qualità in mezzo al campo, dove riesce ad uscire in situazioni complicate grazie alle sue giocate.",
          "Baumgartner: Attaccante e numero 9 “di razza”. Non sempre gli arrivano palloni semplici ma lui li gestisce bene e tiene alta la squadra.",
          "De Fazio: Durante la partita compie ottime parate, ma dá il meglio di sé parando il rigore decisivo che porta i suoi in semifinale.",
        ],
      },
      { type: "h2", text: "Cattaneo" },
      {
        type: "ul",
        items: [
          "Cappello: gioca la sua prima partita da titolare in mole nella gara più difficile di tutte e parte come se fosse praticamente un veterano con chiusure e giocate di livello.",
          "Damici: Il 27 neroverde è ovunque: dietro non si fa mai sorpassare e anche quando è in ritardo compie ottimi interventi in scivolata, dá anche supporto al reparto offensivo.",
          "De rosa: Per 50 minuti marca stretto Baumgartner rendendogli la partita davvero complicata, sempre pulito e freddo con la palla tra i piedi anche in situazioni di difficoltà.",
        ],
      },
    ],
  },
  {
    slug: "cattaneo-prima-in-solitaria",
    competitionSlug: "mole-cup",
    title:
      "Cattaneo prima in solitaria, l’Agnelli sorprende tutti e il Galfer passeggia sul Gioberti.",
    dek: "Fatica il Catta che alla fine vince di misura sul Sociale, stravincono invece l’outsider Agnelli e la corazzata Galfer.",
    authors: ["D. Dessi", "A. Roggero"],
    dateLabel: "10 marzo 2026",
    dateIso: "2026-03-10",
    image: "/blog/cattaneo-prima-in-solitaria.webp",
    imageAlt:
      "Cattaneo prima in solitaria, l’Agnelli sorprende tutti e il Galfer passeggia sul Gioberti.",
    body: [
      { type: "h2", text: "Galfer-Gioberti" },
      {
        type: "p",
        text: "Il Galfer apre la domenica con una goleada ai danni del Gioberti. Sulla carta ci si aspettava un match equilibrato tra le due corazzate, ma il campo ha presto emesso il suo verdetto. Nel primo parziale i galferini fanno subito capire chi comanda, siglando un secco 3-0 nei primi 20’ di gioco. Lombardi apre le danze con una volée di pregevole fattura poi Bessone raddoppia con un tap-in e cala il tris con una punizione nel finale. Un marchio di fabbrica, ormai, per uno dei migliori centrocampisti della competizione, il quale ci aveva già abituato a perle del genere. Il Galfer mette le cose in chiaro anche nella ripresa, continuando ad attaccare e imporre il suo gioco. Infatti, dopo appena due minuti dall’inizio, anche capitan Lombardi sancisce la sua doppietta personale con l’incornata vincente in area di rigore. La “manita” arriva intorno al 10’ con la rete di Carlino, scaltro nell’arrivate prima di tutti sulla ribattuta del penalty calciato da Parisotto. A questo punto, viste le 5 lunghezze di vantaggio, il Galfer gestisce tranquillamente la gara, lasciando anche spazio ai subentrati. Nel finale c’è lo spazio per la rete del 6-0, scaturita da un autogol della difesa giobertina. Partita a senso unico e vinta meritatamente dai ragazzi di Mainardi, i quali adesso festeggiano d consolidano il loro posto nelle zone alte della classifica.",
      },
      { type: "h3", text: "LE PAGELLE" },
      { type: "h2", text: "Galfer" },
      {
        type: "ul",
        items: [
          "Sai 7. Una vera spina nel fianco della difesa giobertina: l’esterno sinistro trova sempre sbocchi e soluzioni interessanti davanti, fornendo anche un assist.",
          "Lombardi 8. Il cap apre le danze con un gol fuori di testa e raddoppia di testa ad inizio ripresa, dimostrandosi sempre più leader di una squadra in gran forma.",
          "Parisotto 7.5. Il rigore fallito non cancella la sua prestazione magistrale. In fase difensiva non fa passare neanche uno spillo e con personalità aiuta i compagni davanti.",
        ],
      },
      { type: "h2", text: "Convitto-Sociale" },
      {
        type: "p",
        text: "Nella seconda sfida si affrontano due squadre che stanno vivendo periodi decisamente diversi. Da una parte c’è l’Agnelli in piena fiducia, galvanizzato dalla vittoria ai rigori col Sociale e con la voglia di mettersi in mostra all’esordio nella competizione; dall’altra il Convitto deve ritrovare certezze dopo la batosta subita nel derby contro il Vittoria. Le premesse lasciano il tempo che trovano, infatti dopo neanche due giri d’orologio, sono gli agnellini a portarsi in vantaggio: sugli sviluppi di un contropiede guidato da Giuliani, il 9 giallo verde allarga la sfera per Lazzarone che prontamente mette in mezzo e trova la deviazione giusta di un difensore avversario. Una rete fortunosa, ma molto significativa per l’andamento del match. Dopo un inizio affannoso il Convitto si riprende, ma il raddoppio di Dalipi aggrava la situazione dei biancorosa. L’Agnelli non si accontenta e poco dopo cala addirittura il tris con l’euro gol di Monterosso. Nonostante le tre reti di svantaggio, il Convitto non molla e cerca di restare in partita, così verso il finale del primo tempo accorcia le distanze con Ragagnin, lesto a sfruttare l’errore difensivo avversario. Nella ripresa la squadra dal centro è costretta ad alzare i ritmi per tentare di riaprirla al più presto. Effettivamente il Convitto le prova tutte, ma le occasioni faticano ad arrivare, eccetto le due conclusioni dal limite di Sacco e Dardino, entrambe controllate da Dubois. I minuti scorrono e le speranze del Convitto si fanno sempre più fioche, complice anche un ottima difesa giallo verde. Nel finale sono proprio gli agnellini a sfruttare gli spazi per le ripartenze e allo scadere “el diez” Dalipi raddoppia dal dischetto, sancendo anche la sua doppietta personale. L’esordiente Agnelli con questa vittoria arriva a 5 punti e inizia già a far parlare di sé, chissà che l’outsider non ci sappia regalare altre sorprese.",
      },
      { type: "h3", text: "LE PAGELLE" },
      { type: "h2", text: "Agnelli" },
      {
        type: "ul",
        items: [
          "Giuliani 7. L’attaccante dell’Agnelli non riesce a scrivere il suo nome nel tabellino, ma fa un lavoro di squadra fondamentale con sponde e spizzate per i compagni.",
          "Dalipi 7.5. “El diez” sigla una doppietta magistrale. Sempre nel vivo del gioco ma soprattutto glaciale sotto porta e dal dischetto.",
          "Monterosso 7.5. Si fa sempre vedere tra le linee, trovando certi spunti importanti durante la manovra offensiva e aiuta in fase di non possesso.",
        ],
      },
      { type: "h2", text: "Convitto" },
      {
        type: "ul",
        items: [
          "Pelissero 7. Il cap nel primo tempo gioca una buona partita: si fa vedere tra le linee, aiuta in fase di non possesso e si incarica delle punizioni.",
          "Sacco 7.5. Nella ripresa trova ottimi spunti sulla trequarti, lasciandosi spesso trasportare a varie serpentine palla al piede. Il più pericoloso dei suoi.",
          "Dardino 7.5. Ottime giocate individuali tra le linee e nel secondo tempo sfiora anche il la gioia individuale.",
        ],
      },
      { type: "h2", text: "Cattaneo-Sociale" },
      {
        type: "p",
        text: "Nell’ultima gara della giornata troviamo un Cattaneo leggermente decimato ma sempre temibile, contro un Sociale in cerca di riscatto a seguito della sconfitta ai rigori nella gara d’esordio. Le aspettative prevedevano che fosse il match più incandescente della giornata, infatti sia sulle tribune che sul prato verde, non c’è stato motivo per annoiarsi. Al 5’ il Catta va vicino al vantaggio con Di Lorenzo, il quale sfrutta un incomprensione difensiva avversaria e riesce a calciare, ma il palo gli nega la rete salvando la retroguardia socialina. Il brivido del legno colpito fa smuovere la struttura del Sociale, che riesce a rimettersi in sesto e accennare delle transizioni offensive, non senza però lasciare spazi ai diavoletti neroverdi. A 2 minuti dallo scadere del primo tempo i veterani del Cattaneo si portano avanti: sugli sviluppi di una punizione dal limite, Loi para il bolide, ma sulla ribattuta arriva Tang che mette lo zampino vincente. Due reti nelle prime due per il difensore goleador, il quale segna una rete fondamentale che porta in vantaggio i suoi all’intervallo. Nella ripresa i ritmi rimangono sempre molto alti, tanto che nei primi 5’ entrambe le squadre hanno una doppia occasione per fare gol, ma nessuno riesce a mettere il sigillo giusto. Il Catta vede l’occasione migliore per raddoppiarla sulla punizione dal limite di De Angelis, ma Loi si allunga sul palo opposto sventando la minaccia. Nella seconda parte della ripresa, la partita si scalda notevolmente e l’arbitro è costretto a mettere mano ai cartellini, dovendo punire Malberti e Moscheni a seguito di una lite avvenuta tra le due panchine. Nonostante l’inferiorità numerica, la squadra di Massari sfiora il pari nel finale, quando Tessore viene lanciato a rete ma il pallonetto si dimostra debole e centrale. Nei minuti di recupero saltano completamente gli schemi e, malgrado il Sociale tenti gli ultimi disperati attacchi, al triplice fischio sono i neroverdi ad esultare. Al Catta basta una rete di Tang per portarsi a quota 6 punti e vedersi prima in solitaria, in attesa delle altre rivali. Ottima prestazione anche del Sociale, che ha comunque saputo tender testa ad una delle squadre più forti della competizione.",
      },
      { type: "h3", text: "LE PAGELLE" },
      { type: "h2", text: "Sociale" },
      {
        type: "ul",
        items: [
          "Malberti 7.5. Metronomo del centrocampo socialino: gestisce la manovra in fase di possesso e dà una grossa mano in fase di riconquista.",
          "Cavancini 7. Grandi spunti in fase offensiva, soprattutto nel secondo tempo: avanzate laterali prepotenti e palloni precisi ai compagni.",
          "Tessore 7. Assoluto riferimento del reparto offensivo, tiene alta la squadra e dialoga bene coi compagni.",
        ],
      },
      { type: "h2", text: "Cattaneo" },
      {
        type: "ul",
        items: [
          "Micheletti 7. Protagonista della seconda porta inviolata del torneo con un ottima parata su una punizione insidiosa dal limite e attento su un pallonetto nei minuti finali.",
          "Tang 7.5. Seconda partita e secondo gol, il bomber del cattaneo gioca in difesa ma sente la porta come pochi altri in campo. Sempre attento in difesa contribuisce con i compagni di reparto al clean sheet.",
          "Di Lorenzo 8. Partita di enorme sacrificio per l’attaccante che spesso si ritrova a rincorrere anche i centrocampisti avversari. Lotta su ogni pallone come se fosse l’ultimo della gara, si crea anche tre grandi occasioni che per centimetri e per interventi del portiere non gli regalano la gioia del gol.",
          "Tonello 7.5 Dalla sua punizione nasce il gol di Tang, detta i tempi a centrocampo e con la sua qualità riesce a offrire spesso palloni importanti agli attaccanti. Si sacrifica anche per aiutare la squadra nel momento del bisogno, esce sapendo di aver dato tutto.",
        ],
      },
    ],
  },
  {
    slug: "catta-da-paura-volta-in-grande-spolvero-e-darwin-a",
    competitionSlug: "mole-cup",
    title: "Catta da paura, Volta in grande spolvero e Darwin aggancia il Cavour",
    dek: "De Angelis firma la vittoria dei neroverdi, il Volta torna alla vittoria e il Darwin ritrova certezze.",
    authors: ["D. Dessi"],
    dateLabel: "14 aprile 2026",
    dateIso: "2026-04-14",
    image: "/blog/catta-da-paura-volta-in-grande-spolvero-e-darwin-a.webp",
    imageAlt:
      "Catta da paura, Volta in grande spolvero e Darwin aggancia il Cavour",
    body: [
      { type: "h2", text: "Cavour-Darwin" },
      {
        type: "p",
        text: "Ad aprire le danze sono Cavor e Darwin: la prima per entrare nella top 4 e sfidare successivamente le altre scuole d’Italia, mentre il Darwin, ancora fermo a tre punti, deve guadagnarsi l’accesso agli ottavi con una vittoria. La voglia di proseguire la competizione arde nei cuori dei rivolesi, i quali spinti dal proprio pubblico, iniziano a mettere subito le cose in chiaro. Già dai primi minuti, infatti, gli arancio neri pressano alto la difesa cavourina, con l’intenzione di recuperare la sfera e proporsi in avanti. Al 10’ si registrano già due conclusioni dalla distanza per la squadra di provincia, ma entrambe le volte la palla termina alta. Pochi minuti dopo, a seguito delle numerose spinte offensive, arriva la tanto attesa rete del vantaggio del Darwin: Guglielmone sguscia bene sulla sinistra e serve la palla a rimorchio, Moine fa il velo per l’arrivo di Paneghini, che apre il piattone e insacca in rete. Indubbiamente il gol subito scuote la squadra di Del Monte, la quale però, non riesce ad avere una reazione immediata. Il primo tempo finisce col Darwin meritatamente in vantaggio, ma lascia presagire ad una possibile rimonta del Cav. I primi minuti della ripresa sono uguali a quelli di inizio gara, quindi con un Darwin decisamente più efficiente, pronto per chiudere la pratica. Infatti, alla prima azione buona, Lipartiti imbuca di prima per l’inserimento di Mucci, il quale si invola verso la porta ma viene atterrato in area di rigore. Dal dischetto va proprio il numero 19, che non sbaglia e scatena la festa dei suoi. I rivolesi, non ancora sazi, cavalcano l’onda e siglano il tris due minuti dopo il raddoppio: da un cross sulla sinistra Suriano si inserisce in mezzo e mette la zampata vincente. Nonostante le tre reti di distacco, il Cavour non molla e verso la metà del secondo tempo, ritrova fiducia grazie all’eurogol di Tonin dalla distanza. I grigio rossi ci credono e continuano ad attaccare per cercare di rientrare al più presto in partita, ma spesso la difesa Cavourina lascia troppi spazi per i contropiedi avversari, ma mai sfruttati a dovere dall’attacco del Darwin. Le ripartenze imprecise costano caro alla squadra di Rivoli, la quale subisce addirittura il secondo gol nel finale. La partita, quindi, si riapre improvvisamente e nei minuti di recupero saltano tutti gli schemi: il Cav tenta gli ultimi disperati assalti; mentre gli arancio neri si barricano dietro per mantenere il risultato che vale oro. Al triplice fischio, é il Darwin che festeggia e va ad agganciare proprio il Cavour a quota 6 punti in classifica, scrivendo il suo nome tra le qualificate agli ottavi.",
      },
      { type: "h3", text: "Top Players" },
      { type: "h2", text: "Cav" },
      {
        type: "ul",
        items: [
          "Tonin: Il migliore in campo del Cavour. A centrocampo è un autentico faro che illumina la strada ai suoi compagni con giocate nello stretto e imbucate precise. Trova anche la rete con un gol magnifico dalla distanza.",
          "Trione: Ottina prova difensiva per il numero 6: difficilmente si fa saltare quando viene puntato e tiene bene la linea, guidando il reparto.",
        ],
      },
      { type: "h2", text: "Darwin" },
      {
        type: "ul",
        items: [
          "Guglielmone: Nel primo tempo non lo tengono mai sulla sinistra. Lui ne approfitta fornendo l’assist per l’1-0 a Paneghini.",
          "Paneghini: A centrocampo si fa valere fisicamente in ogni duello e al 10’ porta in vantaggio i suoi con un bolide che finisce sotto la traversa.",
          "Mucci: Assoluto protagonista ad inizio ripresa, dove si procura il rigore che successivamente trasforma.",
        ],
      },
      { type: "h2", text: "Volta-Maux" },
      {
        type: "p",
        text: "Nel secondo match di giornata il Volta domina sul Maux già eliminato. I giallo neri si portano in vantaggio dopo neanche un giro d’orologio: sugli sviluppi di un calcio d’angolo da destra battuto da Italiano, Cravero spinge in rete portando avanti i suoi. Una manciata di minuti dopo, il Volta raddoppia con un gol fotocopia. Italiano batte nuovamente l’angolo dalla destra, ma questa volta ad impattare la palla é la testa di Melloni, che piazza dove Mattrel non può arrivare. L’inerzia del match è chiara: i gialloneri assediano la retroguardia del Maux senza tregua, cercando non solo i tre punti, ma anche di totalizzare più reti possibili. Al 15’ arriva la terza rete del Volta, sempre da un angolo dalla destra: Italiano mette a referto il terzo assist di giornata pescando alla perfezione la testa di Salerno. La partita prosegue a senso unico e nel finale c’è tempo per il poker, siglato dalla fucilata rasoterra di Ricciuti. Nella ripresa il Volta già in vantaggio di 4 misure si può permettere di abbassare i ritmi e apportare qualche modifica degli interpreti. Anche se il risultato sembra essere già in ghiaccio, le avanzate giallo nere non terminano, ma uno strepitoso Mattrel riesce sempre a mettere una pezza sugli errori dei compagni. Verso la metà del secondo tempo, il Volta ne sigla due in tre minuti: prima bomber Melloni fa la manita con la sua doppietta personale, poi Deda al volo si unisce alla festa siglando la sesta rete. Una partita completamente a senso unico, che porta il Volta a cinque punti in classifica.",
      },
      { type: "h3", text: "Top Players" },
      { type: "h2", text: "Volta" },
      {
        type: "ul",
        items: [
          "Melloni: Semplicemente il bomber della squadra, quando gioca lui la squadra acquisisce certezze e gioca meglio. Ovviamente scrive il suo nome nel tabellino per ben due volte.",
          "Italiano: Centricampista dotato di un piede ultra raffinato e lo dimostra mettendo a referto tre assist da corner.",
          "Salerno: Non solo si dimostra un autentico muro invalicabile in difesa, riesce anche a trovare la gioia personale con un colpo di testa nel primo tempo.",
        ],
      },
      { type: "h2", text: "Maux" },
      {
        type: "ul",
        items: [
          "Mattrel: Il migliore in campo del Maux. Inutile dire che senza di lui la squadra ne avrebbe potuto subire molti di più.",
        ],
      },
      { type: "h2", text: "Des Ambrois-Cattaneo" },
      {
        type: "p",
        text: "Nella partita piu attesa Catta e Desa si danno battaglia in uno scontro epocale: la cenerentola di provincia contro la storica corazzata. I provinciali fanno capire di che pasta sono fatti già dal primo minuto di gioco, sfiorando il vantaggio con la conclusione di Giugliano, respinta da Cisse. Le spinte del Desa continuano e al 5’ di gioco Molon si divincola bene in area di rigore per segnare l’1-0, andando ad esultare sotto i pochi (ma buoni) sostenitori arrivati da lontano. Doccia gelata per la squadra di Bisi, la quale è costretta ad inseguire. Intorno alla metà del primo parziale il Catta trova il pareggio con De Angelis, che sfrutta un’incomprensione difensiva avversaria. Dal pareggio neroverde il match torna ampiamente equilibrato, caratterizzato da ritmi altissimi e duelli in mezzo al campo fino all’intervallo. Nella ripresa il Catta, ancora galvanizzato dal pareggio, aumenta i giri del motore e va vicino al gol: un De Angelis in gran forma si inventa uno stop da urlo col quale salta l’avversario e riesce a concludere, trovando per sua sfortuna, l’ottima risposta di Beltrame. Ma come dice il detto: “la calma è la virtù dei forti” e il numero 30 del Catta aspetta con pazienza il momento giusto per deciderla. Al 12’ quel momento arriva e bomber De Angelis non si fa cogliere affatto impreparato: sugli sviluppi di un’azione dalla sinistra, viene messo cross un preciso sulla testa dell’attaccante neroverde, che svetta di testa e gonfia la rete, scatenando la festa di tutta la curva. A questo punto il Desa é costretto a spingersi in avanti per cercare il pareggio, ma non riesce mai ad incidere concretamente dalle parti di Cisse. Al triplice fischio, dunque, è la squadra di Bisi che conquista i 3 punti, portandosi in prima posizione a punteggio pieno, confermando ulteriormente la forza di una squadra sempre più protagonista della competizione.",
      },
      { type: "h3", text: "Top Players" },
      { type: "h2", text: "Cattaneo" },
      {
        type: "ul",
        items: [
          "De Angelis: Il classe ‘09 firma la sua prima doppietta nella competizione e inizia già a far parlare di sé. Prima si dimostra lesto per “rubare” il gol del pareggio, poi la decide con una rete da rapace d’area.",
        ],
      },
      { type: "h2", text: "Des Ambrois" },
      {
        type: "ul",
        items: [
          "Molon: Numero 10 assoluto protagonista in ogni fase del gioco: aiuta durante la manovra abbassandosi per dialogare coi compagni e davanti risulta cruciale alla prima occasione pericolosa.",
        ],
      },
    ],
  },
  {
    slug: "le-new-entry-si-danno-battaglia",
    competitionSlug: "mole-cup",
    title:
      "Le new entry si danno battaglia e la cenerentola di provincia batte la corazzata",
    dek: "Cupoli mette le mani sulla qualificazione del Cop/Lux; Molon continua ad incantare: doppietta che fa volare in alto il Desa",
    authors: ["D. Dessi"],
    dateLabel: "22 aprile 2026",
    dateIso: "2026-04-22",
    image: "/blog/le-new-entry-si-danno-battaglia.webp",
    imageAlt:
      "Le new entry si danno battaglia e la cenerentola di provincia batte la corazzata",
    body: [
      { type: "h2", text: "Darwin-Cop/lux" },
      {
        type: "p",
        text: "Iniziano finalmente le fasi finali, il momento clue della stagione. Si parte con Cop/Lux-Darwin, entrambe alla prima storica apparizione nel torneo, con un cammino abbastanza analogo finora. Nonostante un inizio altalenante, caratterizzato da una sconfitta per gli arancio neri e un pareggio per i bianco blu, nelle altre gare le due nuove arrivate sono riuscite ad imporsi contro le rivali per garantirsi il posto agli ottavi.",
      },
      {
        type: "p",
        text: "La partita inizia in modo equilibrato, con le due squadre che si studiano, senza partire subito a razzo. Dopo i primi minuti, però, si iniziano a stabilire le prime gerarchie: il Cop fraseggia e pressa alto, mentre il Darwin fatica ad uscire e predilige il lancio lungo per sfruttare la fisicità di Moine. Malgrado un inizio non al top, i rivolesi al 10’ riescono a trovare la prima conclusione del match con la punizione di Geme, ma la sfera termina sopra la traversa. La conclusione del 67 dà fiducia alla squadra di Plos, che la sblocca due minuti dopo. Da una palla recuperata sulla sinistra, Lipartiti semina il panico e salta due avversari prima di servire Moine in area, il quale a sua volta prolunga per Mucci che da due passi firma l’1-0. Il tridente d’attacco arancio nero continua ad affondare in fase offensiva, provando a raddoppiare al più presto. Ma entro la fine del primo tempo c’è spazio per il pari del Cop: alla prima disattenzione difensiva del Darwin, i bianco blu ne approfittano e Barutti dopo un eccellente controllo, trafigge Fortuna e ristabilisce la parità. Termina così un primo parziale molto equilibrato. Nel secondo tempo i ritmi sono più compassati, tanto che nei primi 10’ non si registrano particolari occasioni e nessuna squadra riesce a prevalere. Giusto dopo il quarto d’ora di gioco il Cop si fa vedere dalle parti della difesa del Darwin, arrivando ad essere pericoloso su una punizione dalla distanza, ma i rivolesi riescono a sventare la minaccia. Visto l’equilibrio inoltrato e visto che nessuna squadra riesce a sopraffare l’altra, i tecnici verso metà ripresa iniziano ad apportare modifiche tattiche per cambiare l’inerzia della gara. Nonostante ciò, le forze fresche non mutano l’andamento del match e dopo 5’ di recupero si va ai rigori. Qui, l’assoluto protagonista è il portiere del Cop/Lux: Fabrizio Cupoli. L’estremo difensore bianco blu mette letteralmente le mani sulla qualificazione, parando 3 rigori per garantire ai suoi la prima qualificazione ai quarti di finale.",
      },
      { type: "h3", text: "Top 3" },
      { type: "h2", text: "Darwin" },
      {
        type: "ul",
        items: [
          "Moine: In un inizio gara difficile, dove i suoi faticano ad uscire dal basso, lui si dimostra un assoluto riferimento in fase offensiva, dove con la sua fisicità riesce a tenere alta la squadra.",
          "Lipartiti: Solite incursioni pericolose a mettere in difficoltà la difesa avversaria. Ogni volta che ha palla può sempre creare qualcosa di inaspettato.",
          "Geme: Terzino sinistro di spinta che aiuta sempre durante la manovra offensiva, rendendosi partecipe con numerose avanzate e incaricandosi di battere le punizioni.",
        ],
      },
      { type: "h2", text: "Cop/Lux" },
      {
        type: "ul",
        items: [
          "Cupoli: Man of the match indiscusso. Durante i tempi regolamentari subisce una rete sulla quale non può nulla, ma ai rigori si trasforma e ne para ben tre, portando i suoi ai quarti.",
          "Barutti: Ottima prova da parte del centrocampista del Cop/Lux, coronata con la rete che ha ristabilito la parità.",
        ],
      },
      { type: "h2", text: "Galfer-desa" },
      {
        type: "p",
        text: "Il secondo ottavo di finale vede la corazzata Galfer, assoluta protagonista della fase a gironi in quanto passata facilmente con 8 punti, sfidare l’outsider Des Ambrois, passata con soli 4 punti ma non senza aver dato filo da torcere a Volta e Cattaneo. Sulla carta, dunque, ci si aspettava una grande partita e gli interpreti non hanno deluso. Il grande spirito della squadra di Oulx prevale fin dai primi istanti, dove al 5’ di gioco il solito Molon porta avanti i suoi. Sugli sviluppi di un corner messo in mezzo da sinistra, il numero 10 stacca più in alto di tutti e la piazza dove Massa non può arrivare. 1-0 quindi e Galfer chiamato subito all’inseguimento. Nonostante lo svantaggio iniziale, i torinesi cercano di riprenderla pochi minuti dopo, sfruttando una disattenzione difensiva avversaria, ma quando Bessone arriva davanti ad Atzoi chiude troppo il mancino e calcia fuori. Il pareggio comunque non tarda ad arrivare e al 15’ la squadra di Mainardi trova l’1-1. Capitan Lombardi sulla destra lascia secco il suo marcatore e crossa rasoterra per l’arrivo di Bessone, il capocannoniere del Galfer questa volta non si fa cogliere impreparato e mette la zampata giusta anticipando tutti. La parità del risultato si riflette anche sull’andamento in campo, ma verso fine primo tempo la squadra di provincia si riporta in vantaggio. Sempre sulla sinistra, sempre il giocatore più forte del Desa, Simone Molon, da dentro l’area calcia un missile col mancino e sigilla il raddoppio poco prima dell’intervallo. Un vantaggio meritato nel complesso, che mette in guardia la storica corazzata, la quale dovrà dare qualcosa in più per giocare una ripresa all’altezza della cenerentola di provincia. Nella ripresa, infatti, ci si aspetta una reazione galferina, ma é il Des Ambrois che si porta in avanti più volte, sfiorando il gol prima con le conclusioni di Giuliano e Arce, poi su una mischia da corner. Verso metà secondo tempo il Galfer alza i giri del motore, provando ad opprimere i giallorossi nella loro metà campo, ma senza mai essere realmente incisivi. Seppur le spinte continuino in modo insistente, i giallorossi in ripartenza colpiscono una traversa con Molon a 3’ dalla fine. Al 23’ Rasello prende il secondo giallo del match per un fallo su Sai e lascia i suoi in 10 per i minuti finali. L’inferiorità numerica, però, non limita il Desa, che la chiude in ripartenza: Giuliano di esterno destro imbuca per Scotto, inseritosi nella difesa sgualcita del Galfer, il 22 controlla, scavetto sul portiere e tap-in a porta vuota. La panchina esplode e la tribuna impazzisce: Il Des Ambrois é ai quarti di finale, la favola continua.",
      },
      { type: "h3", text: "Top 3" },
      { type: "h2", text: "Galfer" },
      {
        type: "ul",
        items: [
          "Sai: Quando si accende difficilmente viene fermato. Gran primo tempo, nel secondo si perde un po’, ma si procura il fallo che lascia in 10 il Desa.",
          "Misul: Si carica sulle spalle tutto il reparto difensivo, chiudendo le incursioni avversarie e trasmettendo passaggi precisi in avanti.",
          "Lombardi: Il capitano del Galfer non molla mai e anche nelle situazioni più complicate aiuta i compagni e li incita. Suo l’assist per il pareggio di Bessone.",
        ],
      },
      { type: "h2", text: "Des Ambrois" },
      {
        type: "ul",
        items: [
          "Molon: In queste partite si sta dimostrando autentico trascinatore di una squadra che punta su di lui. Capocannoniere della squadra e doppietta messa a referto, “El Diez” continua a incantare.",
          "Maffei: Anche se in un ruolo inedito per il centrocampista classe ‘08, con fame e voglia lui si mette in gioco e guida il reparto difensivo in modo magistrale.",
          "Scotto: Se Maffei fa bella figura dietro é anche merito del compagno di reparto. Il 22 del Des Ambrois non fa passare niente dietro e nei minuti finali si traveste da bomber andando a siglare la rete che chiude la partita.",
        ],
      },
    ],
  },
  {
    slug: "mvp-prima-giornata-aihem-farhani",
    competitionSlug: "leonessa-cup",
    title: "MVP prima giornata: Aihem Farhani",
    dek: "Un talento che non molla mai: Aihem Farhani illumina il Tartaglia nel pareggio thriller contro il Luzzago",
    authors: ["Paolo Passerini", "Nicolò Finazzi"],
    dateLabel: "29 aprile 2026",
    dateIso: "2026-04-29",
    image: "/blog/mvp-prima-giornata-aihem-farhani.jpeg",
    imageAlt: "MVP prima giornata: Aihem Farhani",
    imageCredit: "Foto di Daniele Martinelli",
    body: [
      { type: "h2", text: "MVP di giornata: Aihem Farhani" },
      {
        type: "p",
        text: "La partita tra Luzzago e Tartaglia Olivieri è stata sicuramente una delle più belle della prima giornata. Un pareggio pirotecnico che, oltre a un mucchio di goal, ha mostrato le qualità e la tecnica di alcune giovani promesse.",
      },
      {
        type: "p",
        text: "Dopo un primo tempo avaro di goal — a parte il rigore trasformato da Scuola allo scadere della prima frazione — ma non carente di emozioni e grandi giocate, nel secondo tempo è esplosa una stella. Per il Tartaglia è stato in realtà un faro che li ha portati a un pareggio che sa di vittoria: Aihem Farhani.",
      },
      {
        type: "p",
        text: "All'inizio del secondo tempo, su punizione, nonostante non fosse il più alto, è riuscito ad anticipare tutti e insaccare la palla in rete, riportando la parità. E anche dopo il 3-1 del Luzzago, è stato lui uno dei pochi che non hanno perso la speranza: dopo aver firmato la doppietta, ha servito quasi alla fine della partita un assist al bacio per il 3-3 da posizione estremamente defilata.",
      },
      {
        type: "p",
        text: "In mezzo a una parata di talenti come questa, lui è sicuramente quello che ha brillato di più — non solo per i dribbling e la tecnica messa in campo, ma anche per la leadership e la voglia di vincere portate in campo. L'assist effettuato praticamente dalla linea di fondo è il simbolo della sua partita: non ha mai mollato un centimetro e ha sempre creduto nel successo.",
      },
      {
        type: "p",
        text: "Se proprio si vuole cercare il pelo nell'uovo, lo si può individuare nel giallo preso nel secondo tempo per nervosismo, di sicuro evitabile.",
      },
      {
        type: "p",
        text: "Adesso non ci resta che aspettare e vedere se si ripeterà nelle prossime giornate!",
      },
    ],
  },
];

export function getCupBlogPosts(competitionSlug: string) {
  return CUP_BLOG_POSTS.filter((post) => post.competitionSlug === competitionSlug).sort(
    (a, b) => b.dateIso.localeCompare(a.dateIso),
  );
}

export function getCupBlogPost(competitionSlug: string, postSlug: string) {
  return CUP_BLOG_POSTS.find(
    (post) => post.competitionSlug === competitionSlug && post.slug === postSlug,
  );
}

export function getCupBlogHref(competitionSlug: string, postSlug?: string) {
  return postSlug
    ? `/competizioni/${competitionSlug}/blog/${postSlug}`
    : `/competizioni/${competitionSlug}/blog`;
}

export function competitionsWithBlog() {
  return [...new Set(CUP_BLOG_POSTS.map((post) => post.competitionSlug))];
}
