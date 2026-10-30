# direwolfcybersecurity.com — working conventions

Public marketing website for Direwolf Cybersecurity, served at www.direwolfcybersecurity.com
from GitHub Pages. The platform (app.direwolfcybersecurity.com) lives in a separate repo,
`Direwolf-Cybersecurity/Direwolf-Cybersecurity-Application`; read its PLAN.md §14 for how
the site and platform fit together.

## Stack and rules

- **Astro** (static output) + **Tailwind CSS** + TypeScript, built with Node 24 / npm.
  No PHP anywhere (owner decision). No server-side code in this repo.
- **No third-party scripts, fonts, or analytics.** Everything is self-hosted: headings use Geist
  (OFL), bundled from the pinned `@fontsource-variable/geist` package and served from `/_astro/`,
  and body text uses the system font stack. The site sets
  no non-essential cookies, so no cookie-consent banner is shown; `/legal/cookies` explains
  the essential cookies (none by default).
- **Accessibility:** WCAG 2.1 AA. Semantic HTML, visible focus, 4.5:1 contrast, skip link,
  reduced-motion respected, every image has alt text, forms have labels and error text.
- **Launched 2026-10-23 at the owner's direction.** `SITE_LAUNCHED` in `src/config.ts` is
  `true`; the deploy workflow publishes `main` to GitHub Pages. Legal documents are in
  effect pending attorney review (tracked as open gates G1-G3 in docs/launch-runbook.md).
  Flip `SITE_LAUNCHED` to `false` only to take the site offline deliberately.
- **Accuracy of claims:** every factual or compliance claim on the site must appear in
  `docs/claims-register.md` with its status (true today / planned / pursuing) and evidence.
  Never write "certified", "authorized", "compliant" or "FedRAMP" about Direwolf unless the
  register says it is true today. **Hosting (owner decision 2026-10-25, platform ADR 0021):** the
  Platform is described as built to run on AWS in the US West (Oregon) Region, with backups in
  US East (Ohio), Regions AWS reports at the FedRAMP Moderate baseline (AWS's label:
  "FedRAMP Certified Class C (formerly Moderate baseline)"), always with the row H2 disclaimer;
  never say the infrastructure beneath the Platform carries AWS's certification (AWS's FedRAMP
  services-in-scope page has no row for Fargate or Elastic Load Balancing, row H1). AI inference
  is Amazon Bedrock in AWS US Regions. **No roadmap (owner decision 2026-10-29, register rule 9):**
  the site shows nothing labelled "Roadmap", "planned", "coming soon", "not yet available" or
  "being built", and no status sentence saying the company or the Platform is not fully set up;
  Platform items are described by their design ("built to run on", "designed to"), never as
  running. GovCloud and FedRAMP intentions appear nowhere on the site (rows H9 and H10 retired).
  The one in-progress statement kept is the CMMC Level 2 pursuit ("Pursuing CMMC Level 2" /
  "preparing for a CMMC Level 2 assessment", rows C1 and C2), never strengthened. Never
  "FedRAMP In Process", "FedRAMP Ready", or FedRAMP
  "authorized/certified/compliant" about Direwolf, and never "FIPS certified" or "FIPS
  compliant" (rows H1-H10). **Owner facts (2026-10-23):** the business is an SBA
  VetCert-certified Service-Disabled Veteran-Owned Small Business (SDVOSB), so the site may
  say "Service-Disabled Veteran-Owned Small Business (SDVOSB), SBA certified"; keep the
  certificate reference in the claims register and follow SBA's logo-usage rules if the
  VetCert mark is shown. Legal entity name: "Direwolf Cybersecurity" (entity type to be
  confirmed; do not append LLC/Inc. until confirmed). Business mailing address: not yet
  available; keep the placeholder "Colorado Springs, Colorado" and a TODO. No attorney has
  reviewed the legal pages yet: that review is a launch gate in docs/launch-runbook.md.
  Domain registrar: Namecheap (DNS instructions must use Namecheap's Advanced DNS record
  format: Type, Host, Value, TTL).
  Do not invent names, numbers, customers, certifications, or testimonials.
