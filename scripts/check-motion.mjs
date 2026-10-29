// Motion check over the built site in dist/ (README "Verify"; docs/design-direction.md, "Motion
// system v2 (2026-10-28)"). Serves dist/ and drives a locally installed Chromium-based browser
// through playwright-core (scripts/lib/site.mjs, as a11y.mjs and check-csp.mjs do), at 375 x 812
// and 1,280 x 800 (and, for the flow's start, at short and zoomed viewports), with a
// securitypolicyviolation listener and an error listener on every page (zero allowed). It proves:
//
// - Budgets: gzipped JavaScript (added by motion v2, the motion bundle, all JavaScript on Home),
//   site CSS and Home HTML within their hard caps (warning above budget); no page loads a new
//   script, stylesheet or font.
// - Tiers: --motion-tier is `full` by default, `off` with reduced motion, `plain` with forced
//   colours or more contrast; every page with reduced motion runs no animation at all.
// - Settling: a page opened in a hidden tab holds its one-shots and plays them when shown; a hero
//   off-screen at load is at rest; a back-forward-cache restore never leaves anything running;
//   `data-revealed` marks exactly the elements revealed on scroll.
// - Each element: icon draw on reveal, button press, header line of light and nav bar, the
//   reading-progress hairline, page headers (standard at rest by 2.5 s, calm with no animation),
//   the hero (at rest by 2.5 s, and playing to its static frame with JavaScript off), the
//   statistics count-up and bars, the flow (static without JavaScript; the run's 4.25 s, pausing
//   off-screen, the brightest frame under axe in both schemes, reduced motion, forced colours,
//   more contrast, Save-Data, reduced motion switched on mid-run; its start: a slow scroll at
//   375 x 262 and 512 x 262 (a 1,280 x 655 laptop at 250% zoom) always runs or draws it, a fast
//   one past it draws its lines, and at 375 x 812 and 1,280 x 800 it starts only with Respond fully
//   on screen and the figure at full opacity) and the link-card light.
// - Copy rule 9 (motion spec 7.1): on every page, no drawing icon sits in an item whose text names
//   a certification, a compliance framework or the ownership status.
// - No layout shift: the cumulative layout-shift score is 0 (every shift counted, input or not)
//   through load, scrolling, the flow run, Replay by mouse and keyboard, hovering and pressing.
//
// Exit code 1 on any failure.
//
// Usage: node scripts/check-motion.mjs [dist-dir]

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { AxeBuilder } from '@axe-core/playwright';
import { animationsIn, freezeAt } from './lib/freeze.mjs';
import { launchBrowser, listPages, serve } from './lib/site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.resolve(root, process.argv[2] ?? 'dist');

/**
 * Gzipped sizes (gzip -9) at 6d8c4b3, before motion v2 (src/styles/global.css, the comment above
 * .hero-media): the motion bundle and the header menu script on every page.
 */
const baseline = { motionJs: 1056, headerJs: 336 };
/** [budget, hard cap] in bytes, gzipped (docs/design-direction.md, "Budgets and checks"). */
const limits = {
  addedJs: [2000, 3000],
  motionJs: [2500, 3000],
  homeJs: [3000, 3500],
  css: [10800, 11500],
  homeHtml: [7500, 8000],
};
const widths = [
  { width: 375, height: 812 },
  { width: 1280, height: 800 },
];
const standardHeaders = ['/services/', '/platform/', '/compliance/', '/about/', '/contact/'];
const calmHeaders = ['/security/', '/legal/'];
const hero = 'section[aria-labelledby="hero-heading"]';
const flow = '[data-flow]';
const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/** @type {string[]} */
const failures = [];
/** @type {string[]} */
const warnings = [];
let checks = 0;
/**
 * @param {boolean} ok
 * @param {string} message
 */
function expect(ok, message) {
  checks += 1;
  if (!ok) failures.push(message);
}

/** Injected before any page script: CSP violations and every layout shift, input or not. */
const instrument = `
  window.__cspViolations = [];
  document.addEventListener('securitypolicyviolation', (event) => {
    window.__cspViolations.push(event.violatedDirective + ' blocked ' + (event.blockedURI || 'inline'));
  });
  window.__shift = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) window.__shift += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
`;
/** Save-Data, as navigator.connection reports it on a phone with data saver on. */
const saveData = `Object.defineProperty(Navigator.prototype, 'connection', { get: () => ({ saveData: true }) });`;
/** A tab that starts hidden; `window.__hidden = false` plus a visibilitychange event shows it. */
const hiddenTab = `
  window.__hidden = true;
  Object.defineProperty(Document.prototype, 'hidden', { configurable: true, get: () => window.__hidden });
  Object.defineProperty(Document.prototype, 'visibilityState', {
    configurable: true,
    get: () => (window.__hidden ? 'hidden' : 'visible'),
  });
`;

/** @param {number} ms */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A page with CSP, error and layout-shift instrumentation, labelled for its messages.
 * @param {import('playwright-core').Browser} browser
 * @param {string} label
 * @param {import('playwright-core').BrowserContextOptions} options
 * @param {{ init?: string[] }} [extra]
 */
