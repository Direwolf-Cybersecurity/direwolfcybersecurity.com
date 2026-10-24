# direwolfcybersecurity.com

Public website for Direwolf Cybersecurity, served at <https://www.direwolfcybersecurity.com>
from GitHub Pages. Astro (static output) + Tailwind CSS + TypeScript, built with Node 24 / npm.
No third-party scripts, fonts or analytics; no server-side code. The platform
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

| Variable                  | Purpose                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `PUBLIC_APP_URL`          | Where "Log in" and "Sign up" point. Default `https://app.direwolfcybersecurity.com`.                    |
| `PUBLIC_CONTACT_ENDPOINT` | Optional. The contact form POSTs JSON here; when unset it falls back to opening the visitor's mail app. |

## Verify (definition of done)

| Command                | What it checks                                                                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`        | Astro static build into `dist/`                                                                                                              |
| `npm run check`        | `astro check`: TypeScript and template diagnostics                                                                                           |
| `npm run lint`         | ESLint with the Astro and jsx-a11y (strict) rules                                                                                            |
| `npm run format:check` | Prettier. `npm run format` rewrites the files.                                                                                               |
| `npm run links`        | Every internal link, asset and `#fragment` in `dist/` resolves                                                                               |
| `npm run a11y`         | axe-core WCAG 2.1 A/AA over every built page, light and dark, phone width. Needs Edge or Chrome installed, or `A11Y_BROWSER_PATH=<browser>`. |

`npm run verify` runs build, check, lint, links and a11y in that order. CI
(`.github/workflows/ci.yml`) runs all six on every push to `main` and on every pull request.

## Layout

```
src/pages/        home, services, platform, about, contact, compliance, security, legal/*
src/components/   header, footer, nav, hero, cards, forms, legal layout
src/content/      legal documents (MDX with versioned frontmatter)
src/data/         navigation, services, pricing
src/config.ts     site constants: launch flag, names, ownership statement, address placeholder
public/           favicon, CNAME; robots.txt, sitemap and security.txt are generated at build
scripts/          check-links.mjs, a11y.mjs
docs/             claims-register.md, claims-research.md, legal-research.md,
                  legal-requirements-checklist.md, platform-consent-spec.md, launch-runbook.md
.github/workflows ci.yml (build, check, lint, format, links, a11y), deploy.yml (GitHub Pages)
```

## Deploy and launch

The site is **not launched**. `SITE_LAUNCHED` in `src/config.ts` is `false`, and while it is:

- `/robots.txt` disallows all crawling and every page carries `noindex`;
- a "Preview build" notice is shown at the top of every page;
- `.github/workflows/deploy.yml` refuses to publish: its `gate` job reads the flag, writes a
  notice, and the build and publish jobs are skipped. The build job additionally refuses any
  `dist/` whose `robots.txt` still says `Disallow: /`.

Flipping the flag is the last step of [docs/launch-runbook.md](docs/launch-runbook.md), after
its gates are closed: attorney review of the legal pages, the business mailing address (PO box or
registered agent), the SBA VetCert certificate filed under `docs/evidence/`, and the rest.

### Before the first publish

1. **Make GitHub Pages available.** GitHub Pages serves only public repositories on the Free
   organization plan. Before launch either make this repository public (normal for a marketing
   site; check that nothing private is in the history or in `docs/evidence/` first) or move the
   `Direwolf-Cybersecurity` organization to the GitHub Team plan.
2. **Verify the domain for the organization** before enabling it on the repository: GitHub
   organization Settings → Pages → "Add a domain" → `direwolfcybersecurity.com`, then create the
   TXT record GitHub shows (Namecheap: Type `TXT`, Host like
   `_github-pages-challenge-direwolf-cybersecurity`, Value as displayed). Once verified, only
   repositories owned by the organization can publish a Pages site on the domain or its
   subdomains, which prevents takeover ([GitHub Docs, "Verifying your custom domain for GitHub
   Pages"](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)).
   Keep the TXT record in place.
3. **Repository settings** → Pages → Build and deployment → Source: **GitHub Actions**. Custom
   domain: `www.direwolfcybersecurity.com` (must match `public/CNAME`). Tick **Enforce HTTPS**
   once GitHub has issued the certificate.
4. **Repository variables** (Settings → Secrets and variables → Actions → Variables):
   `PUBLIC_APP_URL` and, when the platform's contact endpoint exists, `PUBLIC_CONTACT_ENDPOINT`.
5. **Launch:** set `SITE_LAUNCHED = true` in `src/config.ts`, commit, push to `main`.
   `deploy.yml` builds and publishes; "Run workflow" (workflow_dispatch) re-publishes on demand.

### DNS at Namecheap (Advanced DNS)

Namecheap → Domain List → Manage → **Advanced DNS** → Host records. The columns are Type, Host,
Value, TTL; Host is relative to the domain (`@` is the apex, `www` is www). First delete
Namecheap's default parking records (the URL Redirect record on `@` and the CNAME `www` →
`parkingpage.namecheap.com`), then add:

| Type  | Host                                            | Value                                   | TTL       |
| ----- | ----------------------------------------------- | --------------------------------------- | --------- |
| A     | @                                               | 185.199.108.153                         | Automatic |
| A     | @                                               | 185.199.109.153                         | Automatic |
| A     | @                                               | 185.199.110.153                         | Automatic |
| A     | @                                               | 185.199.111.153                         | Automatic |
| AAAA  | @                                               | 2606:50c0:8000::153                     | Automatic |
| AAAA  | @                                               | 2606:50c0:8001::153                     | Automatic |
| AAAA  | @                                               | 2606:50c0:8002::153                     | Automatic |
| AAAA  | @                                               | 2606:50c0:8003::153                     | Automatic |
| CNAME | www                                             | direwolf-cybersecurity.github.io.       | Automatic |
| TXT   | \_github-pages-challenge-direwolf-cybersecurity | (the value GitHub displays, see step 2) | Automatic |

The A and AAAA addresses were verified on 2026-10-23 against GitHub Docs, ["Managing a custom
domain for your GitHub Pages
site"](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site);
re-check them there before adding. With both the apex and `www` configured, GitHub Pages
redirects the apex to `www` (the custom domain in `public/CNAME`). The platform (`app`), the
mail records that the platform's Terraform will output, DNSSEC and the Namecheap account hygiene
checklist are in [docs/launch-runbook.md](docs/launch-runbook.md).
