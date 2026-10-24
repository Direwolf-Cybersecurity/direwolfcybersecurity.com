// Generates every brand image the website ships from the owner's master artwork in docs/brand/v2/
// (1254 x 1254 RGBA PNGs with transparent backgrounds, designed for dark surfaces), with sharp.
// The outputs are committed, so the build and CI never run this; run it again only when the
// masters, the site name or the tagline change:
//
//   npm run brand:assets
//
// The 1254 px masters are never shipped: pages import only the derivatives written to
// src/assets/brand/, and public/ holds only the icons and the social card below. The platform app
// (direwolf-platform, frontend/scripts/brand-assets.mjs) is built from the same masters; the tile
// colour and the electric blue here match its `--brand-panel` and primary colours.
//
// Outputs:
//   src/assets/brand/direwolf-shield-{72,144,288}.png     the shield cropped to its artwork and
//                                                          centred on a transparent square (header
//                                                          36 px and footer 32 px, srcset 2x to 8x)
//   src/assets/brand/direwolf-logo-stacked-{320,640}.png  the stacked lockup cropped to its artwork
//                                                          (Home hero and About panels, 1x and 2x)
//   public/favicon.ico            16, 32 and 48 px PNGs in one ICO container (/favicon.ico requests)
//   public/favicon-16x16.png      tab icon, transparent
//   public/favicon-32x32.png      tab icon, high density, transparent
//   public/apple-touch-icon.png   180 px, the shield on a near-black tile (iOS paints transparency
//                                 black anyway, and the dark shield needs a dark field to read)
//   public/icon-192.png           web manifest (public/manifest.webmanifest), same tile
//   public/icon-512.png           web manifest, same tile
//   public/og-image.png           1200 x 630 Open Graph / Twitter card: the stacked lockup and the
//                                 tagline on near-black
//
// "Cropped to its artwork": the masters carry a faint glow haze far from the art, so the crop is
// the bounding box of pixels at least ALPHA_CROP opaque (8/255, about 3 %, invisible on any
// background). Nothing is upscaled: the largest derivative (the 640 px lockup, the 512 px icon's
// 410 px shield) is drawn from the 1254 px masters.
//
// Encoding: each image is encoded as truecolour and as a 256-colour palette with alpha
// (libimagequant), and the palette copy is written only when it looks identical: its PSNR against
// the truecolour copy, composited over white and over the near-black panel, is at least MIN_PSNR
// (38 dB), and smaller. On 2026-10-24 every output passed (38.8 to 47.4 dB; the 16 px favicon is
// lossless either way and smaller as truecolour) and the copies were compared by eye at 2x to 5x
// zoom with no visible difference; the palette files are about a third of the size (the 640 px
// lockup: about 120 KB instead of 450 KB). An output that fails falls back to truecolour and the
// log says so.
//
// Deterministic: the same masters, sharp version and fonts produce byte-identical files (no
// timestamps or metadata are written). The tagline on the social card is rendered by sharp's SVG
// renderer with the first available font of the stack below (Segoe UI on Windows, Helvetica or
// Arial elsewhere), so regenerate on the same kind of machine to keep the card's look stable. The
// site name and tagline are read from src/config.ts so the card never drifts from the site.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mastersDir = path.join(root, 'docs', 'brand', 'v2');
const SHIELD_MASTER = path.join(mastersDir, 'direwolf-shield.png');
const LOCKUP_MASTER = path.join(mastersDir, 'direwolf-logo-stacked.png');
const brandDir = path.join(root, 'src', 'assets', 'brand');
const publicDir = path.join(root, 'public');

/**
 * Brand colours (also `--brand-panel` and `--brand-blue` in src/styles/global.css, and the
 * manifest colours in public/manifest.webmanifest). PANEL is the shield's own near-black field
 * (sampled at about #01060d, lifted a touch); BLUE is the art's electric blue (the neon shield
 * edge and the CYBERSECURITY lettering).
 */
const PANEL = '#05070d';
const BLUE = '#0184f7';
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/** Pixels below this alpha (of 255) count as margin when cropping the masters. */
const ALPHA_CROP = 8;
/** Minimum PSNR (dB) of the palette copy against truecolour for the palette copy to be used. */
const MIN_PSNR = 38;
/** Shield size on the touch and manifest tiles, as a fraction of the edge (the platform's too). */
const TILE_SCALE = 0.8;

/**
 * Read a single-quoted string constant from src/config.ts (the file uses import.meta.env, so it
 * cannot simply be imported into Node).
 * @param {string} source
 * @param {string} name
 * @returns {string}
 */
function constant(source, name) {
  const match = source.match(new RegExp(`export const ${name} = '([^']+)';`));
  if (!match) throw new Error(`Could not read ${name} from src/config.ts`);
  return match[1];
}

/** @param {string} text */
const escapeXml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Greedy word wrap by an approximate character budget per line.
 * @param {string} text
 * @param {number} maxChars
 * @returns {string[]}
 */