async function open(browser, label, options, extra = {}) {
  const context = await browser.newContext({ reducedMotion: 'no-preference', ...options });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  /** @type {string[]} */
  const problems = [];
  page.on('pageerror', (error) => problems.push(`${label}: page error: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`${label}: console error: ${message.text()}`);
  });
  await page.addInitScript(instrument);
  for (const script of extra.init ?? []) await page.addInitScript(script);
  const close = async () => {
    if (options.javaScriptEnabled !== false) {
      const violations = /** @type {string[]} */ (
        await page.evaluate('window.__cspViolations ?? []').catch(() => [])
      );
      for (const v of violations) problems.push(`${label}: CSP violation: ${v}`);
    }
    failures.push(...problems);
    checks += 1;
    await context.close();
  };
  return { page, close };
}

/** @param {import('playwright-core').Page} page */
const shift = (page) => page.evaluate(() => /** @type {any} */ (window).__shift);

/**
 * Scroll instantly (the site's smooth scrolling would otherwise animate the jump).
 * @param {import('playwright-core').Page} page
 * @param {number | string} target a y offset, or a selector to bring to the top of the viewport
 */
async function scrollTo(page, target) {
  await page.evaluate((t) => {
    const y =
      typeof t === 'number'
        ? t
        : (document.querySelector(t)?.getBoundingClientRect().top ?? 0) + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'instant' });
  }, target);
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
}

/**
 * Animations under `selector` whose play state is `running`.
 * @param {import('playwright-core').Page} page
 * @param {string} selector
 */
async function running(page, selector) {
  return (await animationsIn(page, selector)).filter((a) => a.state === 'running');
}

/**
 * Computed style values of an element or pseudo-element.
 * @param {import('playwright-core').Page} page
 * @param {string} selector
 * @param {string | null} pseudo
 * @param {string[]} props
 */
async function styleOf(page, selector, pseudo, props) {
  return page.evaluate(([sel, ps, list]) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el, ps);
    return Object.fromEntries(list.map((p) => [p, cs.getPropertyValue(p)]));
  }, /** @type {[string, string | null, string[]]} */ ([selector, pseudo, props]));
}

/** @param {string | undefined} transform */
const isUnit = (transform) => transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)';

async function checkBudgets() {
  const astro = path.join(dist, '_astro');
  const files = await readdir(astro);
  /** @param {string} file */
  const gz = async (file) => gzipSync(await readFile(path.join(astro, file)), { level: 9 }).length;
  const motion = files.find((f) => /^BaseLayout\.astro_astro_type_script.*\.js$/.test(f));
  const header = files.find((f) => /^Header\.astro_astro_type_script.*\.js$/.test(f));
  const css = files.find((f) => /^BaseLayout\.[^.]+\.css$/.test(f));
  if (!motion || !header || !css) {
    failures.push(
      'budgets: motion bundle, header script or site stylesheet not found in dist/_astro/',
    );
    return;
  }
  const home = await readFile(path.join(dist, 'index.html'));
  const homeScripts = [...home.toString().matchAll(/<script[^>]*\ssrc="\/_astro\/([^"]+)"/g)].map(
    (m) => m[1],
  );
  let homeJs = 0;
  for (const file of homeScripts) homeJs += await gz(file);
  const sizes = {
    motionJs: await gz(motion),
    addedJs: (await gz(motion)) + (await gz(header)) - baseline.motionJs - baseline.headerJs,
    homeJs,
    css: await gz(css),
    homeHtml: gzipSync(home, { level: 9 }).length,
  };
  for (const [name, value] of Object.entries(sizes)) {
    const [budget, cap] = limits[/** @type {keyof typeof limits} */ (name)];
    expect(value <= cap, `budgets: ${name} is ${value} B gzipped, over its ${cap} B hard cap`);
    if (value > budget)
      warnings.push(`budgets: ${name} is ${value} B gzipped (budget ${budget} B)`);
  }
  console.log(
    `  sizes (gzip -9): motion bundle ${sizes.motionJs} B (added ${sizes.addedJs} B), all JavaScript on Home ${sizes.homeJs} B, CSS ${sizes.css} B, Home HTML ${sizes.homeHtml} B`,
  );

  // No new request: every page loads the same scripts and stylesheets as before motion v2.
  for (const pagePath of await listPages(dist)) {
    const file = pagePath.endsWith('/')
      ? path.join(dist, pagePath, 'index.html')
      : path.join(dist, pagePath);
    const html = (await readFile(file, 'utf8')).replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
    const scripts = (html.match(/<script\b[^>]*\ssrc=/g) ?? []).length;
    const styles = (html.match(/<link\b[^>]*rel="stylesheet"/g) ?? []).length;
    const contact = pagePath === '/contact/';
    expect(
      scripts === (contact ? 3 : 2) && styles === (contact ? 2 : 1),
      `requests: ${pagePath} loads ${scripts} scripts and ${styles} stylesheets (expected ${contact ? '3 and 2' : '2 and 1'})`,
    );
  }
}

/** @param {import('playwright-core').Browser} browser */
async function checkTiers(browser) {
  /** @type {Array<[string, import('playwright-core').BrowserContextOptions, string]>} */
  const cases = [
    ['default', {}, 'full'],
    ['reduced motion', { reducedMotion: 'reduce' }, 'off'],
    ['forced colours', { forcedColors: 'active' }, 'plain'],
    ['more contrast', { contrast: 'more' }, 'plain'],
  ];
  for (const [name, options, tier] of cases) {
    const { page, close } = await open(browser, `tier ${name}`, {
      viewport: widths[1],
      ...options,
    });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    const actual = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--motion-tier').trim(),
    );
    expect(actual === tier, `tiers: ${name} gives --motion-tier "${actual}", expected "${tier}"`);
    await close();
  }
}

/** @param {import('playwright-core').Browser} browser */
async function checkReducedMotionEverywhere(browser) {
  const { page, close } = await open(browser, 'reduced motion', {
    viewport: widths[1],
    reducedMotion: 'reduce',
  });
  for (const pagePath of await listPages(dist)) {
    await page.goto(`${origin}${pagePath}`, { waitUntil: 'load' });
    await sleep(150);
    await scrollTo(page, 1e6);
    await sleep(150);
    const state = await page.evaluate(() => ({
      animations: document
        .getAnimations()
        .filter((a) => a.playState === 'running' || a instanceof CSSAnimation)
        .map((a) => /** @type {any} */ (a).animationName ?? 'transition'),
      pending: document.querySelectorAll('.reveal-pending').length,
      counted: document.querySelectorAll('[data-count]').length,
      flow: document.querySelector('[data-flow]')?.className ?? '',
      lite: document.documentElement.classList.contains('motion-lite'),
    }));
    expect(
      state.animations.length === 0,
      `reduced motion: ${pagePath} runs animations: ${state.animations.join(', ')}`,
    );
    expect(state.pending === 0, `reduced motion: ${pagePath} hides ${state.pending} element(s)`);
    expect(state.counted === 0, `reduced motion: ${pagePath} arms a statistic bar`);
    expect(
      !/is-armed|is-running/.test(state.flow),
      `reduced motion: the flow was armed or run (${state.flow})`,
    );
  }
  await page.goto(`${origin}/`, { waitUntil: 'load' });
  const button = await styleOf(page, '.flow-replay', null, ['display']);
  expect(button?.display === 'none', 'reduced motion: the flow button is displayed');
  await close();
}

/** @param {import('playwright-core').Browser} browser */
async function checkSettling(browser) {
  // (1) Opened in a hidden tab: the hero holds at its start, then plays when the tab is shown.
  {
    const { page, close } = await open(
      browser,
      'hidden tab',
      { viewport: widths[1] },
      { init: [hiddenTab] },
    );
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await sleep(300);
    const held = await animationsIn(page, hero);
    const hidden = await page.evaluate(() =>
      document.documentElement.classList.contains('is-tab-hidden'),
    );
    expect(hidden, 'hidden tab: <html> lacks .is-tab-hidden');
    expect(held.length > 0, 'hidden tab: the hero has no animations to check');
    expect(
      held.every((a) => a.state === 'paused' && a.time < 100),
      `hidden tab: hero animations not held at their start: ${JSON.stringify(held.filter((a) => a.state !== 'paused' || a.time >= 100))}`,
    );
    await page.evaluate(() => {
      /** @type {any} */ (window).__hidden = false;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await sleep(150);
    expect(
      (await running(page, hero)).length > 0,
      'hidden tab: the hero did not play when the tab was shown',
    );
    await sleep(2050);
    const still = await running(page, hero);
    expect(
      still.length === 0,
      `hidden tab: hero not at rest 2.2 s after being shown: ${still.map((a) => a.name).join(', ')}`,
    );
    await close();
  }

  // (2) Loaded at #how-it-works: the hero, off-screen, is at rest.
  {
    const { page, close } = await open(browser, 'fragment load', { viewport: widths[1] });
    await page.goto(`${origin}/#how-it-works`, { waitUntil: 'load' });
    await sleep(400);
    const live = await running(page, hero);
    expect(
      live.length === 0,
      `fragment load: hero animations running off-screen: ${live.map((a) => a.name).join(', ')}`,
    );
    await close();
  }

  // (3) Back-forward-cache restore: mid-hero and mid-flow, nothing is left running.
  {
    const { page, close } = await open(browser, 'pageshow', { viewport: widths[1] });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await page.evaluate(() =>
      window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })),
    );
    await sleep(50);
    const heroLive = await running(page, hero);
    expect(heroLive.length === 0, 'pageshow: hero animations still running after a restore');
    await scrollTo(page, flow);
    await page.waitForFunction(
      (sel) => document.querySelector(sel)?.classList.contains('is-running'),
      flow,
    );
    await sleep(1000);
    await page.evaluate(() =>
      window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })),
    );
    await sleep(50);
    const flowLive = await running(page, flow);
    expect(
      flowLive.length === 0,
      `pageshow: flow animations still running after a restore: ${flowLive.map((a) => a.name).join(', ')}`,
    );
    await close();
  }

  // (4) data-revealed on every element revealed on scroll, never on one on screen at load.
  for (const viewport of widths) {
    const { page, close } = await open(browser, `reveal ${viewport.width}`, { viewport });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    const pendingAtLoad = await page.evaluate(() =>
      [...document.querySelectorAll('[data-reveal]')].map((el) =>
        el.classList.contains('reveal-pending'),
      ),
    );
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height; y += 400) {
      await scrollTo(page, y);
      await sleep(30);
    }
    await sleep(200);
    const revealed = await page.evaluate(() =>
      [...document.querySelectorAll('[data-reveal]')].map((el) => el.hasAttribute('data-revealed')),
    );
    const wrong = revealed.filter((r, i) => r !== pendingAtLoad[i]).length;
    expect(
      wrong === 0 && pendingAtLoad.some(Boolean),
      `reveal ${viewport.width}: data-revealed differs from "below the fold at load" on ${wrong} element(s)`,
    );
    expect(
      (await shift(page)) === 0,
      `reveal ${viewport.width}: layout shift ${await shift(page)} through a full scroll`,
    );
    await close();
  }
}

