// Home hero text contrast over the owner's image, at rest and mid-animation (README "Verify";
// src/styles/global.css, the comment above .hero-media). The hero text sits on a photographic
// image behind a scrim, which axe cannot measure, so this samples the rendered pixels.
//
// Serves dist/ and, at 19 widths from 375 to 1,920 px (the widths of the 2026-10-26 check,
// including 960, 1,000, 1,024 and 1,060 px, where the subhead sits closest to the shield), loads
// Home in a locally installed Chromium-based browser through playwright-core (scripts/lib/site.mjs,
// as a11y.mjs and check-csp.mjs do). For each frame it pauses every hero animation at a set time
// (scripts/lib/freeze.mjs semantics: pause, then currentTime = t), makes the hero's text
// transparent through CSSOM (style.setProperty, which the Content Security Policy allows),
// screenshots the page, decodes it with sharp and, for every line box of every text element (the
// eyebrow, the h1, the subhead, both buttons' labels and the proof points; line boxes from
// Range.getClientRects()), compares the text's colour with every pixel behind it. Frames: rest,
// t = 0, t = 600 ms, t = 1,400 ms (mid-pulse) and, when the optional edge-light is rendered
// (ImageSlot `glint`), t = 2,000 ms (mid-edge-light). Fails under 4.5:1, warns under 4.6:1, and
// prints the worst line per frame and overall. Exit code 1 on failure.
//
// Usage: node scripts/hero-contrast.mjs [dist-dir]

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { launchBrowser, serve } from './lib/site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.resolve(root, process.argv[2] ?? 'dist');

const widths = [
  375, 390, 414, 480, 600, 640, 720, 768, 820, 900, 960, 1000, 1024, 1060, 1152, 1280, 1366, 1440,
  1920,
];
const heroSelector = 'section[aria-labelledby="hero-heading"]';
const failBelow = 4.5;
const warnBelow = 4.6;

/**
 * WCAG 2.x relative luminance of an sRGB colour with 0-255 channels.
 * @param {number} r @param {number} g @param {number} b
 */
