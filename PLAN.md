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

- [ ] 1.1 Tokenizzare le ~230 occorrenze `white/[0.0x]` → `--c-hairline` / `--c-surface-*` (41 file)
- [ ] 1.2 Budget arancione: SectionLabel a un segno, stats senza suffissi tutti orange, 1 accento/unità
- [ ] 1.3 Componente `SectionHeader` (label+heading+lead) → adottato nelle 22 pagine
- [ ] 1.4 Collassare i 5 branch layout in `BranchLayout branchId`
- [ ] 1.5 `tabular-nums` sui contatori StatsRow
- [ ] 1.6 Contrasto: `--c-text-muted` ≥ 4.5:1; via i testi `ice-grey/15–35`, `white/20–25`
- [ ] 1.7 Micro-type calendario (9–11px → floor 13px); `pt-[72px]/[124px]` → utility; token `max-w-container`
- [ ] 1.8 De-dup utility: `text-orange-gradient` vs `text-gradient-orange`, doppio sistema telemetry, shadow Button

## Fase 2 — Contenuto e gerarchia

- [!] 2.1 Prova su Services: SLA, anni, interventi/anno, dimensione team (vedi Input)
- [!] 2.2 Numeri reali Global Portal: produttori iscritti, paesi (vedi Input)
- [!] 2.3 Muro loghi clienti: loghi veri autorizzati o trattamento tipografico deliberato (vedi Input)
- [ ] 2.4 De-dup copy: 4× "Le domande più comuni", CTA Food verbatim, 5 contatti-cloni, 3× card "148"
- [ ] 2.5 Gerarchia: prova Pitter in alto; Food guidata dalle visciole; home senza doppia spinta IT
- [ ] 2.6 Pulizia inglese: "WTC Method", "Pattern recognition", "Full Managed", marquee Apple, ecc.
- [ ] 2.7 Fix stat "0 → 0" animato su Food; ripensare "0 in grande distribuzione" come hero stat
- [ ] 2.8 ALL-CAPS: de-uppercase H2/H3 Services e Pitter (coerenza con Team/Food/GP)

## Fase 3 — Motion elevation

- [ ] 3.1 `animateHeading` (reveal mascherato, già scritto in gsap.ts) su tutti gli H2 di sezione
- [ ] 3.2 Freccia "→" animata all'hover su tutte le card; hover depth (oggi solo border-color)
- [ ] 3.3 Bottoni magnetici su CTA primarie
- [ ] 3.4 `transition:name` per morph card-divisione → pagina BU
- [ ] 3.5 Navbar hide-on-scroll (CSS già presente, mai cablato) + underline animata
- [ ] 3.6 Timeline rail disegnata con lo scroll; parallasse interna HorizontalGallery

## Fase 4 — Asset e grafica

- [!] 4.1 Fotografia reale (vedi Input — il buco più grande del sito)
- [ ] 4.2 Pipeline `astro:assets`: AVIF + srcset + width/height, partendo dalle foto team (330 KB → ~50)
- [ ] 4.3 Logo WTC in SVG (oggi PNG 30–35 KB); marchi BU e apple-partner-logo in SVG
- [ ] 4.4 Font metric overrides (size-adjust/ascent-override) → CLS zero su swap
- [ ] 4.5 GSAP/Lenis non caricati su pagine legali e 404
- [ ] 4.6 `width`/`height` sugli img rimanenti (Navbar, Footer, LogoGrid)

## Fase 5 — Overengineering sorprendente

- [ ] 5.1 Canvas interattivi al puntatore (radar, globo, rete — oggi pointer-events:none)
- [ ] 5.2 Accenti per-BU reali: 5 tinte calibrate su `--branch-accent` (sistema esiste, oggi tutte uguali)
- [ ] 5.3 Telemetria vera nel footer Services (uptime/metriche reali)
- [ ] 5.4 Diagramma ecosistema scroll-linked (le 5 aziende che si connettono, disegnato con lo scroll)
- [ ] 5.5 Prefetch/Speculation Rules, OG dinamiche per pagina, BreadcrumbList JSON-LD
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

## Registro modifiche

- 2026-07-18 — Audit completo (4 analisi parallele + 33 screenshot). Creato questo piano.
- 2026-07-18 — Fase 0 avviata: 3 subagenti su canvas / motion / integrità contenuti. 0.9 completato.
- 2026-07-18 — **Fase 0 completata** (tranne 0.10, bloccata su input I-6).
  Verifica: `astro check` 0 errori, build 38 pagine ok, screenshot su home/services/team/food/GP,
  navigazione con view transition testata (canvas re-init ok), reduced-motion testato
  (contatori al valore finale, gallery in scroll nativo). Corretti in corsa: refuso privacy
  policy ("teciche"), typing Navbar (narrowing btn/menu), import ScrollTrigger inutilizzati.
