// Accessibility check: axe-core (WCAG 2.1 A and AA rules) over every built page in dist/,
// in light and dark color schemes and at a phone-width viewport (CLAUDE.md, "Definition of
// done"). Serves dist/ from a local HTTP server and drives a locally installed Chromium-based
// browser through playwright-core, so no browser download is needed. Exit code 1 on any
// violation; a JSON report is written to reports/a11y.json (git-ignored).
//
// Browser selection: A11Y_BROWSER_PATH (an executable), else Edge, else Chrome.

import { createServer } from 'node:http';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { AxeBuilder } from '@axe-core/playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

/** @type {Record<string, string>} */
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

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

/** Serve dist/ like GitHub Pages does (directory index, 404 page). */
function serve() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://localhost');
      let file = path.join(dist, decodeURIComponent(url.pathname));
      if (!file.startsWith(dist)) {
        res.writeHead(403).end();
        return;
      }
      if (url.pathname.endsWith('/')) file = path.join(file, 'index.html');
      let body;
      try {
        body = await readFile(file);
      } catch {
        try {
          body = await readFile(`${file}.html`);
          file = `${file}.html`;
        } catch {
          body = await readFile(path.join(dist, '404.html'));
          res.writeHead(404, { 'Content-Type': contentTypes['.html'] }).end(body);
          return;
        }
      }
      res
        .writeHead(200, {
          'Content-Type': contentTypes[path.extname(file)] ?? 'application/octet-stream',
        })
        .end(body);
    } catch (error) {
      res.writeHead(500).end(String(error));
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

async function launchBrowser() {
  const executablePath = process.env.A11Y_BROWSER_PATH;
  if (executablePath) return chromium.launch({ executablePath, headless: true });
  /** @type {Array<'msedge' | 'chrome'>} */
  const channels = ['msedge', 'chrome'];
  let lastError;
  for (const channel of channels) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    `No Chromium-based browser found. Install Microsoft Edge or Google Chrome, or set A11Y_BROWSER_PATH to a browser executable.\n${lastError}`,
  );
}

async function main() {
  const htmlFiles = (await walk(dist)).filter((f) => f.endsWith('.html'));
  const pages = htmlFiles
    .map((f) => path.relative(dist, f).split(path.sep).join('/'))
    .map((rel) =>
      rel.endsWith('index.html') ? `/${rel.slice(0, -'index.html'.length)}` : `/${rel}`,
    )
    .sort();

  const { server, origin } = await serve();
  const browser = await launchBrowser();

  /** @type {Array<{ name: string, viewport: { width: number, height: number }, colorScheme: 'light' | 'dark' }>} */
  const modes = [
    { name: 'desktop-light', viewport: { width: 1280, height: 900 }, colorScheme: 'light' },
    { name: 'desktop-dark', viewport: { width: 1280, height: 900 }, colorScheme: 'dark' },
    { name: 'mobile-light', viewport: { width: 375, height: 812 }, colorScheme: 'light' },
  ];

  /** @type {Array<{ page: string, mode: string, violations: unknown[] }>} */
  const results = [];
  let violationCount = 0;

  try {
    for (const mode of modes) {
      const context = await browser.newContext({
        viewport: mode.viewport,
        colorScheme: mode.colorScheme,
      });
      const page = await context.newPage();
      for (const pagePath of pages) {
        await page.goto(`${origin}${pagePath}`, { waitUntil: 'load' });
        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        results.push({ page: pagePath, mode: mode.name, violations: axe.violations });
        if (axe.violations.length > 0) {
          violationCount += axe.violations.length;
          console.error(`\n${pagePath} [${mode.name}]`);
          for (const violation of axe.violations) {
            console.error(`  ${violation.id} (${violation.impact}): ${violation.help}`);
            console.error(`    ${violation.helpUrl}`);
            for (const node of violation.nodes.slice(0, 3)) {
              console.error(`    - ${node.target.join(' ')}`);
            }
            if (violation.nodes.length > 3)
              console.error(`    - ... ${violation.nodes.length - 3} more`);
          }
        }
      }
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  await mkdir(path.join(root, 'reports'), { recursive: true });
  await writeFile(path.join(root, 'reports', 'a11y.json'), JSON.stringify(results, null, 2));

  const runs = pages.length * modes.length;
  if (violationCount > 0) {
    console.error(
      `\n${violationCount} accessibility violation(s) across ${runs} page checks. Report: reports/a11y.json`,
    );
    process.exit(1);
  }
  console.log(
    `axe-core: no WCAG 2.1 A/AA violations on ${pages.length} pages in ${modes.length} modes (${runs} checks).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
