/**
 * Site-wide motion, bundled by Astro into a file under /_astro/ (the Content Security Policy
 * allows script-src 'self' only, so nothing here may be inline). Loaded by BaseLayout.astro.
 * Motion system v2 (2026-10-28): docs/design-direction.md, "Motion system v2".
 *
 * CSS decides who gets motion. `--motion-tier` on <html> (src/styles/global.css) is `off`
 * (reduced motion, slow-update screens, browsers without the `update` media feature, print),
 * `plain` (forced colours, more contrast: reveals, count-up, settles and draws, no light effects)
 * or `full`; it is read once, here. Lite (Save-Data or prefers-reduced-data): `.motion-lite` on
 * <html>; nothing optional starts by itself (no count-up, no automatic flow run, no card light)
 * and the light one-shots are cancelled in CSS. This script only adds classes that put things in
 * a start state, and only when motion is allowed, so without JavaScript nothing is ever hidden or
 * half-drawn, and every animation ends on the static frame.
 *
 * - Tab visibility: `.is-tab-hidden` on <html> follows document.hidden, and CSS pauses every
 *   animation while it is set, so a page opened in a background tab plays when first viewed.
 * - Scroll reveal: elements with `data-reveal` (or `data-reveal="stagger"` for a grid whose
 *   children enter 60 ms apart) fade in and rise as they enter the viewport. Content is never
 *   hidden without JavaScript, with reduced motion, in print, or when it is already on screen at
 *   load (including at the URL's #fragment): only elements still below the fold are given
 *   `.reveal-pending`, and each is revealed as soon as its top crosses 90% of the viewport
 *   height, however the page got there (scrolling, an anchor jump, the End key, restored scroll
 *   position), when it receives focus, or once the page reaches its bottom. A revealed element
 *   keeps `data-revealed`, which one-shots keyed to a reveal (the icon draw) use.
 * - One-shots (`data-oneshot`: the Home hero, standard page headers): CSS-only sequences that
 *   jump to their end if they leave the viewport mid-sequence or on a back-forward-cache restore.
 * - Count-up: `data-countup` figures count from zero to their value once, over 1 s, when first
 *   seen. The final text is in the HTML (and in a screen-reader copy beside it), and the
 *   animation always ends on that exact string. On the Home band the figure's `[data-stat]` item
 *   gets `data-count="armed"` (its accent bar at scale 0) and then `"run"` (the bar grows on the
 *   same curve, from the same frame).
 * - Flow (`[data-flow]`, Home "How it works"; `full` tier only): played once when its steps are in
 *   view (all of them when they fit in 90% of the viewport, otherwise enough of them to cover 85%
 *   of it); it stops by itself after 4.25 s and offers Replay. Paused while off-screen. Carried
 *   past without playing (a fling, a jump), its lines are drawn, so they are never left undrawn.
 * - Card light (`[data-spotlight]` grids, fine pointers, `full` tier, not lite): writes the
 *   pointer position to `--mx` / `--my` on the hovered link card through CSSOM, at most once a
 *   frame.
 * - Header: `.is-scrolled` on the site header once the page has scrolled, for its line of light
 *   and shadow (every tier).
 * - Reduced motion switched on mid-visit: CSS animations cancel back to the static state by
 *   themselves; a running count-up ends on its final string and the flow shows its drawn, static
 *   diagram without its button. Switching back takes effect on the next load.
 *
 * Startup reads everything it needs (the tier, the fold, the tops of the revealed elements and of
 * the flow, the one-shots' animations, the scroll position) before it writes anything, so style
 * and layout are computed once rather than once per element (motion spec section 8: no forced
 * reflow).
 */

const root = document.documentElement;
const tier = getComputedStyle(root).getPropertyValue('--motion-tier').trim() || 'off';
const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
const lite =
  connection?.saveData === true || window.matchMedia('(prefers-reduced-data: reduce)').matches;

/** Set once reduced motion is switched on mid-visit: everything settles and nothing restarts. */
let stopped = false;
/** Running count-ups and the exact string each one ends on. */
const counting = new Map<HTMLElement, string>();
/** Time the tab has spent hidden, so a count-up resumes in step with its (paused) CSS bar. */
let hiddenTotal = 0;
let hiddenAt = 0;
/** Ends the flow at once: `stop` for reduced motion, otherwise a back-forward-cache restore. */
let settleFlow: ((stop: boolean) => void) | undefined;

