# Launch runbook

How www.direwolfcybersecurity.com goes from the unlaunched preview build to a published site,
and what must be true first. Owner: Mitch. Companion documents: `docs/claims-register.md`
(every claim, its status and its launch gates), `docs/legal-requirements-checklist.md`
(legal items), `README.md` (build, verify, Pages setup). Platform-side steps come from
`PLATFORM/PLAN.md` §14.1 (`PLATFORM` = `/c/Users/mitch/code/direwolf-platform`).

**State on 2026-10-23: launched at the owner's direction.** `SITE_LAUNCHED = true` in
`src/config.ts`: `robots.txt` allows crawling and names the sitemap, every page except the 404
page carries `index, follow`, the preview banner is gone, and `.github/workflows/deploy.yml`
publishes `main` to GitHub Pages on push. The launch went ahead before every gate in §1 was
closed; "Launch record" below is the authoritative list of what is open.

## Launch record

**2026-10-23: launched at the owner's direction.** Mitch directed that the site launch on
2026-10-23, accepting that the legal documents have not had attorney review. Done at launch:

- `SITE_LAUNCHED` set to `true` (indexing on, sitemap advertised in `robots.txt`).
- All seven legal documents (Privacy Policy, Terms of Service, Acceptable Use Policy, Cookie
  Notice, Accessibility Statement, EEO statement, Subprocessors) set to `status: published`,
  version `v2026.10.23`, effective 2026-10-23, with no change to their substantive text. The
  draft notice no longer renders; each legal page shows "These documents are in effect and are
  reviewed periodically; the current version is shown above." Bracketed owner and counsel
  drafting notes that readers could see (entity type and address, refunds, U.S. persons, dispute
  resolution, the EEO policy, "mailbox to be created") are now source comments
  (`TODO(mitch|counsel, gate Gn)`); the bracketed values that are open owner decisions are still
  visible (see G1 below).
- Contact addresses published: contact@, security@, legal@ and privacy@direwolfcybersecurity.com
  (`src/config.ts`). They are aliases on the owner's Google Workspace mailbox and deliver there
  (G7, done 2026-10-24; README.md, "Email"). No phone number is published. The street address
  stays unpublished.
- A Content Security Policy and `referrer` policy (`<meta>` tags in
  `src/layouts/BaseLayout.astro`) on every page, with no inline script or style;
  `npm run csp` checks them and is part of CI.
- GitHub: repository public; Pages enabled with source GitHub Actions and custom domain
  `www.direwolfcybersecurity.com` (both confirmed through the GitHub API on 2026-10-23).

**Open gates, tracked as post-launch items:**

| Gate                               | Status | Post-launch action                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1 Attorney review                 | OPEN   | Counsel reviews the published documents (`v2026.10.23`; Privacy Policy, Terms of Service and Subprocessors `v2026.10.24`), the Security page's policy, `docs/claims-register.md` and `docs/claims-research.md`. Any change is published as a new version, never an edit of a published version. Still visible in the published text and needing an owner or counsel decision: the retention windows "[24 months]", "[30 days]" and "[35 days]" (Privacy §8, Terms §8.4; register row L3), the support-SLA note in Terms §3.5 and the two "[data-residency option ...]" notes on the Subprocessors page. Hidden `TODO` comments in `terms.mdx` mark the refunds, U.S.-persons and dispute-resolution decisions. |
| G2 Business mailing address        | OPEN   | Add the PO box or registered agent to `streetAddress` in `src/config.ts`, the Privacy Policy (§1 and §15) and the Terms (§1), where `TODO(mitch, gate G2)` comments mark the places; publish those documents as a new version.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| G3 SBA VetCert certificate on file | OPEN   | File the certificate, or the SAM.gov entity record showing the SDVOSB certification, under `docs/evidence/` (public repository: redact personal data) and record the reference in claims register row F1. Calendar the recertification date.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

