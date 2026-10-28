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