function syncTabVisibility(): void {
  root.classList.toggle('is-tab-hidden', document.hidden);
  if (document.hidden) {
    hiddenAt = performance.now();
  } else if (hiddenAt) {
    hiddenTotal += performance.now() - hiddenAt;
    hiddenAt = 0;
  }
}

/** Jump every animation in `element`, pseudo-elements included, to its end state. */
function settle(element: Element): void {
  for (const animation of element.getAnimations({ subtree: true })) {
    try {
      animation.finish();
    } catch {
      // An animation that cannot finish (none on this site loops) is left as it is.
    }
  }
}

/** Calls `fn` at most once a frame, from the next animation frame. */
function perFrame(fn: () => void): () => void {
  let queued = false;
  return () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      fn();
    });
  };
}

/** Its first state is read with the startup reads (`scrolled`) and written with the writes. */
function setUpHeader(scrolled: boolean): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;
  header.classList.toggle('is-scrolled', scrolled);
  window.addEventListener(
    'scroll',
    perFrame(() => header.classList.toggle('is-scrolled', window.scrollY > 8)),
    { passive: true },
  );
}

/**
 * The line an element's top must cross to be revealed: 90% of the way down the viewport, or the
 * very bottom once the page cannot scroll any further (so the last elements on a page always
 * appear).
 */
function revealLine(): number {
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  return window.innerHeight * (atBottom ? 1 : 0.9);
}

/** The element the URL's #fragment names, if any. */
function fragmentTarget(): HTMLElement | null {
  try {
    const id = decodeURIComponent(window.location.hash.slice(1));
    return id ? document.getElementById(id) : null;
  } catch {
    return null; // a malformed fragment matches no element
  }
}

/**
 * Where the top of the viewport will be once the browser has scrolled to the URL's #fragment,
 * relative to the top of the viewport now (0 without a fragment). Module scripts run before that
 * scroll, so without this the content at an anchor would be hidden at load and fade in late.
 */
function pendingFragmentOffset(): number {
  const target = fragmentTarget();
  if (!target) return 0;
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const destination = Math.min(
    target.getBoundingClientRect().top + window.scrollY - margin,
    maxScroll,
  );
  return Math.max(0, destination - window.scrollY);
}

/**
 * An element whose top is below this line (viewport coordinates) is below the fold at load: 92%
 * of the way down the viewport at the URL's #fragment, and never above the reveal line, so
 * nothing on screen at load is hidden only to be revealed on the next frame.
 */
function foldLine(): number {
  return Math.max(pendingFragmentOffset() + window.innerHeight * 0.92, revealLine());
}

/** `pending`: the `data-reveal` elements below the fold at load (read at startup). */
function setUpReveal(pending: Set<HTMLElement>): void {
  if (pending.size === 0) return;
  const reveal = (element: HTMLElement) => {
    if (!pending.delete(element)) return;
    element.setAttribute('data-revealed', '');
    element.classList.add('is-revealed');
    // Hand transitions back to the element (for example a card's hover lift) once done: the
    // reveal takes 400 ms plus at most 240 ms of stagger (src/styles/global.css).
    window.setTimeout(() => {
      element.classList.remove('reveal-pending', 'is-revealed');
    }, 700);
  };

  /*
   * Checked on scroll (at most once per frame), resize, load and pageshow rather than with an
   * IntersectionObserver: an observer reports only elements that intersect the viewport, so an
   * element carried straight past it (an anchor link, the End key, a scrollbar drag) stayed
   * hidden above the viewport, a blank gap on the way back up. Anything whose top is above the
   * reveal line, on screen or already scrolled past, is revealed. Every top is read before any
   * element is revealed.
   */
  const check = () => {
    const line = revealLine();
    const due = [...pending].filter((element) => element.getBoundingClientRect().top < line);
    due.forEach(reveal);
    if (pending.size === 0) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
      document.removeEventListener('focusin', onFocus);
    }
  };
  const schedule = perFrame(check);
  // Keyboard focus moving into a hidden element (for example a link in a card still below the
  // reveal line) shows it at once, so the focus ring is never on invisible content.
  const onFocus = (event: FocusEvent) => {
    const element = (event.target as Element | null)?.closest<HTMLElement>('.reveal-pending');
    if (element) reveal(element);
  };

  for (const element of pending) element.classList.add('reveal-pending');
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule, { once: true });
  window.addEventListener('pageshow', schedule);
  document.addEventListener('focusin', onFocus);
}

