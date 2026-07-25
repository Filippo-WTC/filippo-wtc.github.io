// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { EnumChangefreq } from 'sitemap';

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
    sitemap({
      // Exclude redirect-only stubs — they 301 elsewhere and carry no content of their own.
      filter: (page) =>
        !page.endsWith('/services/overview/') &&
        !page.endsWith('/pitter-italy/our-proof/') &&
        !page.endsWith('/team/vip-accreditation/') &&
        !page.endsWith('/team/hospitality/') &&
        !page.endsWith('/team/sponsorship/'),
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