function luminance(r, g, b) {
  /** @param {number} c */
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** @param {number} a @param {number} b */
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/**
 * "rgb(230, 234, 242)" -> [230, 234, 242].
 * @param {string} value
 */
function parseRgb(value) {
  const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (!match) throw new Error(`Unexpected text colour ${value}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/**
 * Pause every animation inside the hero at `time` ms from its start ('rest': long past its end).
 * @param {import('playwright-core').Page} page
 * @param {number | 'rest'} time
 */
async function freezeHero(page, time) {
  await page.evaluate(([selector, t]) => {
    const hero = document.querySelector(selector);
    for (const animation of document.getAnimations()) {
      const target = /** @type {KeyframeEffect | null} */ (animation.effect)?.target;
      if (!hero || !target || !hero.contains(target)) continue;
      animation.pause();
      animation.currentTime = t === 'rest' ? 1e6 : t;
    }
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, /** @type {[string, number | 'rest']} */ ([heroSelector, time]));
}

async function main() {
  const { server, origin } = await serve(dist);
  const browser = await launchBrowser();
  /** @type {Array<{ width: number, frame: string, label: string, contrast: number }>} */
  const worstPerFrame = [];
  const failures = [];
  const warnings = [];
  let glint = false;

  try {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: 1400 },
        deviceScaleFactor: 1,
        reducedMotion: 'no-preference',
      });
      const page = await context.newPage();
      await page.goto(`${origin}/`, { waitUntil: 'load' });
      await page.evaluate(async (selector) => {
        await document.fonts.ready;
        const image = document.querySelector(`${selector} img`);
        if (image instanceof HTMLImageElement) await image.decode().catch(() => {});
      }, heroSelector);
      // Hold the sequence at its start while the text is measured and hidden.
      await freezeHero(page, 0);
      const hasGlint = (await page.locator('.hero-glint').count()) > 0;
      glint = glint || hasGlint;

      // Record each text element's colour and line boxes, then hide its text (CSSOM only).
      const elements = await page.evaluate((selector) => {
        const hero = document.querySelector(selector);
        if (!hero) throw new Error('No hero on the Home page');
        /** @type {Array<[string, Element | null]>} */
        const targets = [
          ['eyebrow', hero.querySelector('.eyebrow')],
          ['h1', hero.querySelector('h1')],
          ['subhead', hero.querySelector('h1 + p')],
          ...[...hero.querySelectorAll('a.btn')].map(
            (el, i) => /** @type {[string, Element]} */ ([`button ${i + 1}`, el]),
          ),
          ...[...hero.querySelectorAll('ul li span')].map(
            (el, i) => /** @type {[string, Element]} */ ([`proof point ${i + 1}`, el]),
          ),
        ];
        const out = [];
        for (const [label, element] of targets) {
          if (!(element instanceof HTMLElement)) continue;
          const color = getComputedStyle(element).color;
          const range = document.createRange();
          range.selectNodeContents(element);
          const rects = [...range.getClientRects()]
            .filter((r) => r.width > 1 && r.height > 1)
            .map((r) => ({ x: r.left, y: r.top, w: r.width, h: r.height }));
          out.push({ label, color, rects });
        }
        for (const [, element] of targets) {
          if (element instanceof HTMLElement) {
            element.style.setProperty('color', 'transparent', 'important');
          }
        }
        return out;
      }, heroSelector);
      if (elements.length < 7) {
        failures.push(
          `${width}px: expected at least 7 hero text elements, found ${elements.length}`,
        );
      }

      /** @type {Array<number | 'rest'>} */
      const frames = ['rest', 0, 600, 1400];
      if (hasGlint) frames.push(2000);
      for (const frame of frames) {
        await freezeHero(page, frame);
        const png = await page.screenshot({ animations: 'allow', caret: 'hide' });
        const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
        let worst = { label: '', contrast: Infinity };
        for (const element of elements) {
          const [tr, tg, tb] = parseRgb(element.color);
          const textLuminance = luminance(tr, tg, tb);
          element.rects.forEach((rect, line) => {
            const x0 = Math.max(0, Math.floor(rect.x));
            const y0 = Math.max(0, Math.floor(rect.y));
            const x1 = Math.min(info.width, Math.ceil(rect.x + rect.w));
            const y1 = Math.min(info.height, Math.ceil(rect.y + rect.h));
            let lowest = Infinity;
            for (let y = y0; y < y1; y += 1) {
              for (let x = x0; x < x1; x += 1) {
                const i = (y * info.width + x) * info.channels;
                const c = ratio(textLuminance, luminance(data[i], data[i + 1], data[i + 2]));
                if (c < lowest) lowest = c;
              }
            }
            if (lowest < worst.contrast) {
              worst = { label: `${element.label}, line ${line + 1}`, contrast: lowest };
            }
          });
        }
        const frameName = frame === 'rest' ? 'rest' : `t=${frame}ms`;
        worstPerFrame.push({ width, frame: frameName, ...worst });
        const message = `${width}px ${frameName}: ${worst.label} at ${worst.contrast.toFixed(2)}:1`;
        if (worst.contrast < failBelow) failures.push(message);
        else if (worst.contrast < warnBelow) warnings.push(message);
      }
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  const byFrame = new Map();
  for (const result of worstPerFrame) {
    const current = byFrame.get(result.frame);
    if (!current || result.contrast < current.contrast) byFrame.set(result.frame, result);
  }
  console.log(`Hero contrast at ${widths.length} widths${glint ? ' (edge-light on)' : ''}:`);
  for (const [frame, result] of byFrame) {
    console.log(
      `  ${frame.padEnd(9)} worst ${result.contrast.toFixed(2)}:1 (${result.label}, ${result.width}px)`,
    );
  }
  for (const warning of warnings) console.warn(`  warning (under ${warnBelow}:1): ${warning}`);
  if (failures.length > 0) {
    console.error(`\n${failures.length} hero text line(s) under ${failBelow}:1:`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  const overall = worstPerFrame.reduce((a, b) => (b.contrast < a.contrast ? b : a));
  console.log(
    `Every hero text line is at least ${failBelow}:1 in every frame; worst ${overall.contrast.toFixed(2)}:1 (${overall.label}, ${overall.width}px, ${overall.frame}).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