- **Legal pages** are published. Terms of Service, Privacy Policy and Subprocessors are at
  `v2026.10.25` (effective 2026-10-25: hosting on commercial AWS US West (Oregon), backups in
  US East (Ohio), AI inference in AWS US Regions); the Acceptable Use Policy is at `v2026.10.24.2`
  (effective 2026-10-24, MSSP scope: no NinjaOne or endpoint management, penetration testing
  added); Cookie Notice and EEO are at `v2026.10.23`; the Accessibility Statement is at `v2026.10.28` (effective
  2026-10-28: its motion sentence, claims register row W3); the Security page policy is
  at `v2026.10.29` (no "not yet in service" or CRM sentence). The Subprocessors page is off every
  navigation, footer and the Legal index (`unlistedLegalDocs` in `src/data/navigation.ts`) but stays
  published, unchanged, because the Privacy Policy and Terms link to it. The published Terms still
  name only the four core services and keep §3.3 "Roadmap features" and a CUI-repository roadmap
  sentence; their versioned update is open gate G21 in docs/launch-runbook.md (until it closes, no
  vulnerability scan is sold without an Order or SOW carrying written authorization). Attorney
  review has not happened yet and is an open post-launch gate (G1 in
  docs/launch-runbook.md). Each document is versioned `vYYYY.MM.DD` (a same-day re-issue adds
  `.N`, N from 2) in its frontmatter and shown with its version and "Last updated" date; the
  platform records which version a user accepted, so every change to a published document
  requires a version bump (new `version` and `effectiveDate`), never an edit in place.
- **Links to the platform** use `PUBLIC_APP_URL` (default `https://app.direwolfcybersecurity.com`),
  and only while `PLATFORM_LIVE` in `src/config.ts` is `true`. It is `false` until the platform
  is in service (no DNS yet): the site then offers no sign-up and no early access (row W6, owner
  direction 2026-10-27). Every "Log in" / "Sign up" becomes a single "Contact us" link to
  `/contact/`, and the footer drops its platform link. The contact form's "The Direwolf Platform"
  topic (`/contact/?topic=platform`) takes platform questions; it replaced "Platform launch
  updates" (`launch-updates`) on 2026-10-29, and that old code falls back to "Other".
  `npm run links` fails on any link to the platform host.
  Contact form posts to `PUBLIC_CONTACT_ENDPOINT` when set, else falls back to a mailto link.
  Set that variable only after the platform's contact topics match the form's (`src/config.ts`).
