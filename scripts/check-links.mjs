// Verifica il sito costruito: nessun link interno rotto, nessuna pagina senza
// la propria card OpenGraph. Da eseguire dopo `npm run build`:
//
//   npm run build && node scripts/check-links.mjs
//
// Esce con codice 1 se trova qualcosa, così è utilizzabile in CI.
//
// Il secondo controllo esiste per un motivo preciso. Le card OG sono PNG
// nominati come lo slug (public/images/og/pages/<pathname con trattini>.png) e
// src/lib/og.ts le risolve cercando il file. Se una route viene rinominata e il
// PNG no, la pagina NON dà errore: cade in silenzio sulla card generica della
// business unit. Nessun link rotto, nessun warning, niente che un controllo dei
// soli link possa vedere. È il modo in cui una rinomina di slug fallisce senza
// che nessuno se ne accorga, e per questo è verificato qui.
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  console.error('dist/ non esiste. Esegui prima `npm run build`.');
  process.exit(1);
}

// Tutti gli .html generati, con il pathname servito da GitHub Pages.
const pages = [];
const walk = async (dir) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith('.html')) {
      const rel = p.slice(dist.length).replaceAll('\\', '/');
      pages.push({ file: p, url: rel.replace(/\/index\.html$/, '/').replace(/^$/, '/') });
    }
  }
};
await walk(dist);

// Un percorso è servibile se esiste come file, come directory con index.html,
// o come file .html senza estensione (GitHub Pages serve entrambi).
const servable = (pathname) => {
  const clean = decodeURIComponent(pathname.split(/[?#]/)[0]);
  const target = join(dist, clean);
  return (
    existsSync(target) ||
    existsSync(join(target, 'index.html')) ||
    existsSync(`${target}.html`) ||
    existsSync(join(dist, `${clean.replace(/\/$/, '')}.html`))
  );
};

// Pagine che usano di proposito la card della business unit invece di una
// propria: le legali e la 404 (vedi il commento in make-og-pages.mjs). Gli
// stub di redirect sono riconosciuti dal meta refresh, non serve elencarli.
const OG_ESENTI = new Set(['/privacy-policy/', '/cookie-policy/', '/404.html']);

const brokenLinks = [];
const missingOg = [];
const cardsInUso = new Set();

for (const page of pages) {
  const html = await readFile(page.file, 'utf8');

  // href/src interni: si scartano ancore pure, mailto/tel e URL assolute
  // verso altri host. Le URL assolute sul dominio di produzione vengono
  // ricondotte al loro pathname e verificate come interne.
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let v = m[1].trim();
    if (!v || v.startsWith('#') || /^(mailto:|tel:|data:|javascript:)/i.test(v)) continue;
    if (/^https?:\/\//i.test(v)) {
      const u = new URL(v);
      if (u.hostname !== 'wtctesting.it') continue; // host esterno, non è compito nostro
      v = u.pathname + u.hash;
    }
    if (!v.startsWith('/')) continue; // relativo: non ne usiamo, se ne compare va guardato a mano
    if (!servable(v)) brokenLinks.push({ from: page.url, to: v });
  }

  // Card OG: solo per le pagine reali. Gli stub di redirect portano un meta
  // refresh e cadono sulla card di BU, come le legali e la 404.
  const isRedirectStub = /http-equiv="refresh"/i.test(html);
  if (!isRedirectStub && !OG_ESENTI.has(page.url)) {
    const slug = page.url.replace(/^\/+|\/+$/g, '').replaceAll('/', '-') || 'home';
    cardsInUso.add(`${slug}.png`);
    if (!existsSync(join(root, 'public/images/og/pages', `${slug}.png`))) {
      missingOg.push({ url: page.url, expected: `public/images/og/pages/${slug}.png` });
    }
  }
}

// Il controllo inverso: una card che non appartiene più a nessuna pagina. È il
// sintomo esatto di una route rinominata senza il suo PNG — e a differenza
// della pagina senza card, un'orfana resta lì per sempre senza dare fastidio a
// nessuno finché qualcuno non condivide il link e vede la card sbagliata.
const cardsOrfane = (await readdir(join(root, 'public/images/og/pages')))
  .filter((f) => f.endsWith('.png') && !cardsInUso.has(f));

console.log(`${pages.length} pagine analizzate.`);

if (brokenLinks.length) {
  console.error(`\n✗ ${brokenLinks.length} link interni rotti:`);
  for (const b of brokenLinks) console.error(`    ${b.from}  →  ${b.to}`);
} else {
  console.log('✓ nessun link interno rotto');
}

if (missingOg.length) {
  console.error(`\n✗ ${missingOg.length} pagine senza card OpenGraph:`);
  for (const m of missingOg) console.error(`    ${m.url}  →  manca ${m.expected}`);
} else {
  console.log('✓ ogni pagina ha la sua card OpenGraph');
}

if (cardsOrfane.length) {
  console.error(`\n✗ ${cardsOrfane.length} card OpenGraph orfane (nessuna pagina le usa):`);
  for (const c of cardsOrfane) console.error(`    public/images/og/pages/${c}`);
} else {
  console.log('✓ nessuna card OpenGraph orfana');
}

process.exit(brokenLinks.length || missingOg.length || cardsOrfane.length ? 1 : 0);
