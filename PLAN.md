# WTC Web — Piano verso il "perfetto"

> Audit del 2026-07-18. Punteggio contro benchmark elite (Stripe/Linear/Vercel): **4.6/10**.
> Questo file è la fonte di verità sull'avanzamento. Aggiornato ad ogni fix completato.

## Legenda
- [ ] da fare · [~] in corso · [x] fatto · [!] bloccato su input

---

## Fase 0 — Integrità

- [x] **0.1 Identità email unificata** — schema **per-BU, allineate**: root/footer/legali →
  `wtc@wtcservices.it`; ogni BU la sua (`wtc@wtcteam.it`, ecc.); JSON-LD = email visibile
  su ogni pagina (con `name` per-BU e `legalName` unico); `worldtradecontacts.com`: zero residui.
- [x] **0.2 Eliminazione definitiva tema chiaro** — CLAUDE.md dichiara dark-only;
  cookie-policy riscritta per rispecchiare la realtà (niente cookie, niente localStorage,
  font self-hosted — rimossi anche i riferimenti errati a Fontshare/Google Fonts CDN);
  rami `isLight()` rimossi da HeroCanvas e NetworkCanvas.
- [x] **0.3 Canvas a risoluzione nativa** — devicePixelRatio (cap 2) su entrambi i canvas,
  disegno in CSS px; NetworkCanvas re-inizializzato a ogni `astro:page-load` (prima moriva
  dopo la prima navigazione); rAF in pausa offscreen (IntersectionObserver) e a tab nascosta;
  ResizeObserver unificato e debounced.
- [x] **0.4 LCP sbloccato** — entrance hero in CSS puro (`.hero-enter`, stessa coreografia
  blur+lift, replay automatico sulle view transitions); GSAP resta solo per il parallasse.
  Nota: gli hero custom (es. services/apple) usano ancora `hero-anim-start` + GSAP → Fase 3.
- [x] **0.5 Reduced-motion completo** — guardia in StatsRow (numeri subito al valore finale),
  EcosystemFlow, Timeline, CTASection, Navbar, HorizontalGallery (fallback a scroll
  orizzontale nativo, niente pin) e nei 15 script inline di pagina; helper `animateHeading`/
  `revealOnScroll` guardati alla fonte in `gsap.ts` (`prefersReducedMotion()`).
- [x] **0.6 Memory leak** — `mm.revert()` su `astro:before-swap` in HorizontalGallery;
  listener Escape della Navbar registrato una sola volta a livello di modulo.
- [x] **0.7 CTA oneste** — "Registrati…" → "Scrivici come azienda" / "Proponi la tua azienda" /
  "Scrivici"; hero GP ora indirizza alle pagine esplicative.
- [x] **0.8 Pagine orfane GP** — scouting/audit/import nella localNav; breadcrumb con
  "WTC Global Portal" in posizione 2 e "Servizi partner" in posizione 3.
- [x] **0.9 Asset morti** — eliminati `team-tennis-alt.webp`, `team-carrera-box.webp` (223 KB),
  componente `ImagePlaceholder.astro` (0 usi).
- [!] **0.10 Calendario eventi** — iframe punta a `wtc-events-app.vercel.app`. Serve dominio brandizzato (vedi Input).

## Fase 1 — Sistema di design

- [x] 1.1 Sistema hairline/veil: token `hairline`/`hairline-strong`/`veil`/`veil-strong`
  al posto delle ~230 occorrenze `white/[0.0x]` — sweep completo su pagine e componenti
  (restano solo i watermark decorativi e 3 alpha fuori range, deliberati)
- [x] 1.2 Budget arancione: SectionLabel a un segno, suffissi stats neutri, ComingSoon
  a un solo accento; verificato da 3 agenti: nessun titolo con doppio accento residuo
- [x] 1.3 `SectionHeader` adottato in ~30 sezioni su tutte le BU (stack compositi con
  più paragrafi lasciati come colonne, solo de-CAPS — scelta documentata)
- [x] 1.4 `BranchLayout branchId` unificato (LocalNav automatica, OG per-BU);
  i 5 wrapper in `layouts/branch/` eliminati
