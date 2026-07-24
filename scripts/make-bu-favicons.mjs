// Generates a per-business-unit favicon set from each BU's two-tone lockup mark.
//
// Each brand mark in public/images/logos/wtc-<bu>-mark.png is a horizontal
// lockup (icon glyph + wordmark). We crop just the icon glyph, centre it on a
// rounded black square matching the group favicon, and emit svg + 16/32 +
// apple-touch under public/favicons/<branchId>/. BranchLayout wires the set.
//
// WTC Services is the group division and keeps the root group mark, so it is
// not listed here.
//
//   node scripts/make-bu-favicons.mjs
//
import sharp from "sharp";
import fs from "node:fs";

// branchId -> mark file basename
const MAP = {
  team: "wtc-team",
  "global-portal": "wtc-global-portal",
  pitter: "wtc-pitter-italy",
  "wtc-food": "wtc-food",
};

const BG = { r: 0x0a, g: 0x0b, b: 0x0f }; // --wtc-black
const CANVAS = 512;
const RADIUS = Math.round((CANVAS * 24) / 128); // same corner ratio as favicon.svg
const GLYPH_BOX = Math.round(CANVAS * 0.6); // padding to match the group mark

async function extractGlyph(markFile) {
  const f = `public/images/logos/${markFile}-mark.png`;
  const { data, info } = await sharp(f)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: ch } = info;
  const colInk = (x) => {
    for (let y = 0; y < H; y++) if (data[(y * W + x) * ch + 3] > 20) return true;
    return false;
  };
  let x = 0;
  while (x < W && !colInk(x)) x++;
  const start = x;
  // the icon ends at the first wide transparent gap before the wordmark
  let gap = 0;
  let end = W;
  for (x = start; x < W; x++) {
    if (colInk(x)) gap = 0;
    else {
      gap++;
      if (gap > W * 0.06) {
        end = x - gap;
        break;
      }
    }
  }
  const region = await sharp(f)
    .extract({ left: start, top: 0, width: end - start, height: H })
    .png()
    .toBuffer();
  return sharp(region).trim().png().toBuffer(); // tight alpha bbox
}

const roundedRect = (fill) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}"><rect width="${CANVAS}" height="${CANVAS}" rx="${RADIUS}" ry="${RADIUS}" fill="${fill}"/></svg>`,
  );

for (const [bid, mark] of Object.entries(MAP)) {
  const glyphBuf = await extractGlyph(mark);
  const gm = await sharp(glyphBuf).metadata();
  const scale = Math.min(GLYPH_BOX / gm.width, GLYPH_BOX / gm.height);
  const gw = Math.round(gm.width * scale);
  const gh = Math.round(gm.height * scale);
  const glyph = await sharp(glyphBuf).resize(gw, gh).png().toBuffer();
  const base512 = await sharp(roundedRect(`rgb(${BG.r},${BG.g},${BG.b})`))
    .composite([
      {
        input: glyph,
        left: Math.round((CANVAS - gw) / 2),
        top: Math.round((CANVAS - gh) / 2),
      },
    ])
    .png()
    .toBuffer();

  const dir = `public/favicons/${bid}`;
  fs.mkdirSync(dir, { recursive: true });
  await sharp(base512).resize(180, 180).png().toFile(`${dir}/apple-touch-icon.png`);
  await sharp(base512).resize(32, 32).png().toFile(`${dir}/favicon-32x32.png`);
  await sharp(base512).resize(16, 16).png().toFile(`${dir}/favicon-16x16.png`);

  const png128 = await sharp(base512).resize(128, 128).png().toBuffer();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <clipPath id="r"><rect width="128" height="128" rx="24"/></clipPath>
  <image href="data:image/png;base64,${png128.toString("base64")}" width="128" height="128" clip-path="url(#r)"/>
</svg>
`;
  fs.writeFileSync(`${dir}/favicon.svg`, svg);
  console.log(`${bid.padEnd(15)} generated (glyph ${gm.width}x${gm.height})`);
}
