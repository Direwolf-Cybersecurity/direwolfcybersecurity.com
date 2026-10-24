// Generates the favicons, the web-manifest icons and the Open Graph image in public/ from the
// owner's shield logo (src/assets/brand/direwolf-shield.png), with sharp. The outputs are
// committed, so the build and CI never run this; run it again only when the logo, the site name
// or the tagline changes:
//
//   npm run brand:assets
//   npm run brand:assets -- path/to/other-shield.png   (a different source image, e.g. a larger one)
//
// Outputs (public/):
//   favicon.ico            16, 32 and 48 px PNGs in one ICO container (for /favicon.ico requests)
//   favicon-16x16.png      tab icon
//   favicon-32x32.png      tab icon, high density
//   apple-touch-icon.png   180 px on the brand navy (iOS fills transparency with black)
//   icon-192.png           web manifest (public/manifest.webmanifest)
//   icon-512.png           web manifest
//   og-image.png           1200 x 630 Open Graph / Twitter card: shield, site name and tagline
//
// The site name and tagline are read from src/config.ts so the card never drifts from the site.
// Text is rendered by sharp's SVG renderer with the first available font of the stack below
// (Segoe UI on Windows, Helvetica or Arial elsewhere), so regenerate on the same kind of machine
// to keep the card's look stable.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shieldPath = path.resolve(
  root,
  process.argv[2] ?? path.join('src', 'assets', 'brand', 'direwolf-shield.png'),
);
const publicDir = path.join(root, 'public');

/** Brand colours sampled from the logo (also the --brand-* tokens in src/styles/global.css). */
const NAVY = '#092a57';
const CYAN = '#39d6f3';

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
 * The shield, trimmed of transparent margins and fitted into a square of `size` px with
 * `padding` px on each side, over `background` (transparent when omitted).
 * @param {number} size
 * @param {{ padding?: number, background?: string }} [options]
 * @returns {Promise<Buffer>}
 */
async function shieldSquare(size, { padding = 0, background } = {}) {
  const inner = size - padding * 2;
  const trimmed = await sharp(shieldPath).trim().toBuffer();
  const logo = await sharp(trimmed)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: logo, left: padding, top: padding }])
    .png({ compressionLevel: 9 })
    .toBuffer();
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
 * The 1200 x 630 social card: navy ground, the shield on the left, name and tagline on the right.
 * @param {string} name
 * @param {string} tagline
 * @returns {Promise<Buffer>}
 */
async function ogImage(name, tagline) {
  const width = 1200;
  const height = 630;
  const shieldSize = 360; // the default source is 360 px square, so it is not upscaled
  const shieldLeft = 90;
  const shieldTop = Math.round((height - shieldSize) / 2);
  const textLeft = shieldLeft + shieldSize + 50;
  const font = "'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif";

  const taglineLines = wrap(tagline, 30);
  const nameLines = wrap(name, 16);
  const nameSize = 68;
  const taglineSize = 34;
  const ruleGap = 34;
  const blockHeight =
    nameLines.length * nameSize * 1.1 + ruleGap * 2 + taglineLines.length * taglineSize * 1.35;
  let y = Math.round((height - blockHeight) / 2 + nameSize);

  const parts = [];
  for (const line of nameLines) {
    parts.push(
      `<text x="${textLeft}" y="${y}" font-family="${font}" font-size="${nameSize}" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`,
    );
    y += Math.round(nameSize * 1.1);
  }
  y += ruleGap - Math.round(nameSize * 0.6);
  parts.push(`<rect x="${textLeft}" y="${y}" width="96" height="6" rx="3" fill="${CYAN}"/>`);
  y += ruleGap + taglineSize;
  for (const line of taglineLines) {
    parts.push(
      `<text x="${textLeft}" y="${y}" font-family="${font}" font-size="${taglineSize}" fill="#d6e4f5">${escapeXml(line)}</text>`,
    );
    y += Math.round(taglineSize * 1.35);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0c3570"/>
      <stop offset="1" stop-color="${NAVY}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#ground)"/>
  <rect x="0" y="${height - 10}" width="${width}" height="10" fill="${CYAN}"/>
  ${parts.join('\n  ')}
</svg>`;

  const shield = await sharp(shieldPath).resize(shieldSize, shieldSize).png().toBuffer();
  return sharp(Buffer.from(svg))
    .composite([{ input: shield, left: shieldLeft, top: shieldTop }])
    .flatten({ background: NAVY })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  const config = await readFile(path.join(root, 'src', 'config.ts'), 'utf8');
  const name = constant(config, 'siteName');
  const tagline = constant(config, 'siteTagline');

  /** @type {Array<[string, Buffer]>} */
  const outputs = [];

  const favicon16 = await shieldSquare(16);
  const favicon32 = await shieldSquare(32);
  const favicon48 = await shieldSquare(48);
  outputs.push(['favicon-16x16.png', favicon16]);
  outputs.push(['favicon-32x32.png', favicon32]);
  outputs.push([
    'favicon.ico',
    ico([
      { size: 16, png: favicon16 },
      { size: 32, png: favicon32 },
      { size: 48, png: favicon48 },
    ]),
  ]);
  outputs.push([
    'apple-touch-icon.png',
    await shieldSquare(180, { padding: 14, background: NAVY }),
  ]);
  outputs.push(['icon-192.png', await shieldSquare(192)]);
  // 76 px padding keeps the default 360 px source at its native size and leaves a safe area.
  outputs.push(['icon-512.png', await shieldSquare(512, { padding: 76 })]);
  outputs.push(['og-image.png', await ogImage(name, tagline)]);

  for (const [file, data] of outputs) {
    await writeFile(path.join(publicDir, file), data);
    console.log(`public/${file} (${data.length.toLocaleString('en-US')} bytes)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
