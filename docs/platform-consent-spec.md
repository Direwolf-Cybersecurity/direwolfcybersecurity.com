# Platform consent and acknowledgement spec

**For:** the platform team (`direwolf-platform`), implementing sign-up, purchase and login
consent for PLAN.md §14.4.
**From:** the website workstream, which owns the legal documents.
**Status:** draft for attorney review, 2026-10-23; versions and sample texts updated 2026-10-24
for the `v2026.10.24.2` documents (§0.1). The texts below are the recommended
wording; counsel must approve the banner and the clickwrap labels before launch
(NIST SP 800-53 AC-8 guidance has legal counsel review the banner; the contract-formation
cases in `docs/legal-research.md` §2 turn on exactly how these screens look).

Research behind every requirement here: `docs/legal-research.md` §2 (enforceable consent),
§3 (system-use banner), §4.4 (prohibited data), §4.10 (vendor EULAs), §5.2 (Stripe).
The requirement checklist that this spec satisfies is the "Consent and acknowledgement"
section of `docs/legal-requirements-checklist.md`.

## 0. The documents and their versions

| Slug                      | Document                                                          | Current version                                            | Canonical URL                                               |
| ------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| `terms`                   | Terms of Service                                                  | `v2026.10.24.2`                                            | https://www.direwolfcybersecurity.com/legal/terms/          |
| `aup`                     | Acceptable Use Policy                                             | `v2026.10.24.2`                                            | https://www.direwolfcybersecurity.com/legal/acceptable-use/ |
| `privacy`                 | Privacy Policy                                                    | `v2026.10.24.2`                                            | https://www.direwolfcybersecurity.com/legal/privacy/        |
| `subprocessors`           | Subprocessors (incorporated by reference; no separate acceptance) | `v2026.10.24.2`                                            | https://www.direwolfcybersecurity.com/legal/subprocessors/  |
| `banner`                  | System-use notice (text in §4 below)                              | `v2026.10.24.2`                                            | n/a (served by the platform)                                |
| `prohibited-data`         | Prohibited-data attestation (text in §1 below)                    | `v2026.10.23`                                              | n/a (part of sign-up)                                       |
| `vendor-eula:sentinelone` | SentinelOne Terms of Service (vendor document)                    | as published by the vendor; record its "last updated" date | https://www.sentinelone.com/legal/terms-of-service/         |

`vendor-eula:ninjaone` was removed on 2026-10-24: Direwolf offers no endpoint management or RMM
service and resells no NinjaOne product (owner direction 2026-10-24; claims register rows A5,
V2), so the platform presents no NinjaOne terms.

Versions are `vYYYY.MM.DD`, or `vYYYY.MM.DD.N` (N from 2) for a further version published the
same day (first used for `v2026.10.24.2`), and come from the frontmatter of
`src/content/legal/*.mdx` in the website repository. The platform must store, for each
version it shows, the version string, the SHA-256 of the document's source text and a copy of
the rendered text, so the exact text a user accepted can be produced later (E-SIGN
15 U.S.C. 7001(d)). Recommended mechanism: the website build publishes
`/legal/versions.json` (slug, version, effectiveDate, sha256, url) and the platform pins the
versions it presents; a mismatch between the pinned version and the live site is a deploy
check, not a runtime surprise. (Website action item: add that build output and, before any
second version is published, per-version archive URLs such as `/legal/terms/v2026.10.23/`.)
Platform note: `apps.legal.documents.VERSION_RE` (`^v\d{4}\.\d{2}\.\d{2}$`) must accept the
`.N` suffix before the platform pins `v2026.10.24.2`. Plain string comparison (`is_newer`)
still orders `v2026.10.24` < `v2026.10.24.2` < `v2026.10.25`, but not a tenth version on one
day (`.10`).

### 0.1 Version history

No one has accepted any version before `v2026.10.24.2`: each was live for a few hours at most
and the Platform is not in service, so no consent record names one and no re-acceptance notice is due.
Pin `v2026.10.24.2` directly.