/** @param {import('playwright-core').Browser} browser */
async function checkSiteWide(browser) {
  // Icon draw on reveal (Why Direwolf): drawn 800 ms after the reveal, and still drawn at 1 s.
  {
    const { page, close } = await open(browser, 'icon draw', { viewport: widths[1] });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await scrollTo(page, '#why-direwolf');
    await page.waitForFunction(() =>
      document
        .querySelector('#why-direwolf [data-reveal="stagger"]')
        ?.hasAttribute('data-revealed'),
    );
    const offsets = async () =>
      page.evaluate(() =>
        [
          ...document.querySelectorAll(
            '#why-direwolf .icon-draw-reveal :is(path, circle, rect, line, polyline, polygon, ellipse)',
          ),
        ].map((shape) => getComputedStyle(shape).strokeDashoffset),
      );
    const started = await page.evaluate(
      () => [...document.querySelectorAll('#why-direwolf .icon-draw-reveal')].length,
    );
    expect(
      started === 2,
      `icon draw: expected 2 Why Direwolf icons with draw="reveal" (the other two are static beside status and compliance wording), found ${started}`,
    );
    await sleep(800);
    const at800 = await offsets();
    expect(
      at800.length > 0 && at800.every((o) => parseFloat(o) === 0),
      `icon draw: not every shape drawn 800 ms after the reveal: ${at800.join(' ')}`,
    );
    await sleep(200);
    expect(
      (await offsets()).every((o) => parseFloat(o) === 0),
      'icon draw: a shape undrawn at 1 s',
    );
    await close();
  }

  // Buttons: hovering and pressing the hero's primary button shifts nothing.
  {
    const { page, close } = await open(browser, 'button press', { viewport: widths[1] });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await page.evaluate(() =>
      document.addEventListener('click', (event) => event.preventDefault(), true),
    );
    const button = page.locator(`${hero} a.btn-primary`);
    await button.hover();
    await sleep(200);
    await page.mouse.down();
    await sleep(200);
    await page.mouse.up();
    await sleep(200);
    expect((await shift(page)) === 0, `button press: layout shift ${await shift(page)}`);
    const catchLight = await styleOf(page, `${hero} a.btn-primary`, null, ['box-shadow']);
    expect(
      /inset/.test(catchLight?.['box-shadow'] ?? ''),
      'button press: the primary button has no inset catch-light',
    );
    await close();
  }

  // Header: line of light on scroll without a shift; the nav bar for the current page and focus.
  {
    const { page, close } = await open(browser, 'header', { viewport: widths[1] });
    await page.goto(`${origin}/services/`, { waitUntil: 'load' });
    for (const y of [0, 50, 100, 200, 100, 0]) {
      await scrollTo(page, y);
      await sleep(60);
    }
    await scrollTo(page, 200);
    await sleep(300);
    const light = await styleOf(page, '[data-site-header]', '::before', ['opacity']);
    expect(light?.opacity === '1', 'header: no line of light once scrolled');
    expect((await shift(page)) === 0, `header: layout shift ${await shift(page)} while scrolling`);
    const current = await styleOf(page, '.nav-link[aria-current="page"]', null, [
      'text-decoration-line',
    ]);
    const bar = await styleOf(page, '.nav-link[aria-current="page"]', '::after', [
      'border-top-width',
      'transform',
    ]);
    expect(
      current?.['text-decoration-line'] === 'none',
      'header: the current page link is still underlined',
    );
    expect(
      bar?.['border-top-width'] === '2px' && isUnit(bar?.transform),
      `header: the current page link lacks its 2 px bar (${JSON.stringify(bar)})`,
    );
    await scrollTo(page, 0);
    let focusedNav = false;
    for (let i = 0; i < 12 && !focusedNav; i += 1) {
      await page.keyboard.press('Tab');
      focusedNav = await page.evaluate(
        () =>
          document.activeElement?.classList.contains('nav-link') === true &&
          document.activeElement.getAttribute('aria-current') !== 'page',
      );
    }
    await sleep(250);
    const focus = await page.evaluate(() => {
      const el = /** @type {HTMLElement} */ (document.activeElement);
      return {
        outline: getComputedStyle(el).outlineStyle,
        bar: getComputedStyle(el, '::after').transform,
      };
    });
    expect(
      focusedNav && focus.outline === 'solid' && isUnit(focus.bar),
      `header: keyboard focus on a nav link shows no bar with the focus ring (${JSON.stringify(focus)})`,
    );
    await close();
  }

  // Reading-progress hairline: Services from md up only, scroll-driven; absent elsewhere.
  {
    const { page, close } = await open(browser, 'progress', { viewport: widths[1] });
    await page.goto(`${origin}/services/`, { waitUntil: 'load' });
    const top = await styleOf(page, '[data-site-header]', '::after', ['transform', 'content']);
    await scrollTo(page, 1e6);
    await sleep(100);
    const bottom = await styleOf(page, '[data-site-header]', '::after', ['transform']);
    expect(
      top?.transform === 'matrix(0, 0, 0, 1, 0, 0)' &&
        bottom?.transform === 'matrix(1, 0, 0, 1, 0, 0)',
      `progress: hairline not scaleX(0) at the top and scaleX(1) at the bottom (${top?.transform} / ${bottom?.transform})`,
    );
    expect((await shift(page)) === 0, `progress: layout shift ${await shift(page)}`);
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    const home = await styleOf(page, '[data-site-header]', '::after', ['content']);
    expect(home?.content === 'none', 'progress: the hairline appears on Home');
    await close();
    for (const [label, options] of /** @type {const} */ ([
      ['375 px', { viewport: widths[0] }],
      ['reduced motion', { viewport: widths[1], reducedMotion: 'reduce' }],
    ])) {
      const other = await open(browser, `progress ${label}`, options);
      await other.page.goto(`${origin}/services/`, { waitUntil: 'load' });
      const style = await styleOf(other.page, '[data-site-header]', '::after', ['content']);
      expect(style?.content === 'none', `progress: the hairline appears at ${label}`);
      await other.close();
    }
  }

  // Page headers: standard at rest 2.5 s after load; calm with no animation at all.
  {
    const { page, close } = await open(browser, 'page headers', { viewport: widths[1] });
    for (const pagePath of standardHeaders) {
      await page.goto(`${origin}${pagePath}`, { waitUntil: 'load' });
      const animated = (await animationsIn(page, '[data-oneshot]')).length;
      expect(
        animated >= 4,
        `page header ${pagePath}: expected the power-on sequence, found ${animated} animation(s)`,
      );
      await sleep(2500);
      const live = await running(page, '[data-oneshot]');
      expect(
        live.length === 0,
        `page header ${pagePath}: still running at 2.5 s: ${live.map((a) => a.name).join(', ')}`,
      );
      expect(
        (await shift(page)) === 0,
        `page header ${pagePath}: layout shift ${await shift(page)}`,
      );
    }
    for (const pagePath of calmHeaders) {
      await page.goto(`${origin}${pagePath}`, { waitUntil: 'load' });
      await sleep(300);
      const all = await animationsIn(page, ':root');
      expect(
        all.length === 0,
        `calm page ${pagePath}: animations found: ${all.map((a) => a.name).join(', ')}`,
      );
    }
    await close();
  }
}

