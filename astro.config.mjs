// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { EnumChangefreq } from 'sitemap';
import { readdir, readFile, writeFile } from 'node:fs/promises';

// Preloada il chunk GSAP (~113 KB) sulle sole pagine che lo usano. Senza, il
// browser lo scopre solo al secondo livello (dopo aver caricato e parsato lo
// script di pagina che lo importa), ritardando l'avvio del motion. Il nome del
// chunk è hashato per build, quindi si trova a build finito e si inietta un
// <link rel="modulepreload"> prima di </head> nelle sole pagine i cui script
// importano davvero GSAP (le pagine legali/404 non lo caricano → niente spreco).
/** @returns {import('astro').AstroIntegration} */
function gsapModulePreload() {
  return {
    name: 'gsap-modulepreload',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const astroDir = new URL('_astro/', dir);
        let jsFiles;
        try {
          jsFiles = (await readdir(astroDir)).filter((f) => f.endsWith('.js'));
        } catch {
          return;
        }
        const gsapChunk = jsFiles.find((f) => /^gsap\.[^.]+\.js$/.test(f));
        if (!gsapChunk) return;
        const gsapHref = `/_astro/${gsapChunk}`;
        // Chunk che importano GSAP: i loro script rendono una pagina "con motion".
        const importers = new Set([gsapChunk]);
        for (const f of jsFiles) {
          const src = await readFile(new URL(f, astroDir), 'utf8');
          if (src.includes(gsapChunk)) importers.add(f);
        }
        const tag = `<link rel="modulepreload" href="${gsapHref}">`;
        /** @type {URL[]} */
        const htmlFiles = [];
        /** @param {URL} d */
        const walk = async (d) => {
          for (const e of await readdir(d, { withFileTypes: true })) {
            const p = new URL(`${e.name}${e.isDirectory() ? '/' : ''}`, d);
            if (e.isDirectory()) await walk(p);
            else if (e.name.endsWith('.html')) htmlFiles.push(p);
          }
        };
        await walk(dir);
        let injected = 0;
        for (const p of htmlFiles) {
          const html = await readFile(p, 'utf8');
          if (html.includes(gsapHref)) continue; // già presente
          // La pagina usa GSAP se carica uno degli script importatori.
          const usesGsap = [...importers].some((c) => html.includes(`/_astro/${c}`));
          if (!usesGsap) continue;
          await writeFile(p, html.replace('</head>', `${tag}</head>`));
          injected++;
        }
        logger.info(`modulepreload GSAP iniettato in ${injected} pagine (${gsapChunk})`);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // Deploy target — served at the ROOT of the GitHub Pages user site
  // (https://filippo-wtc.github.io/, repo `filippo-wtc.github.io`,
  // no `base` needed; all absolute internal links work as-is).
  //
  // `site` below is set to the intended production domain (wtctesting.it)
  // so canonical URLs / sitemap / structured data are ready for the switch.
  // This does NOT move the deploy — GitHub Pages still serves from
  // filippo-wtc.github.io until DNS + `public/CNAME` are added:
  //   1. add a `public/CNAME` file containing `wtctesting.it`,
  //   2. point the domain's DNS at GitHub Pages + set it in Settings → Pages.
  // A custom domain also serves at root, so nothing else changes.
  site: 'https://wtctesting.it',

  // NB: trailingSlash lasciato al default ('ignore'), NON 'always'. La forma
  // canonica è comunque quella con slash (/services/): build in directory-mode,
  // canonical e sitemap la usano, e i link interni ora sono tutti slashati —
  // quindi zero 301 per navigazione. 'always' aggiungeva solo severità al server
  // di `astro preview` (404 sulle URL senza slash), un attrito locale che la
  // produzione non ha: GitHub Pages fa da sé il 301 /services -> /services/.
  // La coerenza dei link è verificata dal crawler, non serve la guardia.

  // Prefetch same-origin links on hover/tap — near-instant navigations
  // on a fully static site at negligible cost.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    gsapModulePreload(),
    sitemap({
      // Exclude redirect-only stubs — they 301 elsewhere and carry no content of their own.
      filter: (page) =>
        !page.endsWith('/services/overview/') &&
        !page.endsWith('/services/apple/') &&
        !page.endsWith('/pitter-italy/our-proof/') &&
        !page.endsWith('/team/vip-accreditation/') &&
        !page.endsWith('/team/hospitality/') &&
        !page.endsWith('/team/sponsorship/') &&
        // Stub aggiunti da FIL-302: le pagine sono state eliminate e queste
        // quattro rotte fanno solo 301 sulla sezione Global Portal.
        !page.endsWith('/global-portal/servizi-partner/') &&
        !page.endsWith('/global-portal/ricerca-fornitori/') &&
        !page.endsWith('/global-portal/audit-fabbriche/') &&
        !page.endsWith('/global-portal/importazione-completa/'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const isHome = path === '/';
        const isTopLevelBranch = /^\/[^/]+\/?$/.test(path) && !isHome;
        return {
          ...item,
          changefreq: isHome || isTopLevelBranch ? EnumChangefreq.WEEKLY : EnumChangefreq.MONTHLY,
          priority: isHome ? 1.0 : isTopLevelBranch ? 0.8 : 0.5,
        };
      },
    }),
  ],
  vite: {
    resolve: {
      alias: { '@': '/src' }
    }
  }
});
