// Internal link check over the built site in dist/ (CLAUDE.md, "Definition of done").
//
// For every HTML page it collects href/src/action attributes and every srcset candidate (the
// logo copies in the header, footer and brand panels are served through srcset) and checks that
// each internal URL resolves to a file in dist/ (directory-format pages, generated text files, assets) and
// that any #fragment names an element id in the target page. External links are counted but
// not fetched, so the check is deterministic and works offline. The Open Graph image
// (<meta property="og:image">) is checked the same way. Exit code 1 on any failure.
//
// Two more assertions:
// - While `PLATFORM_LIVE` in src/config.ts is false (the platform is not in service), no href,
//   src or action may point to the platform host (app.direwolfcybersecurity.com, or the host of
//   PUBLIC_APP_URL when set): every such call to action must be "Request early access".
// - Every image in dist/_astro/ is referenced by a built page or stylesheet, so an image that
//   no page shows (such as an organization logo imported without permission,
//   src/data/engagements.ts) is never published. astro.config.mjs prunes them; this catches a
//   regression.

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

/** Origins treated as "this site": links to them are checked as internal paths. */
const siteOrigins = new Set([
  'https://www.direwolfcybersecurity.com',
  'https://direwolfcybersecurity.com',
]);

/** The platform's hosts: the production default and PUBLIC_APP_URL's host, when set. */
const platformHosts = new Set(['app.direwolfcybersecurity.com']);
try {
  if (process.env.PUBLIC_APP_URL) platformHosts.add(new URL(process.env.PUBLIC_APP_URL).host);
} catch {
  // Not a URL: src/config.ts would not produce links from it either.
}

/**
 * PLATFORM_LIVE from src/config.ts, read the way .github/workflows/deploy.yml reads
 * SITE_LAUNCHED (the exact `export const PLATFORM_LIVE = …;` line).
 * @returns {Promise<boolean>}
 */
async function platformLive() {
  const config = await readFile(path.join(root, 'src', 'config.ts'), 'utf8');
  const match = config.match(/^export const PLATFORM_LIVE = (true|false);$/m);
  if (!match) throw new Error('src/config.ts: no `export const PLATFORM_LIVE = true|false;` line');
  return match[1] === 'true';
}

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/**
 * @param {string} p
 * @returns {Promise<boolean>}
 */
async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Map a site-absolute URL path to the file in dist/ that serves it, or null.
 * @param {string} urlPath
 * @returns {Promise<string | null>}
 */
async function resolveTarget(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const candidates = decoded.endsWith('/')
    ? [path.join(dist, decoded, 'index.html')]
    : [
        path.join(dist, decoded),
        path.join(dist, decoded, 'index.html'),
        path.join(dist, `${decoded}.html`),
      ];
  for (const candidate of candidates) {
    if (await exists(candidate)) {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    }
  }
  return null;
}

/** @type {Map<string, Set<string>>} */
const idCache = new Map();

/**
 * @param {string} file
 * @returns {Promise<Set<string>>}
 */
async function idsIn(file) {
  const cached = idCache.get(file);
  if (cached) return cached;
  const html = await readFile(file, 'utf8');
  const ids = new Set();
  for (const match of html.matchAll(/\s(?:id|name)=["']([^"']+)["']/g)) ids.add(match[1]);
  idCache.set(file, ids);
  return ids;
}

/**
 * @param {string} pagePath site-absolute path of the page being scanned, e.g. /about/
 * @param {string} raw the attribute value
 * @returns {{ kind: 'skip' | 'external' | 'internal', path?: string, fragment?: string }}
 */
function classify(pagePath, raw) {
  const value = raw.trim();
  if (value === '' || /^(mailto|tel|javascript|data|sms):/i.test(value)) return { kind: 'skip' };
  if (value.startsWith('#')) return { kind: 'internal', path: pagePath, fragment: value.slice(1) };
  let url;
  try {
    url = new URL(value, `https://www.direwolfcybersecurity.com${pagePath}`);
  } catch {
    return { kind: 'skip' };
  }
  const isInternal =
    /^\//.test(value) || !/^[a-z][a-z0-9+.-]*:/i.test(value) || siteOrigins.has(url.origin);
  if (!isInternal) return { kind: 'external' };
  return {
    kind: 'internal',
    path: url.pathname,
    fragment: url.hash ? url.hash.slice(1) : undefined,
  };
}