- **Positioning (owner direction 2026-10-24):** an AI-driven managed security services provider
  (MSSP) for any small or mid-size business, not an MSP and not only for government contractors.
  Services (owner decision 2026-10-29: fourteen current services, no roadmap; `src/data/services.ts`,
  register rows A1-A4, A6, A7, C5, R2-R11), in four groups on the Services page: **Detect and
  respond** (managed detection and response powered by the Direwolf AI SOC, managed endpoint
  protection (EDR), breach-exposure monitoring, incident-response readiness); **Test and harden**
  (penetration testing, vulnerability scanning, Microsoft 365 and Google Workspace security
  reviews, security awareness training); **Comply and prove** (compliance readiness, compliance
  tracking (GRC), cyber-insurance readiness, security questionnaire support); **Plan and lead**
  (risk analysis, fractional security officer). Each is worded as a service Direwolf's team
  delivers (outcome and deliverable), never as unbuilt software ("engine", "dashboard", "portal",
  "tracker", "real time"); no endpoint management or RMM. MDR is scoped to what the EDR reports
  (row A9) until the owner confirms Microsoft 365 or Google Workspace monitoring is delivered, and
  EDR "licenses" are not offered until the partner agreement is signed (rows V1 and A4).
  Say "monitored by a team of security professionals", never "human analyst reviewing", and
  never claim 24/7 human staffing (claims register rule 8, rows A2, A6, A7, F5).
  **Approved positioning line (owner decision 2026-10-26, row A8):** "A next-gen AI SOC: AI
  security analysts, engineers and responders work every alert around the clock, overseen by our
  team of security professionals." It is the Home hero subhead, verbatim; Services (MDR lede,
  and the EDR and MDR explainer) and Platform (the "AI handles the alert noise" point, in design
  form: "Designed so AI security analysts and responders work every alert around the clock, ...")
  use row A8's approved forms, word for word. The
  analysts, engineers and responders are Direwolf's AI agents: always write "AI" with them, never
  word, name or picture them so they could be read as people, and keep "monitored by" /
  "overseen by our team of security professionals" for the human side ("around the clock" never
  describes the people). The analyst (triage and investigation) and responder (automated,
  guarded containment) agents are built in the platform's code, not yet in service; the
  detection-engineer and advisor agents are owner intent (owner direction 2026-10-26, not yet
  built or in the platform's PLAN.md or backlog). Only the Home hero's verbatim line names
  "engineers" (the register's `owner intent` exception); every other page names only the built
  roles, and a page that lists duties lists only theirs. Before `PLATFORM_LIVE` is set to `true`,
  either the engineer agent is in service or "engineers" comes off the Home hero (row A8's gate,
  launch runbook G20; `npm run links` enforces it). **Open owner decision (review of
  2026-10-29):** now that the site no longer says the Platform is not in service, the review
  recommends moving the hero to row A8's short form (without "engineers") now, or closing G20 when
  the site stopped disclosing pre-launch status rather than when `PLATFORM_LIVE` flips. The hero
  stays verbatim until Mitch decides; do not edit it without his decision. Evidence:
  `docs/evidence/2026-10-26-owner-decision-ai-soc-positioning.md`.
- **Brand and logos:** the owner's logo masters (the 1254 px shield and stacked lockup, and the
  1672 x 941 horizontal lockup, all designed for dark surfaces, 2026-10-24) are in
  `docs/brand/v2/` and are never shipped; `npm run brand:assets` generates the horizontal lockup
  copies in `src/assets/brand/`, the favicons, touch and manifest icons (from the shield) and the
  social card (horizontal lockup and tagline). The header and footer show the horizontal lockup
  (`src/components/BrandLogo.astro`) on the near-black band (`.dark-band`, #05070d in both color
  schemes) with no typed name beside it; the stacked lockup is no longer used. The veteran-owned badge is in `src/assets/brand/` (row F7).
- **No illustrations (owner direction 2026-10-24):** never draw SVG artwork or scenes. Imagery is
  the owner's own (image-generator output or licensed), placed in the five slots of
  `src/data/images.ts` (`src/assets/images/`, README "Adding images"); a slot with no file renders
  nothing. UI icons come from Lucide (`lucide-static`, ISC, pinned) via `src/data/icons.ts`.
  Motion (`src/scripts/motion.ts`, CSS in `src/styles/global.css`; rules in `docs/design-direction.md`,
  "Motion system v2 (2026-10-28)") is off under `prefers-reduced-motion`, plays once and never
  loops, and content is fully visible without JavaScript. The Home "How it works" flow
  (`src/components/SystemFlow.astro`: labelled HTML steps joined by CSS rules and one CSS frame, with no
  SVG) is interface, not illustration; nothing figurative is ever added to it (motion gate 1: for the
  owner to confirm before the motion change is published). Third-party statistics
  come only from `src/data/stats.ts` (rows S-STAT-1 to S-STAT-6, rule 13). Other organizations' logos stay off until the mark owner's written
  permission is filed (claims register rows E1-E6, `docs/logo-use-research.md`), and their files
  are **not committed**: this repository is public, so `src/assets/engagements/*` is gitignored and
  the owner's copies stay in local or private storage. Commit a logo file (with a
  `!src/assets/engagements/<file>` exception in `.gitignore`) only in the same change that sets
  its entry's `logoApproved: true` in `src/data/engagements.ts`; never for the DoD seal or The
  Cyber AB logo. The Experience section lists an organization only once the owner's confirmation
  (the engagement happened as stated; no publicity or confidentiality restriction known) is
  recorded in its E-row and as `ownerConfirmed` (gate G18 in docs/launch-runbook.md: closed for
  names on 2026-10-24 by the owner's instruction of 2026-10-23, so the six names are live; logos
  remain pending).
- **Do not run `git commit`**; the orchestrating session commits.

## Layout

```
src/pages/        home, services, platform, about, contact, compliance, security, legal/*
src/components/   header, footer, brand logo, image slots, icons, stats, cards, forms, legal layout
src/content/      legal documents (MDX with frontmatter)
src/data/         services, pricing, stats, images (slots), icons, navigation, engagements
src/scripts/      motion.ts (motion tiers, scroll reveal, one-shots, count-up, the Home flow,
                  card light, header state)
src/assets/       brand/ (generated logo copies, badge), images/ (owner-supplied slot images)
src/config.ts     site constants (name, address line, phone/email placeholders, flags)
public/           favicons, web manifest, og-image.png, CNAME; robots.txt and security.txt generated
docs/             claims-register.md, legal-research.md, claims-research.md, logo-use-research.md,
                  launch-runbook.md
.github/workflows deploy.yml (GitHub Pages), ci.yml (build, links, accessibility)
```

## Definition of done

`npm ci`, `npm run build`, `npm run check` (astro check), `npm run lint`, `npm run links`
(internal link check over `dist/`), `npm run a11y` (axe over the built pages), `npm run csp`,
`npm run motion` and `npm run hero-contrast` all pass (`npm run verify` runs them in order).
