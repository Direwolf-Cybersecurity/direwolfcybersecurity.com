# direwolfcybersecurity.com — working conventions

Public marketing website for Direwolf Cybersecurity, served at www.direwolfcybersecurity.com
from GitHub Pages. The platform (app.direwolfcybersecurity.com) lives in a separate repo,
`Direwolf-Cybersecurity/Direwolf-Cybersecurity-Application`; read its PLAN.md §14 for how
the site and platform fit together.

## Stack and rules

- **Astro** (static output) + **Tailwind CSS** + TypeScript, built with Node 24 / npm.
  No PHP anywhere (owner decision). No server-side code in this repo.
- **No third-party scripts, fonts, or analytics.** Everything is self-hosted. The site sets
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
  register says it is true today. Hosting is described as "AWS GovCloud (US), FedRAMP High
  authorized infrastructure". **Owner facts (2026-10-23):** the business is an SBA
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
- **Legal pages** are published: in effect 2026-10-23, version `v2026.10.23` (the Privacy
  Policy, Terms of Service and Subprocessors page are at `v2026.10.24`, effective 2026-10-24,
  after the platform-in-service note was added). Attorney review has not happened yet and is an
  open post-launch gate (G1 in docs/launch-runbook.md). Each document is versioned
  `vYYYY.MM.DD` in its frontmatter and shown with its version and "Last updated" date; the
  platform records which version a user accepted, so every change to a published document
  requires a version bump (new `version` and `effectiveDate`), never an edit in place.
- **Links to the platform** use `PUBLIC_APP_URL` (default `https://app.direwolfcybersecurity.com`).
  Contact form posts to `PUBLIC_CONTACT_ENDPOINT` when set, else falls back to a mailto link.
- **Do not run `git commit`**; the orchestrating session commits.

## Layout

```
src/pages/        home, services, platform, about, contact, compliance, security, legal/*
src/components/   header, footer, nav, hero, cards, forms, legal layout
src/content/      services and legal documents (Markdown/MDX with frontmatter)
src/config.ts     site constants (name, address line, phone/email placeholders, flags)
public/           favicon, robots.txt (generated), CNAME, .well-known/security.txt
docs/             claims-register.md, legal-research.md, claims-research.md, launch-runbook.md
.github/workflows deploy.yml (GitHub Pages), ci.yml (build, links, accessibility)
```

## Definition of done

`npm ci`, `npm run build`, `npm run check` (astro check), `npm run lint`, `npm run links`
(internal link check over `dist/`), `npm run a11y` (axe over the built pages) all pass.