/**
 * One-shots finish (jump to their end state) when they leave the viewport mid-sequence, so a
 * visitor scrolling back up never finds one half-run; each element is let go once its
 * animations (read at startup) are done.
 */
function setUpOneShots(oneShots: Array<[Element, Animation[]]>): void {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) continue;
      settle(entry.target);
      observer.unobserve(entry.target);
    }
  });
  for (const [element, animations] of oneShots) {
    observer.observe(element);
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() =>
      observer.unobserve(element),
    );
  }
}

/** "$1.93M" -> { prefix: "$", value: 1.93, decimals: 2, suffix: "M" }. */
function parseFigure(text: string) {
  const match = text.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/s);
  if (!match) return null;
  const [, prefix, number, suffix] = match;
  const decimals = number.includes('.') ? number.split('.')[1].length : 0;
  return { prefix, value: Number(number), decimals, suffix };
}

/**
 * Count up over 1,000 ms on 1 - (1 - p)^3, the curve of the bar's --ease-count, timed from the
 * first frame (the frame the bar's CSS animation starts on) and paused while the tab is hidden.
 */
function countUp(element: HTMLElement): void {
  const finalText = element.textContent ?? '';
  const figure = parseFigure(finalText);
  if (!figure) return;
  counting.set(element, finalText);
  const show = (eased: number) => {
    element.textContent = `${figure.prefix}${(figure.value * eased).toFixed(figure.decimals)}${figure.suffix}`;
  };
  let start = 0;
  let hiddenBefore = 0;
  const frame = (now: number) => {
    if (!counting.has(element)) return; // ended early (reduced motion switched on)
    if (!start) {
      start = now;
      hiddenBefore = hiddenTotal;
    }
    const progress = Math.min(1, (now - start - (hiddenTotal - hiddenBefore)) / 1000);
    if (progress < 1) {
      show(1 - (1 - progress) ** 3);
      window.requestAnimationFrame(frame);
    } else {
      element.textContent = finalText;
      counting.delete(element);
    }
  };
  show(0);
  window.requestAnimationFrame(frame);
}

function setUpCountUp(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        entry.target.closest('[data-stat]')?.setAttribute('data-count', 'run');
        countUp(entry.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );
  for (const figure of document.querySelectorAll<HTMLElement>('[data-countup]')) {
    figure.closest('[data-stat]')?.setAttribute('data-count', 'armed');
    observer.observe(figure);
  }
}

/**
 * The run may start once the steps are in view: all of them (to within 2 px) when they fit in
 * 90% of the viewport, so on a phone the last step plays on screen; otherwise once they cover 85%
 * of the viewport's height (tall layouts, zoomed text).
 */
function flowInView(rect: DOMRectReadOnly): boolean {
  const height = window.innerHeight;
  const visible = Math.min(rect.bottom, height) - Math.max(rect.top, 0);
  return visible >= (rect.height <= height * 0.9 ? rect.height - 2 : height * 0.85);
}

/**
 * The Home flow (src/components/SystemFlow.astro, "Flow" in global.css). States on the figure:
 * `.is-armed` (lines at scale 0, waiting: the figure was below the fold at load), `.is-running`
 * (the 4.25 s run), `.is-drawn` (lines drawn, never drawn again: set after the first run, when the
 * figure is on screen at load, on Play, and when the steps are carried above the viewport before
 * the run has started), `.is-paused` (off-screen). The run ends when every one of its animations
 * has finished (paused time does not count); no timer is involved.
 */
