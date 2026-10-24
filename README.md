# direwolfcybersecurity.com

Public website for Direwolf Cybersecurity, served at <https://www.direwolfcybersecurity.com>
from GitHub Pages. Astro (static output) + Tailwind CSS + TypeScript, built with Node 24 / npm.
No third-party scripts, fonts or analytics (the heading font, Geist, is self-hosted from the
pinned `@fontsource-variable/geist` package); no server-side code. The platform
(app.direwolfcybersecurity.com) lives in a separate repository.

- Working conventions for people and agents: [CLAUDE.md](CLAUDE.md)
- Launch checklist, DNS and account hygiene: [docs/launch-runbook.md](docs/launch-runbook.md)
- Every factual or compliance claim on the site, with status and evidence:
  [docs/claims-register.md](docs/claims-register.md)

## Develop

```sh
npm ci
npm run dev        # http://localhost:4321
```

Build-time variables (copy `.env.example` to `.env`; CI reads them from repository variables):

| Variable                  | Purpose                                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_APP_URL`          | Where "Log in" and "Sign up" point once `PLATFORM_LIVE` is `true` in `src/config.ts`. Default `https://app.direwolfcybersecurity.com`. |
| `PUBLIC_CONTACT_ENDPOINT` | Optional. The contact form POSTs JSON here; when unset it falls back to opening the visitor's mail app.                                |

## Verify (definition of done)

| Command                | What it checks                                                                                                                                                                                                                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`        | Astro static build into `dist/`                                                                                                                                                                                                                                                                                                        |
| `npm run check`        | `astro check`: TypeScript and template diagnostics                                                                                                                                                                                                                                                                                     |
| `npm run lint`         | ESLint with the Astro and jsx-a11y (strict) rules                                                                                                                                                                                                                                                                                      |
| `npm run format:check` | Prettier. `npm run format` rewrites the files.                                                                                                                                                                                                                                                                                         |
| `npm run links`        | Every internal link, asset, `#fragment` and the Open Graph image in `dist/` resolves; no page links to the platform host while `PLATFORM_LIVE` is `false`; every image in `dist/_astro/` is shown by some page                                                                                                                         |
| `npm run a11y`         | axe-core WCAG 2.1 A/AA over every built page, light and dark, phone width, with reduced motion so scroll-revealed content is checked in its final state. Needs Edge or Chrome installed, or `A11Y_BROWSER_PATH=<browser>`.                                                                                                             |
| `npm run csp`          | Every page carries the Content Security Policy and referrer meta, has no inline script or style, and links out with `rel="noopener noreferrer"`; each page then loads in the same browser as `a11y` with zero CSP violations or console errors, and the mobile menu, contact-form validation and no-JavaScript fallback are exercised. |

`npm run verify` runs build, check, lint, format:check, links, a11y and csp in that order. CI
(`.github/workflows/ci.yml`) runs all seven on every push to `main` and on every pull request.

## Layout

```
src/pages/        home, services, platform, about, contact, compliance, security, legal/*
src/components/   header, footer, BrandLogo, ImageSlot, Icon, stats band, cards, forms, legal layout
src/content/      legal documents (MDX with versioned frontmatter)
src/data/         services, pricing, stats (cited third-party figures), images (the five image
                  slots), icons (Lucide), navigation, engagements (Experience section)
src/scripts/      motion.ts: scroll reveal, statistic count-up, header state (bundled, no inline JS)
src/assets/       brand/ (horizontal-lockup copies generated from docs/brand/v2/, veteran-owned badge);
                  images/ (owner-supplied slot images, see "Adding images"); engagements/ is
                  gitignored (other organizations' logos stay local until permission is filed)
src/config.ts     site constants: launch and platform flags, names, ownership statement, mailboxes, HQ line
public/           favicons, web manifest, og-image.png (generated by `npm run brand:assets`), CNAME,
                  noscript.css; robots.txt, sitemap and security.txt are generated at build
scripts/          check-links.mjs, a11y.mjs, check-csp.mjs, lib/site.mjs (shared by a11y and csp),
                  generate-brand-assets.mjs (logo copies, favicons, icons and social card from the
                  masters in docs/brand/v2/, with sharp)
docs/             brand/v2/ (the owner's logo masters; never shipped), claims-register.md, claims-research.md, logo-use-research.md, legal-research.md,
                  legal-requirements-checklist.md, platform-consent-spec.md, launch-runbook.md,
                  threat-stats.md, design-direction.md, image-prompts.md
.github/workflows ci.yml (build, check, lint, format, links, a11y, csp), deploy.yml (GitHub Pages)
```

