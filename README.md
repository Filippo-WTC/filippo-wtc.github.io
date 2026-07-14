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
- **Font**: Clash Display (Fontshare CDN) per i titoli, Inter (Google Fonts) per il corpo
- **Hosting**: GitHub Pages (sito 100% statico, nessun backend)
- **Contatti**: link email diretti (`mailto:`) per ogni business unit
- **Eventi WTC Team**: gestiti da una webapp separata su Vercel (`https://wtc-events-app.vercel.app`), incorporata nella pagina Team
- Il contesto di design completo è in [`CLAUDE.md`](CLAUDE.md).

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
git config --global user.email "andrea.rossi@wtcservices.it"
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

### Dominio personalizzato

Il dominio è gestito dal file [`public/CNAME`](public/CNAME) (attualmente `wtctesting.it`),
copiato automaticamente in `dist/` a ogni build.

- Per cambiare dominio: aggiorna **sia** `public/CNAME` **sia** `site` in
  [`astro.config.mjs`](astro.config.mjs) con lo stesso valore.
- Configura il DNS del dominio verso GitHub Pages (record `A` verso gli IP di GitHub +
  record `CNAME` `www` verso `<utente>.github.io`), poi verifica il dominio in
  **Settings → Pages**.

> **Senza dominio personalizzato** il sito verrebbe servito da `https://<utente>.github.io/<repo>/`.
> In quel caso rimuovi `public/CNAME` e aggiungi `base: '/<repo>'` in `astro.config.mjs`,
> altrimenti CSS e immagini non si risolvono.

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
│   ├── CNAME                 # dominio personalizzato per GitHub Pages
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