async function main() {
  if (!(await exists(dist))) {
    console.error('dist/ not found. Run `npm run build` first.');
    process.exit(1);
  }

  const allFiles = await walk(dist);
  const files = allFiles.filter((f) => f.endsWith('.html'));
  const live = await platformLive();
  /** @type {string[]} */
  const failures = [];
  /** @type {string[]} Text of every page and stylesheet, for the unreferenced-image check. */
  const corpus = [];
  let internalCount = 0;
  let externalCount = 0;
  let platformLinkCount = 0;

  for (const file of files) {
    const rel = path.relative(dist, file).split(path.sep).join('/');
    const pagePath = rel.endsWith('index.html')
      ? `/${rel.slice(0, -'index.html'.length)}`
      : `/${rel}`;
    const html = await readFile(file, 'utf8');
    corpus.push(html);

    const values = [
      ...[...html.matchAll(/\s(?:href|src|action)=["']([^"']*)["']/g)].map((m) => m[1]),
      // srcset="a.png 72w, b.png 144w": the URL of each candidate (the part before its descriptor).
      ...[...html.matchAll(/\ssrcset=["']([^"']*)["']/g)].flatMap((m) =>
        m[1]
          .split(',')
          .map((candidate) => candidate.trim().split(/\s+/)[0])
          .filter(Boolean),
      ),
      ...[...html.matchAll(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/g)].map(
        (m) => m[1],
      ),
    ];
    for (const value of values) {
      try {
        const host = new URL(value, `https://www.direwolfcybersecurity.com${pagePath}`).host;
        if (platformHosts.has(host)) {
          platformLinkCount += 1;
          if (!live) {
            failures.push(
              `${pagePath}: links to the platform (${value}) while PLATFORM_LIVE is false in src/config.ts`,
            );
          }
        }
      } catch {
        // Unparseable values are left to classify() below.
      }
    }

    for (const value of values) {
      const link = classify(pagePath, value);
      if (link.kind === 'skip') continue;
      if (link.kind === 'external') {
        externalCount += 1;
        continue;
      }
      internalCount += 1;
      const target = await resolveTarget(link.path ?? '/');
      if (!target) {
        failures.push(`${pagePath}: broken link to ${value}`);
        continue;
      }
      if (link.fragment && target.endsWith('.html')) {
        const ids = await idsIn(target);
        if (!ids.has(decodeURIComponent(link.fragment))) {
          failures.push(`${pagePath}: missing anchor #${link.fragment} in ${value}`);
        }
      }
    }
  }

  // Every image Astro emitted must be shown somewhere (pages, or stylesheets via url()).
  for (const file of allFiles.filter((f) => f.endsWith('.css'))) {
    corpus.push(await readFile(file, 'utf8'));
  }
  const pageText = corpus.join('\n');
  const assetsDir = path.join(dist, '_astro');
  for (const file of allFiles) {
    if (path.dirname(file) !== assetsDir || !/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(file)) {
      continue;
    }
    const name = path.basename(file);
    if (!pageText.includes(`/_astro/${name}`)) {
      failures.push(`unreferenced image published: _astro/${name} (no page shows it)`);
    }
  }

  // Generated files every build must contain.
  for (const required of [
    'robots.txt',
    '.well-known/security.txt',
    'sitemap-index.xml',
    '404.html',
  ]) {
    if (!(await exists(path.join(dist, required))))
      failures.push(`missing generated file: ${required}`);
  }

  console.log(
    `Checked ${files.length} pages: ${internalCount} internal links, ${externalCount} external links (not fetched).`,
  );
  console.log(
    live
      ? `PLATFORM_LIVE is true: ${platformLinkCount} links to the platform (${[...platformHosts].join(', ')}).`
      : `PLATFORM_LIVE is false: no links to the platform (${[...platformHosts].join(', ')}) allowed.`,
  );
  if (failures.length > 0) {
    console.error(`\n${failures.length} problem(s):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  console.log('All internal links and anchors resolve.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
