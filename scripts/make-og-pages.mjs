// Generate per-page 1200×630 OpenGraph cards: BU mark top-left, page title
// bottom-left in Clash Display, hairline rule, brand grain. Rendered in a real
// browser (Playwright's cached headless Chromium) so the typography is the
// site's actual typography — librsvg/sharp can't load our woff2 fonts.
//
// Output: public/images/og/pages/<slug>.png where <slug> is the pathname with
// slashes → dashes ("/services/come-lavoriamo" → "services-come-lavoriamo", "/" → "home").
// Layouts resolve these automatically (see src/lib/og.ts). Cards are committed;
// re-run this script only when titles or brand assets change.
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { homedir, tmpdir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/images/og/pages');
mkdirSync(outDir, { recursive: true });

// ---------------------------------------------------------------------------
// Find a headless Chromium (Playwright cache first, then env override).
function findChrome() {
  if (process.env.OG_CHROME && existsSync(process.env.OG_CHROME)) return process.env.OG_CHROME;
  const cache = join(homedir(), 'Library/Caches/ms-playwright');
  if (existsSync(cache)) {
    for (const dir of readdirSync(cache).sort().reverse()) {
      for (const rel of [
        'chrome-headless-shell-mac-arm64/chrome-headless-shell',
        'chrome-headless-shell-mac-x64/chrome-headless-shell',
        'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
      ]) {
        const p = join(cache, dir, rel);
        if (existsSync(p)) return p;
      }
    }
  }
  throw new Error('No headless Chromium found. Set OG_CHROME to a Chrome binary path.');
}
const chrome = findChrome();

// ---------------------------------------------------------------------------
// Assets inlined as data URIs — file:// pages block cross-origin font fetches,
// and inlining keeps the render hermetic.
const dataUri = (path, mime) =>
  `data:${mime};base64,${readFileSync(resolve(root, path)).toString('base64')}`;

const fontClash = dataUri('public/fonts/ClashDisplay-Variable.woff2', 'font/woff2');
const fontInter = dataUri('public/fonts/Inter-latin.woff2', 'font/woff2');

const LOGOS = {
  services:        'public/images/logos/wtc-logo-white.png',
  team:            'public/images/logos/wtc-team-mark.png',
  'global-portal': 'public/images/logos/wtc-global-portal-mark.png',
  pitter:          'public/images/logos/wtc-pitter-italy-mark.png',
  food:            'public/images/logos/wtc-food-mark.png',
};
const logoUris = Object.fromEntries(
  Object.entries(LOGOS).map(([k, p]) => [k, dataUri(p, 'image/png')]),
);

// Group-level pages (home, /contatti) must not carry the SERVICES lockup:
// isolate the square WTC mark (same crop as the favicon set) and pair it
// with a "WTC Group" wordmark set in the template.
logoUris.group = `data:image/png;base64,${(
  await sharp(resolve(root, 'public/images/logos/wtc-logo-white.png'))
    .extract({ left: 0, top: 0, width: 212, height: 212 })
    .trim()
    .png()
    .toBuffer()
).toString('base64')}`;

// ---------------------------------------------------------------------------
// One entry per shareable page (redirects, legal pages and 404 keep the
// default/BU cards). Titles mirror each page's <title> main clause.
const cards = [
  { path: '/',                                    bu: 'group',         title: 'IT, Sport, Import e Agroalimentare' },
  { path: '/contatti',                            bu: 'group',         title: 'Parla con noi' },

  { path: '/services',                            bu: 'services',      title: 'Supporto IT Enterprise' },
  { path: '/services/come-lavoriamo',             bu: 'services',      title: 'Il Metodo WTC' },
  { path: '/services/assistenza-urgente',         bu: 'services',      title: 'Pronto Intervento IT' },
  { path: '/services/supporto-continuativo',      bu: 'services',      title: 'Partner IT su Richiesta' },
  { path: '/services/sicurezza-informatica',      bu: 'services',      title: 'Cybersecurity & Networking' },
  { path: '/services/partner-e-clienti',          bu: 'services',      title: 'Partner e Clienti' },
  { path: '/services/contatti',                   bu: 'services',      title: 'Contatti' },

  { path: '/team',                                bu: 'team',          title: 'Relazioni commerciali attraverso lo sport' },
  { path: '/team/eventi',                         bu: 'team',          title: 'Eventi e inviti' },
  { path: '/team/software-e-consulenza',          bu: 'team',          title: 'Software e consulenza' },
  { path: '/team/contatti',                       bu: 'team',          title: 'Contatti' },

  { path: '/global-portal',                       bu: 'global-portal', title: 'Trova produttori nel mondo' },
  { path: '/global-portal/come-funziona',         bu: 'global-portal', title: 'Come funziona' },
  { path: '/global-portal/aziende',               bu: 'global-portal', title: 'Per le aziende' },
  { path: '/global-portal/produttori',            bu: 'global-portal', title: 'Per i produttori' },
  { path: '/global-portal/contatti',              bu: 'global-portal', title: 'Contatti' },

  { path: '/pitter-italy',                        bu: 'pitter',        title: 'Ingegneria e macchinari per l’agroalimentare' },
  { path: '/pitter-italy/macchinari',             bu: 'pitter',        title: 'Macchinari industriali agroalimentari' },
  { path: '/pitter-italy/contatti',               bu: 'pitter',        title: 'Contatti' },

  { path: '/wtc-food',                            bu: 'food',          title: 'Specialità agroalimentari italiane di nicchia' },
  { path: '/wtc-food/regedano',                   bu: 'food',          title: 'Le Eccellenze di Regedano' },
  { path: '/wtc-food/export',                     bu: 'food',          title: 'Export e regali d’impresa' },
  { path: '/wtc-food/contatti',                   bu: 'food',          title: 'Contatti' },
];

const slugFor = (path) => path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'home';

// Display size steps down for long titles so everything fits in two lines.
const titleSize = (t) => (t.length <= 16 ? 96 : t.length <= 28 ? 84 : t.length <= 40 ? 72 : 62);

// Same near-threshold film grain as the site (SVG feTurbulence, static).
const GRAIN = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;

const html = ({ bu, title }) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Clash Display'; src: url('${fontClash}') format('woff2'); font-weight: 200 700; }
  @font-face { font-family: 'Inter'; src: url('${fontInter}') format('woff2'); font-weight: 100 900; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    position: relative; overflow: hidden;
    background: #0A0B0F;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 84px 88px 88px;
  }
  .glow {
    position: absolute; right: -220px; top: -260px; width: 720px; height: 720px;
    background: radial-gradient(circle, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0) 58%);
  }
  .grain {
    position: absolute; inset: 0; opacity: 0.04;
    background-image: url("data:image/svg+xml,${GRAIN}");
    background-size: 240px 240px;
  }
  .logo { position: relative; height: 58px; display: flex; align-items: center; gap: 22px; }
  .logo img { height: 100%; width: auto; }
  .logo .wordmark {
    font-family: 'Clash Display', sans-serif; font-weight: 480; font-size: 36px;
    color: #FFFFFF; letter-spacing: 0.01em;
  }
  .block { position: relative; }
  .rule { width: 64px; height: 1px; background: rgb(72 74 88); margin-bottom: 40px; }
  h1 {
    font-family: 'Clash Display', sans-serif; font-weight: 560;
    color: #FFFFFF; letter-spacing: -0.015em; line-height: 1.06;
    max-width: 980px; text-wrap: balance;
  }
