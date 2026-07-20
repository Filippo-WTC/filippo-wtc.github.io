// Generate 1200×630 OpenGraph social cards: each BU's logo centered on the
// brand near-black background (#0A0B0F). The *-mark.png logos are pre-colored
// white+orange for dark surfaces, so they read cleanly on this background.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const logos = resolve(root, 'public/images/logos');
const outDir = resolve(root, 'public/images/og');
mkdirSync(outDir, { recursive: true });

const W = 1200, H = 630;
const BG = { r: 10, g: 11, b: 15, alpha: 1 }; // #0A0B0F
const MAX_W = 720, MAX_H = 340;               // safe area for the logo

const cards = [
  { out: 'default',       logo: 'wtc-logo-white.png' },
  { out: 'services',      logo: 'wtc-logo-white.png' },
  { out: 'food',          logo: 'wtc-food-mark.png' },
  { out: 'pitter',        logo: 'wtc-pitter-italy-mark.png' },
  { out: 'global-portal', logo: 'wtc-global-portal-mark.png' },
  { out: 'team',          logo: 'wtc-team-mark.png' },
];

for (const { out, logo } of cards) {
  const resized = await sharp(resolve(logos, logo))
    .resize(MAX_W, MAX_H, { fit: 'inside', withoutEnlargement: true })
    .toBuffer();

  await sharp({ create: { width: W, height: H, channels: 4, background: BG } })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toFile(resolve(outDir, `${out}.png`));

  console.log(`✓ og/${out}.png  (from ${logo})`);
}

// Brand favicon set — isolate the square WTC mark by cropping the leftmost
// square of the horizontal white lockup (no standalone square asset exists),
// then render it on the brand background at each required size.
// Replaces the stock Astro favicon that shipped with the scaffold.
const markSquare = await sharp(resolve(logos, 'wtc-logo-white.png'))
  .extract({ left: 0, top: 0, width: 212, height: 212 })
  .trim()
  .toBuffer();

// Render the mark onto an opaque brand-bg square of the given size.
async function iconOnBg(size, pad) {
  const inner = size - pad * 2;
  const mark = await sharp(markSquare).resize(inner, inner, { fit: 'inside' }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toBuffer();
}

// apple-touch-icon: 180×180, OPAQUE (iOS masks/rounds it itself).
await sharp(await iconOnBg(180, 30)).toFile(resolve(root, 'public/apple-touch-icon.png'));
// Standard PNG favicons.
await sharp(await iconOnBg(32, 4)).toFile(resolve(root, 'public/favicon-32x32.png'));
await sharp(await iconOnBg(16, 2)).toFile(resolve(root, 'public/favicon-16x16.png'));
// PWA / Android home-screen icons.
await sharp(await iconOnBg(192, 32)).toFile(resolve(root, 'public/icon-192.png'));
await sharp(await iconOnBg(512, 86)).toFile(resolve(root, 'public/icon-512.png'));

// favicon.svg — embed the brand-bg PNG as a data URI so /favicon.svg is
// on-brand (the previous file was the default Astro logo). Rounded corners.
const svgPng = (await iconOnBg(128, 20)).toString('base64');
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <clipPath id="r"><rect width="128" height="128" rx="24"/></clipPath>
  <image href="data:image/png;base64,${svgPng}" width="128" height="128" clip-path="url(#r)"/>
</svg>`;
const { writeFileSync } = await import('node:fs');
writeFileSync(resolve(root, 'public/favicon.svg'), faviconSvg);
console.log('✓ apple-touch-icon.png + favicon-32/16 + favicon.svg (WTC mark)');
