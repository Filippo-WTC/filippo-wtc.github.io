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
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // Exclude redirect-only stubs — they 301 elsewhere and carry no content of their own.
      filter: (page) =>
        !page.endsWith('/services/overview/') &&
        !page.endsWith('/pitter-italy/our-proof/') &&
        !page.endsWith('/team/vip-accreditation/'),
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
