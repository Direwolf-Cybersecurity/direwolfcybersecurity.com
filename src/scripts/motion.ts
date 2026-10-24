/**
 * Site-wide motion, bundled by Astro into a file under /_astro/ (the Content Security Policy
 * allows script-src 'self' only, so nothing here may be inline). Loaded by BaseLayout.astro.
 *
 * - Scroll reveal: elements with `data-reveal` (or `data-reveal="stagger"` for a grid whose
 *   children enter one after another) fade in and rise as they enter the viewport. Content is
 *   never hidden without JavaScript, with reduced motion, in print, or when it is already on
 *   screen at load (including at the URL's #fragment): only elements still below the fold are
 *   given `.reveal-pending` (src/styles/global.css), and each is revealed as soon as its top
 *   crosses 90% of the viewport height, however the page got there (scrolling, an anchor jump,
 *   the End key, restored scroll position), when it receives focus, or once the page reaches its
 *   bottom.
 * - Count-up: `data-countup` figures count from zero to their value once, when first seen. The
 *   final text is in the HTML (and in a screen-reader copy beside it), and the animation always
 *   ends on that exact string.
 * - Header: `.is-scrolled` on the site header once the page has scrolled, for its hairline and
 *   shadow.
 *
 * Every effect is skipped when the visitor prefers reduced motion.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setUpHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;
  let queued = false;
  const update = () => {
    queued = false;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(update);
      }
    },
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

function setUpReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (elements.length === 0) return;

  const pending = new Set<HTMLElement>();
  const reveal = (element: HTMLElement) => {
    if (!pending.delete(element)) return;
    element.classList.add('is-revealed');
    // Hand transitions back to the element (for example a card's hover lift) once done: the
    // reveal takes 400 ms plus at most 200 ms of stagger (src/styles/global.css).
    window.setTimeout(() => {
      element.classList.remove('reveal-pending', 'is-revealed');
    }, 700);
  };

  /*
   * Checked on scroll (at most once per frame), resize, load and pageshow rather than with an
   * IntersectionObserver: an observer reports only elements that intersect the viewport, so an
   * element carried straight past it (an anchor link, the End key, a scrollbar drag) stayed
   * hidden above the viewport, a blank gap on the way back up. Anything whose top is above the
   * reveal line, on screen or already scrolled past, is revealed.
   */
  let queued = false;
  const check = () => {
    queued = false;
    const line = revealLine();
    for (const element of pending) {
      if (element.getBoundingClientRect().top < line) reveal(element);
    }
    if (pending.size === 0) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
      document.removeEventListener('focusin', onFocus);
    }
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      window.requestAnimationFrame(check);
    }
  };
  // Keyboard focus moving into a hidden element (for example a link in a card still below the
  // reveal line) shows it at once, so the focus ring is never on invisible content.
  const onFocus = (event: FocusEvent) => {
    const element = (event.target as Element | null)?.closest<HTMLElement>('.reveal-pending');
    if (element) reveal(element);
  };

  // Already on screen at load, or at the URL's #fragment, or above it: leave it visible rather
  // than hiding it and fading it back in.
  const fold = pendingFragmentOffset() + window.innerHeight * 0.92;
  for (const element of elements) {
    if (element.getBoundingClientRect().top < fold) continue;
    element.classList.add('reveal-pending');
    pending.add(element);
  }
  if (pending.size === 0) return;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule, { once: true });
  window.addEventListener('pageshow', schedule);
  document.addEventListener('focusin', onFocus);
  schedule();
}

/** "$1.93M" -> { prefix: "$", value: 1.93, decimals: 2, suffix: "M" }. */
function parseFigure(text: string) {
  const match = text.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/s);
  if (!match) return null;
  const [, prefix, number, suffix] = match;
  const decimals = number.includes('.') ? number.split('.')[1].length : 0;
  return { prefix, value: Number(number), decimals, suffix };
}

function countUp(element: HTMLElement): void {
  const finalText = element.textContent ?? '';
  const figure = parseFigure(finalText);
  if (!figure) return;
  const duration = 1400;
  const start = performance.now();
  const frame = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    if (progress < 1) {
      element.textContent = `${figure.prefix}${(figure.value * eased).toFixed(figure.decimals)}${figure.suffix}`;
      window.requestAnimationFrame(frame);
    } else {
      element.textContent = finalText;
    }
  };
  element.textContent = `${figure.prefix}${(0).toFixed(figure.decimals)}${figure.suffix}`;
  window.requestAnimationFrame(frame);
}

function setUpCountUp(): void {
  const figures = document.querySelectorAll<HTMLElement>('[data-countup]');
  if (figures.length === 0 || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        countUp(entry.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );
  for (const figure of figures) observer.observe(figure);
}

setUpHeader();
if (!reducedMotion) {
  setUpReveal();
  setUpCountUp();
}