**Other gates at launch.** None of G4 to G17 was recorded as closed before launch. Known state on
2026-10-23, updated 2026-10-24: G4 (entity type) open; G5 (cap table) not recorded; G6 (EEO policy)
open, marked by a `TODO` in `eeo.mdx`; G7 (mailboxes) **done 2026-10-24**: the four addresses and
dmarc@ are Google Workspace aliases that deliver (README.md, "Email"); G8 (platform production)
open: the AWS GovCloud (US) account is still being approved by AWS, see the note below; G9
(branding@gsa.gov reply) not recorded; G10 (CMMC status) re-checked 2026-10-23 (claims register
change log), keep re-checking; G11 (CMVP) not recorded; G12 (vendor agreements) not recorded, so
vendor names stay off Home and Services; G13 (GitHub) repository public and Pages configured,
organization-level domain verification **done 2026-10-24** (verified), Enforce HTTPS **pending**
until GitHub issues the certificate (the orchestrator enables it), and no repository variables are
set (the build uses the default `PUBLIC_APP_URL`); G14 (DNS) **done 2026-10-24** for the records
(website, CAA, mail) and DNSSEC, with Domain Lock and WHOIS privacy on (README.md, "DNS at
Namecheap"; the rest of the §5 hygiene checklist is not recorded); G15 (security.txt) `Expires`
2027-10-23, contact security@ delivers (G7); G16 (definition of done) run locally on 2026-10-23, and
CI on `main` runs on the push; G17 optional, not done.

**Resolved 2026-10-24: claims that outran their gates.** At launch the Platform, Compliance and
Security pages (and the Platform page's compliance strip) described the Platform as running in
AWS GovCloud (US) in the present tense while claims register rows H1 and H4 to H7 were still
`planned` (G8). On 2026-10-24 those pages were reworded to the planned form ("Built for AWS
GovCloud (US)", "built to run in", "designed to run on"), rows H1 and H4 to H8 carry that wording
with status `planned` (platform not yet in service), and the Privacy Policy, Terms of Service and
Subprocessors page (v2026.10.24) say near their hosting statements that the Platform is being
brought into service. The present-tense wording returns only when G8 closes.

## 1. Launch gates

These were written as the conditions for setting `SITE_LAUNCHED` to `true`. The owner launched
on 2026-10-23 with them not all closed; the open ones are post-launch items, and their state is in
"Launch record" above. Record each closure there and in `docs/claims-register.md`. Evidence
goes under `docs/evidence/` (create the directory on first use; this repository is public,
so file public records or redacted copies, never personal data or anything under NDA).

| #   | Gate                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Owner               | Evidence                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------- |
| G1  | **Attorney review of legal pages**: Privacy Policy, Terms of Service, Acceptable Use Policy, Cookie Notice, Accessibility Statement, EEO statement, Subprocessors, the Security page's disclosure policy, plus `docs/claims-register.md` and `docs/claims-research.md`. No legal page has been reviewed yet; all were published unreviewed at launch (`v2026.10.23`, effective 2026-10-23). After review, publish each changed document as a new `version` and `effectiveDate`. | Attorney, Mitch     | Review memo in `docs/evidence/`; new versions committed |
| G2  | **Business mailing address (PO box or registered agent)** entered in `src/config.ts` (`streetAddress`), the Privacy Policy (§1 and the contact section) and the Terms (§1). Until then "Colorado Springs, Colorado" is a marked placeholder. Needed for CAN-SPAM and for the legal pages' identity disclosures.                                                                                                                                                                 | Mitch               | Commit                                                  |
| G3  | **SBA VetCert certificate filed**: the SBA Veteran Small Business Certification (SDVOSB) certificate, or the SAM.gov entity record showing the certification, filed under `docs/evidence/`, and the reference (certificate or SAM UEI, certification date, expiry) recorded in claims register row F1. The site already states the status on the owner's statement; this gate makes the evidence match. Calendar the recertification date.                                      | Mitch               | File in `docs/evidence/`; row F1 updated                |
| G4  | **Legal entity type confirmed** (LLC, Inc., ...) against the Colorado Secretary of State record. Until then the name is exactly "Direwolf Cybersecurity" everywhere (`legalEntityName`). Update the footer, Privacy Policy and Terms together.                                                                                                                                                                                                                                  | Mitch               | Record saved; commit                                    |
| G5  | **Cap table statement** confirming at least 51 % ownership and control by a service-disabled veteran (register F1).                                                                                                                                                                                                                                                                                                                                                             | Mitch               | Statement filed                                         |
| G6  | **EEO policy adopted**: the one-page internal policy the EEO statement summarises (register F2); remove the `TODO(mitch, gate G6)` comment from `src/content/legal/eeo.mdx`.                                                                                                                                                                                                                                                                                                    | Mitch               | Policy filed                                            |
| G7  | **Mailboxes reachable and monitored**: contact@, security@, legal@ and privacy@ (and dmarc@ for DMARC aggregate reports) are aliases on the owner's Google Workspace mailbox (README.md, "Email"); a test message to each arrives. **Done 2026-10-24.** Never switch Namecheap's Mail Settings away from Custom MX (§3.4).                                                                                                                                                      | Mitch               | Test message to each                                    |
| G8  | **Platform production live** in AWS GovCloud `us-gov-west-1`: ALB serving app.direwolfcybersecurity.com with the FIPS TLS policy, KMS keys attached (register H1, H4–H7). Hosting and cryptography rows flip from `planned` to `true today`; the Compliance page's "Last reviewed" date is bumped.                                                                                                                                                                              | Platform workstream | `PLATFORM/docs/compliance/evidence/`                    |
| G9  | **branding@gsa.gov reply** on the Compliance page's FedRAMP paragraph (register H1/H2).                                                                                                                                                                                                                                                                                                                                                                                         | Mitch               | Email filed in `docs/evidence/`                         |
| G10 | **CMMC status re-checked** against primary sources (war.gov, dodcio.defense.gov, Federal Register, Cyber AB). Last check 2026-10-23: the July 2026 Phase II suspension stands and no review outcome is published (research §3.4). Update the Compliance page's C2 sentence if that changes.                                                                                                                                                                                     | Mitch               | URL and date in the register change log                 |
| G11 | **CMVP certificates re-checked** (#4631, #4884) and the ALB's FIPS scope confirmed in AWS Artifact (register H4/H5).                                                                                                                                                                                                                                                                                                                                                            | Mitch               | Dated screenshots                                       |
| G12 | **Vendor agreements**: SentinelOne and NinjaOne signed before any vendor name appears on Home, Services or in purchase flows (register V1/V2).                                                                                                                                                                                                                                                                                                                                  | Mitch               | Agreements filed (private; reference only in this repo) |
| G13 | **GitHub**: repository public (or organization on the Team plan); organization-level domain verification done (**verified 2026-10-24**); Pages source set to GitHub Actions; repository variables set (§4). Enforce HTTPS is pending until GitHub issues the certificate (§4, step 3).                                                                                                                                                                                          | Mitch               | Screenshots                                             |
| G14 | **DNS**: website records live and resolving (§3.2), default parking records removed, DNSSEC enabled (§3.5), Namecheap account hygiene done (§5). **Done 2026-10-24** for the records (§3.2, §3.4) and DNSSEC (§3.5); Domain Lock and WHOIS privacy are on; the rest of §5 is not recorded.                                                                                                                                                                                      | Mitch               | `dig` output                                            |
| G15 | **security.txt** `Expires` within a year (`securityTxtExpires` in `src/config.ts`) and security@ monitored.                                                                                                                                                                                                                                                                                                                                                                     | Website workstream  | Built file                                              |
| G16 | **Definition of done green** on `main`: build, check, lint, format:check, links, a11y (CI).                                                                                                                                                                                                                                                                                                                                                                                     | Website workstream  | CI run                                                  |
| G17 | Manual accessibility pass with a screen reader on the top pages (optional for launch; required before the Accessibility Statement says "conforms").                                                                                                                                                                                                                                                                                                                             | Website workstream  | Notes                                                   |

## 2. Launch day

On 2026-10-23 the owner directed the launch before step 1 was complete ("Launch record"); steps
2 to 5 still describe how a publish is made and checked.

1. Close every gate above; update `docs/claims-register.md` rows and the Compliance page's
   `lastReviewed`.
2. Set `SITE_LAUNCHED = true` in `src/config.ts`. Run `npm run verify` and
   `npm run format:check` locally.
3. Commit and push to `main`. `deploy.yml` builds, checks `dist/robots.txt` and `dist/CNAME`,
   runs the link check and publishes. Watch the run in the Actions tab.
4. Verify in a private browser window: `https://www.direwolfcybersecurity.com/` loads over
   HTTPS with no banner; `https://direwolfcybersecurity.com/` redirects to `www`;
   `/robots.txt` says `Allow: /` and names the sitemap; `/sitemap-index.xml` and
   `/.well-known/security.txt` exist; every page's `<meta name="robots">` says `index, follow`.
5. Optional, no third-party code involved: register the domain with Google Search Console and
   Bing Webmaster Tools using the DNS TXT method and submit the sitemap.

## 3. DNS at Namecheap

The registrar and DNS host is Namecheap (BasicDNS). All records are entered in **Domain List →
Manage → Advanced DNS → Host records** in Namecheap's format: **Type | Host | Value | TTL**.
Host is relative to `direwolfcybersecurity.com` (`@` = the apex, `www` = www, `app` = app,
`_dmarc` = \_dmarc.direwolfcybersecurity.com). "Automatic" TTL is Namecheap's default (about 30
minutes); choose 5 min only while cutting the platform over, then put it back.

Sources: Namecheap, ["How do I link my domain to GitHub
Pages?"](https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages/)
and ["How to set up default domain and email
redirects"](https://www.namecheap.com/support/knowledgebase/article.aspx/9623/2237/how-to-set-up-default-domain-and-email-redirects/);
GitHub Docs, ["Managing a custom domain for your GitHub Pages
site"](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
(addresses verified 2026-10-23) and ["Verifying your custom domain for GitHub
Pages"](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

### 3.1 First: remove Namecheap's defaults

A newly registered Namecheap domain carries the parking-page records: a **URL Redirect
Record** on Host `@` (pointing to `http://www.direwolfcybersecurity.com/`) and a **CNAME** on
Host `www` pointing to `parkingpage.namecheap.com`. Delete both; the URL redirect also carries a
hidden A record that disappears with it. Check that no other A, AAAA, CNAME, ALIAS or URL
Redirect record exists for `@` or `www` (conflicting records on one host break the site).
**Done:** on 2026-10-24 public DNS showed only the GitHub Pages records for `@` and `www`. Leave
the **Mail Settings** selector on **Custom MX** (Google Workspace, §3.4).

### 3.2 Website (GitHub Pages): done 2026-10-24

All records below are live (checked against public DNS on 2026-10-24), and the
organization-level domain verification (§4, step 2) is verified. If the zone is ever rebuilt, do
that verification **before** adding the A, AAAA and CNAME records, so nobody else can bind the
domain to a Pages site in the meantime.

| Type  | Host                                            | Value                                                 | TTL       |
| ----- | ----------------------------------------------- | ----------------------------------------------------- | --------- |
| TXT   | \_github-pages-challenge-direwolf-cybersecurity | (exact value shown by GitHub; keep it)                | Automatic |
| A     | @                                               | 185.199.108.153                                       | Automatic |
| A     | @                                               | 185.199.109.153                                       | Automatic |
| A     | @                                               | 185.199.110.153                                       | Automatic |
| A     | @                                               | 185.199.111.153                                       | Automatic |
| AAAA  | @                                               | 2606:50c0:8000::153                                   | Automatic |
| AAAA  | @                                               | 2606:50c0:8001::153                                   | Automatic |
| AAAA  | @                                               | 2606:50c0:8002::153                                   | Automatic |
| AAAA  | @                                               | 2606:50c0:8003::153                                   | Automatic |
| CNAME | www                                             | direwolf-cybersecurity.github.io.                     | Automatic |
| CAA   | @                                               | `0 issue "letsencrypt.org"`                           | Automatic |
| CAA   | @                                               | `0 issue "amazon.com"`                                | Automatic |
| CAA   | @                                               | `0 iodef "mailto:security@direwolfcybersecurity.com"` | Automatic |

Notes. The TXT host is what GitHub displays for the `Direwolf-Cybersecurity` organization
(pattern `_github-pages-challenge-ORGANIZATION`); copy it exactly. The CNAME target is the
organization's Pages default domain, with no repository name. GitHub recommends A records
alongside AAAA because IPv6 adoption is uneven. Because `public/CNAME` names `www`, GitHub
redirects the apex to `www`. Do not add a wildcard (`*`) record: GitHub warns it re-opens
subdomain takeover even on a verified domain. The CAA records allow only Let's Encrypt (GitHub
Pages certificates) and Amazon (AWS Certificate Manager, for the platform's load balancer in
§3.3) to issue certificates for the domain; add an `issue` record before using any other
certificate authority. The `iodef` record asks a certificate authority that refuses a request
to report it to security@.

Check (from any machine):

```sh
dig +short A direwolfcybersecurity.com
dig +short AAAA direwolfcybersecurity.com
dig +short CNAME www.direwolfcybersecurity.com
dig +short TXT _github-pages-challenge-direwolf-cybersecurity.direwolfcybersecurity.com
dig +short CAA direwolfcybersecurity.com
```

### 3.3 Platform (later, when GovCloud production exists)

The platform is an Application Load Balancer in AWS GovCloud (US). An ALB has a DNS name, not a
fixed IP, so `app` is a CNAME; the values come from `terraform output` in the platform
repository's production environment.

| Type  | Host                            | Value                                                                  | TTL       |
| ----- | ------------------------------- | ---------------------------------------------------------------------- | --------- |
| CNAME | app                             | `<ALB DNS name output by Terraform>.` (ends in `.elb.amazonaws.com`)   | Automatic |
| CNAME | `<ACM validation name for app>` | `<ACM validation value>` (only if the certificate uses DNS validation) | Automatic |

Before the cutover, lower the TTL to 5 min; after it, set Automatic. `https://app.direwolfcybersecurity.com/`
must present the FIPS TLS policy (`ELBSecurityPolicy-TLS13-1-2-FIPS-2023-04`; register H4).

### 3.4 Mail

#### Google Workspace (inbound and staff mail): done 2026-10-24

Mail for `direwolfcybersecurity.com` runs on Google Workspace. contact@, security@, legal@,
privacy@ and dmarc@ are aliases on the owner's Workspace mailbox and deliver there (gate G7;
README.md, "Email"). The records, all live on 2026-10-24:

| Type | Host               | Value                                                                                          | TTL       |
| ---- | ------------------ | ---------------------------------------------------------------------------------------------- | --------- |
| MX   | @                  | `smtp.google.com`, priority 1 (in **Advanced DNS → Mail Settings → Custom MX**)                | Automatic |
| TXT  | @                  | `v=spf1 include:_spf.google.com ~all`                                                          | Automatic |
| TXT  | google.\_domainkey | `v=DKIM1;k=rsa;p=…` (Gmail DKIM key from the Google Admin console; signing active)             | Automatic |
| TXT  | \_dmarc            | `v=DMARC1; p=quarantine; rua=mailto:dmarc@direwolfcybersecurity.com; adkim=s; aspf=r; pct=100` | Automatic |

**Warning: do not change Mail Settings away from Custom MX.** Selecting Email Forwarding, Private
Email or any other Mail Settings option, or adding forwarders under Redirect Email, replaces the
Google MX records and stops mail to every published address, including the `security.txt`
contact. Add or remove addresses as aliases in the Google Admin console, never at Namecheap.

#### Amazon SES (platform sending, later; placeholders until Terraform outputs them)

Transactional mail will be sent from `no-reply@direwolfcybersecurity.com` through Amazon SES in
GovCloud. The platform's Terraform will output three DKIM tokens and, if a custom MAIL FROM
domain is used, the MAIL FROM records. Enter them as:

| Type  | Host                        | Value                                                                          | TTL       |
| ----- | --------------------------- | ------------------------------------------------------------------------------ | --------- |
| CNAME | `<dkim-token-1>._domainkey` | `<dkim-token-1>.dkim.amazonses.com.`                                           | Automatic |
| CNAME | `<dkim-token-2>._domainkey` | `<dkim-token-2>.dkim.amazonses.com.`                                           | Automatic |
| CNAME | `<dkim-token-3>._domainkey` | `<dkim-token-3>.dkim.amazonses.com.`                                           | Automatic |
| MX    | `<mail-from subdomain>`     | `10 feedback-smtp.us-gov-west-1.amazonses.com.` (only with a custom MAIL FROM) | Automatic |
| TXT   | `<mail-from subdomain>`     | `v=spf1 include:amazonses.com ~all` (only with a custom MAIL FROM)             | Automatic |

Notes. The MAIL FROM MX goes in the Custom MX list with the subdomain as its Host, next to the
Google record on `@`; leave the selector on Custom MX. Exactly one SPF TXT record may exist on
`@`, and it is Google's: never add a second one, and if SES ever needs to be authorized on `@`
itself, merge `include:amazonses.com` into the existing record. The `_dmarc` record already
exists: do not add another or lower it to `p=none`. Because it sets `adkim=s`, SES mail passes
DMARC only when it is DKIM-signed for `direwolfcybersecurity.com` itself, which the three DKIM
CNAMEs provide. Move DMARC from `p=quarantine` to `p=reject` once the reports to dmarc@ show only
legitimate senders.

### 3.5 DNSSEC

Namecheap BasicDNS supports DNSSEC with a switch: **Advanced DNS → DNSSEC → toggle on**; the
DS records are published automatically and take about 60 minutes to settle. `.com` is not on
Namecheap's list of TLDs that cannot use DNSSEC. Sources: Namecheap, ["Managing DNSSEC for
domains pointed to Premium or
BasicDNS"](https://www.namecheap.com/support/knowledgebase/article.aspx/9723/2232/managing-dnssec-for-domains-pointed-to-premium-or-basicdns/)
and ["Nameservers and TLDs supported/unsupported by
DNSSEC"](https://www.namecheap.com/support/knowledgebase/article.aspx/9718/2232/nameservers-and-tlds-supportedunsupported-by-dnssec/).
**Done 2026-10-24:** DNSSEC is on and the DS record is published. If DNS is ever moved off
Namecheap's nameservers (for example to Route 53), **disable DNSSEC first** and wait for the DS
record to clear, or the domain will fail validation at every resolver.

## 4. GitHub Pages

1. **Plan or visibility.** GitHub Pages serves only public repositories on the Free
   organization plan. Make this repository public (check the history and `docs/evidence/`
   first) or move the organization to the Team plan.
2. **Organization-level domain verification** (takeover protection; **done 2026-10-24**,
   verified): organization Settings → Pages → Add a domain → `direwolfcybersecurity.com`; add
   the TXT record from §3.2; after propagation click Continue verifying → Verify. Keep the record. Once verified, only
   repositories owned by the organization can publish Pages on the domain or its immediate
   subdomains. (The separate organization profile badge under Settings → Verified and approved
   domains uses a different TXT record; optional.)
3. **Repository**: Settings → Pages → Source: GitHub Actions; Custom domain:
   `www.direwolfcybersecurity.com` (equals `public/CNAME`); Enforce HTTPS once the certificate
   is issued (pending; the orchestrator enables it). Settings → Environments → `github-pages`: restrict deployments to `main`.
4. **Repository variables**: `PUBLIC_APP_URL`, `PUBLIC_CONTACT_ENDPOINT` (optional).
5. `deploy.yml` publishes every push to `main` now that `SITE_LAUNCHED` is `true` (since
   2026-10-23). Steps 1 and 3 (public repository; Pages source and custom domain) are done,
   and the organization-level domain verification (step 2) was done on 2026-10-24. Enforce
   HTTPS (step 3) is pending until GitHub issues the certificate, and the variables (step 4) are
   open ("Launch record", G13).

## 5. Namecheap account hygiene checklist

Sources: Namecheap knowledgebase articles
[9253 (two-factor authentication)](https://www.namecheap.com/support/knowledgebase/article.aspx/9253/45/how-can-i-enabledisable-twofactor-authentication/),
[10073 (TOTP)](https://www.namecheap.com/support/knowledgebase/article.aspx/10073/45/how-can-i-use-the-totp-method-for-twofactor-authentication/),
[10102 (U2F)](https://www.namecheap.com/support/knowledgebase/article.aspx/10102/45/how-can-i-use-the-u2f-method-for-twofactor-authentication/),
[380 (registrar lock)](https://www.namecheap.com/support/knowledgebase/article.aspx/380/46/how-do-i-setrelease-registrar-lock-for-a-domain/),
[282 (Domain Privacy renewal)](https://www.namecheap.com/support/knowledgebase/article.aspx/282/37/is-domain-privacy-automatically-renewed-with-the-domain-renewal/),
[10564 (automatic billing)](https://www.namecheap.com/support/knowledgebase/article.aspx/10564/2207/can-i-set-up-automatic-billing-for-my-namecheap-services/),
[10536 (Registry lock / Domain Vault)](https://www.namecheap.com/support/knowledgebase/article.aspx/10536/2289/what-is-registry-lock/).

- [ ] **2FA on the Namecheap account**: Profile → Security → Two-Factor Authentication. Use
      U2F (a hardware security key) or TOTP, never SMS; store the backup codes in the company
      password manager. Only one method can be active at a time.
- [ ] **Account email** is a company mailbox with its own 2FA, not a personal address; add a
      recovery phone; review Profile → Security → login history and active sessions.
- [x] **Domain Lock (registrar lock) on** (confirmed 2026-10-24): Domain List → Manage → the lock
      shows under Transfer Out / Domain Lock. It is on by default; confirm it stays on (WHOIS
      shows `clientTransferProhibited`).
- [x] **WHOIS / Domain Privacy on** (confirmed 2026-10-24; free with Namecheap; renews with the
      domain). Keep it on and keep the underlying registrant contact accurate and company-owned.
- [ ] **Auto-renew on** for the domain and for Domain Privacy (Domain List → Manage → Auto-Renew
      toggles), with a company card on file that does not expire soon; Namecheap starts renewal
      attempts 30 days before expiry and PayPal cannot be used for automatic renewals. Consider
      renewing several years ahead.
- [ ] **Registry Lock** (Namecheap Domain Vault, .com only, paid): optional extra that blocks
      nameserver changes, transfers and deletion at the registry; worth it once the platform
      depends on the domain.
- [ ] **Sub-users / API**: no shared logins; Namecheap API access off unless it is used (and then
      with IP allow-listing). Record who holds the account in the company's access register.
- [ ] **Calendar**: domain expiry, Domain Privacy expiry, DNSSEC check, and the annual
      `security.txt` `Expires` renewal.

## 6. Logo use (SBA VetCert / SDVOSB mark)

The site states "Service-Disabled Veteran-Owned Small Business (SDVOSB), SBA certified" in words
(claims register row F1) and shows **no SBA mark**. If the owner wants the SBA certification icon
on the site, follow SBA's rules (SBA brand guide, ["SBA-certified
businesses"](https://www.sba.gov/brand/for-partners/sba-certified-businesses), and the icon
pack ["Brand guide: decals and web
icons"](https://www.sba.gov/document/brand-guide-decals-web-icons); both read 2026-10-23):

- **Eligibility.** Only active participants in SBA's certification programs, including the
  Veteran Small Business Certification (VetCert) program, may use the icons. File the
  certificate first (gate G3), calendar the recertification date, and remove the icon the day
  the certification lapses: SBA says a business that is no longer certified "must discontinue
  using SBA icons".
- **Which file.** SBA's icon pack contains separate "Service-Disabled Veteran-Owned Certified"
  and "Veteran-Owned Certified" icons in several formats. Use the Service-Disabled icon as
  supplied; do not redraw, recolor, crop or merge it with the Direwolf logo, and do not use the
  SBA seal or wordmark on its own.
- **Where SBA allows it.** Business websites, business cards, social media profiles, capability
  statements and proposals.
- **Where SBA does not allow it.** Company letterhead, marketing materials and advertising,
  including paid ads and public service announcements in digital or traditional media. So: not
  in ads, not in marketing email, not in the preview banner or hero copy, not on merchandise.
- **No implied endorsement.** The icon "may not be used to express or imply endorsement of any
  goods, services, entities, or individuals": keep it with the company facts (About, Compliance,
  footer), never beside a product, price, testimonial or call to action, and never with words
  such as "SBA-approved", "endorsed" or "preferred".
- **Not the VA seal.** The VA Center for Verification and Evaluation stopped verifying
  businesses on 2023-01-01; do not use its "Verified" seal or the words "VA-verified".
- **Implementation.** Self-host the file under `public/` (no hotlinking, no third-party
  requests), give it the alt text "Service-Disabled Veteran-Owned Small Business, SBA
  certified", keep contrast and size readable at phone width, and record the decision, the file
  source and the date in claims register row F1.

## 7. After launch

- Renew `securityTxtExpires` in `src/config.ts` yearly (the build warns within 30 days).
- Re-check the CMMC program status (G10) and the FedRAMP vocabulary on the Compliance page
  whenever DoD or FedRAMP publish changes; bump `lastReviewed`.
- Never edit a published legal document in place: bump `version` and `effectiveDate`; the
  platform pins the accepted version.
- Keep `docs/claims-register.md` ahead of the pages: change the row, then the page.