## Adding images

The site draws no artwork of its own. It has five image slots, defined in `src/data/images.ts`,
and each one shows an image only when its file exists in `src/assets/images/`. With no file the
slot renders nothing and its section closes up around it, so the site always looks complete.

| Slot     | File name       | Where it appears                                                | Aspect | Minimum size |
| -------- | --------------- | --------------------------------------------------------------- | ------ | ------------ |
| hero     | `hero.webp`     | Home hero: behind the headline on the right, below it on phones | 16:9   | 2400 x 1350  |
| mdr      | `mdr.webp`      | Services, managed detection and response                        | 4:3    | 1600 x 1200  |
| pentest  | `pentest.webp`  | Services, penetration testing                                   | 4:3    | 1600 x 1200  |
| platform | `platform.webp` | Platform, beside "What your administrators will see"            | 16:10  | 2000 x 1250  |
| about    | `about.webp`    | About, beside the mission                                       | 3:2    | 1800 x 1200  |

1. Every image must be **original or licensed for commercial use** (for example generated with a
   tool whose terms allow commercial use). Keep the licence terms with your records. No photos of
   real people, no other organizations' logos, no text in the image.
2. Export at the minimum size or larger, in the slot's aspect ratio (the slot crops to it).
   `.webp` is preferred; `.avif`, `.png`, `.jpg` and `.jpeg` with the same name also work.
   Smaller files still work, and the build prints a warning naming the recommended size.
3. Save it in `src/assets/images/` with the exact file name above and run `npm run build`. Astro
   makes AVIF and WebP copies at several widths (never upscaled); the hero loads first, the others
   lazily.
4. If the picture differs from the description, update the slot's `alt` text in
   `src/data/images.ts`.

Prompts for an image generator, in the site's style: `docs/image-prompts.md`.

## Deploy and launch

The site **launched on 2026-10-23** at the owner's direction. `SITE_LAUNCHED` in
`src/config.ts` is `true`, so:

- `/robots.txt` allows all crawling and names `/sitemap-index.xml` (generated by
  `@astrojs/sitemap`); every page carries `index, follow` except the 404 page;
- no preview notice is shown, and each legal page states that the documents are in effect;
- `.github/workflows/deploy.yml` builds and publishes `main` to GitHub Pages on every push. Its
  `gate` job reads the flag, and the build job still refuses any `dist/` whose `robots.txt` says
  `Disallow: /`.

The launch went ahead with three gates still open, now tracked as post-launch items in
[docs/launch-runbook.md](docs/launch-runbook.md) ("Launch record"): attorney review of the legal
pages (G1), the business mailing address (G2), and the SBA VetCert certificate filed under
`docs/evidence/` (G3). Two more were added on 2026-10-24: the owner's confirmation of each
Experience-section entry (G18; closed for names on 2026-10-24, so the section lists the six names,
logos still off) and the source and commercial-use licence of the veteran-owned badge artwork
(G19). Setting the flag back to `false` stops further publishes and restores `noindex`; it does not
take down what is already on Pages.

GitHub Pages cannot set response headers, so the Content Security Policy and the referrer policy
are `<meta>` tags in `src/layouts/BaseLayout.astro`; `npm run csp` checks them over `dist/`.

### GitHub (done by the orchestrator)

1. **Done: repository public.** GitHub Pages serves only public repositories on the Free
   organization plan; this repository is public (confirmed through the GitHub API on
   2026-10-23).
2. **Done: Pages enabled with the custom domain.** Repository Settings → Pages → Build and
   deployment → Source: **GitHub Actions**; Custom domain: `www.direwolfcybersecurity.com`
   (matches `public/CNAME`).