/** @param {import('playwright-core').Browser} browser */
async function checkHeroAndStats(browser) {
  for (const viewport of widths) {
    const { page, close } = await open(browser, `hero ${viewport.width}`, { viewport });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    const names = (await animationsIn(page, hero)).map((a) => a.name);
    for (const name of ['hero-settle', 'draw-x', 'trace', 'icon-draw', 'accent-sweep']) {
      expect(names.includes(name), `hero ${viewport.width}: no ${name} animation`);
    }
    await sleep(2500);
    const live = await running(page, hero);
    expect(
      live.length === 0,
      `hero ${viewport.width}: still running at 2.5 s: ${live.map((a) => a.name).join(', ')}`,
    );
    expect((await shift(page)) === 0, `hero ${viewport.width}: layout shift ${await shift(page)}`);

    // Statistics: each bar grows with its figure and lands within 1,050 ms; exact final strings.
    await page.evaluate(() => {
      /** @type {any} */ (window).__runAt = [];
      for (const item of document.querySelectorAll('[data-stat]')) {
        new MutationObserver(() => {
          if (item.getAttribute('data-count') === 'run') {
            /** @type {any} */ (window).__runAt.push(performance.now());
          }
        }).observe(item, { attributes: true, attributeFilter: ['data-count'] });
      }
    });
    const armed = await page.evaluate(() =>
      [...document.querySelectorAll('[data-stat]')].map((el) => el.getAttribute('data-count')),
    );
    expect(
      armed.length === 3 && armed.every((v) => v === 'armed'),
      `stats ${viewport.width}: bars not armed below the fold (${armed.join(', ')})`,
    );
    await scrollTo(page, '#stats-heading');
    await sleep(1050);
    if (viewport.width < 768) {
      await scrollTo(page, '[data-stat]:last-child');
      await sleep(1050);
    }
    const stats = await page.evaluate(() =>
      [...document.querySelectorAll('[data-stat]')].map((item) => ({
        count: item.getAttribute('data-count'),
        bar: getComputedStyle(item, '::before').transform,
        shown: item.querySelector('[data-countup]')?.textContent?.trim(),
        final: item.querySelector('.sr-only')?.textContent?.trim(),
      })),
    );
    for (const [i, stat] of stats.entries()) {
      expect(stat.count === 'run', `stats ${viewport.width}: figure ${i + 1} never counted`);
      expect(isUnit(stat.bar), `stats ${viewport.width}: bar ${i + 1} not drawn (${stat.bar})`);
      expect(
        stat.shown === stat.final,
        `stats ${viewport.width}: figure ${i + 1} ended on "${stat.shown}", not "${stat.final}"`,
      );
    }
    expect((await shift(page)) === 0, `stats ${viewport.width}: layout shift ${await shift(page)}`);
    await close();
  }

  // JavaScript off: the hero sequence still plays and ends on the static frame; bars and figures
  // are final; the flow is the drawn diagram with no button.
  for (const viewport of widths) {
    const { page, close } = await open(browser, `no JavaScript ${viewport.width}`, {
      viewport,
      javaScriptEnabled: false,
    });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await sleep(2500);
    const heroAnims = await animationsIn(page, hero);
    expect(
      heroAnims.length > 0 && heroAnims.every((a) => a.state === 'finished'),
      `no JavaScript ${viewport.width}: hero sequence did not play to its end`,
    );
    const state = await page.evaluate(() => {
      const fig = document.querySelector('[data-flow]');
      /** @param {Element} el */
      const opacity = (el) => getComputedStyle(el).opacity;
      /** @param {string} sel */
      const display = (sel) => {
        const el = fig?.querySelector(sel);
        return el ? getComputedStyle(el).display : '';
      };
      return {
        bars: [...document.querySelectorAll('[data-stat]')].map(
          (item) => getComputedStyle(item, '::before').transform,
        ),
        figures: [...document.querySelectorAll('[data-stat]')].map(
          (item) =>
            item.querySelector('[data-countup]')?.textContent?.trim() ===
            item.querySelector('.sr-only')?.textContent?.trim(),
        ),
        nodes: [...(fig?.querySelectorAll('[data-flow-node]') ?? [])].map(opacity),
        links: [...(fig?.querySelectorAll('.flow-link') ?? [])].map((link) => {
          const cs = getComputedStyle(link, '::before');
          return {
            transform: cs.transform,
            width: Math.max(parseFloat(cs.borderLeftWidth), parseFloat(cs.borderTopWidth)),
          };
        }),
        pulses: [...(fig?.querySelectorAll('.flow-pulse') ?? [])].map(opacity),
        button: display('.flow-replay'),
        icons: [
          ...document.querySelectorAll(
            '.icon-draw-reveal :is(path, circle, rect, line, polyline, polygon, ellipse)',
          ),
        ].map((shape) => getComputedStyle(shape).strokeDasharray),
        frame: (() => {
          const frameEl = fig?.querySelector('.flow-frame');
          return frameEl ? getComputedStyle(frameEl).borderTopWidth : '';
        })(),
      };
    });
    expect(
      state.bars.length === 3 && state.bars.every(isUnit),
      `no JavaScript ${viewport.width}: statistic bars not drawn`,
    );
    expect(
      state.figures.every(Boolean),
      `no JavaScript ${viewport.width}: a statistic is not final`,
    );
    expect(
      state.nodes.length >= 3 && state.nodes.every((o) => o === '1'),
      `no JavaScript ${viewport.width}: a flow node is not at opacity 1`,
    );
    expect(
      state.links.length >= 2 && state.links.every((l) => isUnit(l.transform) && l.width === 1),
      `no JavaScript ${viewport.width}: a flow line is not drawn as a 1 px border (${JSON.stringify(state.links)})`,
    );
    expect(
      state.pulses.every((o) => o === '0'),
      `no JavaScript ${viewport.width}: a pulse is visible`,
    );
    expect(
      state.button === 'none',
      `no JavaScript ${viewport.width}: the Replay button is displayed`,
    );
    expect(state.frame === '1px', `no JavaScript ${viewport.width}: the frame is not drawn`);
    expect(
      state.icons.every((d) => d === 'none'),
      `no JavaScript ${viewport.width}: an icon is not fully drawn`,
    );
    await close();
  }

  // Save-Data: no count-up runs and the bars stay drawn.
  {
    const { page, close } = await open(
      browser,
      'save-data stats',
      { viewport: widths[1] },
      { init: [saveData] },
    );
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await scrollTo(page, '#stats-heading');
    const samples = [];
    for (let i = 0; i < 6; i += 1) {
      samples.push(
        await page.evaluate(() =>
          [...document.querySelectorAll('[data-stat]')].every(
            (item) =>
              !item.hasAttribute('data-count') &&
              item.querySelector('[data-countup]')?.textContent?.trim() ===
                item.querySelector('.sr-only')?.textContent?.trim(),
          ),
        ),
      );
      await sleep(150);
    }
    expect(samples.every(Boolean), 'save-data: a statistic counted up or its bar was armed');
    await close();
  }
}