- [x] 1.5 `tabular-nums` sui contatori e sui numeri di SectionLabel
- [x] 1.6 Contrasto: `--c-text-muted` → `126 133 147` (≥4.6:1 anche su surface-03);
  testi `ice-grey/15–35` leggibili → `text-muted` (footer, navbar, note legali Apple)
- [x] 1.7 `max-w-container` (39 file), `pt-navbar`/`pt-nav-full`; micro-type calendario
  9–11px → 13px (9 casi); hover LinkedIn `#0A66C2` → neutro
- [x] 1.8 De-dup: rimossi `.text-gradient-orange`, `.telemetry-bg*`, `.border-glow`,
  `.border-subtle`, `.surface-card` (plugin, 0-1 usi); Button usa `shadow-orange-sm/xs`
- [x] 2.8 (anticipato) ALL-CAPS rimosso dai display heading di Services e Pitter —
  effetto collaterale progettato dell'adozione di SectionHeader

Note post-sweep (da tenere d'occhio):
- HorizontalGallery: gutter `calc((100vw-1600px)/2)` hardcoda ancora 1600px (espressione
  aritmetica, non classe — cambiarla altererebbe il comportamento con root font ≠ 16px)
- EventsCalendar: chip del mese più alti di ~4px dopo il floor 13px; cerchio del giorno
  mobile un po' stretto con numeri a due cifre — verificare a occhio quando il calendario
  avrà dati reali

## Fase 2 — Contenuto e gerarchia

- [!] 2.1 Prova su Services: SLA, anni, interventi/anno, dimensione team (vedi Input)
- [!] 2.2 Numeri reali Global Portal: produttori iscritti, paesi (vedi Input)
- [!] 2.3 Muro loghi clienti: loghi veri autorizzati o trattamento tipografico deliberato (vedi Input)
- [x] 2.4 De-dup copy: FAQ differenziate per BU, CTA Food export riscritta, card "148"
  → componente `ContactPricingCard` (sempre etichettata "Un esempio");
  i 5 contatti erano già differenziati dalla Fase 0
- [x] 2.5 Gerarchia: sezione "Prova in campo" di Pitter spostata sopra "Ingegneria collaudata"
  (rinumerata 02/03); Food guidata dalle visciole ("Un frutto raro, otto specialità.");
  home senza doppia spinta IT (hero → #divisioni, CTA finale a un'azione sola)
- [x] 2.6 Pulizia inglese: Metodo WTC, "Schemi già visti", archivio di soluzioni, causa di fondo,
  analisi delle cause, "A freddo", regali d'impresa, "Gestito da noi", confronto sul campo,
  supporto di primo livello, ospiti/invitati al posto di stakeholder, ospitalità al posto
  di hospitality (ovunque), tagline Team in italiano
- [x] 2.7 Stat "0 → 0" eliminata: il claim "niente grande distribuzione" è un'affermazione
  nel copy della hero, non un contatore animato
- [x] 2.8 ALL-CAPS: fatto in Fase 1 via SectionHeader

## Fase 3 — Motion elevation

- [x] 3.1 Reveal mascherato a livello di parola (`animateHeadingWords`, preserva accenti arancioni
  e `<br/>`, aria-label per gli screen reader) coreografato dentro `SectionHeader`:
  label → titolo → lead sotto un solo trigger; DOM mai splittato con reduced-motion
- [x] 3.2 `.link-arrow` (36 conversioni, con fix dei conflitti `a:hover >` diretto) e
  `.card-lift`/`.card-lift-glow` (16 card cliccabili; le card informative deliberatamente
  escluse — la profondità implica cliccabilità). Fix critici: `clearProps` sui tween
  d'ingresso (l'inline transform di GSAP avrebbe ucciso il lift), rimozione `transition-all`
- [x] 3.3 Bottoni magnetici su primary/outline (max 6px, via custom property CSS per non
  rompere il feedback di pressione; spenti su touch e reduced-motion)
- [x] 3.4 `transition:name="brand-logo"` sul logo navbar → morph gruppo↔BU tra le pagine
  (il morph card-divisione→hero valutato e scartato: blocchi troppo diversi, morph brutto)
- [x] 3.5 Navbar hide-on-scroll cablata (giù nasconde, su mostra, sempre visibile in cima
  e a menu aperto) + underline attiva animata al posto del puntino statico
- [x] 3.6 Rail Timeline disegnata con lo scroll (scrub, init per-istanza); profondità card
  nella HorizontalGallery (scala/opacità dal centro, offset precalcolati, zero layout/frame)

## Fase 4 — Asset e grafica

- [!] 4.1 Fotografia reale (vedi Input — il buco più grande del sito)
- [x] 4.2 Pipeline `astro:assets`: foto team in `<Picture>` AVIF+WebP con srcset 480/800/1200
  e `sizes` calcolati dal layout reale (calcio: 330 KB → ~34 KB mobile / ~89 KB desktop);
  fix del fallback PNG di default di Astro (avrebbe prodotto fallback da 1-2 MB)
- [!] 4.3 Logo WTC in SVG — serve il **master vettoriale** del wordmark (vedi Input I-8)
- [x] 4.4 Font fallback metric-adjusted: Arial scalata con size-adjust/ascent/descent
  calcolati dai file font reali (fontkit) — Inter 107%, Clash 117.9% → swap senza CLS
- [x] 4.5 Runtime motion estratto in `MotionRuntime.astro`, spento su legali e 404
  (`motion={false}`); Navbar riscritta senza GSAP (underline e stagger menu in CSS puro)
  → le pagine legali ora caricano solo router + prefetch, zero bundle animazioni
- [x] 4.6 `width`/`height` su footer, overlay di transizione e logo Apple; +
  **prefetch hover** attivato in astro.config (navigazioni quasi istantanee)

## Fase 5 — Overengineering sorprendente

- [x] 5.1 Canvas al puntatore: rete che si scosta (rep. 10px) con linee illuminate, radar che
  evidenzia i nodi vicini, globo con deriva ±8°, pallone con tilt ~6° — tutto doppio-lerp 0.06
  (lento, "vivo" ma mai inseguitore), solo pointer fine, mai sotto reduced-motion,
  non può svegliare i canvas in pausa; blueprint e albero deliberatamente esclusi
- [!] 5.2 Accenti per-BU — **congelato su decisione utente (2026-07-19): da proporre al CEO,
  non ora.** Palette proposta e pronta: Services #F26522 (brand), Team #3EAE7C verde campo,
  Global Portal #4C9EEB azzurro rotte, Pitter #8FA3B8 acciaio, Food #C34A5A visciola.
  Applicazione prevista (chirurgica): indicatore LocalNav attivo, numero SectionLabel,
  pallini badge — l'arancione resta l'unico accento primario. Il sistema `--branch-accent`
  è già cablato: attivarla è un cambio di 5 valori in navigation.ts + 3 consumer CSS.
- [ ] 5.3 Telemetria vera nel footer Services (uptime/metriche reali)
- [x] 5.4 Ecosistema auto-cablante: fili curvi chip→chip misurati dal DOM (rimisurati su
  resize e fonts.ready), disegnati in scrub con punto luminoso sulla punta; progress-based
  così il resize re-renderizza a metà corsa; statico e completo sotto reduced-motion
- [x] 5.5 Prefetch hover (Fase 4) + BreadcrumbList JSON-LD su 24 sottopagine via helper
  condiviso (18 blocchi hand-rolled migrati byte-identici); **OG per-pagina fatte
  (2026-07-20)**: 30 card 1200×630 generate da `scripts/make-og-pages.mjs` (template HTML
  reso in Chromium headless — tipografia Clash Display reale, marchio BU, grana filmica;
  lockup "WTC Group" dedicato per home e /contatti), risoluzione automatica per pathname
  in `src/lib/og.ts` con fallback per-BU → default; legali e 404 restano sulla default
- [ ] 5.6 Calendario eventi nativo (via iframe)

---

## Input richiesti (specifici)

| # | Cosa serve | Per cosa | Formato ideale |
|---|---|---|---|
| I-1 | **Foto macchinari Pitter**: almeno 1 foto per snocciolatrici, vasche di lavaggio, linee complete — in produzione, non in showroom | 2.5 / 4.1 | orizzontali, ≥2000px lato lungo |
| I-2 | **Foto prodotti Food**: le 8 specialità alle visciole (bottiglie/vasetti su fondo neutro o still-life scuro) + 2–3 scatti territorio/eccellenze Regedano | 4.1 | ≥1600px, fondo coerente |
| I-3 | **Numeri Services**: anno di inizio attività, n. interventi/anno (anche approssimato), SLA di prima risposta reale, dimensione team tecnico | 2.1 | anche a voce |
| I-4 | **Numeri Global Portal**: produttori realmente iscritti, paesi coperti | 2.2 | anche a voce |
| I-5 | **Loghi clienti**: file vettoriali dei loghi autorizzati tra RDS, Banca CF+, Gardant, EPM, Meridian, Gruppocity, Sanatrix, Invitalia, Intellitronika, Banca del Fucino, ALES — e conferma scritta di poterli mostrare | 2.3 | SVG/PDF |
| I-6 | **Dominio calendario eventi**: un sottodominio (es. `eventi.wtcservices.it`) da puntare all'app Vercel | 0.10 / 5.6 | CNAME |
| I-7 | **SLA/uptime per telemetria** (se si vuole la 5.3): fonte dati reale (es. UptimeRobot API) | 5.3 | endpoint/API key |
| I-8 | **Master vettoriale del logo WTC** (wordmark completo + marchi BU) per sostituire i PNG da 30-35 KB | 4.3 | SVG/AI/PDF |

## Fase 6 — Texture e progressive disclosure (input utente 2026-07-19)

- [x] 6.1 Grana filmica globale (SVG feTurbulence, statica, opacità 3.5%) — de-appiattisce i vuoti scuri
- [x] 6.2 Componente `Disclosure` (espansione inline stile Apple, grid-rows 0fr→1fr, aria completa,
  listener delegato unico) — pilota su Pitter: dettagli macchine dietro "+" (con slot commento
  per le foto I-1) e FAQ richiudibili
- [ ] 6.3 Estensione disclosure a Metodo/Apple/FAQ altrove — dopo validazione del pilota
- [ ] 6.4 Scena firma scroll-stop (galleria visciole elevata) — vincolata alle foto I-2
- [~] 6.5 Micro-texture per BU — **variante "organica" fatta e pilotata su Food (2026-07-20)**:
  `SectionTexture.astro` + `.texture-organic` in global.css (pozze radiali morbide per la
  profondità + macchiatura frattale a grana larga per il "tessuto"; niente geometria — la
  griglia ortogonale è il linguaggio tecnico di Services; niente accento arancione in più).
  Decorativa pura: `aria-hidden`, `pointer-events:none`, statica → nessuna guardia
  reduced-motion necessaria. Scelta fra 4 candidate rese sulla pagina vera; scartate:
  macchiatura forte (sporca), righe diagonali (troppo simili alla griglia telemetrica).
  Difetto trovato e corretto in corsa: il pattern ripetuto mostrava cuciture ogni 600px →
  ora riquadro unico stirato (`no-repeat` + `100% 100%`).
  Restano da valutare le varianti per gli altri 4 BU, dopo validazione utente di questa.

## Registro modifiche

- 2026-07-20 — **Sweep qualità a 4 agenti (a11y, performance, codice morto+SEO, regressione
  visiva)** su sito live. Applicato:
  - PERF: `Button.astro` importava tutto GSAP (116KB) per l'attrazione magnetica di 6px →
    reimplementata in rAF vanilla; il 404 ora non spedisce GSAP (solo router + 45 byte).
  - A11Y (bloccante): menu mobile chiuso aveva 6 link focalizzabili sotto aria-hidden → ora
    `inert`. Contrasti a norma: numeri sezione arancione/70 (3,5:1) → pieni (6,2:1),
    didascalia rossa Metodo idem; watermark decorativo → aria-hidden.
  - VISIVO: pannello menu mobile reso opaco (il testo pagina traspariva dove il
    backdrop-filter non veniva applicato); dissolvenza destra sulla LocalNav mobile.
  - PULIZIA: rimossi `ComingSoon.astro`, `EventsCalendar.astro` (faceva fetch esterno in
    build), 5 loghi `-footer.png`, `getLenis()`, 6 classi CSS inutilizzate.
  - SEO: `sameAs` popolato (5 LinkedIn), `vatID` aggiunto all'Organization JSON-LD.
  - **Aperto, deciso dall'utente**: il CTA primario è bianco su arancione = 3,15:1, sotto la
    soglia AA (serve 4,5:1). Due opzioni: testo nero su arancione (6,66:1) o fondo arancione
    più scuro. È una scelta di brand → da confermare, non toccato.
  - **Aperto, deciso dall'utente**: casing denominazione legale "WTC Services" vs
    "WTC SERVICES" incoerente (8 file) — dipende dalla visura, da uniformare.

- 2026-07-20 — **Galleria: pin abbandonato, scorrimento nativo.** Dopo tre giri di
  correzioni Safari, ricerca a fonti: `overflow-x:clip` è implementato male in Safari
  (clippa anche l'asse Y — bug Apple 745729 aperto, e l'avevo introdotto io come "fix"),
  `mix-blend-mode` dentro un elemento `position:fixed` è un punto debole noto di WebKit
  (e la texture era finita dentro la sezione pinnata), Lenis avvisa che `position:fixed`
  arranca su Safari macOS. Ma il motivo decisivo è indipendente: **il track pinnato non
  aveva alcun accesso da tastiera — violazione WCAG 2.1.1** contro il target AA dichiarato.
  Ora: contenitore a scorrimento nativo con snap su tutti i breakpoint, zero JS, barra di
  avanzamento in CSS guidata dallo scroll con ripiego statico. Perso l'effetto pin,
  guadagnati affidabilità su ogni browser, tastiera, ripristino della posizione e la
  cancellazione del ramo reduced-motion. `overflow-x:clip` rimosso dal body.
- 2026-07-20 — **Texture per BU completate (6.5)**: variante scelta da sé via `data-branch`
  — acciaio spazzolato (Pitter), isoipse (Global Portal), luce da stadio (Team), griglia
  telemetrica (Services), grana organica (Food). Due strati: pozze per la profondità,
  motivo per il tessuto. Su mobile i motivi a linee da 1px si spengono (moiré a DPR 2-3 e
  costo di composizione inutile), restano le pozze. Zero overflow orizzontale su tutte le
  pagine a tutte le larghezze, per la prima volta.
- 2026-07-20 — **Linea di navigazione**: non si ridisegna più a ogni pagina. Le due linee
  (BU in navbar, pagina in LocalNav) hanno un `transition:name`, quindi il browser le
  interpola: cambiando BU la linea scorre, restando nella stessa non si muove, e la
  LocalNav segue la pagina. Disegno da zero solo all'arrivo a freddo (`data-navigated`).
- 2026-07-20 — **Loghi: 12 su 17 recuperati** da fonti ufficiali (autorizzazione confermata
  dalla direzione). Mancano HPE, Sanatrix, EPM, Meridian Group, Gruppocity — le ultime tre
  non identificabili con certezza. RDS è una derivazione monocromatica, **da far confermare**.
- 2026-07-20 — Favicon: il ritaglio era fisso a 212px su un marchio largo 248 — tagliava il
  15%. Ora la larghezza si ricava dall'immagine, così non si rompe in silenzio.

- 2026-07-20 — **Safari, scorrimento orizzontale: causa vera trovata.** Non era
  l'animazione. Due difetti indipendenti, entrambi invisibili in WebKit headless
  (niente scroll inerziale) ma decisivi in Safari reale: (1) `.hg-viewport` era
  `overflow-visible` da md in su, quindi il track da 2860px allargava il documento di
  ~1450px — `overflow-x` sul `body` non lo tagliava mai, perché l'elemento che scrolla è
  `html`. Risultato: la pagina si poteva trascinare di lato e uno swipe col trackpad
  scorreva *la pagina* invece di pilotare la galleria. (2) `body` aveva `overflow-x:hidden`,
  che fa calcolare `overflow-y:auto` e trasforma il body in contenitore di scroll — il modo
  documentato di rompere il pin di ScrollTrigger, e Safari è più severo di Blink.
  Entrambi risolti con `overflow-x:clip` (taglia senza creare contenitore di scroll).
  Verificato che `clip` e `hidden` sono per il resto identici e che nessuna pagina ha
  guadagnato overflow orizzontale. **L'animazione resta quella che è: non serve cambiarla.**
- 2026-07-20 — **Touch area delle disclosure**: il bersaglio percepito era la "+" da 16px e
  i 32px di padding della card erano morti. Ora l'intero blocco header apre la sezione
  (area estesa con pseudo-elemento posizionato: zero impatto sul layout), riga ≥44px
  (era ~28 su machinery, con 16px morti sotto il filetto), e l'area si ritrae quando il
  pannello è aperto così il testo rivelato resta cliccabile e selezionabile. Corretti nello
  stesso file: la guardia "una volta sola" era un `let` di modulo che non poteva mai essere
  vera (una ri-valutazione del modulo avrebbe raddoppiato il listener, annullando ogni
  toggle) e il `role="region"` senza nome accessibile.
- 2026-07-20 — **Brief fotografico completo** (inventario generato dal codice): 47 scatti,
  2 schermate di prodotto, 17 loghi mancanti, in ordine di priorità e con la destinazione
  esatta di ciascuno. Espande I-1/I-2/I-5/I-8 in una lista consegnabile al cliente.
  Segnalato: le 4 foto sportive già online sembrano stock — verificare la licenza.

- 2026-07-20 — **Ritmo verticale** (audit misurato, non a occhio): il CTA finale era ~51%
  padding attorno a una colonna `max-w-2xl` (`py-24 md:py-36` a mano invece del token) →
  ora `section-py` su tutti e 25 i call site; blocco Food da 565 a 493px. `HorizontalGallery`
  era l'unica sezione del sito senza `border-t`: i ~170px fra stats e card leggevano come
  nero indifferenziato → bordo aggiunto. Rimosso l'override `mt-16 md:mt-20` su team/eventi,
  che ora sballava il ritmo invece di sistemarlo. Verificato che `variant="full"` non è usato
  da nessuno e che nessun CSS puntava alle vecchie classi di padding.
- 2026-07-20 — Micro-texture organica su Food (6.5, pilota) — vedi Fase 6.
- 2026-07-20 — **Fix Safari hero (bug vero trovato via probe WebKit)**: lo swap delle
  view transitions rimpiazza gli attributi di `<html>` e cancellava `is-safari` — dalla
  seconda pagina in poi Safari finiva sul percorso blur fragile (hero rotta navigando,
  es. home → Food). Ora la classe si ri-aggiunge su `astro:after-swap`. In più l'entrata
  Safari recupera la coreografia completa (distanze per-elemento + scale del titolo,
  solo il blur resta fuori). Verifica: traiettoria campionata al primo frame su WebKit,
  replay su 2 salti di navigazione, controprova Chromium (percorso blur intatto).
- 2026-07-20 — OG per-pagina (5.5 chiusa): 30 social card con titolo di pagina,
  generatore `make-og-pages.mjs` + helper `og.ts`, verificate su dist (ogni og:image
  referenziata esiste, 1200×630, legali/404 su default). Build 38 pagine, 0 errori.
- 2026-07-18 — Audit completo (4 analisi parallele + 33 screenshot). Creato questo piano.
- 2026-07-18 — Fase 0 avviata: 3 subagenti su canvas / motion / integrità contenuti. 0.9 completato.
- 2026-07-19 — Fasi 1-5 completate e pushate (7 commit). Review utente: LocalNav sincronizzata
  con hide-on-scroll, nav centrata sul logo più largo, underline a larghezza testo, hamburger
  ridisegnato. Accenti per-BU congelati (decisione CEO). Restano: input I-1..I-8, 5.3, 5.6.
- 2026-07-18 — **Fase 0 completata** (tranne 0.10, bloccata su input I-6).
  Verifica: `astro check` 0 errori, build 38 pagine ok, screenshot su home/services/team/food/GP,
  navigazione con view transition testata (canvas re-init ok), reduced-motion testato
  (contatori al valore finale, gallery in scroll nativo). Corretti in corsa: refuso privacy
  policy ("teciche"), typing Navbar (narrowing btn/menu), import ScrollTrigger inutilizzati.
