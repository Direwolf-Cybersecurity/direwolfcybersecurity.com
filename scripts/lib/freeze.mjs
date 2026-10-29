// Test-side animation helpers for scripts/check-motion.mjs and scripts/hero-contrast.mjs. They run
// in the page through Playwright, so production carries no test hook.
//
// freezeAt(page, selector, ms) pauses every animation in a subtree (pseudo-elements included) at
// one time from its start, so a check sees one exact frame: for example the brightest frame of the
// Home flow (3,250 ms: every node lit, the frame light at its peak) or a mid-pulse hero frame.

/**
 * Pause every animation under `selector` (or every animation in the document for `:root`) and
 * move it to `ms` from its start, delays included. Returns how many animations were frozen.
 * @param {import('playwright-core').Page} page
 * @param {string} selector
 * @param {number} ms
 * @returns {Promise<number>}
 */
export async function freezeAt(page, selector, ms) {
  return page.evaluate(([sel, time]) => {
    /** @type {Animation[]} */
    let animations;
    if (sel === ':root') {
      animations = document.getAnimations();
    } else {
      const root = document.querySelector(sel);
      if (!root) throw new Error(`freezeAt: nothing matches ${sel}`);
      animations = root.getAnimations({ subtree: true });
    }
    for (const animation of animations) {
      animation.pause();
      animation.currentTime = time;
    }
    return animations.length;
  }, /** @type {[string, number]} */ ([selector, ms]));
}

/**
 * Every animation under `selector`, as { name, state, time } (name is the CSS animation name, or
 * the transitioned property for a transition).
 * @param {import('playwright-core').Page} page
 * @param {string} selector
 * @returns {Promise<Array<{ name: string, state: string, time: number }>>}
 */
export async function animationsIn(page, selector) {
  return page.evaluate((sel) => {
    const root = sel === ':root' ? null : document.querySelector(sel);
    if (sel !== ':root' && !root) return [];
    const animations = root ? root.getAnimations({ subtree: true }) : document.getAnimations();
    return animations.map((animation) => {
      const a = /** @type {Animation & { animationName?: string, transitionProperty?: string }} */ (
        animation
      );
      return {
        name: a.animationName ?? a.transitionProperty ?? 'animation',
        state: a.playState,
        time: Number(a.currentTime ?? 0),
      };
    });
  }, selector);
}
