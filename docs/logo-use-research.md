# Logo-use research: the Experience section

**Researched:** 2026-10-24, for the owner's instruction of 2026-10-23 to show "previous
engagements with the Department of Defense, Maxar Space Systems, The Cyber AB, Boeing, NIST and
the MEP National Network, with their logos". Sources are primary (the mark owner's own policy, the
statute or regulation) unless marked **SECONDARY** (a search-engine excerpt or a news report,
because the primary page refused automated retrieval) or **NOT RETRIEVED** (could not be opened at
all; a person must read it before relying on this file). Quotations are short; read the source
for the full rule.

**This is engineering and marketing-compliance research, not legal advice.** It belongs with
`docs/claims-research.md` in the attorney review (launch gate G1).

**Where it is used.** `src/data/engagements.ts` (one entry per organization, every
`logoApproved: false` and without a `logo`), `src/components/Experience.astro` (Home and About;
off until the owner's confirmation is recorded, gate G18), and claims register rows E1-E6 and F7
(`docs/claims-register.md`). The logo files the owner supplied are not committed: this repository
is public, so `src/assets/engagements/*` is gitignored and the file paths below refer to the
owner's local copies.

## Summary

| Organization (row)         | Show the logo today?                     | Name in text?                                    | What it takes to show the logo                                                                                                      |
| -------------------------- | ---------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Department of Defense (E1) | **No, and not obtainable**               | Yes, factual, no implied endorsement             | Nothing will do: the seal is reserved for official use and DoD has no substitute logo (section 1)                                   |
| Maxar Space Systems (E2)   | No                                       | Yes, with "now Lanteris Space Systems"           | Written permission from the current owner of the mark (unresolved after the 2025 rename and the 2026 acquisition; section 2)        |
| The Cyber AB (E3)          | **No**                                   | Yes, without any suggestion of a Cyber AB status | The Cyber AB's express written consent, and a change to register wording rule 4 (section 3)                                         |
| Boeing (E4)                | No                                       | Yes, factual, no implied endorsement             | Boeing's written permission and trademark agreement, requested through a Boeing representative or trademarks@boeing.com (section 4) |
| NIST (E5)                  | No                                       | Yes, but NIST discourages being named as a user  | NIST's written permission; unlikely, given its impartiality policy (section 5)                                                      |
| MEP National Network (E6)  | No                                       | Yes, factual, no implied government endorsement  | Written permission from NIST MEP: the mark is licensed only to MEP Centers and their subrecipients (section 6)                      |
| Veteran-owned badge (F7)   | **Yes** (generic badge, not an SBA mark) | n/a                                              | Nothing from SBA; confirm the artwork's licence (section 7)                                                                         |

**Rules that apply to every row.**

- **Implied endorsement is the core risk.** The Lanham Act makes a seller liable for a name,
  symbol or device likely to confuse "as to the origin, sponsorship, or approval" of its services
  ([15 U.S.C. 1125(a)](https://www.law.cornell.edu/uscode/text/15/1125)), and the FTC treats an
  implied endorsement like an express one (`docs/claims-research.md` section 1.1). A logo wall
  under a heading such as "Trusted by" or "Clients" is the classic implied endorsement, which is
  why the section says only "Our team has supported programs and organizations including:" and
  carries the note "Names identify the organizations only; listing them does not mean that any of
  them endorses Direwolf Cybersecurity or its services."
- **A name in plain text** is a nominative reference: it identifies the organization and is
  generally allowed when the statement is true, uses no more of the mark than needed (no logo, no
  stylized lettering) and suggests no sponsorship. Every row below keeps that form.
- **The engagement's own contract may restrict even the name.** Defense contracts commonly carry
  [DFARS 252.204-7000](https://www.acquisition.gov/dfars/252.204-7000-disclosure-information.),
  under which the contractor "shall not release to anyone outside the Contractor's organization
  any unclassified information" about the contract without the contracting officer's written
  approval (requested at least 10 business days ahead), and commercial purchase orders and
  subcontracts (Boeing, Maxar) usually have a publicity clause. Where the work was done by a team
  member for a former employer, that employer's contract and the team member's confidentiality
  obligations govern. **Before publishing each name, the owner confirms that no contract or
  confidentiality obligation forbids it** (recorded in each E-row and as the entry's
  `ownerConfirmed`; gate G18 in `docs/launch-runbook.md`, open, so no name is shown yet).
- **Turning a logo on:** file the mark owner's written permission (email or licence) under
  `docs/evidence/`, record it in the row (who granted it, date, scope, conditions such as
  attribution lines or colours), follow the owner's logo standards exactly, then in one change
  commit the logo file (add a `!src/assets/engagements/<file>` line to `.gitignore`), import it
  in `src/data/engagements.ts`, set the entry's `logo` and set `logoApproved: true`. Logos render
  grayscale until hover or focus; if a licence forbids altering colours, render that logo in
  colour (change the component).

## 1. Department of Defense (row E1)

**What the rules say.**

- The seal is created by statute: "The Secretary of Defense shall have a seal for the Department
  of Defense" ([10 U.S.C. 112](https://www.law.cornell.edu/uscode/text/10/112)).
- DoD's Help Center answer "Use of Department of War and/or Military Seals" (published
  2021-09-02, updated 2025-09-05) says the seals are "protected by law and reserved for official
  use only", ties the restriction to 18 U.S.C. 506, and lists "commercial, marketing, advertising
  or promotion use by any nongovernment entity" as unauthorized use
  ([war.gov Help Center](https://www.war.gov/Contact/Help-Center/Article/Article/2762920/use-of-department-of-war-andor-military-seals/);
  **SECONDARY**: the page returns 403 to automated requests, so the wording is from the search
  engine's copy). Official use is DoD's own presentations, letterhead, publications and websites.
- [18 U.S.C. 506](https://www.law.cornell.edu/uscode/text/18/506) criminalizes falsely making
  or knowingly using a "seal of any department or agency of the United States"; [18 U.S.C.
  701](https://www.law.cornell.edu/uscode/text/18/701) covers insignia and their likenesses
  "except as authorized under regulations made pursuant to law".
- DoD's trademark guide for non-federal entities (Community and Public Outreach Division,
  editions of 2015-2017) says the seals may not be used for non-official purposes, that the
  protected marks need prior written permission from the Military Service trademark licensing
  offices, and that "there is no substitute for the Department of Defense Seal"
  ([copy on trademark.marines.mil](https://www.trademark.marines.mil/Portals/161/Docs/DOD%20Trademark%20Licensing%20Guide-16%20July%202017_1.pdf);
  **NOT RETRIEVED**, 403; wording from search excerpts and from university policies that quote
  it, e.g. [Georgia Tech](https://osp.gatech.edu/node/54)).
- The licensing program itself is DoD Instruction 5535.12, "DoD Branding and Trademark
  Licensing Program" (2013-09-13, Change 1 2020-04-29), under 10 U.S.C. 2260, which lets the
  Secretary "license trademarks, service marks, certification marks, and collective marks"
  ([10 U.S.C. 2260](https://www.law.cornell.edu/uscode/text/10/2260);
  [DoDI 5535.12](https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/553512p.pdf),
  **NOT RETRIEVED**, 403). Licensing covers service marks for merchandise; it is not a route to
  displaying the DoD seal on a vendor's website.
- Since Executive Order 14347 (2025-09-05, [90 FR 43893](https://www.federalregister.gov/documents/full_text/text/2025/09/10/2025-17508.txt))
  the department also uses the secondary title "Department of War" (war.gov). The statutory
  name is still Department of Defense, so the owner's wording stands.

**May a vendor show it as a past-engagement logo?** No. The seal is for official use only, a
contractor's marketing page is not official use, and DoD offers no alternative logo. Keep
`logoApproved: false` permanently and do not use any military service emblem as a substitute.

**Permission needed.** None is available for the seal. For the name: the contracting officer's
approval if the contract carried DFARS 252.204-7000 (or the prime's approval, for subcontract
work), and never a contract number, program name or customer office without it.

## 2. Maxar Space Systems (row E2)

**What happened to the company and the mark.**

- On 2025-10-01 Maxar Space Systems became **Lanteris Space Systems** and Maxar Intelligence
  became **Vantor**; both were Advent International portfolio companies
  ([Business Wire, 2025-10-01](https://www.businesswire.com/news/home/20251001023322/en/Lanteris-Space-Systems---A-New-Space-Era-Defense-and-Infrastructure-Solutions-Provider),
  [SpaceNews](https://spacenews.com/maxar-retires-its-name-rebrands-as-vantor-and-lanteris/);
  **SECONDARY**, the release returns 403).
- On 2026-01-13 Intuitive Machines completed its acquisition of "Lanteris Space Systems,
  formerly known as Maxar Space Systems"
  ([Intuitive Machines Form 8-K, Exhibit 99.1](https://www.sec.gov/Archives/edgar/data/1844452/000119312526011200/d89967dex991.htm)).
  On 2026-10-24 `lanterisspace.com` redirected to `intuitivemachines.com`; `maxar.com` did not
  respond; `lanteris.com` is an unrelated site.
- Vantor's site footer lists its own trademarks (Vantor, WorldView and others) and not MAXAR
  ([vantor.com](https://vantor.com/)). **Who now owns the MAXAR word and logo registrations is
  NOT DETERMINED**: check the USPTO record (TSDR) for the MAXAR marks before asking anyone.
- No public logo-use policy for Maxar, Lanteris or Intuitive Machines was found. Without one,
  ordinary trademark law applies: the logo needs the owner's permission.

**May a vendor show it as a past-engagement logo?** Not without written permission, and the
"Maxar Space Systems" logo in `src/assets/engagements/maxar.png` is a retired brand whose owner is
unclear. Showing it in 2026 also risks suggesting a current relationship with a company that no
longer trades under that name. The text card says "Maxar Space Systems" with the note "Now
Lanteris Space Systems" (About page), which is accurate.

**Permission needed.** Written permission from the owner of the MAXAR marks (after the TSDR
check) or, if the owner prefers to show the current company, from Intuitive Machines for the
Lanteris mark, with the card worded "Maxar Space Systems (now Lanteris Space Systems)". Also check
the purchase order or subcontract for a publicity clause.

## 3. The Cyber AB (row E3)

**What the rule says.** The Cyber AB's policy P1001, "Referencing Cyber AB Accreditation and Use
of Accreditation Symbols" (version 1.0, published 2026-01-12), separates its corporate logo from
the status symbols it licenses to authorized and accredited assessment bodies. Section 3.1: the
corporate logo is for The Cyber AB's own materials and "shall not be used by any other entity
without the expressed written consent" of The Cyber AB. Section 3.2: only authorized or
accredited organizations receive the status symbols, and section 4.2.1 bars applicants from
implying any status; section 7 provides for cease-and-desist demands and published notices of
false claims
([P1001, cyberab.org](https://cyberab.org/Portals/0/Documents/ISO17020/P1001-Referencing%20Cyber%20AB%20Accreditation%20and%20Use%20of%20Accreditation%20Symbols%20JAN2026.pdf)).
`docs/claims-research.md` section 3.5 records why The Cyber AB rebranded in 2022: to police
people falsely claiming affiliation.

**May a vendor show it as a past-engagement logo?** No. `src/assets/engagements/cyber-ab.png` is
the corporate logo, which only The Cyber AB may use without its written consent, and Direwolf
holds no Cyber AB status. Register wording rule 4 already forbids Cyber AB logos. The name in
text is allowed only in the Experience list and must not suggest that Direwolf is, or works
with, a C3PAO or RPO or holds any Cyber AB authorization.

**Permission needed.** The Cyber AB's express written consent, and an owner decision to amend
rule 4. Treat the logo as unavailable.

## 4. Boeing (row E4)

**What the rule says.** Boeing's "Logos, Trademarks & Copyrights" page says the Boeing logo
should not be copied for websites or other unapproved materials and that its trademarks "may
only be used with written permission from Boeing". It adds that Boeing does not typically allow
its name or marks to be used in an implicit or explicit endorsement of another company's
products or services, suppliers included. Logo files, brand guidelines and a trademark agreement
go only to approved requesters, through a request submitted by the requester's Boeing
representative ([boeing.com/company/brand](https://www.boeing.com/company/brand)). Boeing's site
terms send licence requests to the Boeing Trademark Management Group at trademarks@boeing.com
([Site Terms](https://www.boeing.com/terms-of-submission-and-privacy-policy/site-terms)).

**May a vendor show it as a past-engagement logo?** Not without Boeing's written permission, and
Boeing's stated practice is to refuse uses that read as an endorsement, which a logo in a vendor's
experience section can. The name in text, with the identification note, is a factual nominative
reference.

**Permission needed.** A written trademark agreement from Boeing, requested through the Boeing
representative for the engagement or trademarks@boeing.com, stating the use (website, Experience
section, grayscale or colour). Check the purchase order or subcontract for a publicity clause
first.

## 5. NIST (row E5)

**What the rules say.**

- NIST's regulation on the use of its results states that "NIST does not approve, recommend, or
  endorse any proprietary product or proprietary material", bars advertising that implies it
  does, and says NIST "discourages references, either in advertising or in the scientific
  literature, which identify it as a user of any proprietary product, material, or service"
  ([15 CFR 200.113](https://www.law.cornell.edu/cfr/text/15/200.113)). NIST's Letter Circular
  1128, "NIST Policy on Use of Its Name in Advertising" (revised July 1995), restates the same
  policy with examples
  ([GovInfo](https://www.govinfo.gov/app/details/GOVPUB-C13-c67eaaa6fe71c6d780c35425a791e0e2)).
- NIST's website notice makes its content public information but grants no right in its name or
  logo, and adds that a mention of a commercial product "does not imply recommendation or
  endorsement by NIST" ([nist.gov/oism/copyrights](https://www.nist.gov/oism/copyrights), last
  updated 2026-06-02).
- NIST's program marks are controlled and licensed only to participants (for example the FIPS
  140 logos, CMVP's
  ["Use of FIPS 140-3 or FIPS 140-2 Logo and Phrases"](https://csrc.nist.gov/Projects/cryptographic-module-validation-program/use-of-fips-140-2-logo-and-phrases)).
  No general public licence for the NIST logo was found. The Department of Commerce's "Logos and
  endorsement" FAQ reportedly requires permission whenever an outside organization uses a
  Commerce logo ([commerce.gov PDF](https://www.commerce.gov/sites/default/files/logos_and_endorsement_-_website_faqs.pdf);
  **NOT RETRIEVED**, 403).

**May a vendor show it as a past-engagement logo?** No. Showing the NIST logo in a vendor's
marketing is the "identify it as a user" reference NIST discourages, and implies endorsement NIST
says it never gives. The name in text is lower risk but still within the policy's concern, so the
card is plain text with the identification note, and nothing on the site may say or imply "NIST
approved", "NIST certified" or "NIST compliant" (register wording rule 1 and rule 4).

**Permission needed.** Written permission from NIST (Office of Public Affairs, or the program
office the work was for). Expect a refusal; the owner may also ask whether NIST objects to the
name being listed at all.

## 6. MEP National Network (row E6)

**What the rule says.** NIST's MEP General Terms and Conditions (2025-06-23), Section B.1,
"Allocation of Rights and License and Use of NIST MEP Trademarks", lists "MEP NATIONAL NETWORK"
(marked TM) and "the interlocking hands marks" among the marks NIST considers its trademarks and
service marks. The licence goes to MEP Centers through their cooperative agreements; it "may be
sub-licensed to the MEP Center's Subrecipients under the same terms and conditions"; licensees
follow NIST MEP's "Guidelines for Using the MEP National Network Brand" (on an internal NIST
SharePoint site: **NOT RETRIEVED**, not public); and licensees must use the marks "in such a way
that there is no appearance of Government endorsement or affiliation"
([NIST MEP General Terms and Conditions, PDF](https://www.nist.gov/system/files/documents/2025/06/25/FY%202025%20-%20NIST%20MEP%20General%20Terms%20and%20Conditions-508.pdf)).
The 15 CFR 200.113 policy in section 5 also applies, since MEP is a NIST program.

**May a vendor show it as a past-engagement logo?** No. Direwolf is neither an MEP Center nor a
subrecipient, so it has no licence, and the licensees themselves may not imply government
endorsement. The name in text is a nominative reference; if the work was for a particular MEP
Center (most MEP engagements are), naming that Center may be more accurate, with the Center's
agreement.

**Permission needed.** Written permission from NIST MEP. A Center cannot grant it to a vendor that
is not its subrecipient.

## 7. Veteran-owned badge (row F7)

`src/assets/brand/veteran-owned-badge.png` is a generic "Veteran Owned Business" shield with a
flag. It is **not** SBA's VetCert certification icon, so SBA's icon rules
(`docs/launch-runbook.md` section 6, "Logo use") do not apply to it, and it makes no claim beyond
"veteran-owned", which register row F1 allows because the owner reports the business is an
SBA-certified Service-Disabled Veteran-Owned Small Business. It appears in the footer, 56 px tall,
beside the ownership statement, with the alt text "Veteran Owned Business".

Open points: the artwork's source and licence are not recorded (owner-supplied 2026-10-23; gate
G19 in `docs/launch-runbook.md`, open); confirm it is licensed for commercial use, or replace it
with in-house artwork or with SBA's own Service-Disabled Veteran-Owned Certified icon under the
runbook's rules once the certificate is filed (gate G3). Never use the VA's former "Verified"
seal.