/**
 * Record the figure's class changes with timestamps (page side).
 * @param {import('playwright-core').Page} page
 */
async function watchFlow(page) {
  await page.evaluate((sel) => {
    const fig = document.querySelector(sel);
    /** @type {Array<[number, string]>} */
    const log = [];
    /** @type {any} */ (window).__flowLog = log;
    if (!fig) return;
    new MutationObserver(() => log.push([performance.now(), fig.className])).observe(fig, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }, flow);
}

/** @param {import('playwright-core').Page} page */
const flowClass = (page) =>
  page.evaluate((sel) => document.querySelector(sel)?.className ?? '', flow);

/** @param {import('playwright-core').Browser} browser */
async function checkFlow(browser) {
  // (1) The run lasts 4.25 s (+/- 150 ms) and nothing runs 5 s after it starts; (4) no layout
  // shift through load, a full scroll, the run and Replay by mouse and by keyboard.
  for (const viewport of widths) {
    const { page, close } = await open(browser, `flow ${viewport.width}`, { viewport });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    expect(
      /\bis-armed\b/.test(await flowClass(page)),
      `flow ${viewport.width}: not armed below the fold (${await flowClass(page)})`,
    );
    await watchFlow(page);
    await scrollTo(page, flow);
    await page.waitForFunction(
      (sel) => document.querySelector(sel)?.classList.contains('is-running'),
      flow,
    );
    await page.waitForFunction(
      (sel) => {
        const c = document.querySelector(sel)?.classList;
        return c?.contains('is-drawn') && !c.contains('is-running');
      },
      flow,
      { timeout: 10000 },
    );
    const log = /** @type {Array<[number, string]>} */ (await page.evaluate('window.__flowLog'));
    const start = log.find(([, c]) => /\bis-running\b/.test(c))?.[0] ?? 0;
    const end =
      log.find(([t, c]) => t > start && /\bis-drawn\b/.test(c) && !/\bis-running\b/.test(c))?.[0] ??
      0;
    const duration = Math.round(end - start);
    expect(
      Math.abs(duration - 4250) <= 150,
      `flow ${viewport.width}: the run took ${duration} ms, expected 4,250 +/- 150 ms`,
    );
    const elapsed = await page.evaluate((s) => performance.now() - s, start);
    if (elapsed < 5000) await sleep(5000 - elapsed);
    const live = await running(page, flow);
    expect(live.length === 0, `flow ${viewport.width}: animations running 5 s after the start`);
    const replay = page.locator('[data-flow-replay]');
    expect(await replay.isVisible(), `flow ${viewport.width}: Replay not shown after the run`);
    expect(
      (await replay.textContent())?.replace(/\s+/g, ' ').trim() === 'Replay the illustration',
      `flow ${viewport.width}: the button is not "Replay the illustration"`,
    );
    await replay.click();
    expect(
      /\bis-running\b/.test(await flowClass(page)),
      `flow ${viewport.width}: Replay did not run`,
    );
    await page.waitForFunction(
      (sel) => !document.querySelector(sel)?.classList.contains('is-running'),
      flow,
      { timeout: 10000 },
    );
    await replay.focus();
    await page.keyboard.press('Enter');
    expect(
      /\bis-running\b/.test(await flowClass(page)),
      `flow ${viewport.width}: Enter on Replay did not run`,
    );
    expect(
      await page.evaluate(() => document.activeElement?.hasAttribute('data-flow-replay') === true),
      `flow ${viewport.width}: focus left the Replay button`,
    );
    await page.waitForFunction(
      (sel) => !document.querySelector(sel)?.classList.contains('is-running'),
      flow,
      { timeout: 10000 },
    );
    await scrollTo(page, 1e6);
    await sleep(200);
    expect((await shift(page)) === 0, `flow ${viewport.width}: layout shift ${await shift(page)}`);
    await close();
  }

  // (2) Off-screen mid-run: everything holds; back on screen: it completes.
  {
    const { page, close } = await open(browser, 'flow pause', { viewport: widths[1] });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await scrollTo(page, flow);
    await page.waitForFunction(
      (sel) => document.querySelector(sel)?.classList.contains('is-running'),
      flow,
    );
    await sleep(1000);
    await scrollTo(page, 0);
    await sleep(300);
    const states = await animationsIn(page, flow);
    expect(
      states.some((a) => a.state === 'paused') && !states.some((a) => a.state === 'running'),
      `flow pause: off-screen animations not paused (${[...new Set(states.map((a) => a.state))].join(', ')})`,
    );
    await sleep(1000);
    expect(
      /\bis-running\b/.test(await flowClass(page)),
      'flow pause: the run ended while off-screen',
    );
    await scrollTo(page, flow);
    await page.waitForFunction(
      (sel) => {
        const c = document.querySelector(sel)?.classList;
        return c?.contains('is-drawn') && !c.contains('is-running');
      },
      flow,
      { timeout: 10000 },
    );
    await close();
  }

  // (3) The brightest frame (3,250 ms: every node lit, the frame light at its peak) under axe.
  for (const colorScheme of /** @type {const} */ (['light', 'dark'])) {
    for (const viewport of widths) {
      const { page, close } = await open(
        browser,
        `flow brightest ${colorScheme} ${viewport.width}`,
        {
          viewport,
          colorScheme,
        },
      );
      await page.goto(`${origin}/`, { waitUntil: 'load' });
      await scrollTo(page, flow);
      await page.waitForFunction(
        (sel) => document.querySelector(sel)?.classList.contains('is-running'),
        flow,
      );
      const frozen = await freezeAt(page, flow, 3250);
      expect(frozen > 0, 'flow brightest: nothing to freeze');
      await sleep(100);
      const lit = await page.evaluate(
        (sel) =>
          [...document.querySelectorAll(`${sel} [data-flow-node]`)].map(
            (n) => getComputedStyle(n, '::after').opacity,
          ),
        flow,
      );
      expect(
        lit.every((o) => o === '1'),
        `flow brightest: not every node lit at 3,250 ms (${lit.join(', ')})`,
      );
      const axe = await new AxeBuilder({ page }).include(flow).withTags(axeTags).analyze();
      expect(
        axe.violations.length === 0,
        `flow brightest ${colorScheme} ${viewport.width}: ${axe.violations.map((v) => `${v.id} (${v.nodes.length})`).join(', ')}`,
      );
      await close();
    }
  }

  // (5) Reduced motion, (6) forced colours and more contrast: never armed or run, no button.
  for (const [
    label,
    options,
  ] of /** @type {Array<[string, import('playwright-core').BrowserContextOptions]>} */ ([
    ['reduced motion', { reducedMotion: 'reduce' }],
    ['forced colours', { forcedColors: 'active' }],
    ['more contrast', { contrast: 'more' }],
  ])) {
    const { page, close } = await open(browser, `flow ${label}`, {
      viewport: widths[1],
      ...options,
    });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await watchFlow(page);
    await scrollTo(page, flow);
    await sleep(1200);
    const classes = /** @type {Array<[number, string]>} */ (await page.evaluate('window.__flowLog'))
      .map(([, c]) => c)
      .concat(await flowClass(page));
    expect(
      classes.every((c) => !/\bis-(armed|running)\b/.test(c)),
      `flow ${label}: armed or run (${classes.join(' | ')})`,
    );
    const button = await styleOf(page, '.flow-replay', null, ['display']);
    expect(button?.display === 'none', `flow ${label}: the button is displayed`);
    if (label === 'reduced motion') {
      const anims = await animationsIn(page, flow);
      expect(anims.length === 0, `flow ${label}: ${anims.length} animation(s) in the figure`);
    }
    await close();
  }

  // (7) Save-Data: lite, never starts by itself, Play runs it once, then Replay.
  {
    const { page, close } = await open(
      browser,
      'flow save-data',
      { viewport: widths[1] },
      { init: [saveData] },
    );
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    expect(
      await page.evaluate(() => document.documentElement.classList.contains('motion-lite')),
      'flow save-data: <html> lacks .motion-lite',
    );
    const heroPulse = await styleOf(page, `${hero} .hero-proof`, '::after', ['animation-name']);
    expect(heroPulse?.['animation-name'] === 'none', 'flow save-data: the hero pulse still runs');
    await scrollTo(page, flow);
    await sleep(1200);
    expect(
      !/\bis-(armed|running)\b/.test(await flowClass(page)),
      'flow save-data: armed or started by itself',
    );
    const button = page.locator('[data-flow-replay]');
    expect(await button.isVisible(), 'flow save-data: the Play button is not visible');
    expect(
      (await button.textContent())?.replace(/\s+/g, ' ').trim() === 'Play the illustration',
      'flow save-data: the button is not "Play the illustration"',
    );
    await button.click();
    expect(/\bis-running\b/.test(await flowClass(page)), 'flow save-data: Play did not run');
    await page.waitForFunction(
      (sel) => !document.querySelector(sel)?.classList.contains('is-running'),
      flow,
      { timeout: 10000 },
    );
    expect(
      (await button.textContent())?.replace(/\s+/g, ' ').trim() === 'Replay the illustration',
      'flow save-data: the label did not become "Replay"',
    );
    const card = await styleOf(page, '.card-lift', '::before', ['display']);
    expect(card?.display === 'none', 'flow save-data: the card light is on');
    await close();
  }

  // (8) Reduced motion switched on mid-run: drawn at once, no run, no button.
  {
    const { page, close } = await open(browser, 'flow reduce mid-run', { viewport: widths[1] });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await scrollTo(page, flow);
    await page.waitForFunction(
      (sel) => document.querySelector(sel)?.classList.contains('is-running'),
      flow,
    );
    await sleep(1000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await sleep(150);
    const classes = await flowClass(page);
    expect(
      /\bis-drawn\b/.test(classes) && !/\bis-running\b/.test(classes),
      `flow reduce mid-run: not settled (${classes})`,
    );
    expect(
      !(await page.locator('[data-flow-replay]').isVisible()),
      'flow reduce mid-run: the button is shown',
    );
    expect(
      (await running(page, flow)).length === 0,
      'flow reduce mid-run: animations still running',
    );
    await close();
  }
}

/**
 * Scroll by `step` px at a time, one real scroll event a frame or so, from `from` to `to`.
 * @param {import('playwright-core').Page} page
 * @param {number} from
 * @param {number} to
 * @param {number} step
 */
async function slowScroll(page, from, to, step) {
  await scrollTo(page, from);
  for (let y = from; y < to; y += step) {
    await page.evaluate((s) => window.scrollBy({ top: s, behavior: 'instant' }), step);
    await sleep(16);
  }
  await sleep(100);
}

/**
 * Page-side: the steps' document span, and a record of the first frame with `.is-running` (where
 * Respond and Detect sat, the viewport height and the figure's opacity).
 * @param {import('playwright-core').Page} page
 */
async function watchFlowStart(page) {
  return page.evaluate((sel) => {
    const fig = /** @type {HTMLElement} */ (document.querySelector(sel));
    const box = (/** @type {string} */ s) => fig.querySelector(s)?.getBoundingClientRect();
    new MutationObserver(() => {
      if (/** @type {any} */ (window).__atRun || !fig.classList.contains('is-running')) return;
      const respond = box('[data-flow-node="respond"]');
      /** @type {any} */ (window).__atRun = {
        respond: respond && [respond.top, respond.bottom],
        height: window.innerHeight,
        opacity: getComputedStyle(fig).opacity,
      };
    }).observe(fig, { attributes: true, attributeFilter: ['class'] });
    const steps = /** @type {DOMRect} */ (box('ol'));
    return { top: steps.top + window.scrollY, bottom: steps.bottom + window.scrollY };
  }, flow);
}

/**
 * The flow's start can never be missed, and never plays its end off screen.
 * @param {import('playwright-core').Browser} browser
 */
async function checkFlowStart(browser) {
  // (1) Short and zoomed viewports (the steps 2.5 to 3 times the viewport's height): a slow scroll
  // down through the figure, then holding it centred, always ends running or drawn, lines drawn.
  for (const viewport of [
    { width: 375, height: 262 },
    { width: 512, height: 262 },
  ]) {
    const label = `flow start ${viewport.width}x${viewport.height}`;
    const { page, close } = await open(browser, label, { viewport });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await watchFlow(page);
    const steps = await watchFlowStart(page);
    const { height } = viewport;
    await slowScroll(page, steps.top - height - 100, steps.bottom + 50, 20);
    await scrollTo(page, steps.top + (steps.bottom - steps.top) / 2 - height / 2 + 80);
    await sleep(1500);
    const log = /** @type {Array<[number, string]>} */ (await page.evaluate('window.__flowLog'));
    const classes = log.map(([, c]) => c).concat(await flowClass(page));
    const lines = await page.evaluate(
      (sel) =>
        [...document.querySelectorAll(`${sel} .flow-link`)].map(
          (link) => getComputedStyle(link, '::before').transform,
        ),
      flow,
    );
    expect(
      classes.some((c) => /\bis-(running|drawn)\b/.test(c)),
      `${label}: the figure never reached .is-running or .is-drawn (${classes.at(-1)})`,
    );
    expect(
      lines.length >= 2 && lines.every(isUnit),
      `${label}: a connector line is left undrawn (${lines.join(' | ')})`,
    );
    await close();
  }

  // (2) A fast scroll past (200 px a step, about a viewport a frame at 375 x 262): if the run
  // never started, the lines are drawn once the steps are above the viewport.
  {
    const viewport = { width: 375, height: 812 };
    const { page, close } = await open(browser, 'flow start fast', { viewport });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    const steps = await watchFlowStart(page);
    await slowScroll(page, steps.top - viewport.height - 100, steps.bottom + 400, 200);
    const state = await page.evaluate(
      (sel) => ({
        classes: document.querySelector(sel)?.className ?? '',
        lines: [...document.querySelectorAll(`${sel} .flow-link`)].map(
          (link) => getComputedStyle(link, '::before').transform,
        ),
      }),
      flow,
    );
    expect(
      /\bis-(running|drawn)\b/.test(state.classes) &&
        (/\bis-running\b/.test(state.classes) || state.lines.every(isUnit)),
      `flow start fast: passed with the lines undrawn (${state.classes}; ${state.lines.join(' | ')})`,
    );
    await close();
  }

  // (3) At 375 x 812 and 1,280 x 800 a slow scroll down starts the run only once Respond is fully
  // on screen, with the figure at full opacity (it has no scroll reveal of its own).
  for (const viewport of widths) {
    const label = `flow start ${viewport.width}`;
    const { page, close } = await open(browser, label, { viewport });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    const steps = await watchFlowStart(page);
    await slowScroll(page, steps.top - viewport.height - 100, steps.top - 40, 20);
    const atRun = /** @type {any} */ (await page.evaluate('window.__atRun'));
    expect(atRun !== undefined, `${label}: the run did not start during a slow scroll`);
    if (atRun) {
      expect(
        atRun.respond?.[0] >= 0 && atRun.respond?.[1] <= atRun.height,
        `${label}: the run started with Respond at ${atRun.respond?.map(Math.round).join(' to ')} px in a ${atRun.height} px viewport`,
      );
      expect(atRun.opacity === '1', `${label}: the run started at figure opacity ${atRun.opacity}`);
    }
    await close();
  }
}

/**
 * Motion copy rule 9 (motion spec 7.1; register row D1's list): no animated check or seal on
 * status or compliance content. On every page, every icon that draws (`.icon-draw`, on load, or
 * `.icon-draw-reveal`, on reveal) is checked against the text of its item: the nearest list
 * item or definition-list group, else its nearest ancestor with text (a tile's eyebrow).
 * @param {import('playwright-core').Browser} browser
 */
async function checkCopyRule(browser) {
  const { page, close } = await open(browser, 'copy rule 9', {
    viewport: widths[1],
    javaScriptEnabled: false,
  });
  for (const pagePath of await listPages(dist)) {
    await page.goto(`${origin}${pagePath}`, { waitUntil: 'load' });
    const offending = await page.evaluate(() => {
      // The spec's list (FedRAMP, FIPS, CMMC, NIST, certified, compliant, authorized, validated,
      // ready, aligned) plus the ownership status.
      const banned =
        /\b(FedRAMP|FIPS|CMMC|NIST|certified|compliant|authorized|validated|ready|aligned|SDVOSB)\b|veteran-owned/i;
      return [...document.querySelectorAll('svg.icon-draw, svg.icon-draw-reveal')]
        .map((icon) => {
          let item = icon.closest('li, dl > div');
          for (let el = icon.parentElement; !item && el; el = el.parentElement) {
            if (el.textContent?.trim()) item = el;
          }
          return item?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        })
        .filter((text) => banned.test(text));
    });
    expect(
      offending.length === 0,
      `copy rule 9: ${pagePath} draws an icon beside status or compliance wording: ${offending.map((t) => `"${t.slice(0, 60)}"`).join(', ')}`,
    );
  }
  await close();
}

/** @param {import('playwright-core').Browser} browser */
async function checkCards(browser) {
  for (const colorScheme of /** @type {const} */ (['light', 'dark'])) {
    const { page, close } = await open(browser, `card light ${colorScheme}`, {
      viewport: widths[1],
      colorScheme,
    });
    await page.goto(`${origin}/`, { waitUntil: 'load' });
    await scrollTo(page, '#services');
    await sleep(800);
    const card = page.locator('[data-spotlight] .card-lift').first();
    const box = await card.boundingBox();
    if (!box) {
      failures.push('card light: no link card in a data-spotlight grid');
      await close();
      continue;
    }
    await page.mouse.move(box.x + box.width * 0.3, box.y + 40);
    await page.mouse.move(box.x + box.width * 0.6, box.y + 60, { steps: 4 });
    await sleep(300);
    const hovered = await card.evaluate((el) => ({
      mx: /** @type {HTMLElement} */ (el).style.getPropertyValue('--mx'),
      my: /** @type {HTMLElement} */ (el).style.getPropertyValue('--my'),
      edge: getComputedStyle(el, '::before').opacity,
    }));
    expect(
      /px$/.test(hovered.mx) && /px$/.test(hovered.my) && hovered.edge === '1',
      `card light ${colorScheme}: pointer position not written or edge not lit (${JSON.stringify(hovered)})`,
    );
    let axe = await new AxeBuilder({ page })
      .include('[data-spotlight]')
      .withTags(axeTags)
      .analyze();
    expect(
      axe.violations.length === 0,
      `card light ${colorScheme} (hover): ${axe.violations.map((v) => v.id).join(', ')}`,
    );
    expect(
      (await shift(page)) === 0,
      `card light ${colorScheme}: layout shift ${await shift(page)}`,
    );

    // Keyboard focus lights the card from above.
    await page.mouse.move(5, 5);
    await scrollTo(page, 0);
    let focused = false;
    for (let i = 0; i < 40 && !focused; i += 1) {
      await page.keyboard.press('Tab');
      focused = await page.evaluate(
        () => document.activeElement?.closest('[data-spotlight] .card-lift') !== null,
      );
    }
    await sleep(350);
    const lit = await page.evaluate(() => {
      const c = document.activeElement?.closest('.card-lift');
      return c ? getComputedStyle(c, '::before').opacity : '';
    });
    expect(
      focused && lit === '1',
      `card light ${colorScheme}: keyboard focus does not light the card`,
    );
    axe = await new AxeBuilder({ page }).include('[data-spotlight]').withTags(axeTags).analyze();
    expect(
      axe.violations.length === 0,
      `card light ${colorScheme} (focus): ${axe.violations.map((v) => v.id).join(', ')}`,
    );
    await close();
  }
}

/** @type {string} */
let origin = '';

async function main() {
  const pages = await listPages(dist).catch(() => []);
  if (pages.length === 0) {
    console.error(`No built pages in ${dist}. Run \`npm run build\` first.`);
    process.exit(1);
  }
  await checkBudgets();
  const served = await serve(dist);
  origin = served.origin;
  const browser = await launchBrowser();
  try {
    // A group that cannot go on (for example a wait that times out) is recorded as a failure and
    // the next group still runs.
    for (const group of [
      checkTiers,
      checkReducedMotionEverywhere,
      checkSettling,
      checkSiteWide,
      checkHeroAndStats,
      checkFlow,
      checkFlowStart,
      checkCopyRule,
      checkCards,
    ]) {
      try {
        await group(browser);
      } catch (error) {
        failures.push(`${group.name}: stopped: ${String(error).split('\n')[0]}`);
      }
    }
  } finally {
    await browser.close();
    served.server.close();
  }

  for (const warning of warnings) console.warn(`  warning: ${warning}`);
  if (failures.length > 0) {
    console.error(`\n${failures.length} motion problem(s):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  console.log(
    `Motion: ${checks} checks passed at 375 and 1,280 px, and the flow's start at 375 x 262 and 512 x 262 (tiers, settling, every element, the flow, copy rule 9, budgets, no layout shift, zero CSP violations).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