function wrap(text, maxChars) {
  /** @type {string[]} */
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * A master cropped to the bounding box of its pixels with alpha >= ALPHA_CROP, as a lossless PNG.
 * @param {string} file
 * @returns {Promise<{ png: Buffer, width: number, height: number }>}
 */
async function artwork(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let left = info.width;
  let top = info.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * 4 + 3] < ALPHA_CROP) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }
  if (right < 0) throw new Error(`${file}: no visible pixels`);
  const width = right - left + 1;
  const height = bottom - top + 1;
  const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left, top, width, height })
    .png()
    .toBuffer();
  return { png, width, height };
}

/**
 * The cropped shield centred on a transparent square (padding only, no resampling).
 * @param {{ png: Buffer, width: number, height: number }} shield
 * @returns {Promise<Buffer>}
 */
async function squared({ png, width, height }) {
  const side = Math.max(width, height);
  const padX = side - width;
  const padY = side - height;
  return sharp(png)
    .extend({
      left: Math.floor(padX / 2),
      right: Math.ceil(padX / 2),
      top: Math.floor(padY / 2),
      bottom: Math.ceil(padY / 2),
      background: TRANSPARENT,
    })
    .png()
    .toBuffer();
}

/**
 * Downscale to exactly width x height (the aspect ratio is kept by the callers, so `contain`
 * only absorbs rounding), as a lossless RGBA PNG.
 * @param {Buffer} source
 * @param {number} width
 * @param {number} height
 * @returns {Promise<Buffer>}
 */
function scaled(source, width, height) {
  return sharp(source)
    .resize(width, height, { fit: 'contain', background: TRANSPARENT, kernel: 'lanczos3' })
    .png()
    .toBuffer();
}

/**
 * @param {string} hex
 * @returns {[number, number, number]}
 */
function rgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/**
 * PSNR (dB) between two PNGs of the same size, both composited over `background`.
 * @param {Buffer} a
 * @param {Buffer} b
 * @param {[number, number, number]} background
 * @returns {Promise<number>}
 */
async function psnr(a, b, background) {
  const [x, y] = await Promise.all([a, b].map((png) => sharp(png).ensureAlpha().raw().toBuffer()));
  let sum = 0;
  for (let i = 0; i < x.length; i += 4) {
    const alphaX = x[i + 3] / 255;
    const alphaY = y[i + 3] / 255;
    for (let c = 0; c < 3; c += 1) {
      const overX = x[i + c] * alphaX + background[c] * (1 - alphaX);
      const overY = y[i + c] * alphaY + background[c] * (1 - alphaY);
      sum += (overX - overY) ** 2;
    }
  }
  const mse = sum / ((x.length / 4) * 3);
  return mse === 0 ? Number.POSITIVE_INFINITY : 10 * Math.log10((255 * 255) / mse);
}

/**
 * The smallest encoding that looks identical: a palette PNG when it passes MIN_PSNR over white
 * and over the panel colour, else truecolour.
 * @param {Buffer} image lossless PNG of the final pixels
 * @returns {Promise<{ data: Buffer, note: string }>}
 */
async function encode(image) {
  const truecolour = await sharp(image)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  const palette = await sharp(image)
    .png({ compressionLevel: 9, palette: true, quality: 100, effort: 10, dither: 1 })
    .toBuffer();
  const score = Math.min(
    await psnr(truecolour, palette, [255, 255, 255]),
    await psnr(truecolour, palette, rgb(PANEL)),
  );
  const db = Number.isFinite(score) ? `${score.toFixed(1)} dB` : 'lossless';
  if (score < MIN_PSNR) {
    return { data: truecolour, note: `truecolour: the palette copy is only ${db}` };
  }
  if (palette.length >= truecolour.length) {
    return { data: truecolour, note: `truecolour: smaller than the palette copy (${db})` };
  }
  return { data: palette, note: `palette, ${db}` };
}

/**
 * Opaque square tile: the shield at TILE_SCALE of the edge, centred on PANEL.
 * @param {Buffer} shield square shield
 * @param {number} size
 * @returns {Promise<Buffer>}
 */
async function tile(shield, size) {
  const inner = Math.round(size * TILE_SCALE);
  const logo = await scaled(shield, inner, inner);
  // sharp applies flatten before composite within one pipeline, so drop alpha in a second pass.
  const composed = await sharp({
    create: { width: size, height: size, channels: 4, background: PANEL },
  })
    .composite([{ input: logo, gravity: 'centre' }])
    .png()
    .toBuffer();
  return sharp(composed).flatten({ background: PANEL }).png().toBuffer();
}

/**
 * An ICO file holding PNG images (supported by every current browser and by Windows Vista+).
 * @param {Array<{ size: number, png: Buffer }>} images
 * @returns {Buffer}
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, png } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette colours
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += png.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((image) => image.png)]);
}

/**
 * The 1200 x 630 social card: near-black ground with a faint blue glow behind the stacked lockup
 * on the left, the tagline on the right under a short electric-blue rule, and a thin blue line
 * along the bottom edge. The site name is in the lockup itself.
 * @param {{ png: Buffer, width: number, height: number }} lockup
 * @param {string} tagline
 * @returns {Promise<Buffer>}
 */