function setUpFlow(figure: HTMLElement, armed: boolean): void {
  const steps = figure.querySelector('ol');
  const button = figure.querySelector<HTMLButtonElement>('[data-flow-replay]');
  const label = button?.querySelector('[data-label]');
  if (!steps || !button || !label) return;
  const state = figure.classList;

  const end = () => {
    state.remove('is-running');
    state.add('is-drawn');
    button.classList.remove('is-play');
    button.classList.add('is-shown');
    label.textContent = 'Replay';
  };
  const run = () => {
    if (stopped || state.contains('is-running')) return;
    state.add('is-running');
    const animations = figure
      .getAnimations({ subtree: true })
      .filter((a) => a instanceof CSSAnimation && a.animationName.startsWith('flow-'));
    // Rejects only if a run animation is cancelled (reduced motion, a layout change across
    // 1,024 px): the flow then rests, drawn, unless reduced motion has already put it there.
    Promise.all(animations.map((a) => a.finished)).then(end, () => {
      if (!stopped) end();
    });
  };
  settleFlow = (stop) => {
    if (stop) {
      state.remove('is-armed', 'is-running', 'is-paused');
      state.add('is-drawn');
      button.classList.remove('is-shown');
    } else if (state.contains('is-running')) {
      state.remove('is-paused');
      settle(figure);
    }
  };
  // Replay and Play add nothing but the run (lines already drawn); the button stays shown and
  // enabled throughout, so focus is never lost.
  button.addEventListener('click', () => {
    state.add('is-drawn');
    run();
  });

  if (lite) {
    button.classList.add('is-shown', 'is-play');
    label.textContent = 'Play';
  } else {
    state.add(armed ? 'is-armed' : 'is-drawn');
  }

  /*
   * The observer pauses the run off-screen and is the trigger. An observer reports only
   * threshold crossings, so while the steps are on screen and the run has not started, every
   * scroll and resize frame also tests them (one read a frame): no scroll speed, zoom level or
   * layout can leave the start test unmet while the steps sit in view.
   */
  let started = lite;
  let first = true;
  const start = (rect: DOMRectReadOnly) => {
    if (started || !flowInView(rect)) return;
    started = true;
    listen(false);
    window.setTimeout(run, first ? 400 : 0);
  };
  const check = perFrame(() => start(steps.getBoundingClientRect()));
  const listen = (on: boolean) => {
    for (const type of ['scroll', 'resize']) {
      if (on) window.addEventListener(type, check, { passive: true });
      else window.removeEventListener(type, check);
    }
  };
  new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        state.toggle('is-paused', !entry.isIntersecting);
        if (started) continue;
        listen(entry.isIntersecting);
        if (entry.isIntersecting) start(entry.boundingClientRect);
        // Carried above the viewport before the run could start: draw the lines.
        else if (entry.boundingClientRect.bottom <= 0) state.add('is-drawn');
      }
      first = false;
    },
    { threshold: [0, 0.2, 0.4, 0.6, 0.8, 0.95, 1] },
  ).observe(steps);
}

function setUpSpotlight(): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  for (const grid of document.querySelectorAll<HTMLElement>('[data-spotlight]')) {
    let card: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    const paint = perFrame(() => {
      if (!card || stopped) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${Math.round(x - rect.left)}px`);
      card.style.setProperty('--my', `${Math.round(y - rect.top)}px`);
    });
    grid.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType !== 'mouse') return;
        card = (event.target as Element).closest<HTMLElement>('.card-lift');
        x = event.clientX;
        y = event.clientY;
        paint();
      },
      { passive: true },
    );
  }
}

// Reads first (the tier, above, was the first): one style and layout pass at startup.
const motion = tier !== 'off';
const fold = motion ? foldLine() : 0;
const belowFold = (element: Element) => element.getBoundingClientRect().top >= fold;
const pendingReveal = new Set(
  motion ? [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter(belowFold) : [],
);
const flowFigure = tier === 'full' ? document.querySelector<HTMLElement>('[data-flow]') : null;
const flowArmed = flowFigure !== null && belowFold(flowFigure);
const oneShots: Array<[Element, Animation[]]> = motion
  ? [...document.querySelectorAll('[data-oneshot]')].map((element) => [
      element,
      element.getAnimations({ subtree: true }),
    ])
  : [];
const scrolled = window.scrollY > 8;

// Then writes.
if (lite) root.classList.add('motion-lite');
syncTabVisibility();
document.addEventListener('visibilitychange', syncTabVisibility);
setUpHeader(scrolled);
if (motion) {
  setUpReveal(pendingReveal);
  setUpOneShots(oneShots);
  if (!lite) setUpCountUp();
  if (flowFigure) setUpFlow(flowFigure, flowArmed);
  if (tier === 'full' && !lite) setUpSpotlight();
}

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
  if (!event.matches) return;
  stopped = true;
  for (const [element, text] of counting) element.textContent = text;
  counting.clear();
  settleFlow?.(true);
});

// Back-forward-cache restore: never show a half-run sequence.
window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  document.querySelectorAll('[data-oneshot]').forEach(settle);
  settleFlow?.(false);
});
