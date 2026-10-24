// Internal link check over the built site in dist/ (CLAUDE.md, "Definition of done").
//
// For every HTML page it collects href/src/action attributes and checks that each internal
// URL resolves to a file in dist/ (directory-format pages, generated text files, assets) and
// that any #fragment names an element id in the target page. External links are counted but
// not fetched, so the check is deterministic and works offline. Exit code 1 on any failure.

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

  const files = (await walk(dist)).filter((f) => f.endsWith('.html'));
  /** @type {string[]} */
  const failures = [];
  let internalCount = 0;
  let externalCount = 0;

  for (const file of files) {
    const rel = path.relative(dist, file).split(path.sep).join('/');
    const pagePath = rel.endsWith('index.html')
      ? `/${rel.slice(0, -'index.html'.length)}`
      : `/${rel}`;
    const html = await readFile(file, 'utf8');

    for (const match of html.matchAll(/\s(?:href|src|action)=["']([^"']*)["']/g)) {
      const link = classify(pagePath, match[1]);
      if (link.kind === 'skip') continue;
      if (link.kind === 'external') {
        externalCount += 1;
        continue;
      }
      internalCount += 1;
      const target = await resolveTarget(link.path ?? '/');
      if (!target) {
        failures.push(`${pagePath}: broken link to ${match[1]}`);
        continue;
      }
      if (link.fragment && target.endsWith('.html')) {
        const ids = await idsIn(target);
        if (!ids.has(decodeURIComponent(link.fragment))) {
          failures.push(`${pagePath}: missing anchor #${link.fragment} in ${match[1]}`);
        }
      }
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