| Slug                                       | Version                                                                  | Live                                 | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `terms`, `aup`, `privacy`, `subprocessors` | `v2026.10.23`                                                            | from the launch on 2026-10-23        | Launch texts.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `terms`, `privacy`, `subprocessors`        | `v2026.10.24`                                                            | 2026-10-24, a few hours              | "The Platform is being brought into service" note beside the hosting statements.                                                                                                                                                                                                                                                                                                                                                                                     |
| `terms`, `aup`, `privacy`, `subprocessors` | `v2026.10.24.2`                                                          | from 2026-10-24                      | Owner direction 2026-10-24 (MSSP scope): endpoint management and NinjaOne removed everywhere; penetration testing added (Terms §§2, 3.1, 3.6, 5, 6.1, 16.3, 18.2; AUP §§1, 4(5), 5.4; Privacy §§2, 3.4, 4); "a Direwolf analyst reviews" and "human analyst review" replaced with "monitored by a team of security professionals" wording, with no staffing level or hours promised (Terms §3.1); "compliance guidance" renamed "compliance readiness" in the Terms. |
| `banner`                                   | `v2026.10.23`, then `v2026.10.24` (the platform's per-document citation) | not served (Platform not in service) | Replaced by `v2026.10.24.2`, which cites the `v2026.10.24.2` documents (§4.1, §4.2).                                                                                                                                                                                                                                                                                                                                                                                 |

## 1. Sign-up screen (clickwrap)

Order on the screen, top to bottom, all on one screen (no multi-step wizard that separates
the notice from the button):

1. Organization name, your name, work email, password, authorized-representative title.
2. **Checkbox A (unchecked, required).** Label, with each document name an underlined link in
   the link color that opens the versioned document in a new tab:

   > I have read and agree to the Direwolf Cybersecurity **[Terms of Service](https://www.direwolfcybersecurity.com/legal/terms/)** (v2026.10.24.2), **[Acceptable Use Policy](https://www.direwolfcybersecurity.com/legal/acceptable-use/)** (v2026.10.24.2) and **[Privacy Policy](https://www.direwolfcybersecurity.com/legal/privacy/)** (v2026.10.24.2).

3. **Checkbox B (unchecked, required).** The prohibited-data attestation:

   > I understand that the Direwolf Platform is not approved for Controlled Unclassified Information (CUI), export-controlled technical data (ITAR/EAR), protected health information (PHI), payment card numbers or classified information, and I will not upload or configure the services to collect any of these unless Direwolf has agreed in writing that the service is approved for it.

4. **Authority line** (plain text under the checkboxes, not a checkbox):

   > By creating this account you confirm that you are at least 18 years old and authorized to bind _[organization name as typed]_ to these terms.

5. **Submit button** labelled **"Create account and accept terms"**. Disabled until both boxes
   are checked. If a user submits with a box unchecked (keyboard users can), show the error
   text next to the box: _"You must agree to the Terms of Service, Acceptable Use Policy and
   Privacy Policy to create an account."_ / _"You must confirm the prohibited-data statement to
   create an account."_
6. **No pre-checked boxes. No marketing opt-in on this screen.** If marketing email is ever
   offered, it is a separate, unchecked, optional box with its own label; never bundled.

Presentation rules (from _Berman_, _Chabolla_, _Meyer_, _Oberstein_):

- Same font size as the form labels; normal foreground color; links underlined and in the link
  color (4.5:1 contrast); the notice sits between the last field and the button, above the
  fold on a 375-px-wide phone.
- Real `<label for>` on each checkbox; error text linked with `aria-describedby`; focus
  visible; the whole flow operable by keyboard.
- Version numbers are displayed on screen so the stored record matches what the user saw.
- Keep a dated screenshot of this screen (desktop and mobile) for every UI change and every
  document version, in the platform repo under `docs/compliance/evidence/consent-ui/`.

Records written on submit: one `ConsentRecord` per document (`terms`, `aup`, `privacy`,
`prohibited-data`), `method = signup_checkbox` (see §6).

## 2. Vendor EULA acceptance at purchase

When a cart or order contains a resold product, show, on the order review screen before the
Stripe redirect, one **unchecked, required checkbox per vendor product**:

> I accept the **[SentinelOne Terms of Service](https://www.sentinelone.com/legal/terms-of-service/)** (last updated _[date shown on the vendor page]_) for the SentinelOne licenses in this order. SentinelOne, not Direwolf, licenses this software.

Button: **"Continue to payment"** (acceptance is by the checkbox, so the button label need not
reference it, but it may: "Accept and continue to payment"). Record
`document_slug = vendor-eula:<vendor>`, `document_version = <vendor last-updated date>`,
`method = purchase_checkbox`, plus the order id. Re-present when the vendor's date changes.
Vendor partner agreements may dictate their own required language; conform when signed.

## 3. Stripe Checkout

- Use **Stripe-hosted Checkout (full redirect)**, not embedded Checkout or Elements, to stay
  in the simplest PCI DSS SAQ A posture (`docs/legal-research.md` §5.1).
- In the Stripe Dashboard public business details, set the Terms of Service URL
  (`https://www.direwolfcybersecurity.com/legal/terms/`) and Privacy Policy URL
  (`https://www.direwolfcybersecurity.com/legal/privacy/`) before enabling consent collection.
- On every Checkout Session: `consent_collection[terms_of_service] = required`, and
  `custom_text[terms_of_service_acceptance][message]` =
  _"I agree to the [Direwolf Cybersecurity Terms of Service](https://www.direwolfcybersecurity.com/legal/terms/) (v2026.10.24.2)."_
- Do **not** enable promotional-email consent collection unless marketing email is launched;
  if enabled, it must be its own checkbox (Stripe requires separate consent).
- Enable the refund-policy display in Checkout settings and publish the refund terms (Terms
  of Service §6.8).
- On `checkout.session.completed`, read `consent.terms_of_service` and write a
  `ConsentRecord` with `method = stripe_checkout`, `document_slug = terms`, the pinned version
  and `stripe_checkout_session_id`.
- Auto-renewal: the checkout and the billing page must state the renewal term, the recurring
  charge and how to cancel before purchase; enable Stripe Billing renewal reminders for annual
  plans (25–40 days before renewal); the customer portal provides one-step cancellation
  (C.R.S. 6-1-732 and SB 25-145; B2B reach UNVERIFIED but build it in).

## 4. Login: system-use notice

Shown **before** the email and password fields, on every sign-in (PLAN.md §14.4), retained on
screen until the user activates **"I acknowledge"**, which reveals the credential fields.
Record `document_slug = banner`, `document_version = v2026.10.24.2`, `method = login_banner`
on every acknowledgement (cheap, and exactly the evidence an assessor asks for under
AC.L2-3.1.9).

The platform's current seeded default (`apps.platform.models.DEFAULT_SYSTEM_USE_BANNER`) and
the frontend fallback (`FALLBACK_BANNER_TEXT` in `frontend/src/auth/SystemUseBanner.tsx`)
cover authorized use, monitoring and penalties but omit three elements counsel will want:
that this is **not a U.S. Government system**, the **prohibited-data** reminder, and the
**links to the governing documents**. Replace both with the texts below.

### 4.1 Full text (default; desktop and tablet)

> **Notice to users**
>
> This is a private computer system owned and operated by Direwolf Cybersecurity and provided
> for authorized users only. It is **not a U.S. Government information system.**
>
> By continuing you acknowledge and agree that:
>
> - Your use of this system may be monitored, recorded and audited. The resulting records may
>   be used for security, operational, legal and compliance purposes, including to help our
>   customers meet their NIST SP 800-171 and CMMC obligations, and may be disclosed as required
>   by law.
> - Unauthorized access or use is prohibited and may result in suspension or termination of
>   access and in civil and criminal penalties under the Computer Fraud and Abuse Act
>   (18 U.S.C. § 1030) and state law.
> - You will not upload Controlled Unclassified Information, export-controlled technical data
>   (ITAR/EAR), protected health information or payment card data unless your agreement with
>   Direwolf expressly permits it.
> - Your use is governed by the [Terms of Service](https://www.direwolfcybersecurity.com/legal/terms/) (v2026.10.24.2), [Acceptable Use Policy](https://www.direwolfcybersecurity.com/legal/acceptable-use/) (v2026.10.24.2) and [Privacy Policy](https://www.direwolfcybersecurity.com/legal/privacy/) (v2026.10.24.2).
>
> **[ I acknowledge ]**

### 4.2 Short text (narrow screens under 480 px, and API or CLI token issuance)

> Private system of Direwolf Cybersecurity. Authorized use only. Activity is monitored and
> recorded. Unauthorized use is prohibited and may be prosecuted. This is not a U.S.
> Government system. Do not upload CUI, ITAR/EAR data, PHI or card data. By continuing you
> accept the Terms of Service, Acceptable Use Policy and Privacy Policy (v2026.10.24.2).
> **[ I acknowledge ]**

### 4.3 Rules for the banner

- Never the DoD "Standard Mandatory DoD Notice and Consent Banner" text or anything that
  says "U.S. Government", "USG" or "DoD information system": the platform is a commercial
  system and that text would misrepresent it.
- No statements about Direwolf's own certifications or authorizations (claims register rule 1).
- Organization overrides (`Org.settings.system_use_banner`) may add the customer's own
  wording but must keep every element above; validate on save that the override contains the
  four required phrases ("authorized users only", "monitored", "not a U.S. Government", and
  the three document names) or prepend the platform text.
- Plain text or minimal markup only; links must be real links; contrast 4.5:1; readable by a
  screen reader as one region (`role="region"`, `aria-label="System use notice"`, as the
  current component does).

## 5. Re-acceptance when a document version changes

When any of `terms`, `aup`, `privacy` has a version newer than the user's latest accepted
version, show an interstitial after the banner acknowledgement and before the dashboard:

> **Our [Terms of Service] changed on [effective date].**
> Summary of changes: _[two to five bullets written by the website workstream in the
> document's change note]_.
> [Review the new version] (link, new tab)
>
> ☐ I have read and agree to the Direwolf Cybersecurity [Terms of Service] (v2026.xx.xx).
>
> **[ Accept and continue ]** [ Sign out ]

Record `method = reacceptance`. Do not let the user into the dashboard without accepting
(the Terms give them the right to terminate instead; "Sign out" plus the billing-portal
cancellation satisfies that). Email org admins when a version changes (transactional
notice, 30 days before a material change takes effect; Terms §21).

## 6. ConsentRecord schema (append-only, like the audit log)

| Field                                    | Notes                                                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `user_id`, `org_id`                      | who bound whom; `org_id` nullable for banner acknowledgements before org context                     |
| `document_slug`                          | `terms`, `aup`, `privacy`, `banner`, `prohibited-data`, `vendor-eula:<vendor>`                       |
| `document_version`                       | `vYYYY.MM.DD` or `vYYYY.MM.DD.N` for Direwolf documents; vendor "last updated" date for vendor EULAs |
| `document_sha256`                        | hash of the document source at that version; the platform keeps the text too                         |
| `accepted_at`                            | server UTC time                                                                                      |
| `ip`, `user_agent`, `locale`             | corroboration                                                                                        |
| `method`                                 | `signup_checkbox`, `purchase_checkbox`, `stripe_checkout`, `login_banner`, `reacceptance`            |
| `ui_version`                             | git SHA or build id of the frontend that rendered the screen; pairs with the screenshot set          |
| `stripe_checkout_session_id`, `order_id` | when applicable                                                                                      |

Retention: life of the customer relationship plus the Colorado limitation period for
contract claims (counsel to confirm the period). Expose to the platform owner; let an
`org_admin` export their own org's records (useful for the customer's own CMMC evidence).
Rows are never updated or deleted (reuse the audit app's insert-only grants).

## 7. Marketing website

The website asks for acceptance of nothing. The contact form carries the notice line already
present in `src/components/ContactForm.astro`: "We use the details you provide only to reply
to you. See our Privacy Policy." That is notice, not a contract, and is sufficient.

## 8. Open items

1. Attorney approval of §1, §2, §4 and §5 texts, and the decision on arbitration (Terms §20.3),
   which, if adopted, must be called out conspicuously on the sign-up screen.
2. Website build output `/legal/versions.json` and per-version archive URLs (website workstream).
3. Vendor partner agreements may require specific EULA-presentation language (owner).
4. Whether an `account_owner` role (officer-level) is needed in addition to `org_admin` for
   acceptance of material changes (platform; PLAN.md Appendix A).
5. Confirm the Colorado contract limitation period for consent-record retention (attorney).
6. Platform: accept the `vYYYY.MM.DD.N` form in `VERSION_RE`, pin the `v2026.10.24.2` documents and
   banner, and recompute each pinned `sha256` from the website's sources (§0, §0.1).
7. Penetration testing (Terms §3.6, AUP §5.4): no engagement starts until rules of engagement signed
   for it and the customer's written authorization listing every target are on file. These are
   engagement documents, not website documents; if the platform records their acceptance, it uses
   its own document slug with the engagement id, and counsel approves their text with the rest of
   this spec.
