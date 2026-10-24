/**
 * Site-wide motion, bundled by Astro into a file under /_astro/ (the Content Security Policy
 * allows script-src 'self' only, so nothing here may be inline). Loaded by BaseLayout.astro.
 *
 * - Scroll reveal: elements with `data-reveal` (or `data-reveal="stagger"` for a grid whose
 *   children enter one after another) fade in and rise as they enter the viewport. Content is
 *   never hidden without JavaScript, with reduced motion, or when it is already on screen at
 *   load: only elements still below the fold are given `.reveal-pending` (src/styles/global.css).
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

function setUpReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (elements.length === 0 || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        element.classList.add('is-revealed');
        // Hand transitions back to the element (for example a card's hover lift) once done: the
        // reveal takes 400 ms plus at most 200 ms of stagger (src/styles/global.css).
        window.setTimeout(() => {
          element.classList.remove('reveal-pending', 'is-revealed');
        }, 700);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  );

  const fold = window.innerHeight * 0.92;
  for (const element of elements) {
    // Already on screen at load: leave it visible rather than hiding it and fading it back in.
    if (element.getBoundingClientRect().top < fold) continue;
    element.classList.add('reveal-pending');
    observer.observe(element);
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
