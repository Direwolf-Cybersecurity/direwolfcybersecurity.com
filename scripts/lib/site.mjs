// Shared helpers for the checks that run over the built site in dist/ (scripts/a11y.mjs and
// scripts/check-csp.mjs): walk the output, serve it the way GitHub Pages does (directory index
// pages, 404 page), list its pages, and launch a locally installed Chromium-based browser
// through playwright-core, so no browser download is needed.
//
// Browser selection: A11Y_BROWSER_PATH (an executable), else Edge, else Chrome.

import { createServer } from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

/** @type {Record<string, string>} */
export const contentTypes = {
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
 * Every file under `dir`, recursively.
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
export async function walk(dir) {
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
 * Site-absolute paths of every HTML page in `dist`, sorted: `/about/` for about/index.html,
 * `/404.html` for a file that is not a directory index.
 * @param {string} dist
 * @returns {Promise<string[]>}
 */
export async function listPages(dist) {
  const htmlFiles = (await walk(dist)).filter((f) => f.endsWith('.html'));
  return htmlFiles
    .map((f) => path.relative(dist, f).split(path.sep).join('/'))
    .map((rel) =>
      rel.endsWith('index.html') ? `/${rel.slice(0, -'index.html'.length)}` : `/${rel}`,
    )
    .sort();
}

/**
 * Serve `dist` on a random local port like GitHub Pages does (directory index, 404 page).
 * @param {string} dist
 * @returns {Promise<{ server: import('node:http').Server, origin: string }>}
 */
export function serve(dist) {
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

/**
 * A headless Chromium-based browser: A11Y_BROWSER_PATH, else Microsoft Edge, else Google Chrome.
 * @returns {Promise<import('playwright-core').Browser>}
 */
export async function launchBrowser() {
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