</style></head>
<body>
  <div class="glow"></div>
  <div class="grain"></div>
  <div class="logo">
    <img src="${logoUris[bu]}" alt="">
    ${bu === 'group' ? '<span class="wordmark">WTC Group</span>' : ''}
  </div>
  <div class="block">
    <div class="rule"></div>
    <h1 style="font-size:${titleSize(title)}px">${title}</h1>
  </div>
</body></html>`;

// ---------------------------------------------------------------------------
const tmp = join(tmpdir(), `wtc-og-${process.pid}`);
mkdirSync(tmp, { recursive: true });

for (const card of cards) {
  const slug = slugFor(card.path);
  const page = join(tmp, `${slug}.html`);
  const shot = join(tmp, `${slug}.png`);
  writeFileSync(page, html(card));

  execFileSync(chrome, [
    '--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', '--virtual-time-budget=4000',
    `--screenshot=${shot}`, `file://${page}`,
  ], { stdio: 'pipe' });

  // Quantize: flat dark surfaces + antialiased text compress very well.
  const out = resolve(outDir, `${slug}.png`);
  await sharp(shot).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(out);
  console.log(`✓ og/pages/${slug}.png`);
}

rmSync(tmp, { recursive: true, force: true });
console.log(`\n${cards.length} cards written to public/images/og/pages/`);
