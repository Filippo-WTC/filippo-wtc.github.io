// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Deploy target. Keep this in sync with public/CNAME.
  // Temporary domain for now; switch to the production domain when it's ready.
  // If ever served without a custom domain (username.github.io/<repo>),
  // also set `base: '/<repo>'` so assets resolve correctly.
  site: 'https://wtctesting.it',
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
