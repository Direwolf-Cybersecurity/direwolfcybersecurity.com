# Launch runbook

How www.direwolfcybersecurity.com goes from the unlaunched preview build to a published site,
and what must be true first. Owner: Mitch. Companion documents: `docs/claims-register.md`
(every claim, its status and its launch gates), `docs/legal-requirements-checklist.md`
(legal items), `README.md` (build, verify, Pages setup). Platform-side steps come from
`PLATFORM/PLAN.md` §14.1 (`PLATFORM` = `/c/Users/mitch/code/direwolf-platform`).

**State on 2026-10-23:** `SITE_LAUNCHED = false` in `src/config.ts`; `robots.txt` disallows
all, every page is `noindex`, a preview banner is shown, and `.github/workflows/deploy.yml`
refuses to publish. No workflow has published anything.

## 1. Launch gates

All of these must be closed before `SITE_LAUNCHED` is set to `true`. Evidence goes under
`docs/evidence/` (create the directory on first use; this repository becomes public at launch,
so file public records or redacted copies, never personal data or anything under NDA).

| #   | Gate                                                                                                                                                                                                                                                                                                                                                                                                                                       | Owner               | Evidence                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- | ------------------------------------------------------- |
| G1  | **Attorney review of legal pages**: Privacy Policy, Terms of Service, Acceptable Use Policy, Cookie Notice, Accessibility Statement, EEO statement, Subprocessors, the Security page's disclosure policy, plus `docs/claims-register.md` and `docs/claims-research.md`. No legal page has been reviewed yet. After review, bump each document's `version` and `effectiveDate` and set `status: published`.                                 | Attorney, Mitch     | Review memo in `docs/evidence/`; new versions committed |
| G2  | **Business mailing address (PO box or registered agent)** entered in `src/config.ts` (`streetAddress`), the Privacy Policy (§1 and the contact section) and the Terms (§1). Until then "Colorado Springs, Colorado" is a marked placeholder. Needed for CAN-SPAM and for the legal pages' identity disclosures.                                                                                                                            | Mitch               | Commit                                                  |
| G3  | **SBA VetCert certificate filed**: the SBA Veteran Small Business Certification (SDVOSB) certificate, or the SAM.gov entity record showing the certification, filed under `docs/evidence/`, and the reference (certificate or SAM UEI, certification date, expiry) recorded in claims register row F1. The site already states the status on the owner's statement; this gate makes the evidence match. Calendar the recertification date. | Mitch               | File in `docs/evidence/`; row F1 updated                |
| G4  | **Legal entity type confirmed** (LLC, Inc., ...) against the Colorado Secretary of State record. Until then the name is exactly "Direwolf Cybersecurity" everywhere (`legalEntityName`). Update the footer, Privacy Policy and Terms together.                                                                                                                                                                                             | Mitch               | Record saved; commit                                    |
| G5  | **Cap table statement** confirming at least 51 % ownership and control by a service-disabled veteran (register F1).                                                                                                                                                                                                                                                                                                                        | Mitch               | Statement filed                                         |
| G6  | **EEO policy adopted**: the one-page internal policy the EEO statement summarises (register F2); remove the bracketed owner note from `src/content/legal/eeo.mdx`.                                                                                                                                                                                                                                                                         | Mitch               | Policy filed                                            |
| G7  | **Mailboxes exist and are monitored**: contact@, security@, privacy@ (and legal@ if the Terms keep referencing it). Inbound mail needs a mailbox provider and MX records (§3.4); SES only sends.                                                                                                                                                                                                                                           | Mitch               | Test message to each                                    |
| G8  | **Platform production live** in AWS GovCloud `us-gov-west-1`: ALB serving app.direwolfcybersecurity.com with the FIPS TLS policy, KMS keys attached (register H1, H4–H7). Hosting and cryptography rows flip from `planned` to `true today`; the Compliance page's "Last reviewed" date is bumped.                                                                                                                                         | Platform workstream | `PLATFORM/docs/compliance/evidence/`                    |
| G9  | **branding@gsa.gov reply** on the Compliance page's FedRAMP paragraph (register H1/H2).                                                                                                                                                                                                                                                                                                                                                    | Mitch               | Email filed in `docs/evidence/`                         |
| G10 | **CMMC status re-checked** against primary sources (war.gov, dodcio.defense.gov, Federal Register, Cyber AB). Last check 2026-10-23: the July 2026 Phase II suspension stands and no review outcome is published (research §3.4). Update the Compliance page's C2 sentence if that changes.                                                                                                                                                | Mitch               | URL and date in the register change log                 |
| G11 | **CMVP certificates re-checked** (#4631, #4884) and the ALB's FIPS scope confirmed in AWS Artifact (register H4/H5).                                                                                                                                                                                                                                                                                                                       | Mitch               | Dated screenshots                                       |
| G12 | **Vendor agreements**: SentinelOne and NinjaOne signed before any vendor name appears on Home, Services or in purchase flows (register V1/V2).                                                                                                                                                                                                                                                                                             | Mitch               | Agreements filed (private; reference only in this repo) |
| G13 | **GitHub**: repository public (or organization on the Team plan); organization-level domain verification done; Pages source set to GitHub Actions; repository variables set (§4).                                                                                                                                                                                                                                                          | Mitch               | Screenshots                                             |
| G14 | **DNS**: website records live and resolving (§3.2), default parking records removed, DNSSEC enabled (§3.5), Namecheap account hygiene done (§5).                                                                                                                                                                                                                                                                                           | Mitch               | `dig` output                                            |
| G15 | **security.txt** `Expires` within a year (`securityTxtExpires` in `src/config.ts`) and security@ monitored.                                                                                                                                                                                                                                                                                                                                | Website workstream  | Built file                                              |
| G16 | **Definition of done green** on `main`: build, check, lint, format:check, links, a11y (CI).                                                                                                                                                                                                                                                                                                                                                | Website workstream  | CI run                                                  |
| G17 | Manual accessibility pass with a screen reader on the top pages (optional for launch; required before the Accessibility Statement says "conforms").                                                                                                                                                                                                                                                                                        | Website workstream  | Notes                                                   |

## 2. Launch day

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
Redirect record exists for `@` or `www` (conflicting records on one host break the site). Leave
the **Mail Settings** selector on "No Email Service" until a mailbox provider is chosen (§3.4).

### 3.2 Website (GitHub Pages)

Do the organization-level domain verification (§4, step 2) **before** adding these, so nobody
else can bind the domain to a Pages site in the meantime.

| Type  | Host                                            | Value                                  | TTL       |
| ----- | ----------------------------------------------- | -------------------------------------- | --------- |
| TXT   | \_github-pages-challenge-direwolf-cybersecurity | (exact value shown by GitHub; keep it) | Automatic |
| A     | @                                               | 185.199.108.153                        | Automatic |
| A     | @                                               | 185.199.109.153                        | Automatic |
| A     | @                                               | 185.199.110.153                        | Automatic |
| A     | @                                               | 185.199.111.153                        | Automatic |
| AAAA  | @                                               | 2606:50c0:8000::153                    | Automatic |
| AAAA  | @                                               | 2606:50c0:8001::153                    | Automatic |
| AAAA  | @                                               | 2606:50c0:8002::153                    | Automatic |
| AAAA  | @                                               | 2606:50c0:8003::153                    | Automatic |
| CNAME | www                                             | direwolf-cybersecurity.github.io.      | Automatic |

Notes. The TXT host is what GitHub displays for the `Direwolf-Cybersecurity` organization
(pattern `_github-pages-challenge-ORGANIZATION`); copy it exactly. The CNAME target is the
organization's Pages default domain, with no repository name. GitHub recommends A records
alongside AAAA because IPv6 adoption is uneven. Because `public/CNAME` names `www`, GitHub
redirects the apex to `www`. Do not add a wildcard (`*`) record: GitHub warns it re-opens
subdomain takeover even on a verified domain.

Check (from any machine):

```sh
dig +short A direwolfcybersecurity.com
dig +short AAAA direwolfcybersecurity.com
dig +short CNAME www.direwolfcybersecurity.com
dig +short TXT _github-pages-challenge-direwolf-cybersecurity.direwolfcybersecurity.com
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

### 3.4 Mail: SES sending records (placeholders until Terraform outputs them)

Transactional mail is sent from `no-reply@direwolfcybersecurity.com` through Amazon SES in
GovCloud. The platform's Terraform will output three DKIM tokens and, if a custom MAIL FROM
domain is used, the MAIL FROM records. Enter them as:

| Type  | Host                        | Value                                                                          | TTL       |
| ----- | --------------------------- | ------------------------------------------------------------------------------ | --------- |
| CNAME | `<dkim-token-1>._domainkey` | `<dkim-token-1>.dkim.amazonses.com.`                                           | Automatic |
| CNAME | `<dkim-token-2>._domainkey` | `<dkim-token-2>.dkim.amazonses.com.`                                           | Automatic |
| CNAME | `<dkim-token-3>._domainkey` | `<dkim-token-3>.dkim.amazonses.com.`                                           | Automatic |
| TXT   | @                           | `v=spf1 include:amazonses.com -all` (placeholder; see note)                    | Automatic |
| TXT   | \_dmarc                     | `v=DMARC1; p=none; rua=mailto:<dmarc-reports mailbox>; fo=1` (start here)      | Automatic |
| MX    | `<mail-from subdomain>`     | `10 feedback-smtp.us-gov-west-1.amazonses.com.` (only with a custom MAIL FROM) | Automatic |
| TXT   | `<mail-from subdomain>`     | `v=spf1 include:amazonses.com ~all` (only with a custom MAIL FROM)             | Automatic |

Notes. Exactly one SPF TXT record may exist on `@`: if a mailbox provider also sends mail for the
domain, merge its `include:` into the same record instead of adding a second one. Move DMARC from
`p=none` to `p=quarantine` and then `p=reject` once the reports show only legitimate senders.
Inbound mail for contact@, security@ and privacy@ needs a mailbox provider; its MX records go in
**Advanced DNS → Mail Settings → Custom MX**, not in Host records.

### 3.5 DNSSEC

Namecheap BasicDNS supports DNSSEC with a switch: **Advanced DNS → DNSSEC → toggle on**; the
DS records are published automatically and take about 60 minutes to settle. `.com` is not on
Namecheap's list of TLDs that cannot use DNSSEC. Sources: Namecheap, ["Managing DNSSEC for
domains pointed to Premium or
BasicDNS"](https://www.namecheap.com/support/knowledgebase/article.aspx/9723/2232/managing-dnssec-for-domains-pointed-to-premium-or-basicdns/)
and ["Nameservers and TLDs supported/unsupported by
DNSSEC"](https://www.namecheap.com/support/knowledgebase/article.aspx/9718/2232/nameservers-and-tlds-supportedunsupported-by-dnssec/).
Enable it after the website records resolve correctly. If DNS is ever moved off Namecheap's
nameservers (for example to Route 53), **disable DNSSEC first** and wait for the DS record to
clear, or the domain will fail validation at every resolver.

## 4. GitHub Pages

1. **Plan or visibility.** GitHub Pages serves only public repositories on the Free
   organization plan. Make this repository public (check the history and `docs/evidence/`
   first) or move the organization to the Team plan.
2. **Organization-level domain verification** (takeover protection): organization Settings →
   Pages → Add a domain → `direwolfcybersecurity.com`; add the TXT record from §3.2; after
   propagation click Continue verifying → Verify. Keep the record. Once verified, only
   repositories owned by the organization can publish Pages on the domain or its immediate
   subdomains. (The separate organization profile badge under Settings → Verified and approved
   domains uses a different TXT record; optional.)
3. **Repository**: Settings → Pages → Source: GitHub Actions; Custom domain:
   `www.direwolfcybersecurity.com` (equals `public/CNAME`); Enforce HTTPS once the certificate
   is issued. Settings → Environments → `github-pages`: restrict deployments to `main`.
4. **Repository variables**: `PUBLIC_APP_URL`, `PUBLIC_CONTACT_ENDPOINT` (optional).
5. `deploy.yml` stays inert until `SITE_LAUNCHED` is `true` (§2).

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
- [ ] **Domain Lock (registrar lock) on**: Domain List → Manage → the lock shows under
      Transfer Out / Domain Lock. It is on by default; confirm it stays on (WHOIS shows
      `clientTransferProhibited`).
- [ ] **WHOIS / Domain Privacy on** (free with Namecheap; renews with the domain). Keep it on
      and keep the underlying registrant contact accurate and company-owned.
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
