// Content Security Policy check over the built site in dist/ (README.md, "Verify").
//
// Static, for every HTML page: exactly one <meta http-equiv="Content-Security-Policy"> placed
// before any script or stylesheet, carrying the directives src/layouts/BaseLayout.astro promises
// and no 'unsafe-inline' or 'unsafe-eval'; no inline <script>, <style>, style="" or on*=""
// attribute and no javascript: URL (the policy would block them, so their presence means a
// broken page); every https origin a form posts to allowed by connect-src and form-action; a
// referrer-policy meta; rel="noopener noreferrer" on every link to another origin.
//
// Runtime: serves dist/ and loads every page in a locally installed Chromium-based browser
// through playwright-core (scripts/lib/site.mjs, as scripts/a11y.mjs does) with console,
// page-error and securitypolicyviolation listeners, asserting zero violations and zero errors.
// It then proves the scripts and styles really ran under the policy: the stylesheet applies in
// light and dark schemes, the mobile menu opens and closes on Escape, the contact form validates
// on submit, and the no-JavaScript fallback stylesheet applies with JavaScript off. Exit code 1
// on any failure.
//
// Usage: node scripts/check-csp.mjs [dist-dir]

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { launchBrowser, listPages, serve } from './lib/site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.resolve(root, process.argv[2] ?? 'dist');

/** Hosts that count as this site; links to them need no rel="noopener noreferrer". */
const siteHosts = new Set(['www.direwolfcybersecurity.com', 'direwolfcybersecurity.com']);

/**
 * Directives every page must carry, with the sources each must include.
 * @type {Record<string, string[]>}
 */
const requiredDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'"],
  'img-src': ["'self'", 'data:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'upgrade-insecure-requests': [],
};
/** Directives that must contain exactly the required sources and nothing else. */
const exactDirectives = new Set([
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'font-src',
  'base-uri',
  'object-src',
  'upgrade-insecure-requests',
]);
/** Directives that may add https origins (the platform, the contact endpoint). */
const extendableDirectives = new Set(['connect-src', 'form-action']);

/** @type {string[]} */
const failures = [];
/** @param {string} message */
const fail = (message) => failures.push(message);

/**
 * @param {string} policy
 * @returns {Map<string, string[]>}
 */
function parsePolicy(policy) {
  /** @type {Map<string, string[]>} */
  const directives = new Map();
  for (const part of policy.split(';')) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;
    const [name, ...sources] = tokens;
    directives.set(name.toLowerCase(), sources);
  }
  return directives;
}

/**
 * The value of attribute `name` in an opening tag, or undefined.
 * @param {string} tag
 * @param {string} name
 * @returns {string | undefined}
 */
function attribute(tag, name) {
  const match = tag.match(
    new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'i'),
  );
  return match ? (match[1] ?? match[2] ?? match[3]) : undefined;
}

/** @param {string} tag */
const isMeta = (tag) => /^<meta\b/i.test(tag);

/**
 * @param {string} pagePath
 * @param {string} html
 */
