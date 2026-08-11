# WTC Group — Sito Web

Sito statico multi-brand del gruppo WTC, costruito con **Astro**. Un unico progetto serve cinque business unit sotto lo stesso dominio:

| Business Unit | Percorso | Pubblico |
|---|---|---|
| WTC Services | `/services` | IT manager, CTO, PMI, istituti di credito |
| WTC Team | `/team` | Talenti, partner, ospitalità sportiva |
| Global Portal | `/global-portal` | Contatti B2B, commercio internazionale |
| Pitter Italy | `/pitter-italy` | Buyer industriali, procurement, macchinari |
| WTC Food | `/wtc-food` | Buyer, distributori, ristoratori |

- **Framework**: Astro 5 (output statico) · **Styling**: Tailwind CSS v3 · **Animazione**: GSAP + Lenis
- **Font**: Clash Display (titoli) e Inter (corpo), **self-hosted** in `public/fonts/*.woff2` (nessuna CDN esterna, dichiarati via `@font-face` in `src/styles/global.css`)
- **Hosting**: GitHub Pages (sito 100% statico, nessun backend)
- **Contatti**: link email diretti (`mailto:`) per ogni business unit
- **Eventi WTC Team**: il calendario è la route `/calendar` della piattaforma `contacts.wtcteam.com`, incorporata inline nella pagina Team con auto-resize via `postMessage`.

---

## 1. Setup su un Mac nuovo (da zero)

Da fare **una sola volta** su questo MacBook. Se hai già Node e Git, salta al passo 4.

### 1.1 — Command Line Tools di Apple (Git + compilatori)
```sh
xcode-select --install
```
> Git è incluso qui. Verifica con `git --version`.

### 1.2 — Homebrew (package manager per macOS)
Se `brew --version` non risponde:
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
Poi segui le istruzioni finali per aggiungere `brew` al PATH.

### 1.3 — Node.js (versione 20+, consigliata la LTS)
Astro 5 richiede **Node ≥ 18.20.8** (o 20.3+, o 22+). Consigliato installarlo con `nvm` per poter cambiare versione in futuro:
```sh
brew install nvm
mkdir -p ~/.nvm
# aggiungi al tuo ~/.zshrc:
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc

nvm install --lts
nvm use --lts
```
Verifica: `node -v` (deve mostrare v20 o v22) e `npm -v`.

> In alternativa, più veloce: `brew install node`.

### 1.4 — Configura Git (nome ed email per i commit)
```sh
git config --global user.name "Il Tuo Nome"
git config --global user.email "tua.email@wtcservices.it"
```

---

## 2. Avviare il progetto in locale

Dalla cartella `wtc-web/`:

```sh
npm install       # installa le dipendenze (prima volta e dopo ogni git pull)
npm run dev       # server di sviluppo → http://localhost:4321
```

> ⚠️ **Importante quando copi il progetto tra computer diversi** (es. da Windows a Mac):
> la cartella `node_modules/` contiene binari specifici del sistema operativo e **non va copiata**.
> Se il progetto è stato copiato con `node_modules` incluso, cancellala e reinstalla:
> ```sh
> rm -rf node_modules package-lock.json
> npm install
> ```

### Comandi disponibili

| Comando | Cosa fa |
|---|---|
| `npm install` | Installa le dipendenze |
| `npm run dev` | Server di sviluppo su `localhost:4321` con hot-reload |
| `npm run build` | Genera il sito statico in `./dist/` |
| `npm run preview` | Anteprima locale della build di produzione |
| `npm run astro -- --help` | CLI di Astro |

---

## 3. Deploy su GitHub Pages

Il sito è statico e viene pubblicato su **GitHub Pages** tramite GitHub Actions.
Il workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) fa il build con
`npm run build` e pubblica la cartella `dist/` a ogni push su `main`.

### Prima configurazione (una tantum)

1. Crea un repository Git e caricalo su GitHub:
   ```sh
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<utente>/wtc-web.git
   git push -u origin main
   ```
   > `node_modules/`, `dist/` e `.env` sono già esclusi dal [`.gitignore`](.gitignore).

2. Su GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.

3. Da qui in poi, **ogni `git push` su `main` fa un deploy automatico**. Lo stato è
   visibile nella tab **Actions** del repository.

### Dominio

Il repository si chiama **`filippo-wtc.github.io`**, quindi è un *user site* di GitHub
Pages servito alla **radice**: `https://filippo-wtc.github.io/`. Nessun `base` da
configurare — tutti i link interni assoluti (`/services`, `/team`, …) funzionano così come sono.

**Per collegare un dominio personalizzato in seguito** (es. `wtctesting.it`), basta perché
anche un dominio custom viene servito alla radice — non cambia nulla nei percorsi:

1. crea il file `public/CNAME` con il dominio (una riga);
2. punta il DNS del dominio verso GitHub Pages (record `A` verso gli IP di GitHub +
   record `CNAME` `www` → `filippo-wtc.github.io`) e impostalo in **Settings → Pages**;
3. cambia `site` in [`astro.config.mjs`](astro.config.mjs) con il nuovo dominio.

### Nota sui contatti e sugli eventi

Non c'è più alcun backend: i form di contatto sono stati sostituiti da **link email**
(`mailto:`) e la partecipazione agli eventi WTC Team è gestita dalla **webapp esterna su
Vercel**, incorporata nella pagina `/team`. Non servono variabili d'ambiente né segreti.

---

## 4. Struttura del progetto

```text
wtc-web/
├── astro.config.mjs          # config Astro (site, tailwind, sitemap, alias @ → /src)
├── tailwind.config.cjs       # design system (colori wtc-*, font, utilities)
├── .github/workflows/
│   └── deploy.yml            # build + deploy automatico su GitHub Pages
├── public/                   # asset statici serviti così come sono
│   ├── favicon.svg / .ico
│   ├── robots.txt
│   └── images/logos/         # loghi PNG delle business unit (footer)
└── src/
    ├── pages/                # ogni file = una route (services/, team/, global-portal/, ...)
    ├── layouts/              # RootLayout, BranchLayout + layout per business unit
    ├── components/
    │   ├── global/           # Navbar, Footer, LocalNav, ComingSoon
    │   ├── sections/         # Hero, Stats, CTA, Timeline, LogoGrid
    │   └── ui/               # Button, Badge, GlowText, canvas, ...
    ├── content/vault/        # case study WTC Services (Markdown, schema in content/config.ts)
    ├── data/navigation.ts    # navigazione centralizzata delle 5 business unit
    ├── layouts/branch/       # layout dedicati per business unit
    ├── lib/                  # gsap.ts (singleton animazioni) + lenis.ts (smooth scroll)
    └── styles/global.css     # CSS variables, utilities, import font CDN
```

Routing: Astro genera una route per ogni file `.astro`/`.md` in `src/pages/`.
Le pagine dei case study sono generate dinamicamente da `src/content/vault/*.md`
tramite `src/pages/services/vault/[slug].astro`.

---

## 5. Note

- **Output statico**: nessun database, nessun backend, nessun segreto — solo file generati in `dist/`.
  I contatti passano da link email; gli eventi WTC Team dalla webapp esterna su Vercel.
- **Font via CDN**: Clash Display e Inter sono caricati da rete in `src/styles/global.css`;
  serve connessione internet al primo caricamento (poi vengono messi in cache dal browser).
- **Accessibilità**: target WCAG 2.1 AA. Le animazioni GSAP rispettano `prefers-reduced-motion`.
- Riferimento completo su design, brand e token: [`CLAUDE.md`](CLAUDE.md).