async function ogImage(lockup, tagline) {
  const width = 1200;
  const height = 630;
  const lockupHeight = 480;
  const lockupWidth = Math.round((lockupHeight * lockup.width) / lockup.height);
  const lockupLeft = 80;
  const lockupTop = Math.round((height - lockupHeight) / 2);
  const textLeft = lockupLeft + lockupWidth + 64;
  const font = "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";

  const taglineLines = wrap(tagline, 20);
  const taglineSize = 46;
  const lineHeight = Math.round(taglineSize * 1.3);
  const ruleHeight = 6;
  const ruleGap = 36;
  const blockHeight = ruleHeight + ruleGap + taglineLines.length * lineHeight;
  let y = Math.round((height - blockHeight) / 2);

  const parts = [
    `<rect x="${textLeft}" y="${y}" width="96" height="${ruleHeight}" rx="3" fill="${BLUE}"/>`,
  ];
  y += ruleHeight + ruleGap + Math.round(taglineSize * 0.95);
  for (const line of taglineLines) {
    parts.push(
      `<text x="${textLeft}" y="${y}" font-family="${font}" font-size="${taglineSize}" font-weight="600" fill="#e6eaf2">${escapeXml(line)}</text>`,
    );
    y += lineHeight;
  }

  const glowX = lockupLeft + lockupWidth / 2;
  const glowY = height / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="glow" cx="${glowX}" cy="${glowY}" r="${lockupHeight * 0.62}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${BLUE}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${BLUE}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="${PANEL}"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  <rect x="0" y="${height - 4}" width="${width}" height="4" fill="${BLUE}"/>
  ${parts.join('\n  ')}
</svg>`;

  const art = await scaled(lockup.png, lockupWidth, lockupHeight);
  const composed = await sharp(Buffer.from(svg))
    .composite([{ input: art, left: lockupLeft, top: lockupTop }])
    .png()
    .toBuffer();
  return sharp(composed).flatten({ background: PANEL }).png().toBuffer();
}

async function main() {
  const config = await readFile(path.join(root, 'src', 'config.ts'), 'utf8');
  const tagline = constant(config, 'siteTagline');

  const [shieldArt, lockupArt] = await Promise.all([
    artwork(SHIELD_MASTER),
    artwork(LOCKUP_MASTER),
  ]);
  const shield = await squared(shieldArt);
  /** @param {number} width */
  const lockupHeight = (width) => Math.round((width * lockupArt.height) / lockupArt.width);

  /** @type {Array<[string, Buffer]>} lossless images to encode, by output path */
  const images = [];
  for (const size of [72, 144, 288]) {
    images.push([`src/assets/brand/direwolf-shield-${size}.png`, await scaled(shield, size, size)]);
  }
  for (const width of [320, 640]) {
    images.push([
      `src/assets/brand/direwolf-logo-stacked-${width}.png`,
      await scaled(lockupArt.png, width, lockupHeight(width)),
    ]);
  }
  images.push(['public/favicon-16x16.png', await scaled(shield, 16, 16)]);
  images.push(['public/favicon-32x32.png', await scaled(shield, 32, 32)]);
  const favicon48 = await scaled(shield, 48, 48);
  images.push(['public/apple-touch-icon.png', await tile(shield, 180)]);
  images.push(['public/icon-192.png', await tile(shield, 192)]);
  images.push(['public/icon-512.png', await tile(shield, 512)]);
  images.push(['public/og-image.png', await ogImage(lockupArt, tagline)]);

  await mkdir(brandDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });

  /** @type {Map<string, Buffer>} */
  const written = new Map();
  for (const [file, image] of images) {
    const { data, note } = await encode(image);
    const { width, height } = await sharp(data).metadata();
    await writeFile(path.join(root, file), data);
    written.set(file, data);
    console.log(
      `${file}  ${width}x${height}  ${data.length.toLocaleString('en-US')} bytes  (${note})`,
    );
  }

  const favicon = ico([
    { size: 16, png: /** @type {Buffer} */ (written.get('public/favicon-16x16.png')) },
    { size: 32, png: /** @type {Buffer} */ (written.get('public/favicon-32x32.png')) },
    { size: 48, png: (await encode(favicon48)).data },
  ]);
  await writeFile(path.join(publicDir, 'favicon.ico'), favicon);
  console.log(`public/favicon.ico  16, 32, 48  ${favicon.length.toLocaleString('en-US')} bytes`);
  /** @param {string} file */
  const relative = (file) => path.relative(root, file).split(path.sep).join('/');
  console.log(
    `Sources: ${relative(SHIELD_MASTER)} (artwork ${shieldArt.width}x${shieldArt.height}), ${relative(LOCKUP_MASTER)} (artwork ${lockupArt.width}x${lockupArt.height})`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
