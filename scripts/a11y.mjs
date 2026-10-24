// Accessibility check: axe-core (WCAG 2.1 A and AA rules) over every built page in dist/,
// in light and dark color schemes and at a phone-width viewport (CLAUDE.md, "Definition of
// done"), with reduced motion so scroll-revealed content is checked in its final, visible state. Serves dist/ from a local HTTP server and drives a locally installed Chromium-based
// browser through playwright-core (scripts/lib/site.mjs, shared with scripts/check-csp.mjs), so
// no browser download is needed. Exit code 1 on any violation; a JSON report is written to
// reports/a11y.json (git-ignored).
//
// Browser selection: A11Y_BROWSER_PATH (an executable), else Edge, else Chrome.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { AxeBuilder } from '@axe-core/playwright';
import { launchBrowser, listPages, serve } from './lib/site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

async function main() {
  const pages = await listPages(dist);

  const { server, origin } = await serve(dist);
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
      // Reduced motion: the scroll reveal (src/scripts/motion.ts) then never hides content below
      // the fold and nothing is mid-animation, so axe checks every element in its final state.
      const context = await browser.newContext({
        viewport: mode.viewport,
        colorScheme: mode.colorScheme,
        reducedMotion: 'reduce',
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