function checkStatic(pagePath, html) {
  const tags = html.match(/<(?:meta|script|style|link|a|form)\b[^>]*>/gi) ?? [];

  const metas = tags.filter(
    (t) => isMeta(t) && /^content-security-policy$/i.test(attribute(t, 'http-equiv') ?? ''),
  );
  if (metas.length !== 1) {
    fail(`${pagePath}: expected one Content-Security-Policy meta, found ${metas.length}`);
  } else {
    const meta = metas[0];
    const metaIndex = html.indexOf(meta);
    const firstAsset = tags.find(
      (t) =>
        /^<(?:script|style)\b/i.test(t) ||
        (/^<link\b/i.test(t) && /\bstylesheet\b/i.test(attribute(t, 'rel') ?? '')),
    );
    if (firstAsset && html.indexOf(firstAsset) < metaIndex) {
      fail(
        `${pagePath}: the Content-Security-Policy meta must precede every script and stylesheet`,
      );
    }

    const directives = parsePolicy(attribute(meta, 'content') ?? '');
    for (const [name, required] of Object.entries(requiredDirectives)) {
      const actual = directives.get(name);
      if (!actual) {
        fail(`${pagePath}: CSP lacks ${name}`);
        continue;
      }
      for (const source of required) {
        if (!actual.includes(source)) fail(`${pagePath}: CSP ${name} lacks ${source}`);
      }
      const extra = actual.filter((source) => !required.includes(source));
      if (exactDirectives.has(name) && extra.length > 0) {
        fail(
          `${pagePath}: CSP ${name} must be exactly "${required.join(' ')}", found "${actual.join(' ')}"`,
        );
      }
      if (extendableDirectives.has(name)) {
        for (const source of extra) {
          if (!/^https:\/\/[^/\s]+$/.test(source)) {
            fail(`${pagePath}: CSP ${name} source ${source} is not an https origin`);
          }
        }
      }
    }
    for (const [name, sources] of directives) {
      for (const source of sources) {
        if (/^'unsafe-/i.test(source)) fail(`${pagePath}: CSP ${name} contains ${source}`);
      }
    }

    // Every https origin a form posts to must be allowed, for the fetch and the plain submit.
    for (const t of tags) {
      if (!/^<form\b/i.test(t)) continue;
      for (const name of ['action', 'data-endpoint']) {
        const value = attribute(t, name);
        if (!value || !/^https:\/\//i.test(value)) continue;
        const origin = new URL(value).origin;
        for (const directive of ['connect-src', 'form-action']) {
          if (!(directives.get(directive) ?? []).includes(origin)) {
            fail(`${pagePath}: form ${name}=${value} needs ${origin} in CSP ${directive}`);
          }
        }
      }
    }
  }

  const referrer = tags.find((t) => isMeta(t) && /^referrer$/i.test(attribute(t, 'name') ?? ''));
  if (!referrer || attribute(referrer, 'content') !== 'strict-origin-when-cross-origin') {
    fail(`${pagePath}: missing <meta name="referrer" content="strict-origin-when-cross-origin">`);
  }

  for (const t of tags) {
    if (/^<script\b/i.test(t) && attribute(t, 'src') === undefined) {
      fail(`${pagePath}: inline <script> (the policy blocks it): ${t.slice(0, 80)}`);
    }
    if (/^<style\b/i.test(t)) fail(`${pagePath}: inline <style> (the policy blocks it)`);
    if (/^<a\b/i.test(t)) {
      const href = attribute(t, 'href') ?? '';
      if (!/^https?:\/\//i.test(href)) continue;
      let host;
      try {
        host = new URL(href).host.toLowerCase();
      } catch {
        continue;
      }
      if (siteHosts.has(host)) continue;
      const rel = (attribute(t, 'rel') ?? '').toLowerCase().split(/\s+/);
      if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
        fail(`${pagePath}: external link without rel="noopener noreferrer": ${href}`);
      }
    }
  }
  for (const match of html.matchAll(/<[a-z][^>]*\s(style|on[a-z]+)\s*=/gi)) {
    fail(`${pagePath}: inline ${match[1]} attribute (the policy blocks it)`);
  }
  if (/\shref\s*=\s*["']\s*javascript:/i.test(html)) fail(`${pagePath}: javascript: URL`);
}

/** Injected before any page script: records CSP violations for the check to read back. */
const recordViolations = `
  window.__cspViolations = [];
  document.addEventListener('securitypolicyviolation', (event) => {
    window.__cspViolations.push(
      event.violatedDirective + ' blocked ' + (event.blockedURI || 'inline') +
        (event.lineNumber ? ' at line ' + event.lineNumber : '') +
        (event.sample ? ' (' + event.sample + ')' : ''),
    );
  });
`;

/**
 * A page whose console errors, page errors and failed requests are collected, each prefixed
 * with whatever `where.current` says at the time.
 * @param {import('playwright-core').BrowserContext} context
 * @param {{ current: string }} where
 * @param {{ javaScript?: boolean }} [options]
 */
async function openPage(context, where, options = {}) {
  const page = await context.newPage();
  /** @type {string[]} */
  const problems = [];
  page.on('console', (message) => {
    const type = message.type();
    if (
      type === 'error' ||
      (type === 'warning' && /content security policy/i.test(message.text()))
    ) {
      problems.push(`${where.current}: console ${type}: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => problems.push(`${where.current}: page error: ${error.message}`));
  page.on('requestfailed', (request) => {
    const text = request.failure()?.errorText ?? '';
    if (text !== 'net::ERR_ABORTED') {
      problems.push(`${where.current}: request failed: ${request.url()} ${text}`);
    }
  });
  if (options.javaScript !== false) await page.addInitScript(recordViolations);
  return { page, problems };
}

/**
 * @param {import('playwright-core').Page} page
 * @returns {Promise<string[]>}
 */
async function violationsOn(page) {
  return /** @type {string[]} */ (await page.evaluate('window.__cspViolations ?? []'));
}

async function main() {
  const pages = await listPages(dist).catch(() => []);
  if (pages.length === 0) {
    console.error(`No built pages in ${dist}. Run \`npm run build\` first.`);
    process.exit(1);
  }

  for (const pagePath of pages) {
    const file = pagePath.endsWith('/')
      ? path.join(dist, pagePath, 'index.html')
      : path.join(dist, pagePath);
    checkStatic(pagePath, await readFile(file, 'utf8'));
  }

  const { server, origin } = await serve(dist);
  const browser = await launchBrowser();
  const where = { current: '' };
  let loads = 0;

  try {
    // Every page, desktop, light scheme: no violation, no error, stylesheet applied.
    {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        colorScheme: 'light',
      });
      const { page, problems } = await openPage(context, where);
      for (const pagePath of pages) {
        where.current = `${pagePath} [desktop-light]`;
        await page.goto(`${origin}${pagePath}`, { waitUntil: 'load' });
        loads += 1;
        for (const v of await violationsOn(page)) fail(`${where.current}: CSP violation: ${v}`);
        const background = await page.evaluate('getComputedStyle(document.body).backgroundColor');
        if (background !== 'rgb(255, 255, 255)') {
          fail(`${where.current}: stylesheet not applied (body background ${background})`);
        }
        const hasMeta = await page.evaluate(
          `Boolean(document.querySelector('meta[http-equiv="Content-Security-Policy" i]'))`,
        );
        if (!hasMeta) fail(`${where.current}: Content-Security-Policy meta not in the live DOM`);
      }
      failures.push(...problems);
      await context.close();
    }

    // Home, dark scheme: the dark tokens apply, so the stylesheet works in both schemes.
    {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        colorScheme: 'dark',
      });
      const { page, problems } = await openPage(context, where);
      where.current = '/ [desktop-dark]';
      await page.goto(`${origin}/`, { waitUntil: 'load' });
      loads += 1;
      for (const v of await violationsOn(page)) fail(`${where.current}: CSP violation: ${v}`);
      const background = await page.evaluate('getComputedStyle(document.body).backgroundColor');
      if (background !== 'rgb(11, 18, 32)') {
        fail(`${where.current}: dark scheme not applied (body background ${background})`);
      }
      failures.push(...problems);
      await context.close();
    }

    // Every page at phone width: the menu script runs under the policy.
    {
      const context = await browser.newContext({
        viewport: { width: 375, height: 812 },
        colorScheme: 'light',
      });
      const { page, problems } = await openPage(context, where);
      for (const pagePath of pages) {
        where.current = `${pagePath} [mobile]`;
        await page.goto(`${origin}${pagePath}`, { waitUntil: 'load' });
        loads += 1;
        const toggle = page.locator('#menu-toggle');
        const menu = page.locator('#site-menu');
        if (!(await toggle.isVisible())) {
          fail(`${where.current}: menu toggle not visible`);
          continue;
        }
        if (await menu.isVisible()) fail(`${where.current}: menu open before the toggle was used`);
        await toggle.click();
        if ((await toggle.getAttribute('aria-expanded')) !== 'true' || !(await menu.isVisible())) {
          fail(`${where.current}: menu did not open (script blocked?)`);
        }
        if ((await toggle.textContent())?.trim() !== 'Close') {
          fail(`${where.current}: toggle label did not change to "Close"`);
        }
        await page.keyboard.press('Escape');
        if ((await toggle.getAttribute('aria-expanded')) !== 'false' || (await menu.isVisible())) {
          fail(`${where.current}: Escape did not close the menu`);
        }
        const focused = await page.evaluate('document.activeElement && document.activeElement.id');
        if (focused !== 'menu-toggle') fail(`${where.current}: focus did not return to the toggle`);
        for (const v of await violationsOn(page)) fail(`${where.current}: CSP violation: ${v}`);
      }
      failures.push(...problems);
      await context.close();
    }

    // Contact form: client-side validation proves its script runs under the policy.
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const { page, problems } = await openPage(context, where);
      where.current = '/contact/ [form]';
      await page.goto(`${origin}/contact/`, { waitUntil: 'load' });
      loads += 1;
      await page.locator('#contact-form button[type="submit"]').click();
      const nameError = page.locator('#cf-name-error');
      if (
        !(await nameError.isVisible()) ||
        (await nameError.textContent())?.trim() !== 'This field is required.'
      ) {
        fail(`${where.current}: validation did not run on submit (script blocked?)`);
      }
      const status = (await page.locator('#cf-status').textContent())?.trim();
      if (status !== 'Please fix the highlighted fields.') {
        fail(`${where.current}: validation status was not announced`);
      }
      const focused = await page.evaluate('document.activeElement && document.activeElement.id');
      if (focused !== 'cf-name') fail(`${where.current}: first invalid field was not focused`);
      for (const v of await violationsOn(page)) fail(`${where.current}: CSP violation: ${v}`);
      failures.push(...problems);
      await context.close();
    }

    // JavaScript off: the <noscript> stylesheet applies (it is a file, so style-src allows it).
    {
      const context = await browser.newContext({
        viewport: { width: 375, height: 812 },
        javaScriptEnabled: false,
      });
      const { page, problems } = await openPage(context, where, { javaScript: false });
      where.current = '/ [no-javascript]';
      await page.goto(`${origin}/`, { waitUntil: 'load' });
      loads += 1;
      if (await page.locator('#menu-toggle').isVisible()) {
        fail(`${where.current}: menu toggle shown without JavaScript (noscript.css blocked?)`);
      }
      if (!(await page.locator('#site-menu').isVisible())) {
        fail(`${where.current}: menu hidden without JavaScript (noscript.css blocked?)`);
      }
      failures.push(...problems);
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} problem(s):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  console.log(
    `CSP: ${pages.length} pages carry the policy with no inline code; ${loads} page loads with zero violations and zero console errors; stylesheet (light and dark), mobile menu, contact-form validation and the no-JavaScript fallback all work under it.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
