# Claims research: what Direwolf may say about compliance, security and itself

**Researched:** 2026-10-23, from primary sources where they could be retrieved (fedramp.gov,
aws.amazon.com, csrc.nist.gov, law.cornell.edu for the CFR, acquisition.gov, ftc.gov,
sba.gov, vendor legal pages) and from law-firm and vendor commentary where the primary
page blocked automated retrieval. Each finding names its source. Items marked
**NOT RETRIEVED** could not be opened by the research tooling and must be checked by a
person before launch. Items marked **SECONDARY** rest on commentary, not the primary text.

**This is engineering and marketing-compliance research, not legal advice.** The
`docs/legal-research.md` and the legal pages go to an attorney before launch; this file
should go with them.

The output of this research is `docs/claims-register.md`. Nothing goes on the site unless
it is in the register.

---

## 0. The four things that changed in 2026 and affect our wording

1. **FedRAMP renamed its designations.** On 2026-05-04 FedRAMP "Changed all designations
   from 'FedRAMP Authorization' to 'FedRAMP Certification'" and moved the impact levels to
   certification Classes A–D; the Consolidated Rules for 2026 (CR26) were released on
   2026-06-24 ([FedRAMP changelog](https://www.fedramp.gov/changelog)). AWS now states
   "AWS GovCloud (US) is FedRAMP Certified Class D (formerly High baseline)" and that the
   JAB P-ATO "is a legacy designation superseded by FedRAMP Certification"
   ([AWS FedRAMP page](https://aws.amazon.com/compliance/fedramp/)). "FedRAMP High
   authorized" is therefore legacy vocabulary. It is still truthful, but the current
   designation is "FedRAMP Certified, Class D (formerly High)". See §2.
2. **DoD suspended CMMC Phase 2.** On 2026-07-13 the Department of War suspended the
   requirement for third-party (C3PAO) Level 2 assessments that was to begin
   2026-11-10, pending a 60-day review; Phase 1 self-assessments and the underlying
   NIST SP 800-171 obligations remain in force. No outcome of the review was found as of
   2026-10-23. Confirmed against the Department of War release and the Cyber AB statement on
   2026-10-23 (§3.4). See §3.
3. **DFARS 252.204-7019 was removed and 7020 renumbered** by class deviation effective
   2026-02-01 (**SECONDARY**; acquisition.gov still displays 7019). See §4.
4. **FIPS 140-2 certificates left the active list** on 2026-09-21/22; only FIPS 140-3
   validations remain active. Both AWS modules we rely on are FIPS 140-3. See §5.

---

## 1. The general rules that apply to every claim on the site

### 1.1 FTC Act section 5: deception and substantiation

- The FTC's deception standard (Policy Statement on Deception, 1983-10-14): a
  representation, omission or practice is deceptive if it is likely to mislead a consumer
  acting reasonably in the circumstances and is material to the consumer's decision.
  Implied claims and the overall "net impression" of a page count, not only literal words.
  Source page: [FTC Policy Statement on Deception](https://www.ftc.gov/legal-library/browse/ftc-policy-statement-deception)
  (the linked PDF was retrieved but is a scanned document; the standard is paraphrased
  here from the Commission's statement, which the attorney should confirm).
- The FTC's substantiation standard: advertisers must "have a reasonable basis for
  advertising claims before they are disseminated"; a claim that implies a level of proof
  ("tests prove") must be backed by that level of proof
  ([FTC Policy Statement Regarding Advertising Substantiation](https://www.ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation)).
- Data-security statements are a recurring FTC enforcement subject; the FTC's business
  guidance cites "50+ data security settlements" (Start with Security) and its case list
  includes Blackbaud, Drizly, Equifax, Zoom, Wyndham and others
  ([FTC data security guidance](https://www.ftc.gov/business-guidance/privacy-security/data-security)).
  Overstating security measures, or not doing what the privacy/security page says, is the
  classic fact pattern.
- AI claims: in "Operation AI Comply" (2024-09-25) the FTC stated "there is no AI
  exemption from the laws on the books" and "Using AI tools to trick, mislead, or defraud
  people is illegal"; the cases targeted unsubstantiated capability and outcome claims
  (for example a "robot lawyer" that was never tested against lawyers)
  ([FTC press release](https://www.ftc.gov/news-events/news/press-releases/2024/09/ftc-announces-crackdown-deceptive-ai-claims-schemes)).

**Implication.** Every objective claim on the site ("every account requires MFA", "alerts
are triaged within a minute", "24x7") needs evidence we hold before publication, and the
page as a whole must not imply more than the register allows (for example, a FedRAMP
sentence next to a Direwolf logo must not leave the impression that Direwolf is certified).

### 1.2 Colorado Consumer Protection Act

- C.R.S. § 6-1-105(1)(b) makes it a deceptive trade practice to knowingly or recklessly
  make "a false representation as to the source, sponsorship, approval, or certification
  of goods, services, or property"; (1)(e) covers representing that services have
  sponsorship, approval or characteristics they do not have. Remedies include actual and
  treble damages and attorney fees; both the Attorney General and private plaintiffs can
  sue. **SECONDARY** (statute text via
  [Justia, 2024 C.R.S.](https://law.justia.com/codes/colorado/title-6/fair-trade-and-restraint-of-trade/article-1/part-1/section-6-1-105);
  the Colorado AG has used (1)(b) in a cease-and-desist,
  [coag.gov](https://coag.gov/app/uploads/2020/05/2020.04.21-Cease-and-Desist.pdf)).
  Direct retrieval of the statute page was blocked; confirm subsection lettering.

**Implication.** "Certified", "authorized", "approved" and "compliant" are exactly the
words this statute targets. They stay off the site unless the register marks them true.

### 1.3 False Claims Act and the DOJ Civil Cyber-Fraud Initiative

- DOJ announced the Civil Cyber-Fraud Initiative on 2021-10-06 to use the False Claims
  Act against contractors and grantees that knowingly misrepresent cybersecurity
  practices or provide deficient cybersecurity products or services
  ([DOJ announcement](https://www.justice.gov/opa/pr/deputy-attorney-general-lisa-o-monaco-announces-new-civil-cyber-fraud-initiative),
  **NOT RETRIEVED**: the page returned empty to the tooling; date and scope are as
  widely reported).
- Settlements that turned on NIST SP 800-171 statements include: Raytheon / RTX /
  Nightwing, $8.4M, 2025-05-01, 29 DoD contracts 2015–2021
  ([DOJ press release](https://www.justice.gov/opa/pr/raytheon-companies-and-nightwing-group-pay-84m-resolve-false-claims-act-allegations-relating));
  MORSECORP (~$4.6M, early 2025); Aero Turbine and its private-equity owner Gallant
  Capital (2025-07-31); Swiss Automation (~$420K, 2025-12-05); Penn State (late 2024,
  alleged misstated implementation timelines); DOJ intervention against Georgia Tech
  ([Arnold & Porter, Dec 2025](https://www.arnoldporter.com/en/perspectives/blogs/fca-qui-notes/posts/2025/12/nist-sp-standards-strike-again);
  [Alston & Bird](https://www.alstonprivacy.com/doj-settles-another-false-claims-act-case-for-alleged-failures-in-implementing-nist-sp-800-171-and-basic-cybersecurity-controls/);
  [Mintz, Jan 2026](https://www.mintz.com/insights-center/viewpoints/2406/2026-01-13-cybersecurity-related-enforcement-under-false-claims-act);
  [GT Law, Aug 2025](https://www.gtlaw.com/en/insights/2025/8/doj-settles-cybersecurity-fca-claims-with-pe-firm-and-government-contractors)).
  A June 2026 matter concerned a "dramatic difference" between a self-reported and a
  DIBCAC-assessed 800-171 score (Arnold & Porter, same blog).

**Implication.** Our customers are defense contractors who will cite Direwolf's
statements in their own SPRS affirmations and assessments, and Direwolf itself may hold
DoD contracts. A website sentence that overstates a control ("FIPS-validated end to end",
"all 110 requirements implemented") can become evidence in a False Claims Act case. The
register is the control that keeps public statements consistent with
`docs/compliance/control-matrix.md` in the platform repo.

---

## 2. FedRAMP

### 2.1 Program vocabulary after the Consolidated Rules for 2026

- fedramp.gov now uses "FedRAMP Certified" throughout and describes the Marketplace as
  "a searchable database of FedRAMP certified cloud services"; 20x Pilot certifications
  became publicly visible on 2026-10-21 ([fedramp.gov home](https://www.fedramp.gov/)).
- Marketplace classes: "Class A (Pilot), Class B (LI-SaaS, Low), Class C (Moderate), or
  Class D (High)"; and "FedRAMP does not grant ATOs"
  ([Marketplace guide](https://www.fedramp.gov/marketplace/guide)).
- Changelog: 2026-05-04 designation rename to "Certification" and classes A–D;
  2026-06-24 "FedRAMP Consolidated Ruleset for 2026 (CR26) is now released!";
  2026-07-17 the Marketplace added a "FedRAMP Certified (In Remediation)" status
  ([changelog](https://www.fedramp.gov/changelog)). The `/definitions/`, `/timeline/`
  and `/rules/` pages returned 404 to the tooling (**NOT RETRIEVED**).
- The legacy Rev5 designations "FedRAMP Ready", "In Process" and "Authorized" were
  defined in the old Marketplace documentation (Ready: a 3PAO attests and FedRAMP accepts
  a Readiness Assessment Report; In Process: actively working toward authorization with
  an agency partner; Authorized: completed the process). The old page is gone
  (**NOT RETRIEVED**, 404); third-party summaries:
  [Security Boulevard](https://securityboulevard.com/2024/05/the-ultimate-guide-to-fedramp-marketplace-designations),
  [Knox Systems](https://knoxsystems.com/resources/fedramp-marketplace-explained).
  Vendor commentary agrees that "FedRAMP compliant", "FedRAMP certified" (before CR26) and
  "FedRAMP equivalent" were never official statuses
  ([Kiteworks](https://www.kiteworks.com/?p=24125)). Under CR26 "FedRAMP Certified" _is_
  the official status, which makes the word "certified" more dangerous for us, not less:
  it now means a specific designation letter and Marketplace listing.

### 2.2 FedRAMP brand use rules (the rules that bind a company that is not listed)

Source: [FedRAMP Brand Use Policy](https://www.fedramp.gov/brand/brand-guidelines/fedramp-brand-use-policy/),
[Brand Guidance for CSPs](https://www.fedramp.gov/brand/brand-guidelines/brand-guidance-for-csps/),
[Brand Standards](https://www.fedramp.gov/brand/brand-guidelines/brand-standards/),
[Disclaimers](https://www.fedramp.gov/disclaimers).

- The FedRAMP name is a GSA trademark; the name and logo "may not be used without GSA's
  express, written permission" (Disclaimers).
- "Non-Federal entities that are not current FedRAMP participants listed on the FedRAMP
  Marketplace" do not have permission to use the FedRAMP name or logo (Brand Use Policy).
- Prohibited: "Suggesting, implying, or stating that products, services, or organizations
  are FedRAMP-certified" (or -authorized, -sponsored, -affiliated) when they are not;
  using "FedRAMP" in a company, product or domain name; confusing composite marks.
- Permitted: "Accurate statements about FedRAMP certification status for specific
  products/services" and "Truthful descriptive references to FedRAMP in marketing
  materials". The policy refers to a "FedRAMP Marketplace Positioning Tips" document that
  could not be found (**NOT RETRIEVED**).
- A provider may call _its own_ product "FedRAMP Certified" only with an official
  designation letter, continued compliance, an independent assessment service and "an
  active listing on the FedRAMP Marketplace" (CSP guidance).
- Certified organizations are responsible for how their "resellers, and partners" use the
  brand; the abbreviation "must always appear as FedRAMP" (Brand Standards).
- Enforcement: FedRAMP monitors use by "integrators, resellers, and partners", contacts
  violators in writing and may require cessation, modification or disclaimers; contacts
  listed are branding@fedramp.gov / brandinginfo@fedramp.gov (Brand Use Policy) and
  branding@gsa.gov (Brand Standards).

**Reading for Direwolf.** Direwolf is not a FedRAMP participant and must never use the
logo. A truthful, attributed, descriptive reference to _AWS's_ status ("AWS GovCloud (US)
is FedRAMP Certified at Class D (formerly High), per AWS") is the kind of "truthful
descriptive reference" the policy permits, and is ordinary nominative use of a fact
published by AWS. The risk is the net impression. Controls adopted in the register:
(1) FedRAMP is mentioned only on the Compliance and Platform pages, never in headlines,
hero text, taglines, page titles or meta descriptions; (2) every mention is attributed to
AWS and immediately followed by the disclaimer that Direwolf itself is not FedRAMP
certified or authorized; (3) no logo, no "FedRAMP" badge graphics; (4) before launch,
email branding@gsa.gov with the exact compliance-page paragraph and keep the reply in
`docs/`. If GSA objects, drop the word and keep "hosted in AWS GovCloud (US)".

### 2.3 What AWS says, and what it does not say

- "AWS GovCloud (US) is FedRAMP Certified Class D (formerly High baseline)"; US East/West
  "is FedRAMP Certified Class C (formerly Moderate baseline)"; "FedRAMP Authorized" was
  "updated to 'FedRAMP Certified'"; the JAB P-ATO "is a legacy designation superseded by
  FedRAMP Certification"; "You can inherit various security controls when using
  FedRAMP-authorized infrastructure, platforms, and services"; agencies "must still issue
  their own Authority to Operate (ATO)"
  ([AWS FedRAMP](https://aws.amazon.com/compliance/fedramp/)).
- Services in scope (page dated 2026-10-15): the Class D (GovCloud) column is checked for
  Amazon Bedrock, Amazon ECS, the Amazon RDS engines, Amazon S3, AWS KMS, Amazon SQS,
  Amazon SES, AWS WAF, AWS Secrets Manager and Amazon CloudWatch; the legend reads "This
  service is FedRAMP Certified and included in the current FedRAMP Certification
  boundary"; the page adds "It is part of the shared responsibility for your organization
  to determine the nature of the data"
  ([AWS services in scope: FedRAMP](https://aws.amazon.com/compliance/services-in-scope/FedRAMP/)).
  The tooling did not find a separate "Elastic Load Balancing" row; confirm the ALB's
  in-scope status in AWS Artifact before the SSP cites it.
- GovCloud also holds a DoD Cloud Computing SRG Provisional Authorization for IL2, IL4 and
  IL5 workloads, is "Accessible only to vetted root accountholders who are US Persons",
  "Managed solely by vetted US Citizens", and "Allows customers [to] meet compliance
  requirements, including ... ITAR" ([AWS GovCloud DoD SRG](https://aws.amazon.com/govcloud-us/dodsrg)).
- Shared responsibility: "AWS is responsible for protecting the infrastructure that runs
  all of the services offered in the AWS Cloud"; "Customer responsibility will be
  determined by the AWS Cloud services that a customer selects"
  ([AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)).
- Amazon Bedrock in GovCloud is FedRAMP Class D in scope (same AWS page); the platform
  repo's `docs/integrations/bedrock-govcloud-notes.md` records per-model status and a
  conflict about IL4/IL5 for Claude models. The website does not need model-level claims;
  "AI analysis runs on Amazon Bedrock inside the same AWS GovCloud (US) boundary" is
  enough and is only true once the production environment exists.

**Reading for Direwolf.** AWS's certification covers AWS's infrastructure and services.
Nothing about running on GovCloud makes the Direwolf Platform certified, authorized,
IL4/IL5, ITAR-compliant or "FedRAMP equivalent". PLAN.md §8 and ADR 0003 say the same.
A DoD impact level is a DoD mission-owner decision and is never claimed for Direwolf.
ITAR compliance is an export-control posture (US-persons staffing, data handling) that
Direwolf has not established as a policy; do not claim it.

### 2.4 Deployment reality check

`infra/README.md` in the platform repo: "nothing has been applied yet because the GovCloud
account does not exist", and ADR 0003: "The GovCloud account does not exist yet". The
hosting, FIPS, encryption and Bedrock claims are therefore **planned** in the register with
a launch gate (production applied in `us-gov-west-1`), even though the owner's brief
states them in the present tense. They become "true today" the day the environment is
live; the launch runbook must verify it.

---

## 3. CMMC (32 CFR part 170 and DFARS 252.204-7021)

### 3.1 Official statuses and definitions (32 CFR 170.4, via Cornell LII)

Source: [32 CFR 170.4](https://www.law.cornell.edu/cfr/text/32/170.4) (eCFR itself
redirected the tooling to a bot-check page).

- "CMMC Status is the result of meeting or exceeding the minimum required score for the
  corresponding assessment." The only statuses are: Final Level 1 (Self); Conditional
  Level 2 (Self); Final Level 2 (Self); Conditional Level 2 (C3PAO); Final Level 2
  (C3PAO); Conditional Level 3 (DIBCAC); Final Level 3 (DIBCAC). Status "is officially
  stored in SPRS" and shown "on a Certificate of CMMC Status, if the assessment was
  conducted by a C3PAO or DCMA DIBCAC".
- "Level 2 certification assessment is the term for the activity performed by a C3PAO".
  So "CMMC certified" can only truthfully describe an organization holding Conditional or
  Final Level 2 (C3PAO) (or Level 3) status in SPRS. "CMMC ready", "CMMC aligned",
  "CMMC compliant" and "Level 2 ready" are not statuses; "compliant" is also the word
  the Colorado statute and the FTC care about.
- External Service Provider: "external people, technology, or facilities that an
  organization utilizes for provision and management of IT and/or cybersecurity services
  on behalf of the organization"; "CUI or Security Protection Data (e.g., log data,
  configuration data), must be processed, stored, or transmitted on the ESP assets to be
  considered an ESP."
- Security Protection Data: "data stored or processed by Security Protection Assets (SPA)
  that are used to protect an OSC's assessed environment", including "log files generated
  by or ingested by an SPA, data related to the configuration or vulnerability status of
  in-scope assets".
- Affirming Official: the OSA's senior representative who affirms continuing compliance.

### 3.2 What an ESP/CSP like Direwolf must do (32 CFR 170.19(c)(2), Table 4)

Source: [32 CFR 170.19](https://www.law.cornell.edu/cfr/text/32/170.19).

- CSP that processes, stores or transmits CUI: "The CSP shall meet the FedRAMP
  requirements in 48 CFR 252.204-7012" (i.e., FedRAMP Moderate authorization or the DoD
  CIO equivalency path).
- CSP or non-CSP ESP that handles **SPD but no CUI**: "The services provided by the CSP
  are in the OSA's assessment scope and shall be assessed as Security Protection Assets".
- "A service provider that does not process CUI or SPD does not meet the CMMC definition
  of an ESP."
- 170.19(c)(2)(ii): the OSA documents the ESP relationship; the ESP's "service description
  and customer responsibility matrix (CRM)" describe both parties' responsibilities; "the
  ESP may voluntarily undergo a CMMC certification assessment"; "The minimum assessment
  type for the ESP is dictated by the OSA's DoD contract requirement."
- DFARS 252.204-7012's CSP clause (FedRAMP Moderate baseline "or equivalent") and the DoD
  CIO FedRAMP Moderate Equivalency memo of 2023-12-21 (3PAO assessment of 100 % of the
  Moderate baseline, body of evidence to DIBCAC): memo **NOT RETRIEVED** (dodcio.defense.gov
  blocks automated access); summaries at
  [Cloud Security Alliance](https://cloudsecurityalliance.org/articles/fedramp-moderate-equivalency-for-cloud-service-providers-explained)
  and [Schellman](https://www.schellman.com/blog/federal-compliance/fedramp-moderate-equivalency-for-csps-explained).

**Reading for Direwolf.** Phase 1 of the platform holds SPD (alerts, sensor inventory,
triage notes), not CUI (`docs/compliance/customer-responsibility-matrix.md`). As an SPD-only
ESP Direwolf is assessed inside each customer's scope as a Security Protection Asset and
must supply a service description and a CRM; it does not need FedRAMP Moderate. The site
must say plainly that the platform is not for CUI storage, and must not describe any
"CUI repository" as available (PLAN.md §8, Phase 6). Direwolf may pursue a _voluntary_
C3PAO Level 2 assessment of its own environment; until it holds a status, the words are
"preparing for" / "pursuing".

### 3.3 The contract clause and the implementation schedule

- DFARS 252.204-7021 "Contractor compliance with the Cybersecurity Maturity Model
  Certification level requirements (NOV 2025)": contractors must "Have and maintain for
  the duration of the contract a current CMMC status" at the specified level for all
  systems processing FCI or CUI, keep an annual affirmation of continuous compliance in
  SPRS, report CMMC UIDs, and flow the clause down; Conditional statuses are current for
  180 days, Final Level 2 for three years with annual affirmation
  ([acquisition.gov, DFARS 252.204-7021](https://www.acquisition.gov/dfars/252.204-7021-cybersecurity-maturity-model-certification-requirements.),
  page shows "DFARS Change 5/7/2026").
- The 48 CFR rule was published 2025-09-10 and effective 2025-11-10, with phases: Phase 1
  (self-assessments) 2025-11-10; Phase 2 (Level 2 C3PAO as condition of award)
  2026-11-10; Phase 3 2027-11-10; Phase 4 2028-11-10
  ([Cooley](https://www.cooley.com/news/insight/2025/2025-09-25-dod-releases-long-awaited-final-rule-implementing-cybersecurity-maturity-model-certification-contract-clause),
  [National Law Review](https://natlawreview.com/article/dont-fall-behind-cmmc-final-rule-update-dfars-here?amp)). **SECONDARY** for dates.

### 3.4 The July 2026 suspension of Phase 2

- On 2026-07-13 the Department of War announced "the immediate suspension of Phase II"
  through a CMMC Reform Memo and an implementing memo (reported as dated 2026-07-10 and
  signed by CIO Kirsten Davies); during the review program offices may require only
  "Level 1 (Self) or Level 2 (Self) assessments" and may not designate C3PAO or DIBCAC
  assessments; "All Phase 1 self-assessment requirements remain firmly in place";
  DFARS 252.204-7012, NIST SP 800-171 Rev. 2 and 252.204-7021 obligations continue;
  contractors "may voluntarily obtain a C3PAO assessment"; a 60-day Reform Task Force
  review followed and an RFI closed 2026-08-14
  ([Latham & Watkins](https://www.lw.com/en/insights/what-defense-contractors-should-know-about-dod-suspension-of-cmmc-phase-2),
  [Skadden](https://www.skadden.com/insights/publications/2026/07/dow-suspends-cmmc-phase-ii),
  [Jenner & Block](https://www.jenner.com/en/news-insights/client-alerts/department-of-war-suspends-cmmc-phase-iibut-compliance-obligations-remain-as-does-enforcement-risk)).
  The memos themselves are **NOT RETRIEVED** by scripted fetches (war.gov, dowcio.war.gov
  and media.defense.gov answer HTTP 403 to automated tooling).
- **Primary-source check, 2026-10-23 (register row C2; launch runbook gate G10).**
  - Department of War release, "Forging the Arsenal of Freedom: Department of War Suspends
    CMMC Phase II Requirements", 2026-07-13,
    <https://www.war.gov/News/Releases/Release/Article/4542329/forging-the-arsenal-of-freedom-department-of-war-suspends-cmmc-phase-ii-require/>
    (mirror: <https://business.defense.gov/Engage/News/Article/4542563/forging-the-arsenal-of-freedom-department-of-war-suspends-cmmc-phase-ii-require/>),
    **read in full in a browser on 2026-10-23**: "the immediate suspension of the
    Cybersecurity Maturity Model Certification (CMMC) Phase II requirements, which were
    originally scheduled to come into effect on November 10, 2026. All Phase I
    self-assessment requirements remain firmly in place"; "Effective immediately, the
    Department will suspend the transition to Phase II requirements of CMMC, as well as
    pending and future CMMC implementation milestones across the Department of War
    solicitations and contracts"; a CMMC Reform Task Force will deliver "their final report
    to the DoW CIO within 60 days"; "During this interim period, the Department will enforce
    cybersecurity compliance with the NIST SP 800-171 Rev 2 standard through self-assessments
    and select government-led assessments"; contractors "remain contractually obligated to
    safeguard covered defense information in accordance with DFARS clause 252.204-7012".
    Quoted officials: DoW CIO Kirsten A. Davies; Under Secretary of War for Acquisition and
    Sustainment Michael Duffey.
  - DoW CIO implementing memo,
    <https://dowcio.war.gov/Portals/0/Documents/Library/ImplementingSuspensionCMMC-PhaseII.pdf>,
    and reform memo, <https://dowcio.war.gov/Portals/0/Documents/Library/CMMC-ReformMemo.pdf>
    (search-engine extracts only; the PDFs refuse scripted download): program managers "may
    request only Level 1 (Self) or Level 2 (Self) assessments, and may not designate CMMC
    Level 2 (C3PAO) or Level 3 (DIBCAC) assessments during this period", and solicitations
    carrying those requirements are to be amended. Phase 2 of the DFARS CMMC rule was the
    Level 2 (C3PAO) condition of award (§3.3), which is why the Compliance page calls the
    suspended requirement "third-party (C3PAO) Level 2 assessments".
  - DoW CMMC FAQ, 2026-08-26,
    <https://media.defense.gov/2026/Aug/26/2003986826/-1/-1/0/CYBERSECURITYMATURITYMODELCERTIFICATIONFAQS.PDF>
    (search-engine extract): the suspension of Phases 2 and 3 "do not change the
    requirements of Phase I, which continues to be a current, valid requirement".
  - Cyber AB, "Statement on the Department of War's Suspension of CMMC Phase II
    Requirements", 2026-07-15,
    <https://cyberab.org/News-Events/Press-Releases/statement-on-the-department-of-wars-suspension-of-cmmc-phase-ii-requirements>
    (PDF <https://www.cyberab.org/Portals/0/Documents/CyberABStatementOnDoWPhaseIISuspension-15JUL2026.pdf>,
    **retrieved in full**): acknowledges "Monday's Pentagon announcement of its suspension of
    CMMC Phase II requirements and the establishment of a CMMC Reform Task Force to conduct
    a 60-day review of the program" and emphasises "that only Phase II implementation
    requirements have been suspended and that all CMMC program elements remain operational
    and available, to include C3PAO Level 2 certification assessments".
  - DoW CIO "About CMMC" page, <https://dodcio.defense.gov/cmmc/About/>, **read in full in a
    browser on 2026-10-23**: "On July 13, 2026 the DoW suspended the implementation of Phase
    II of the CMMC and established a CMMC reform task force. During this period the DoW will
    enforce cybersecurity compliance with NIST 800-171 Rev 2 through self-assessments and
    select government-led assessments"; "The CMMC Program is paused in Phase 1 and may only
    require self-assessments at two levels"; the status table lists only Level 1 (Self) and
    Level 2 (Self), so the pause is still in effect on 2026-10-23.
  - Federal Register: no 2026 document amending 32 CFR part 170 or DFARS 252.204-7021 was
    found (federalregister.gov search, 2026-10-23); the suspension was made by memorandum,
    not by rule. No published outcome of the 60-day review (nominally due in mid-September 2026) was found on war.gov, dodcio.defense.gov or cyberab.org.
  - **Conclusion:** the Compliance-page sentence in register row C2 ("In July 2026 the
    Department of War suspended the requirement for third-party (C3PAO) Level 2 assessments
    while it reviews the CMMC program; self-assessment requirements remain in force") is
    confirmed by primary sources and stays. Re-check at launch (gate G10) and whenever the
    Compliance page is edited; a person should also open the two DoW CIO memos in a browser
    and file copies under `docs/evidence/`.

**Reading for Direwolf.** "Pursuing CMMC Level 2 certification" remains truthful (C3PAO
assessments are voluntary and available) but the Compliance page should state the
suspension in one neutral sentence so the claim is not read as "required of us and done".

### 3.5 The Cyber AB and the CMMC marks

- The Cyber AB (legal name: Cybersecurity Maturity Model Certification Accreditation Body,
  Inc.) rebranded in June 2022 partly because its old logo mirrored "the government CMMC
  logo, which is unprotected intellectual property", leaving it "unable to effectively
  police the unauthorized use" by people falsely claiming authorization or certification
  ([Cyber AB](https://cyberab.org/d1-cyber-ab); [press release](https://cyberab.org/News-Events/Press-Releases/cmmc-accreditation-body-is-now-the-cyber-ab)).
  C3PAO and RPO status is verifiable in the public Marketplace
  ([cyberab.org/Catalog](https://cyberab.org/Catalog)). The Code of Professional Conduct
  (v2.0) binds ecosystem members (RPOs, C3PAOs, credentialed individuals) and bars
  representing oneself in ways not aligned with one's authorization; the current PDF was
  **NOT RETRIEVED**. The DoD CMMC FAQ and Level 2 Assessment Guide (v2) are at
  dodcio.defense.gov and were **NOT RETRIEVED** (403).

**Reading for Direwolf.** Direwolf is neither an RPO nor a C3PAO; it must not use the Cyber
AB marks, the CMMC logo, "Registered Provider Organization" or any phrase suggesting it
is part of the assessment ecosystem. "Compliance guidance for NIST 800-171 / CMMC" is an
ordinary consulting description and is fine; "CMMC consultant" is fine; "we get you
certified" is not (only a C3PAO assessment does).

---

## 4. NIST SP 800-171, self-assessment and SPRS language

- NIST SP 800-171 Rev. 2 was withdrawn by NIST on 2024-05-14 and superseded by Rev. 3
  ([NIST CSRC](https://csrc.nist.gov/pubs/sp/800/171/r2/upd1/final)), but CMMC and
  DFARS continue to incorporate Rev. 2 (32 CFR 170.4 lists "NIST SP 800-171 R2"; DoD's
  July 2026 memo again names Rev. 2). The site should say "NIST SP 800-171 Rev. 2" where
  it names a revision, and simply "NIST SP 800-171" elsewhere.
- NIST does not certify: "NIST does not provide certification for Information Technology
  (IT) systems, products, or modules"; it runs validation programs (CMVP, CAVP) through
  accredited labs ([NIST compliance FAQ, updated 2024-07-03](https://www.nist.gov/standardsgov/compliance-faqs-nist-it-security-validation-program)).
  There is no "NIST certification" and no "NIST 800-171 certification". Formal
  recognition of 800-171 implementation comes only through DoD's CMMC statuses or a DCMA
  DIBCAC assessment.
- SPRS: the official vocabulary is the CMMC Status list in §3.1 and, for the legacy DoD
  Assessment Methodology, a summary score "for example, 95 out of 110" posted to SPRS
  ([acquisition.gov, DFARS 252.204-7019 (NOV 2023) as displayed](https://www.acquisition.gov/dfars/252.204-7019-notice-nist-sp-800-171-dod-assessment-requirements.)).
  **SECONDARY, important:** DFARS class deviation 2026-O0025, effective 2026-02-01,
  removed 252.204-7019 and renumbered 252.204-7020 to 252.240-7997, dropping the
  stand-alone "Basic" self-assessment in favour of CMMC self-assessments; 252.204-7012
  and 252.204-7021 did not change
  ([Summit 7](https://summit7.us/blog/why-the-rfo-ended-dfars-7019-and-7020);
  Latham, above, confirms the 7020 renumbering). acquisition.gov still displays 7019,
  so the attorney should confirm against the DPC class-deviation list before the
  Compliance page cites either clause.
- Wording that is defensible before any assessment: "aligned to", "designed to meet",
  "implements the applicable requirements of", "maintains a System Security Plan and
  POA&M against". Wording that is not: "compliant", "certified", "fully implemented",
  "110/110", "meets all NIST requirements", "NIST approved".

---

## 5. FIPS 140: "validated" versus "compliant"

### 5.1 CMVP rules

Source: [CMVP FAQ](https://csrc.nist.gov/Projects/cryptographic-module-validation-program/faqs).

- P-18: "FIPS 140-3 'compliant' means a vendor believes its product implementation meets
  the FIPS 140-3 requirements" but "the product has not gone through the CMVP validation
  process." SG-7: "The correct ... term is validated."
- P-17: "A product which uses an embedded validated cryptographic module cannot claim
  itself to be validated; only that it utilizes an embedded validated cryptographic
  module"; vendors "may use the phrase 'FIPS 140-[2 or 3] Inside'".
- SG-7/SG-8: ask for the certificate number and check it against the CMVP entry; "If they
  do not agree, the vendor is not offering a validated solution." A validated module is
  only validated "when operated in approved mode".
- CL-4: "FIPS 140-2 validated modules will remain on the active list through September 21, 2026. On September 22, 2026, only FIPS 140-3 module validations will remain on the
  active list." (Also [NIST FIPS 140-3 transition page](https://csrc.nist.gov/Projects/FIPS-140-3-Transition-Effort).)
- CMMC practice SC.L2-3.13.11 "Employ FIPS-validated cryptography when used to protect the
  confidentiality of CUI": "Simply using an approved algorithm is not sufficient"; "the
  module (software and/or hardware) used to implement the algorithm must be separately
  validated under FIPS 140" ([NDISAC CyberAssist](https://ndisac.org/dibscc/cyberassist/cybersecurity-maturity-model-certification/level-2/sc-l2-3-13-11/),
  reproducing the DoD assessment guide discussion; the guide PDF is **NOT RETRIEVED**).

### 5.2 The two AWS modules the platform relies on

- **TLS termination at the ALB.** The platform's listener policy is
  `ELBSecurityPolicy-TLS13-1-2-FIPS-2023-04` (`infra/modules/alb/variables.tf`). AWS:
  "All FIPS policies leverage the AWS-LC FIPS validated cryptographic module", linking
  CMVP certificate #4631; the `TLS13-1-1-FIPS` and `TLS13-1-0-FIPS` variants "are
  provided for legacy compatibility only"; backend (ALB-to-target) connections for a FIPS
  policy use `ELBSecurityPolicy-TLS13-1-0-FIPS-2023-04`
  ([ALB security policies](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/describe-ssl-policies.html)).
  Certificate #4631: AWS-LC Cryptographic Module, FIPS 140-3, overall Level 1, Active,
  validated 2023-10-06 (updated 2025-06-27), sunset 2028-10-05, caveat "When operated in
  approved mode" ([CMVP #4631](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/4631)).
- **Key management.** Certificate #4884: AWS Key Management Service HSM, FIPS 140-3,
  overall Level 3, Active, validated 2024-11-18, sunset 2029-11-17, caveat "Interim
  validation" and no assurance for externally loaded keys
  ([CMVP #4884](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/4884)).
  AWS: "AWS KMS uses HSMs that are FIPS 140-3 Level 3 validated or in the process of
  validation" and the modules "operate exclusively in FIPS-approved mode when providing
  functionality to KMS"; "FIPS endpoints provide encryption in-transit using
  FIPS-validated cryptographic libraries" ([AWS FIPS](https://aws.amazon.com/compliance/fips/)).
  (One search summary showed a 2026 sunset for #4884; the certificate page itself says
  2029-11-17. Re-check the CMVP entry at launch.)
- **FIPS endpoints for AWS API calls**: `use_fips_endpoint = true` in
  `infra/envs/prod/providers.tf`, `AWS_USE_FIPS_ENDPOINT=true` in `infra/modules/ecs/main.tf`
  and `backend/direwolf/settings/base.py`, enforced by `backend/apps/core/aws.py` and
  tested in `backend/tests/test_health.py`.
- **Application-level cryptography** (PBKDF2-SHA256 password hashing, TOTP, HMAC-signed
  tokens) uses Python's OpenSSL bindings, which are not a validated module in our build.
  PLAN.md §6.13 deliberately scopes CUI protection to the AWS modules above. The site
  must therefore never say "all cryptography is FIPS validated" or "FIPS-validated end to
  end".

**Reading for Direwolf.** Approved pattern: "Data in transit is protected with TLS 1.2+
terminated by a FIPS 140-validated module (AWS-LC, CMVP #4631); data at rest is encrypted
with keys held in AWS KMS hardware security modules validated to FIPS 140-3 Level 3
(CMVP #4884)." Never "FIPS compliant", "FIPS certified platform", "Direwolf is FIPS
140 validated". Both certificates are FIPS 140-3, so the September 2026 sunset of 140-2
does not affect us. All of this is **planned** until production is applied (§2.4).

---

## 6. Reselling SentinelOne and NinjaOne

- SentinelOne Trademark Usage Guidelines: "You may not use our Trademarks unless you have
  a written agreement with SentinelOne" or written permission; "You may not mislead anyone
  to think that your products or services are somehow offered, endorsed or sponsored by
  SentinelOne"; "Do not place your company name, trademarks, service marks or product
  names immediately next to (or combined with) our Trademarks"; do not alter logos; include
  ® / ™; licensees also follow their license agreement; questions to legal@sentinelone.com
  ([SentinelOne TM guidelines](https://www.sentinelone.com/legal/tm-guidelines/)).
- NinjaOne: "NinjaOne trademarks and logos may not be used without prior, written
  permission from NinjaOne"; third-party use "is limited to authorized users" under the
  logo guidelines; partner-program participants follow the program's trademark license;
  marks carry "XYZ is a trademark of NinjaOne, LLC." ([NinjaOne trademarks](https://www.ninjaone.com/trademarks/));
  the partner finder describes "Authorized NinjaOne reseller partners"
  ([NinjaOne partner finder](https://www.ninjaone.com/partner-finder/)); the current
  partner program is "NinjaOne Now" (2024)
  ([NinjaOne press](https://www.ninjaone.com/press/ninjarmm-launches-new-partner-program-equips-technology-resellers-with-industry-leading-endpoint-management-solution)).
- PLAN.md §10 Phase 0 and §14.4: the SentinelOne partner application and the NinjaOne
  partner relationship are owner-only steps that have not happened; the platform repo's
  README confirms no partner console exists.

**Reading for Direwolf.** Until a signed reseller/partner agreement exists for each vendor:
no logos, no "authorized partner/reseller", no "available through Direwolf", and no
product naming in purchase flows. Plain-word references to the vendors as the EDR and
endpoint-management products the platform integrates with are nominative and truthful
(the SentinelOne integration is in PLAN.md and in design), but the register still keeps
vendor names off the Services and Home pages until the agreements are signed, to avoid
implying endorsement. After signing, use the vendor's partner trademark license and keep
the ® / ™ and attribution lines.

---

## 7. "Veteran-owned"

- VOSB: "Not less than 51 percent owned and controlled by one or more veterans who reside
  in the United States" and a small business under 13 CFR part 121
  ([13 CFR 128.200](https://www.law.cornell.edu/cfr/text/13/128.200)).
- Certification through SBA's VetCert is required to "compete for federal sole-source and
  set-aside contracts"; "there is no self-certification provision" for VA set-asides; the
  self-certification grace period for subcontracting/goaling ended 2024-12-22
  ([SBA veteran contracting programs](https://www.sba.gov/federal-contracting/contracting-assistance-programs/veteran-contracting-assistance-programs)).
- Misrepresentation: SBA proposes decertification and IG referral for "false or misleading
  information" and may recommend government-wide debarment
  ([13 CFR 128.310](https://www.law.cornell.edu/cfr/text/13/128.310)); willful
  misrepresentation of status carries a statutory presumption of loss equal to the contract
  value, trebled under the False Claims Act, and has produced criminal convictions
  ([Arnold & Porter on VetCert](https://www.arnoldporter.com/en/perspectives/advisories/2022/12/veteran-small-business-certification-program),
  [SmallGovCon](https://smallgovcon.com/service-disabled-veteran-owned-small-businesses/false-sdvosb-certification-results-in-criminal-conviction/)).

**Reading for Direwolf.** "Veteran-owned" as a plain description is lawful when the
company is at least 51 % owned and controlled by a veteran (confirm against the cap
table). **Owner statement 2026-10-23 (CLAUDE.md "Owner facts"):** Direwolf holds SBA VetCert
certification as a Service-Disabled Veteran-Owned Small Business, so register row F1 now
approves "Service-Disabled Veteran-Owned Small Business (SDVOSB), SBA certified" on the
owner's statement; the certificate, or the SAM.gov entity record showing the
certification, must be filed under `docs/evidence/` before launch (the repository becomes
public at launch, so file the public SAM.gov record or a redacted certificate). "VA-verified"
is wrong: verification moved from VA's CVE to SBA on 2023-01-01. PLAN.md §14.3 still carries
the older "veteran-owned only" rule and should be read with this note.

**SBA icon rules (retrieved 2026-10-23).** SBA's brand page for SBA-certified businesses
([sba.gov/brand/for-partners/sba-certified-businesses](https://www.sba.gov/brand/for-partners/sba-certified-businesses))
says active participants in the 8(a), WOSB/EDWOSB, HUBZone and Veteran Small Business
Certification (VetCert) programs "are eligible to use the icons"; the icons "may be used
on business websites, business cards, and social media profiles" and on capability
statements and proposal bids; they "may not be used on company letterhead, marketing
materials, or advertising" (including paid ads and public service announcements in digital
or traditional media) and "may not be used to express or imply endorsement of any goods,
services, entities, or individuals"; a business that is no longer certified "must
discontinue using SBA icons". The icon pack
([decals and web icons](https://www.sba.gov/document/brand-guide-decals-web-icons), zip
dated 2024-05-09) contains separate "Service-Disabled Veteran-Owned Certified" and
"Veteran-Owned Certified" icons. The site shows no icon today; the rules are summarised in
`docs/launch-runbook.md` ("Logo use") for the day it does.

---

## 8. "Equal opportunity employer"

- Executive Order 14173 (2025-01-21) rescinded EO 11246, the affirmative-action order
  that carried the OFCCP job-advertisement tagline requirement; employers still keep EEO
  language in postings ([MSU HR FAQ](https://hr.msu.edu/ua/hiring/eo-14173-faqs.html)).
  Section 503 (disability) and VEVRAA (protected veterans) obligations for covered federal
  contractors remain, with OFCCP enforcement resumed under Secretary's Order 08-2025
  (2025-07-07) ([Proskauer](https://www.proskauer.com/blog/secretary-of-labor-issues-order-detailing-next-steps-for-ofccp-enforcement),
  [Holland & Knight](https://www.hklaw.com/en/insights/publications/2025/03/a-look-at-changes-to-department-of-labor-office-of-federal)). **SECONDARY.**
- Federal coverage thresholds: Title VII, ADA and GINA apply at 15 or more employees,
  ADEA at 20 ([EEOC coverage](https://www.eeoc.gov/employers/coverage), threshold page
  **NOT RETRIEVED**; figures are the statutory ones). Colorado's Anti-Discrimination Act
  defines "employer" as the state, its subdivisions and "every other person employing
  persons in the state" (C.R.S. § 24-34-401(3)), so state law applies to Direwolf from
  its first hire; secondary summaries differ on a two-employee threshold
  ([Brownstein](https://bhfs.com/insights/alerts-articles/2022/recent-changes-to-colorado-s-employment-discrimination-laws)). **SECONDARY**; statute page blocked.

**Reading for Direwolf.** "Direwolf Cybersecurity is an equal opportunity employer" is a
lawful, voluntary statement that must be true in practice: adopt a one-page EEO policy
(the Careers/About page and the footer EEO statement should match it) and do not use the
old "M/F/D/V" or "affirmative action employer" formulas, which describe programs Direwolf
does not run. If Direwolf becomes a covered federal contractor, Section 503/VEVRAA posting
language becomes mandatory; revisit then.

---

## 9. AI SOC, "24x7" and capability claims

- FTC substantiation (§1.1) applies to every capability statement: "analyst-quality",
  "within about a minute", "contains confirmed threats automatically", "24x7".
- What PLAN.md actually promises: AI triage of every alert with a schema-validated verdict
  (§6.11), autonomous containment through SentinelOne under deterministic guardrails with
  one-click undo (ADR 0005), a single human analyst working a review queue (§2, §6.11),
  SentinelOne's on-device policy as the containment backstop. Human review is not
  24x7-staffed; the AI pipeline runs continuously. None of M4–M5 is built yet
  (`backend/apps/` has no triage or integrations app).

**Reading for Direwolf.** Say what the system does and who reviews it: "Every alert is
triaged automatically, around the clock. A Direwolf analyst reviews the AI's decisions and
takes the cases it cannot decide." Never "24x7 human-staffed SOC", "24/7 analysts",
"guaranteed response time", "stops all threats", "zero false positives", "replaces your
security team", or performance numbers until measured in production. "AI SOC" is a product
name and is fine with that explanation beside it.

---

## 10. Payments and PCI

- Stripe "is certified annually by an independent PCI Qualified Security Assessor (QSA) as
  a PCI Level 1 Service Provider"; "low risk" integrations "securely collect and transmit
  payment information directly to Stripe without it passing through your servers, reducing
  your PCI obligations" ([Stripe integration security guide](https://docs.stripe.com/security/guide)).
  PLAN.md §14.4: Stripe Checkout, "card data never touches Direwolf (PCI DSS SAQ A)".

**Reading for Direwolf.** Approved: "Payments are processed by Stripe. Direwolf never sees
or stores card numbers." Not approved: "PCI certified", "PCI compliant platform",
"bank-grade security". Status: planned (Phase 2).

---

## 11. The website itself

- The website is on GitHub Pages, outside the GovCloud boundary (PLAN.md §14.1; ADR 0003
  lists public DNS and CI as the only things outside the boundary; the marketing site holds
  no customer data). Nothing on the site may imply the _website_ is in GovCloud or covered
  by any of the platform's controls.
- No third-party scripts, fonts or analytics and no non-essential cookies (CLAUDE.md), so
  "we do not track you" style statements are true once CI enforces them.
- Accessibility: WCAG 2.1 AA is the build target (CLAUDE.md); until an audit is recorded,
  say "built to WCAG 2.1 AA" / "we aim to meet", never "fully accessible", "ADA compliant"
  or "WCAG certified" (there is no WCAG certification).

---

## 12. Open items to close before launch (also listed in the register)

1. Production applied in `us-gov-west-1`; ALB FIPS policy, KMS keys and FIPS endpoints
   confirmed live (converts the hosting/FIPS/encryption rows to "true today").
2. Email branding@gsa.gov with the Compliance-page FedRAMP paragraph; file the reply.
3. Confirm the outcome of DoD's CMMC review (post-September 2026) and update §3.4 and the
   Compliance page sentence.
4. Confirm DFARS class deviation 2026-O0025 (7019/7020) on the DPC class-deviation list.
5. Re-check CMVP #4631 and #4884 status and sunset dates; confirm ALB in-scope status in
   AWS Artifact.
6. Signed SentinelOne and NinjaOne agreements before any vendor name appears on Services,
   Home or in purchase flows.
7. Cap-table confirmation of at least 51 % service-disabled-veteran ownership and control;
   SBA VetCert certificate or SAM.gov entity record filed under `docs/evidence/` with the
   reference recorded in register row F1.
8. One-page EEO policy adopted; business mailing address (PO box or registered agent) added
   to `src/config.ts`, the Privacy Policy and the Terms; legal entity type confirmed.
9. Attorney review of this file, the register and the legal pages.
