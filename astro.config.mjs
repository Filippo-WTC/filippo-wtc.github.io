// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Deploy target — served at the ROOT of a GitHub Pages user site.
  // The repo is named `prowebsitetester.github.io`, so it publishes at
  // https://prowebsitetester.github.io/ (no `base` needed; all absolute
  // internal links work as-is).
  //
  // To connect the custom domain later (e.g. wtctesting.it):
  //   1. add a `public/CNAME` file containing the domain (one line),
  //   2. point the domain's DNS at GitHub Pages + set it in Settings → Pages,
  //   3. change the line below to `site: 'https://wtctesting.it'`.
  // A custom domain also serves at root, so nothing else changes.
  site: 'https://prowebsitetester.github.io',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  vite: {
    resolve: {
      alias: { '@': '/src' }
    }
  }
});