3. **Done 2026-10-24: organization-level domain verification.** Organization Settings → Pages
   shows `direwolfcybersecurity.com` as verified, using the
   `_github-pages-challenge-direwolf-cybersecurity` TXT record in the DNS table below. Only
   repositories owned by the organization can publish a Pages site on the domain or its
   subdomains, which prevents takeover ([GitHub Docs, "Verifying your custom domain for GitHub
   Pages"](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)).
   Keep the TXT record in place.
4. **Pending: Enforce HTTPS.** Repository Settings → Pages → tick **Enforce HTTPS**. The
   orchestrator enables it once GitHub has issued the certificate for
   `www.direwolfcybersecurity.com`.
5. **Repository variables** (Settings → Secrets and variables → Actions → Variables), optional:
   `PUBLIC_APP_URL` and, when the platform's contact endpoint exists, `PUBLIC_CONTACT_ENDPOINT`.
   None is set, so the build uses the default `https://app.direwolfcybersecurity.com`.
   "Run workflow" (workflow_dispatch) on `deploy.yml` re-publishes on demand.

### DNS at Namecheap (Advanced DNS): done 2026-10-24

Namecheap → Domain List → Manage → **Advanced DNS**. The columns are Type, Host, Value, TTL;
Host is relative to the domain (`@` is the apex, `www` is www). These records are live (checked
against public DNS on 2026-10-24):

| Type  | Host                                            | Value                                                 | TTL       |
| ----- | ----------------------------------------------- | ----------------------------------------------------- | --------- |
| A     | @                                               | 185.199.108.153                                       | Automatic |
| A     | @                                               | 185.199.109.153                                       | Automatic |
| A     | @                                               | 185.199.110.153                                       | Automatic |
| A     | @                                               | 185.199.111.153                                       | Automatic |
| AAAA  | @                                               | 2606:50c0:8000::153                                   | Automatic |
| AAAA  | @                                               | 2606:50c0:8001::153                                   | Automatic |
| AAAA  | @                                               | 2606:50c0:8002::153                                   | Automatic |
| AAAA  | @                                               | 2606:50c0:8003::153                                   | Automatic |
| CNAME | www                                             | direwolf-cybersecurity.github.io.                     | Automatic |
| TXT   | \_github-pages-challenge-direwolf-cybersecurity | (the value GitHub displays; verified)                 | Automatic |
| CAA   | @                                               | `0 issue "letsencrypt.org"`                           | Automatic |
| CAA   | @                                               | `0 issue "amazon.com"`                                | Automatic |
| CAA   | @                                               | `0 iodef "mailto:security@direwolfcybersecurity.com"` | Automatic |

The mail records are in "Email" below. Also done: **DNSSEC** on (the DS record is published),
**Domain Lock** on and **WHOIS privacy** on. The CAA records allow only Let's Encrypt (which
issues the GitHub Pages certificate) and Amazon (AWS Certificate Manager, for the platform's
load balancer) to issue certificates for the domain, and the `iodef` record asks a certificate
authority that refuses a request to report it to security@. Add a CAA `issue` record before
using any other certificate authority, or its certificates will be refused.

The A and AAAA addresses were verified on 2026-10-23 against GitHub Docs, ["Managing a custom
domain for your GitHub Pages
site"](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
With both the apex and `www` configured, GitHub Pages redirects the apex to `www` (the custom
domain in `public/CNAME`). The platform (`app`), the Amazon SES sending records that the
platform's Terraform will output, DNSSEC and the Namecheap account hygiene checklist are in
[docs/launch-runbook.md](docs/launch-runbook.md).

### Email (Google Workspace): done 2026-10-24

Mail for `direwolfcybersecurity.com` runs on **Google Workspace**. The site publishes four
addresses, all set in `src/config.ts`: contact@, security@ (also the `security.txt` contact),
legal@ and privacy@direwolfcybersecurity.com. They and dmarc@ (DMARC aggregate reports) are
aliases on the owner's Workspace mailbox, and each already delivers there. Add or remove an
alias in the Google Admin console, never at Namecheap.

The mail records, all live on 2026-10-24:

| Type | Host               | Value                                                                                                                 | TTL       |
| ---- | ------------------ | --------------------------------------------------------------------------------------------------------------------- | --------- |
| MX   | @                  | `smtp.google.com`, priority 1 (entered under **Mail Settings → Custom MX**, not in Host records)                      | Automatic |
| TXT  | @                  | `v=spf1 include:_spf.google.com ~all` (SPF)                                                                           | Automatic |
| TXT  | google.\_domainkey | `v=DKIM1;k=rsa;p=…` (Gmail DKIM key from Google Admin → Apps → Google Workspace → Gmail → Authenticate email; active) | Automatic |
| TXT  | \_dmarc            | `v=DMARC1; p=quarantine; rua=mailto:dmarc@direwolfcybersecurity.com; adkim=s; aspf=r; pct=100`                        | Automatic |

**Warning: do not change Advanced DNS → Mail Settings away from Custom MX.** Choosing Email
Forwarding, Private Email or any other option there, or adding forwarders under Redirect Email,
replaces the Google MX records, and mail to every address on the site (including the security@
contact in `security.txt`) stops arriving. Keep exactly one SPF record on `@`: when the
platform's Amazon SES sending is set up, merge any `include:` it needs into this record rather
than adding a second one. Keep exactly one `_dmarc` record, and do not lower its policy to
`p=none`. Runbook §3.4 has the SES records.
