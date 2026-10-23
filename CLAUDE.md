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
- **Not launched until told:** `SITE_LAUNCHED` in `src/config.ts` is `false`: `robots.txt`
  disallows all, every page has `noindex`, and the deploy workflow refuses to publish.
- **Accuracy of claims:** every factual or compliance claim on the site must appear in
  `docs/claims-register.md` with its status (true today / planned / pursuing) and evidence.
  Never write "certified", "authorized", "compliant" or "FedRAMP" about Direwolf unless the
  register says it is true today. Hosting is described as "AWS GovCloud (US), FedRAMP High
  authorized infrastructure". Say "veteran-owned" only; no SDVOSB/VOSB certification claim.
  Do not invent names, numbers, customers, certifications, or testimonials.
- **Legal pages** are drafts for attorney review, versioned `vYYYY.MM.DD` in their
  frontmatter and shown with "Last updated"; the platform records which version a user
  accepted, so never edit a published version in place: bump the version.
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
