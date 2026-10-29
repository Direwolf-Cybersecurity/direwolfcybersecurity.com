# Design direction: homepage layout and motion

How three well-known managed detection and response (MDR) and security operations providers
structure their homepages, and what Direwolf should take from that. Structure only: no text,
imagery or layout is copied, and nothing here is a claim (claims follow
`docs/claims-register.md`). Observed 2026-10-24 on arcticwolf.com, huntress.com (page text
only; the site blocked the browser) and esentire.com.

## What the three homepages do

|                 | Arctic Wolf                                                                                                                                                                                                                                                                                                                              | Huntress                                                                                                                                                                                                                                                                                   | eSentire                                                                                                                                                                                                                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Section order   | Utility bar, mega-menu header, dark hero (two-line headline, two buttons), problem statement with 3 cited statistics, numbered three-point value row, customer logo strip, platform block with product graphic, three challenge cards, trust principles, ecosystem numbers, analyst badges and one quote, closing call to action, footer | Announcement bar, header, hero (headline, two buttons, rating row, image), three alternating text-and-number blocks, logo grid, platform intro, six product cards, six threat cards, threat map and case studies, testimonial carousel, guides, closing call to action, newsletter, footer | Announcement bar, header, dark hero (headline, one button, abstract graphic), logo strip, three cards (prevent, detect, respond), integrations carousel, SOC feature block, threat statistics band, platform metrics, testimonial carousel, recognition band, resource cards, closing call to action, footer |
| Statistics      | Three large figures straight after the hero, each cited to a named third-party report; separate band of company numbers                                                                                                                                                                                                                  | About fifteen figures spread through the page, mostly without a source                                                                                                                                                                                                                     | One headline threat figure plus three supporting figures, sourced to the company's own threat report; separate platform metrics                                                                                                                                                                              |
| Imagery         | Dark full-bleed hero image with a beam of light and a blue gradient headline; product screenshots; consistent line icons; no illustrations                                                                                                                                                                                               | Decorative graphics, product thumbnails, a world map, headshots only beside testimonials                                                                                                                                                                                                   | Abstract network-node graphic on navy; line icons on dark cards; headshots only beside testimonials                                                                                                                                                                                                          |
| Calls to action | One primary label repeated about a dozen times (header, sticky bottom bar, mid-page, closing band); "Learn more" on cards                                                                                                                                                                                                                | Two primary labels (free trial, demo) in header, hero and closing band                                                                                                                                                                                                                     | One primary label in header, hero and closing band; a quote builder in the hero                                                                                                                                                                                                                              |
| Motion          | Sticky header that turns solid on scroll, sections fade up as they enter, soft gradient glows                                                                                                                                                                                                                                            | Not observable (blocked)                                                                                                                                                                                                                                                                   | Scrolling logo carousels, chat widget, alternating dark and light bands                                                                                                                                                                                                                                      |
| Incident link   | "Experienced a breach?" in the utility bar and the sticky bar                                                                                                                                                                                                                                                                            | None                                                                                                                                                                                                                                                                                       | Breach hotline in the menu drawer and a footer strip                                                                                                                                                                                                                                                         |

Patterns all three share: a dark, short hero; proof immediately after it; a three-up card row
for the core idea; alternating dark and light bands; one primary call to action repeated top,
middle and bottom; and no wall of text anywhere above the fold.

## Recommendations for Direwolf

1. **Home section order.** Near-black header band (logo lockup, nav, one button) running
   straight into a dark hero; statistics band; "How it works" in three steps; four service
   cards; who it is for; platform preview; credentials strip; closing call to action; footer.
   Nine blocks, each one screen or less on a laptop. Compliance becomes one card and one
   audience among several, never the hero.
2. **A hero that reads in five seconds.** Headline of eight words or fewer on two lines,
   one subhead of 25 words or fewer (for example the owner's "AI-driven detection and
   response, monitored by a team of security professionals" idea), two buttons at most, and
   the `hero.webp` slot on the right (below the text on phones). Keep the header and hero on
   the same near-black (#05070d) so the logo and hero read as one band, and keep the image's
   dark left side under the text with a gradient scrim for contrast.
3. **Statistics band directly under the hero, cited like Arctic Wolf, not uncited like
   Huntress.** Three or four figures from rows S-STAT-1 to S-STAT-6 (in use after the 2026-10-24
   review: S-STAT-3, S-STAT-2 and S-STAT-6 under the neutral heading "The threat, by the
   numbers"; a band's heading must claim no more than every figure under it, and a saving from
   security AI never sits beside Direwolf's own AI service). Each tile: the figure large in tabular numerals, a label of
   twelve words or fewer, and a small source line ("Verizon, 2026 Breach Impact Study") linking
   to the publisher or to a footnote list. No company metrics: rule 6 of the register forbids
   customer counts, ratings and response times.
4. **Count-up on first view, with the real number always in the HTML.** The final value is
   the server-rendered text, so screen readers, no-JavaScript visitors and search engines get
   it. A small bundled module (external file, CSP `script-src 'self'`) animates from zero over
   about one second when the tile first enters the viewport, only if
   `prefers-reduced-motion: no-preference`, and always ends on the exact source string
   (">7%", "$1.93M"). Never animate in a loop.
5. **"How it works" as three numbered steps, not paragraphs.** Detect, investigate, respond
   (01 to 03, Arctic Wolf's numbered-row structure), each with an icon, a three-word title and
   one sentence. Put it on a dark panel so the page alternates dark, light, dark. The
   `mdr.webp` slot can sit beside it.
6. **Four service cards in a 2x2 (desktop) or single column (phone) grid.** Managed detection
   and response, managed endpoint protection (EDR), penetration testing, compliance readiness.
   Each card: lucide icon, title, one sentence of 20 words or fewer, "Learn more" to its
   `/services/#…` anchor; the `pentest.webp` slot belongs on the penetration testing section
   of the Services page. Roadmap items go in a single muted row of tags labelled "Roadmap",
   never as cards.
7. **Proof without customer claims.** Competitors use logo strips, ratings and testimonials
   right after the hero; Direwolf may not (rule 6, rows E1-E6 gated). Use instead: the cited
   statistics band, a credentials strip led by the row F1 wording (SDVOSB, SBA certified) with at
   most one compliance short form where its row allows it, and concrete deliverables ("a
   written report" for penetration testing). Leave the Experience section off until gate G18
   closes.
8. **One primary call to action, repeated three times.** While `PLATFORM_LIVE` is `false` the
   only call to action is "Contact us" (row W6; owner direction 2026-10-27: no early access, the
   platform opens when it is complete), with "See services" as the hero's secondary link. Show
   it in the header, the hero and the closing band, plus once after the service cards. Do
   not add an "Experienced a breach?" hotline: it implies round-the-clock human incident
   response, which the owner has not authorized (no 24/7 staffing claim).
9. **A small, consistent motion system.** Durations 150 ms (hover), 250 ms (reveal), 400 ms
   (large panels); one easing curve (for example `cubic-bezier(0.2, 0.8, 0.2, 1)`). Sections
   fade in and rise 12 to 16 px once as they enter; cards in a row stagger by 60 ms using
   classes (`.reveal-1`, `.reveal-2`), not `style` attributes, which the CSP blocks. Prefer CSS
   scroll-driven animations (`animation-timeline: view()`) inside `@supports` and
   `prefers-reduced-motion: no-preference`, so content is never hidden when JavaScript or the
   feature is missing. Cards lift 2 px with an accent border on hover and focus.
10. **Header behaviour.** Sticky near-black band; on scroll it gains a hairline bottom border
    and a slightly shorter height (CSS scroll-driven animation on the document scroll timeline,
    or one class toggled by the existing header script). Logo lockup 56 px tall on desktop and
    44 px on phones (raised after the 2026-10-24 review: the lettering is about a fifth of the
    lockup's height, so anything smaller is unreadable), trimmed of its transparent margins so
    it aligns with the nav baseline.
11. **Image slots as a system, not decoration.** One `ImageSlot` component per slot in
    `docs/image-prompts.md` (hero 16:9, MDR 4:3, penetration testing 4:3, platform 16:10,
    About 3:2): fixed aspect ratio so nothing shifts while loading, `astro:assets` output as
    AVIF or WebP with width and height, required alt text, the hero loaded eagerly with high
    fetch priority and the rest lazily, and nothing rendered when the file is absent (the
    platform slot today). No hand-drawn SVG scenes and no stock photos of people; the
    owner-generated abstract graphics carry the look, and small lucide icons do the rest.
12. **Copy density limits that keep it from becoming walls of text.** Section intro 25 words
    or fewer; card body 20 words or fewer; no paragraph longer than three lines at desktop
    width on Home; details move to Services, Platform and Compliance. Every section has one
    heading, one optional sentence and a visual element (statistic, icon row, image or card
    grid).

## Guardrails

- No auto-rotating carousels (WCAG 2.2.2 needs pause controls) and no autoplay video; logo
  carousels are moot because no logos may be shown.
- Parallax, if any, stays under 20 px and switches off with reduced motion.
- Text on images keeps 4.5:1 contrast through a scrim, in both themes; the a11y check runs
  light and dark at phone width.
- Everything stays self-hosted: icons from an npm package (for example `lucide-static`, MIT)
  copied into the build, no icon fonts or CDNs.

## Motion system v2 (2026-10-28)

The owner asked (2026-10-28) for a site that feels more dynamic, "very high tech high quality",
and not cheesy. Three motion directions were judged; "the system at work" was chosen, with
grafts from the other two. This section summarises the build spec, which is kept outside this
repository in the owner's tools folder (`.direwolf-tools/website-motion/motion-spec.md`). Where
this section and recommendations 9 and 10 above differ, this section wins: durations are the
tiers below, the header never changes height (a shrinking sticky header shifts the page), and
scroll-driven animation is used only for the reading-progress hairline. Nothing here is a claim:
every word inside or beside an animation follows `docs/claims-register.md`.

### Rules

1. **Motion means a state change** (something arrives, is processed, is overseen, lands, or is
   under the pointer). Nothing moves only to decorate.
2. **The end state is the static state.** Every animation ends on the frame that visitors see
   without JavaScript, with reduced motion and in print. The base CSS is the static page; motion
   lives only inside the two media blocks below.
3. **Type never moves.** Headlines, subheads, body text, buttons, captions and labels are fully
   painted at first paint and never fade, rise, type or shimmer, and their colour never changes
   between states. Only rules, borders, light and icons move.
4. **Every motion has a partner:** a line draws exactly under its first pulse, a statistic's bar
   lands on the same curve and frame as its number, a node lights as its pulse arrives.
5. **One high-novelty moment per viewport.** Home has two (the hero at load, the flow), always
   separated by the statistics band. No other page has one.
6. **Automatic motion stops by itself within 4.25 s and nothing loops** (WCAG 2.2.2), so no pause
   control is needed. Anything longer is driven by the visitor.
7. **Compositor first:** new animations move `transform` or `opacity` only. No canvas, no WebGL,
   no library, no new request.
8. **Colour is rationed:** electric blue is light (pulses, lit edges, the frame light); structure
   uses `--line`, `--line-strong` and `--accent`. The optional hero edge-light is silver.

### Tokens and tiers

| Token          | Value                                     | Used for                                                                                                                |
| -------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `--ease-out`   | `cubic-bezier(0.2, 0.8, 0.2, 1)`          | Every transition, reveal, draw and flow pulse (the hero rail pulse and the page-header trace run linear: an even speed) |
| `--ease-count` | `cubic-bezier(0.3333, 1, 0.6667, 1)`      | The count-up and its bar (exactly `1 - (1 - p)^3`, the count-up's own easing)                                           |
| `--dur-hover`  | 150 ms                                    | Hover, press, nav bar, arrow nudge, field borders                                                                       |
| `--dur-state`  | 250 ms                                    | Lit and unlit states, the header's line of light, the dwell between flow hops                                           |
| `--dur-reveal` | 400 ms                                    | Section reveal (12 px rise), icon draw on reveal, one hop of a pulse                                                    |
| `--dur-count`  | 1,000 ms                                  | Count-up (was 1,400 ms)                                                                                                 |
| `--dur-settle` | 1,200 ms                                  | Image settle, dot-grid power-on, rail pulse, page-header trace, the frame light                                         |
| Stagger        | 60 ms per item (`--stagger`, 0 to 240 ms) | Items in a `data-reveal="stagger"` group (was 50 ms)                                                                    |

Who gets motion is decided once, in CSS: `--motion-tier` on `:root` is `off`, `plain` or
`full`, and `src/scripts/motion.ts` reads it, so CSS and script never disagree.

- **MOTION** block, `screen and (prefers-reduced-motion: no-preference) and (update: fast)`:
  reveals, settles, draws, the count-up bar, the nav bar, the button press, the progress
  hairline. Tier `plain` (forced colours, more contrast) gets only this block.
- **LIGHT** block, the MOTION query plus `(forced-colors: none)` and
  `(prefers-contrast: no-preference)`: the light effects (hero rail pulse, edge-light,
  page-header trace, the flow run, the card light). Tier `full`.
- **Lite** (`full` plus Save-Data or `prefers-reduced-data: reduce`): nothing optional starts by
  itself: no count-up, no automatic flow run (a "Play" button instead), no card light.
- Reduced motion and slow-update screens are tier `off`: the static site.
- A page opened in a background tab plays its one-shots when first viewed (`.is-tab-hidden` on
  `<html>` pauses every animation); a one-shot that leaves the viewport mid-sequence jumps to its
  end; a back-forward-cache restore never shows a half-run sequence.

### What moves

| Element                               | Page                                           | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Ends by                           |
| ------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Hero                                  | Home                                           | The text is static. The image settles from 1.035 to 1; the first two proof icons draw (0.3 to 1.25 s; the third, beside the ownership status, stays static under copy rule 9); a hairline rail draws above the proof points and one pulse crosses it at an even speed, its head stopping on the rail's end. Optional (owner preview): one silver edge-light pass across the shield, right of the text column                                                                                                                                                                                                                                                                                                                                                                                                    | 2.0 s (3.2 s with the edge-light) |
| Statistics                            | Home (the count only on Services)              | Each figure counts up once over 1 s to its exact source string; its rule becomes an accent bar that grows on the same curve. At rest the bar is drawn                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 1 s from view                     |
| The flow (the signature)              | Home, "How it works"                           | A static schematic: Detect joined into a "Direwolf AI SOC" frame holding Investigate and Respond, the oversight node "Overseen by our security professionals" and the caption "Illustrative. Not live data." Played once when its steps are in view (all of them when they fit in 90% of the viewport, so on a phone Respond plays on screen; otherwise once they cover 85% of it). The figure has no scroll reveal: the run is its entrance. Pulses lay down the lines, each step lights as its pulse arrives, the frame lights once, everything rests; then a quiet Replay button. Carried past without playing (a fling, a jump), its lines are drawn. From 1,024 px the gaps are wider (about 90 px at 1,280) and the pulses longer, so the travelling alert reads; from 640 to 1,023 px each step is a row | 4.25 s from its start             |
| Service cards                         | Home                                           | Today's 2 px lift, plus an edge light near the pointer (fine pointers) or at the top of the card (keyboard focus), and a 2 px arrow nudge                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Pointer-driven                    |
| Icon draw on reveal                   | Home, Services, Platform, About                | Listed icon tiles draw their strokes once as their item reveals, except beside status or compliance wording (copy rule 9, below): Services' Compliance readiness tile, Home's "Veteran-owned" and "When your contracts raise the bar" tiles and About's Ownership tile stay static                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 0.74 s                            |
| Page header (standard)                | Services, Platform, Compliance, About, Contact | Dot grid powers on, glow settles (2.4 s, was 5 s), eyebrow line, one pulse sweeps along the bottom edge at an even speed (about 1 px/ms at 1,280 px). Security and the Legal index use the calm (static) variant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 2.4 s                             |
| Header                                | All                                            | On scroll, a centre-weighted line of light at the bottom edge; nav links draw a 1 px bar on hover and focus, the current page shows a static 2 px bar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 250 ms                            |
| Reading-progress hairline             | Services, Platform, Compliance (md up)         | The bright part of the header's bottom line grows with the scroll                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Scroll-driven                     |
| Buttons                               | All                                            | Primary buttons get a 1 px top catch-light; hover lift as today; a press lands back flat                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 150 ms                            |
| Page-to-page cross-fade (if approved) | All                                            | The old page fades out (150 ms), the new page fades in with a 6 px rise (250 ms)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 250 ms                            |

Static by rule: every headline and sentence, the roadmap tags, the Compliance posture cards, the
Platform `ComplianceStrip` and security cards, the "What you get" checks, Experience, the call
to action panel, the contact form (field borders aside), legal documents and the 404 page.

### Words inside animations

- Every visible string inside or beside a moving element is in the claims register verbatim
  first (the flow's strings: new row D1, and an A2 / A8 amendment for the oversight node's
  second Home mention).
- No numbers except the step indices and the cited statistics; no times, counts, percentages,
  "live", "real time", "now", "online", "scanning", tickers, timestamps or blinking dots.
- Anything that shows a path, stream or example is captioned "Illustrative. Not live data."
- AI roles always carry "AI", list only built duties, and never get a person icon; "engineers"
  never appears in an animation; the only people icon is beside "our security professionals".
- No vendor, customer or compliance words (FedRAMP, FIPS, CMMC, certified, compliant) in or
  beside an animation, no animated checks or meters on status content, and no roadmap item in an
  animation. Platform wording is future tense while `PLATFORM_LIVE` is `false`.
- **Exception to the spec's M05 list** (2026-10-28 review): M05 asks for every Services tile,
  every Why Direwolf tile and every About Company tile to draw on reveal, which would draw a
  clipboard-check beside "NIST SP 800-171, CMMC and similar frameworks", badge-checks beside "SBA
  certified" and "SBA-certified", and a landmark beside "NIST SP 800-171, CMMC". The copy rule
  wins: those four icons, and the hero's badge-check beside "Service-disabled veteran-owned", are
  static (`draw={false}`). `npm run motion` fails if any drawing icon sits in an item whose text
  names FedRAMP, FIPS, CMMC, NIST, "certified", "compliant", "authorized", "validated", "ready",
  "aligned", SDVOSB or "veteran-owned".

### Budgets and checks

- JavaScript added: about 1.2 KB gzipped (budget 2.0 KB, hard cap 3.0 KB; all JavaScript on
  Home at most 3.5 KB). CSS at most 11.5 KB gzipped. No new request on any page. CLS 0.00. LCP
  within 100 ms of the 6d8c4b3 baseline. Nothing running 5 s after it starts, off-screen, in a
  hidden tab, or under reduced motion.
- `npm run motion` (new, in `verify`) checks the budgets, layout shift, self-stopping, pausing,
  reduced motion, forced colours, Save-Data, JavaScript off and the brightest frame of the flow.
  `npm run hero-contrast` (new, in `verify`) samples the pixels behind every hero text line at 19
  widths in the rest frame and in paused mid-animation frames, failing under 4.5:1.

### Owner decisions before publishing

1. Confirm the flow is interface, not illustration (no SVG; HTML steps joined by CSS rules), and
   add that sentence to `CLAUDE.md`.
2. Approve register row D1 and the A2 / A8 amendment (until then the oversight node is off).
3. Approve the Accessibility Statement re-issue: "No autoplaying motion" becomes "Animations
   play once, end within a few seconds and never loop, and all motion is off when your device's
   reduced-motion setting is on." (a new version and effective date; row W3).
4. Keep or drop the silver hero edge-light after a preview (off by default).
5. Move "How it works" up to directly after the statistics band (recommendation 1 above).
6. Page-to-page cross-fades: yes or no (off by default).

### Build record (2026-10-28)

Built on 6d8c4b3; not committed or published. Each owner decision above is one switch:

1. Gate 1: the sentence is in `CLAUDE.md` ("No illustrations"), marked for the owner to confirm.
2. Gate 2: claims register v2026.10.28 has row D1 and the proposed A2 / A8 placement;
   `oversight.shown` is `false` in `src/data/flow.ts` (set it to `true` to show the node; the
   run's timings do not change).
3. Gate 3: `src/content/legal/accessibility.mdx` is re-issued as `v2026.10.28` (effective
   2026-10-28) with the new sentence; row W3 carries it.
4. Gate 4: `heroEdgeLight` in `src/pages/index.astro` is `false` (it is ImageSlot's `glint`).
5. Gate 5: today's order; move the "How it works" `Section` to directly after `<StatsBand />` in
   `src/pages/index.astro` to change it.
6. Gate 6: there is no `@view-transition` rule; the spec's M18 block is what would be added.

Measured on the built files (gzip -9; before, at 6d8c4b3, then after): motion bundle 1,056 B, then
2,048 B (992 B added); all JavaScript on Home 1,392 B, then 2,384 B; site CSS 8,264 B, then
11,095 B (over the 10.8 KB budget and under the 11.5 KB cap: mostly the flow's layout and run, and
the `@supports` fallback the build writes for each `color-mix()`); Home HTML 6,894 B, then 7,217 B.
No new file or request. Lab median of five Home loads at 412 x 823, 4x CPU and slow 4G
(Lighthouse-like, not Lighthouse): LCP 2,320 to 2,388 ms before (two series), 2,420 ms after; TBT 3
to 8 ms; CLS 0; at least 97.9% of frames under 20 ms while the hero plays. Hero text: worst 4.87:1
(4.83:1 before). Not yet done: a Safari or Playwright WebKit pass, a real Android phone, a
DevTools paint-flashing review, and the owner's screen-recorded preview.

Review fixes (2026-10-28, same day, before any commit):

- The flow's start can no longer be missed. It used to wait for an IntersectionObserver
  threshold crossing at 60%, which never came when the steps were 2.5 to 3 times the viewport's
  height (375 x 262, 512 x 262: a 1,280 x 655 laptop at 250% zoom), leaving the lines undrawn
  for the whole visit. Now the observer is the trigger and, while the steps are on screen, every
  scroll and resize frame tests them too: all of them in view when they fit in 90% of the
  viewport, otherwise 85% of the viewport covered. Carried above the viewport before it could
  start, the figure gets `.is-drawn`. On a 375 x 812 phone the run now starts with Respond fully
  on screen (it used to start with Respond half below the fold). The figure lost its
  `data-reveal`, so on desktop the run no longer starts while the figure is still fading in.
  `npm run motion` checks all of this at 375 x 262, 512 x 262, 375 x 812 and 1,280 x 800.
- Startup reads before it writes: forced style and layout events from the motion bundle on a Home
  load at 4x CPU went from 25 to 2 (the first read of `--motion-tier`, which every load needs).
  The reveal check also reads every top before revealing anything.
- Copy rule 9: the five icons above no longer draw.
- The hero rail pulse's head lands on the rail's end (it used to overshoot by 72 px and linger),
  and the shared `trace` keyframes run linear, so the rail pulse and the page-header trace move
  at an even speed (about 1 px/ms at 1,280 px for the trace) and dim steadily as they arrive. The
  hero's first two proof icons draw at 300 and 450 ms (were 900, 1,100 and 1,300 ms, leaving
  empty slots for up to 1.3 s).
- From 1,024 px the flow's gaps are `clamp(4.5rem, 7vw, 7rem)` (were `clamp(3rem, 5vw, 5rem)`)
  and its horizontal pulses `min(3rem, 45cqw)` (were `min(2.5rem, 40cqw)`). From 640 to
  1,023 px each step is a row (tile, heading and sentence, index), about half as tall.
- Replay is a quiet control (muted text, no border until hover or focus; the 44 px target and
  the focus ring stay), not a second call to action.

Measured after the fixes (gzip -9): motion bundle 2,237 B (1,181 B added over 6d8c4b3, budget
2,000 B; 189 B more than the reviewed build), all JavaScript on Home 2,573 B, site CSS 11,260 B
(still over the 10.8 KB budget, under the 11.5 KB cap), Home HTML 7,211 B. Forced style and layout
from the motion bundle beyond the page's first style and layout pass, Home load at 4x CPU, median
of five: 23 events and 39 ms at 1,280 px (22 and 29 ms at 412 px) in the reviewed build, 0 after
the fixes (6d8c4b3: 20 events, 19 to 24 ms). Hero text unchanged: worst 4.87:1.

For the owner's preview (spec section 8's strength knobs): the desktop flow's gap and pulse
length are the "pulse" knob (compare the values above with the earlier ones), and the
page-header trace can be dropped by removing the `header-trace` span in
`src/components/PageHeader.astro` if four effects at once still read as busy.
