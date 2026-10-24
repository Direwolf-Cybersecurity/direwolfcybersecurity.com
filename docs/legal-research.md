# Legal and compliance research: website and platform sign-up flow

**Prepared:** 2026-10-23 for Direwolf Cybersecurity (Colorado Springs, CO).
**Status:** research memo for attorney review. Nothing here is legal advice; every legal
page it leads to is a _draft for attorney review_ (see `CLAUDE.md`).
**Scope:** a U.S. B2B cybersecurity SaaS company incorporated in Colorado, selling to U.S.
small and mid-size businesses and to DoD contractors, with a static marketing site on
GitHub Pages (`www.direwolfcybersecurity.com`) and a separate platform
(`app.direwolfcybersecurity.com`) hosted in AWS GovCloud (US).

How to read this document:

- **Required** = a statute, regulation or contract that applies to Direwolf today (or will at
  launch) says so. **Advisable** = not legally compelled, but standard practice, expected by
  customers or assessors, or materially reduces risk. **N/A** = checked and does not apply.
- **UNVERIFIED** marks a point I could not confirm against a primary source in this pass;
  treat it as a question for counsel, not a fact.
- Citations are in square brackets and resolve to the numbered source list in §10. Where a
  primary source blocked automated retrieval, I say so and cite the secondary source used.
- Facts about Direwolf come from the owner and from the platform plan (`direwolf-platform/PLAN.md`
  §§2, 6.11, 6.13, 7, 8, 10, 14). Nothing about people, customers, numbers or certifications
  has been invented; the claims rules in `CLAUDE.md` and PLAN §14.3 govern wording.

Summary of what is actually _required_ (everything else is advisable):

| Requirement                                                                                                          | Why                                                                                    | Section |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------- |
| Conspicuous privacy policy with specific contents and an effective date                                              | CalOPPA applies to any commercial site collecting PII from California residents        | 1.1     |
| Reasonable security for personal identifying information, flowed down to vendors; written disposal policy            | Colorado C.R.S. 6-1-713 and 6-1-713.5 apply to every covered entity regardless of size | 1.1.5   |
| Breach notification within 30 days (AG at 500+ residents)                                                            | C.R.S. 6-1-716                                                                         | 1.1.5   |
| CAN-SPAM mechanics on every marketing email (B2B included)                                                           | 15 U.S.C. 7701 et seq.; 16 CFR 316                                                     | 1.6     |
| Accessible website and app (standard not codified for private companies; WCAG 2.1 AA is the de facto benchmark)      | ADA Title III per DOJ guidance                                                         | 1.5     |
| Truthful, substantiated marketing and security claims                                                                | FTC Act §5; Colorado Consumer Protection Act                                           | 6       |
| PCI DSS validation (SAQ A) once card payments start                                                                  | card-network rules via the Stripe agreement                                            | 5.1     |
| Auto-renewal disclosures, renewal reminders, one-step online cancellation                                            | C.R.S. 6-1-732 (B2B reach UNVERIFIED, see 1.7.3)                                       | 1.7.3   |
| Enforceable assent to Terms/AUP/Privacy at sign-up (if you want the terms to bind)                                   | contract law; see case law in §2                                                       | 2       |
| Payment-card, PHI, CUI and export-controlled data must not enter the platform until the service is approved for them | PCI, HIPAA, DFARS 7012/CMMC, ITAR/EAR                                                  | 4.4     |

---

## 1. Website legal pages: required vs. advisable

### 1.1 Privacy policy: **Required**

#### 1.1.1 CalOPPA (California Online Privacy Protection Act), Cal. Bus. & Prof. Code §§ 22575-22579

Applies to any "operator of a commercial Web site or online service that collects personally
identifiable information through the Internet about individual consumers residing in
California who use or visit" the site [S1]. There is no size or revenue threshold, and a
website that is reachable from California and collects a name or email (the contact form, the
sign-up form) is covered. The policy must be "conspicuously" posted and must [S1]:

1. identify the categories of PII collected and the categories of third parties with whom it
   may be shared;
2. describe any process for a consumer to review and request changes to their PII (if one
   exists);
3. describe how consumers are notified of material changes;
4. state its **effective date**;
5. disclose how the site responds to browser **Do Not Track** signals (technically only when
   the operator tracks across third-party sites; include the statement anyway: "we do not track
   visitors across third-party websites and do not respond to DNT signals because there is
   nothing to opt out of");
6. disclose whether third parties may collect PII about a consumer's online activities over
   time and across sites.

A violation occurs only if the operator fails to post a compliant policy within 30 days of
notice of noncompliance [S1], so this is low-penalty, but it is the one page that is
unambiguously required by statute for this site.

Implementation notes: the "Last updated" line satisfies (4). Because legal pages are versioned
(`vYYYY.MM.DD`), state in the policy that changes are announced by a new version date and, for
platform users, by in-app notice (ties to (3) and to §2.4).

#### 1.1.2 Colorado Privacy Act (CPA), C.R.S. 6-1-1301 to 6-1-1313: **Not applicable at launch; follow it anyway**

Applies to a controller that conducts business in Colorado or targets Colorado residents _and_
either (a) controls or processes personal data of **100,000 or more consumers** in a calendar
year, or (b) derives revenue or a price discount from the **sale** of personal data and
processes data of **25,000 or more consumers** [S2]. There is no revenue-only threshold.
"Consumer" means a Colorado resident "acting only in an individual or household context" and
**excludes** "an individual acting in a commercial or employment context, as a job applicant,
or as a beneficiary of someone acting in an employment context" [S3]. Direwolf's customers,
their employees and website visitors acting for their employers are therefore outside the
definition; only genuinely individual visitors count, and the 100,000 threshold is far away.

Even so, the privacy policy should be written to the CPA notice standard because it costs
nothing and Colorado customers' counsel will look for it. Under C.R.S. 6-1-1308(1) a privacy
notice must be "reasonably accessible, clear, and meaningful" and include: the categories of
personal data collected or processed; the purposes for each category; how consumers exercise
their rights (including contact information and how to appeal a decision on a request); the
categories of personal data shared with third parties and the categories of those third
parties; and, if the controller sells personal data or uses it for targeted advertising, a
clear and conspicuous disclosure and the way to opt out [S4]. Purpose specification and data
minimization are in 6-1-1308(2)-(3); sensitive data (which includes **citizenship or
citizenship status**, as well as health, biometric and children's data) needs prior consent
under 6-1-1308(7) [S4][S3]. Note the citizenship point: if the platform ever asks users to
attest to U.S.-person status for export-control reasons (§4.5), that attestation is "sensitive
data" for any user who is a "consumer"; platform users act in a commercial context so the CPA
should not reach it, but keep the field optional, explain why it is asked, and do not use it
for anything else.

Rights: opt out of targeted advertising, sale and profiling; access; correction; deletion;
portability; 45-day response (extendable once) [S5]. **Universal opt-out mechanism:** effective
**July 1, 2024**, a controller that processes personal data for targeted advertising or sale
must honor a user-selected universal opt-out mechanism (the Attorney General's shortlist
includes Global Privacy Control) [S5][S6]. Direwolf does neither, so there is nothing to honor;
state in the policy that the site sets no tracking cookies, sells no data, and that GPC
signals therefore require no action.

**Data protection assessments** (C.R.S. 6-1-1309) are required only before processing that
"presents a heightened risk of harm": targeted advertising or risky profiling, sale of personal
data, or processing sensitive data; the AG may request the assessment [S7]. None of these is
planned. If a sensitive-data field (citizenship attestation) is ever added for individuals who
could be "consumers", do the assessment first.

Enforcement: Attorney General and district attorneys only; a violation is a deceptive trade
practice under the Colorado Consumer Protection Act; the 60-day cure right **expired January 1,
2025**; no private right of action [S8]. Penalties under the Colorado Consumer Protection Act
run up to $20,000 per violation [S9]. Amendments since enactment: biometric data (HB 24-1130,
effective July 1, 2025) and minors' data (SB 24-041, effective October 1, 2025) [S10]; rules at
4 CCR 904-3 (the AG's CPA rules page blocked retrieval in this pass; the rule text is at the
Colorado Secretary of State's CCR site).

#### 1.1.3 CCPA / CPRA (California): **Not applicable at launch**

A "business" is one that meets any of: annual gross revenue above the inflation-adjusted
threshold (**$26,625,000** effective January 1, 2025, adjusted in odd-numbered years under
Civ. Code 1798.199.95(d)); annually buys, sells or shares personal information of **100,000 or
more** consumers or households; or derives **50 percent or more** of annual revenue from
selling or sharing personal information [S11][S12]. Direwolf meets none of these. When it
does, add the CCPA-specific notices (notice at collection, "Do Not Sell or Share" link if ever
relevant, categories tables, rights and 12-month look-back). Until then, the CalOPPA policy
plus the CPA-grade contents above are sufficient for California.

Other state comprehensive privacy laws have similar structures and thresholds (Virginia,
Connecticut, Utah, Texas and roughly a dozen more as of 2025 [S10]); most exclude individuals
acting in a commercial or employment context, as Colorado does. Texas's law has no numeric
threshold but exempts SBA-defined small businesses from most obligations (UNVERIFIED in this
pass; confirm if Texas customers are targeted).

#### 1.1.4 What the privacy policy must actually disclose for this stack

Specific facts to disclose, because they are true today or at launch:

- **GitHub Pages logging.** GitHub states that when a GitHub Pages site is visited, "the
  visitor's IP address is logged and stored for security purposes," whether or not the visitor
  is signed in to GitHub [S13]. GitHub is therefore a hosting provider that receives visitor IP
  addresses; name it. (GitHub also states Pages is "not intended for or allowed to be used as a
  free web hosting service to run your online business" or a site primarily directed at
  commercial transactions or commercial SaaS [S14]; a marketing site with the transactions and
  the SaaS on `app.` is the normal pattern, but keep checkout, login and any paid functionality
  off the GitHub-hosted site. Flag this to the owner: if GitHub ever objects, the site must
  move to S3/CloudFront or similar.)
- **Contact form.** Data goes to the platform endpoint `/api/v1/public/contact` and is emailed
  through Amazon SES, or by mailto fallback (PLAN §14.1); say what is collected, why, and how
  long it is kept.
- **No cookies, no analytics, no third-party scripts** on the marketing site (`CLAUDE.md`);
  one essential session cookie on the platform (see 1.4).
- **Platform data categories** (account data, organization data, endpoint telemetry and alert
  data from SentinelOne/NinjaOne, audit logs, consent records, billing identifiers from Stripe)
  with purposes and retention, and the subprocessor list in §4.2.
- **AI processing.** Alerts are processed by a foundation model on Amazon Bedrock inside AWS.
  AWS states that with Bedrock "your content is not used to improve the base models and is not
  shared with any model providers," that inputs and outputs are not used to train Amazon or
  third-party models, and that content is encrypted and stored in the Region where Bedrock is
  used [S15]; model providers have no access to customer prompts and completions [S16]. Say
  this plainly; it is a frequent customer question.
- **Children.** The services are for business users; no one under 18 may create an account
  (relevant to COPPA and to Colorado's minors amendments; both then do not apply).
- **Rights and contact.** A privacy contact address, how to request access/deletion, and the
  appeal route (CPA style).
- **Do Not Track / GPC** statement (1.1.1, 1.1.2).
- **International.** The services are offered in the United States and data is stored in AWS
  GovCloud (US). If the company ever targets EU/UK customers, GDPR Art. 3(2) and the UK GDPR
  would apply and a separate review is needed (not fetched in this pass; flag only).

#### 1.1.5 Colorado's data-security and breach laws: **Required, regardless of size**

These are separate from the CPA and have **no thresholds**:

- **C.R.S. 6-1-713.5** requires a covered entity that "maintains, owns, or licenses personal
  identifying information of an individual residing in the state" to "implement and maintain
  reasonable security procedures and practices that are appropriate to the nature" of the
  information and the size of the business, and, when it discloses PII to a **third-party
  service provider**, to require that provider to implement reasonable security "appropriate to
  the nature of the personal identifying information disclosed" and "reasonably designed to
  help protect the personal identifying information from unauthorized access" [S17]. This is a
  contractual flow-down duty: the subprocessor agreements with AWS, Stripe, SentinelOne and
  NinjaOne satisfy it in practice, and the customer agreement should impose it on Direwolf as
  the customer's provider.
- **C.R.S. 6-1-713** requires a written policy for the disposal of documents containing PII
  (summarized from law-firm sources; the AG's page blocked retrieval) [S18].
- **C.R.S. 6-1-716** requires notice of a security breach to affected Colorado residents "not
  later than thirty days after the date of determination that a security breach occurred," with
  prescribed contents (date or date range, description of the information, contact details,
  consumer reporting agency and FTC contacts, fraud-alert and security-freeze guidance); notice
  to the **Attorney General** when the breach "is reasonably believed to have affected five
  hundred Colorado residents or more"; and notice to nationwide consumer reporting agencies when
  more than **1,000** residents are notified [S19]. "Personal information" includes name plus
  SSN, ID numbers, medical or health-insurance information, biometric data, and also login
  credentials that permit account access [S19]. Platform usernames plus passwords (hashed, but
  still) are in scope.

These feed the incident-notification clause in §4.3 and the platform IR runbook.

### 1.2 Terms of Service / customer agreement: **Advisable (and the only way the contract terms in §4 bind anyone)**

No statute requires a website to have terms. They matter because (a) the platform's customer
agreement, limitation of liability, autonomous-response authorization and reseller pass-through
only work if they are contractually accepted (§2), and (b) the DMCA designated-agent safe harbor
(17 U.S.C. 512) is irrelevant here because the platform does not host user-generated public
content. Recommend two documents: short **Website Terms of Use** for the marketing site
(no-warranty, IP, acceptable use, governing law) and a fuller **Customer Agreement / Platform
Terms of Service** accepted at sign-up and incorporated into Stripe Checkout (§5.2). Contents in
§4 and §4.11.

### 1.3 Acceptable Use Policy: **Advisable**

Serves three purposes: it defines "authorized" use (which supports CFAA-based remedies and the
system-use banner in §3), it gives suspension grounds, and it is the document a safe-harbor
vulnerability policy carves an exception from (§7.3: disclose.io's full safe harbor includes
"exemption from violating the organization's own terms of service or acceptable use policy
during security testing" [S20]). Keep it a separate, versioned document so it can change
without re-papering the whole agreement.

### 1.4 Cookie notice when only essential cookies are used: **Notice page advisable; banner not required**

- **United States:** no federal or Colorado/California statute requires a cookie banner. The
  CPA and CCPA regulate cookies only as personal data used for targeted advertising, sale or
  profiling (opt-out rights, GPC) [S5][S11]; a session cookie needed to keep a user logged in is
  none of those. CalOPPA requires the DNT/third-party-tracking disclosures in the privacy policy
  [S1], not a banner.
- **EU/UK (if ever relevant):** the ePrivacy Directive (2002/58/EC, Art. 5(3)) requires consent
  for storage or access on a user's device except where "strictly necessary" to provide a
  service the user requested; an authentication session cookie is the textbook example of the
  exemption (not fetched in this pass; standard reading).
- **What to publish:** a `/legal/cookies` page listing each cookie by name, purpose, lifetime
  and whether it is essential: the marketing site sets none; the platform sets a session cookie
  (Secure, HttpOnly, not persistent per PLAN §7 3.1.18) and a CSRF cookie. State that no
  consent banner is shown because there is nothing optional to consent to, and that the page
  will change if analytics or embedded third-party content is ever added. "Cookie preferences"
  can simply link to this page.

### 1.5 Accessibility statement, ADA Title III and WCAG 2.1 AA: **Accessibility required; statement advisable; ACR advisable for government-adjacent sales**

- The Department of Justice's March 18, 2022 guidance states that the ADA's Title III
  requirements apply to "all the goods, services, privileges, or activities offered by public
  accommodations, including those offered on the web," names WCAG and the Section 508 standards
  as helpful guidance, and acknowledges that DOJ has not issued a Title III web regulation, so
  businesses have flexibility in how they comply [S21]. Courts have reached the same result
  (Robles v. Domino's Pizza, 913 F.3d 898 (9th Cir. 2019), cert. denied; not re-fetched in this
  pass). Because there is no private-sector technical standard in regulation, the practical
  benchmark is WCAG 2.1 AA: it is the standard DOJ adopted for state and local governments in
  its April 24, 2024 Title II rule (compliance dates since extended by an April 20, 2026 interim
  final rule to April 26, 2027 for governments of 50,000+ and April 26, 2028 for smaller ones)
  [S22], it is the standard Colorado adopted for its own public entities under HB 21-1110
  (which applies to state and local government, not private businesses) [S23], and it is what
  plaintiffs' experts test against. `CLAUDE.md` already mandates WCAG 2.1 AA for the site; the
  platform should hold the same bar.
- **Accessibility statement.** W3C recommends a statement that at minimum pledges accessibility,
  names the standard and conformance level, and gives a way to report problems; optionally lists
  known limitations, measures taken, technical requirements and the testing environment, and
  provides a generator [S24]. Publish at `/accessibility`.
- **Accessibility Conformance Report (VPAT).** Federal solicitations that include ICT "will
  specify accessibility requirements," and GSA recommends vendors prepare an ACR (built from the
  ITI VPAT template) for any ICT they plan to market to the government [S25]. Direwolf sells to
  contractors rather than agencies, but primes and some state/local customers will ask. Mark
  as a launch-plus item.

### 1.6 CAN-SPAM for marketing email: **Required**

The FTC's compliance guide lists the obligations: accurate header and routing information;
non-deceptive subject lines; identification of the message as an advertisement; a valid
**physical postal address**; a clear opt-out mechanism; opt-outs honored within **10 business
days** with the mechanism working for at least 30 days after sending; no fee or extra
information demanded to opt out; and responsibility for anyone who sends on your behalf. The
law "makes no exception for business-to-business email," and penalties run up to **$53,088 per
separate email** [S26]. Transactional or relationship messages (receipts, security alerts,
account notices) are exempt from most requirements but must not have false routing information
[S26].

Implementation: the platform's SES-sent transactional mail (alerts, invoices, invitations) is
exempt; any newsletter or promotional mail needs an unsubscribe link, the postal address
(placeholder in `src/config.ts` until the owner supplies it), and a suppression list. Stripe
also requires separate consent before sending promotional email through Checkout [S27]. If SMS
notifications arrive in Phase 2, the TCPA (47 U.S.C. 227) requires prior express consent for
automated texts; collect it in-app (not fetched in this pass; standard requirement). Colorado's
own commercial-email statute (C.R.S. 6-1-702) is largely preempted by CAN-SPAM; UNVERIFIED and
not relied on.

### 1.7 Other Colorado-specific items

#### 1.7.1 Colorado Consumer Protection Act, C.R.S. 6-1-105

Deceptive trade practices include false representations about the characteristics, benefits or
certifications of services. This is the state counterpart to FTC Act §5 (§6) and the vehicle
for CPA enforcement [S8][S9]. The claims register discipline in `CLAUDE.md` is the control.

#### 1.7.2 Colorado's AI law: **Likely N/A; monitor**

The 2024 Colorado AI Act (SB 24-205) was repealed and replaced by **SB 26-189**, signed May 14,
2026, which enacts the Colorado Automated Decision-Making Technology Act effective **January 1,
2027**. It applies to developers and deployers of ADMT that "materially influence[s]" a
**consequential decision** (education, employment, housing, financial/lending, insurance,
healthcare, essential government services); it drops the original law's risk-management,
impact-assessment and "you are interacting with AI" disclosure duties; the AG enforces with a
60-day cure period; there is no private right of action [S28][S29]. The AG published draft ADMT
rules on August 11, 2026 with a hearing on October 26, 2026 [S30]. An AI SOC that triages
endpoint alerts and quarantines files does not make consequential decisions about Colorado
consumers, so the Act should not apply; keep labeling automated verdicts "Direwolf SOC
(automated)" (PLAN §6.11) because it is honest and costs nothing. Re-check when the final rules
publish.

#### 1.7.3 Automatic renewal contracts, C.R.S. 6-1-732: **Treat as required**

The statute requires a seller making an automatic renewal offer to present the offer terms
"in a clear and conspicuous manner" before the contract is executed (renewal term, recurring
charges, cancellation policy, minimum purchase, and that the contract renews for a term not to
exceed one year without express written consent); to send a renewal reminder "at least
twenty-five and no more than forty days before the first automatic renewal" and before each
later renewal (different timing for terms under 12 months); and to provide a "simple,
cost-effective, timely, easy-to-use, and readily accessible mechanism for canceling," with a
one-step online cancellation link deemed compliant [S31]. **SB 25-145** (signed June 3, 2025,
effective August 6, 2025) requires an online cancellation option whenever consent was given
online and allows retention offers only if the cancel link stays visible [S32].

**UNVERIFIED conflict:** the statute text I retrieved defines "consumer" as an individual
acquiring goods or services for personal, family or household purposes [S31], which would put
B2B subscriptions outside the law, while a law-firm summary states SB 25-145 extended coverage
to businesses [S33]. Counsel should read the enacted text of SB 25-145. The recommendation does
not change: Stripe Billing can send renewal reminders and the Stripe customer portal provides
one-step online cancellation, and the FTC and other states point the same direction (the FTC's
2024 "click-to-cancel" rule was vacated by the Eighth Circuit in July 2025, UNVERIFIED in this
pass, but state laws remain). Build it in from day one.

#### 1.7.4 Job postings (if a careers page is added)

Colorado's Equal Pay for Equal Work Act (C.R.S. 8-5-201, as amended effective January 1, 2024)
requires every job posting to include the compensation range, a general description of benefits
and the application deadline (the CDLE page blocked retrieval; not re-verified in this pass).
Colorado's Anti-Discrimination Act applies to employers of any size. See §6.4 for the EEO
statement itself and §4.5 for how to word U.S.-person requirements without citizenship
discrimination.

### 1.8 Pages this research implies for the footer

Privacy Policy · Terms of Service (website) · Customer Agreement / Platform Terms · Acceptable
Use Policy · Cookie Notice · Accessibility · Security and Responsible Disclosure (plus
`/.well-known/security.txt`) · Compliance (claims and status) · Equal Opportunity statement ·
Subprocessors · Contact (with postal address once available). PLAN §14.2 already lists these.

---

## 2. Enforceable online consent

### 2.1 Case law: what courts enforce and what they refuse

| Case                                                                            | Design at issue                                                                                                                                                                             | Result                                                                                                                                                                        | Lesson                                                                                                                        |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| _Specht v. Netscape_, 306 F.3d 17 (2d Cir. 2002) (not re-fetched; classic case) | Terms linked below the fold of a download page; user never saw them                                                                                                                         | Not enforceable                                                                                                                                                               | Terms must be visible before the action that supposedly accepts them.                                                         |
| _Nguyen v. Barnes & Noble_, 763 F.3d 1171 (9th Cir. 2014)                       | **Browsewrap**: "Terms of Use" link in the footer; no click required                                                                                                                        | Not enforceable; proximity of a link to a button is not enough without notice or an act of assent [S34][S35]                                                                  | Browsewrap does not bind users.                                                                                               |
| _Meyer v. Uber Technologies_, 868 F.3d 66 (2d Cir. Aug. 17, 2017)               | Registration screen stated that by creating an account the user agrees to the Terms of Service; "Terms of Service" underlined, blue, hyperlinked, on the same screen as the Register button | Enforceable: "reasonably conspicuous" notice and unambiguous assent by clicking Register [S36]                                                                                | A clean sign-in-wrap can work if the notice is next to the button and the link looks like a link.                             |
| _Berman v. Freedom Financial Network_, 30 F.4th 849 (9th Cir. Apr. 5, 2022)     | Tiny gray text with a hyperlink in the same color as surrounding text; a "Continue" button that said nothing about terms                                                                    | Not enforceable; two-part test: (1) reasonably conspicuous notice and (2) action that unambiguously manifests assent; the text was "the antithesis of conspicuous" [S37][S38] | Font, contrast, link styling and button wording all matter.                                                                   |
| _Oberstein v. Live Nation_, (9th Cir. Feb. 13, 2023)                            | Users confirmed agreement to the Terms of Use at three stages of account creation; link conspicuous                                                                                         | Enforceable under the _Berman_ test [S39]                                                                                                                                     | Repeated, conspicuous confirmation at natural decision points is robust.                                                      |
| _Chabolla v. ClassPass_, (9th Cir. Feb. 27, 2025, 2-1)                          | Three screens; notice on screen 1 far from the "Continue" button and outside the user's natural flow; buttons said "Continue"/"Redeem now"                                                  | Not enforceable; notice not reasonably conspicuous and progressing through screens did not unambiguously manifest assent [S40][S41]                                           | Button text must signal agreement; distance from the action defeats notice; clickwrap and scrollwrap give the most certainty. |

The consistent rule: **a clickwrap (unchecked box or a button whose label references the terms,
with conspicuous links on the same screen) is enforced; browsewrap is not; sign-in-wrap is
enforced only when the notice is conspicuous and adjacent to the act of assent.** The Ninth
Circuit (which covers California, where many SaaS disputes land) is the strictest.

Unilateral changes: terms that let the provider change them "at any time" without notice are
not binding on existing users without notice of the change (_Douglas v. U.S. District Court
(Talk America)_, 495 F.3d 1062 (9th Cir. 2007); not re-fetched). Material changes need notice
and fresh acceptance (§2.4).

### 2.2 Electronic signatures and records

- **E-SIGN**, 15 U.S.C. 7001(a): a signature, contract or record "may not be denied legal
  effect, validity, or enforceability solely because it is in electronic form." §7001(d)(1):
  an electronic record satisfies a retention requirement if it "accurately reflects the
  information set forth in the contract or other record" and "remains accessible to all persons
  who are entitled to access" for the required period [S42]. (§7001(c)'s consumer-disclosure
  consent rules apply to consumer transactions where another law requires a writing; not
  triggered by B2B sign-up.)
- **Colorado UETA**, C.R.S. 24-71.3-107: a record or signature may not be denied legal effect
  solely because it is electronic; an electronic record satisfies a writing requirement and an
  electronic signature a signature requirement [S43].

A checked box plus a stored record is an electronic signature. The evidentiary burden is on
Direwolf to show _what the user saw_ and _what they did_, which drives the record-keeping below.

### 2.3 What the sign-up UI must look like

1. **Unchecked checkbox** (never pre-checked) immediately above the submit button, with the
   label: "I have read and agree to the Direwolf Cybersecurity **Customer Agreement**
   (v2026.xx.xx), **Acceptable Use Policy** (v2026.xx.xx) and **Privacy Policy**
   (v2026.xx.xx)." Each document name is a real hyperlink (underlined, link color, 4.5:1
   contrast) that opens the exact version in a new tab. Showing the version number on the
   screen is what lets the stored record be tied to the text the user saw.
2. **Button text that references the act**: "Create account and accept terms" (not "Continue").
   Disable the button until the box is checked; show an error message on submit if unchecked.
3. **Same screen, natural flow**: the notice sits between the last form field and the button,
   not in the footer, not on a prior screen, not below the fold on mobile (Chabolla, Berman).
4. **Readable**: same font size as form labels, normal contrast; no gray-on-gray.
5. **Separate consents**: marketing email opt-in (if offered) is its own unchecked box;
   never bundle it with the terms (CAN-SPAM, Stripe's promotional-consent rule [S27]).
6. **Organization authority**: a line under the box: "You confirm you are authorized to bind
   [Organization name] to these terms." Add an "Authorized representative name and title"
   field; the person signing up becomes `org_admin` (PLAN §14.4) and may not be an officer.
7. **Accessibility**: real `<label for>` on the checkbox, the error text tied with
   `aria-describedby`, keyboard-operable, focus visible.
8. **Export-control and prohibited-data attestation** (§4.4) as a second, separate unchecked
   box at sign-up: "I will not upload Controlled Unclassified Information, export-controlled
   technical data (ITAR/EAR), protected health information or payment card data to the
   platform unless Direwolf has agreed in writing that the service is approved for it." This
   both creates a contractual representation and gives the user a real notice.
9. **Stripe Checkout** repeats the acceptance at purchase: set
   `consent_collection[terms_of_service]=required` so Checkout "dynamically displays a checkbox"
   and records `consent.terms_of_service = accepted` on the session; customize the label with
   `custom_text[terms_of_service_acceptance]` ("I agree to the [Customer Agreement](...)"); the
   Terms of Service URL must be set in the Stripe Dashboard public details first, and a Privacy
   Policy URL is optional but linked when set [S27]. Capture the accepted flag from the
   `checkout.session.completed` webhook into the same consent table.
10. **Marketing site** never asks for acceptance of anything except in the contact form, where a
    line "By sending this message you agree to our Privacy Policy" with a link is enough (it is
    notice, not a contract).

### 2.4 Records to keep

PLAN §14.4 already specifies `ConsentRecord(user, document, version, accepted_at, ip,
user_agent)`. Recommended full schema, append-only like the audit log:

| Field                                                                           | Why                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user_id`, `org_id`                                                             | who bound whom                                                                                                                                                                                                                               |
| `document_slug` (terms, aup, privacy, banner, prohibited-data)                  | which document                                                                                                                                                                                                                               |
| `document_version` (`vYYYY.MM.DD`) and `document_sha256`                        | ties the record to the exact text; keep every published version's source and rendered HTML in the website repo and a copy in the platform database so the text can be produced years later (E-SIGN 7001(d) accuracy and accessibility [S42]) |
| `accepted_at` (UTC, from the server clock)                                      | when                                                                                                                                                                                                                                         |
| `ip`, `user_agent`, `locale`                                                    | corroborates identity and the device                                                                                                                                                                                                         |
| `method` (`signup_checkbox`, `login_banner`, `stripe_checkout`, `reacceptance`) | what act of assent                                                                                                                                                                                                                           |
| `ui_version` or `screenshot_ref`                                                | which rendering of the consent screen; keep a dated screenshot of the sign-up screen for every UI change and every document version (courts decide these cases on screenshots of the flow: Berman, Chabolla, Meyer)                          |
| `stripe_checkout_session_id` (when applicable)                                  | links to Stripe's own `consent.terms_of_service` evidence [S27]                                                                                                                                                                              |

Retention: for the life of the customer relationship plus the limitations period for contract
claims in the governing-law state (confirm the Colorado period with counsel). Expose the
records to the platform owner and let an org admin download their own org's records (useful for
their CMMC evidence too).

**Changes:** never edit a published version; publish a new version, show a notice at next login
("Our Customer Agreement changed on <date>; summary of changes; [Review] [Accept]"), and record
a new `ConsentRecord` with `method = reacceptance`. For non-material changes, notice without
re-acceptance is defensible, but re-acceptance is the safe default. Email the org admins when a
version changes (transactional message, CAN-SPAM-exempt).

### 2.5 Login-time acknowledgements the platform should show

1. The **system-use banner** before credentials are entered, retained until the user clicks
   "I acknowledge" (§3); record it (`document_slug = banner`).
2. **Updated-terms interstitial** when a document version is newer than the user's last
   acceptance (§2.4).
3. **MFA enrollment** interstitial on first login (PLAN §7 3.5.3), not a legal consent but a
   control.
4. No "cookie consent" on login: the session cookie is essential (§1.4).

---

## 3. The system-use notification banner

### 3.1 What the frameworks require

- **NIST SP 800-171 Rev 2, 3.1.9** (the version DoD and CMMC use): "Provide privacy and
  security notices consistent with applicable CUI rules." The discussion says system use
  notifications "can be implemented using messages or warning banners displayed before
  individuals log in to organizational systems," apply to logon interfaces with human users,
  and that the Office of General Counsel reviews and approves the banner content [S44]. CMMC
  Level 2 practice identifier is AC.L2-3.1.9 (32 CFR 170 references NIST SP 800-171 Rev 2
  [S45]). The assessment objectives in NIST SP 800-171A are that the notices are identified and
  associated with the CUI category and that they are displayed (not re-fetched; from the
  published assessment guide).
- **NIST SP 800-171 Rev 3, 03.01.09:** "Display a system use notification message with privacy
  and security notices consistent with applicable CUI rules before granting access to the
  system" [S46]. DoD has not adopted Rev 3 for DFARS 7012 or CMMC (class deviation of May 2,
  2024 pins Rev 2) [S47].
- **NIST SP 800-53 Rev 5, AC-8:** display a notification before granting access that states
  users are accessing a government system (for federal systems), that usage may be monitored,
  recorded and subject to audit, that unauthorized use is prohibited and subject to criminal and
  civil penalties, and that use indicates consent to monitoring and recording; **AC-8 b:
  "Retain the notification message or banner on the screen until users acknowledge the usage
  conditions"** and take explicit action to log on; AC-8 c covers publicly accessible systems;
  the guidance has legal counsel review the banner [S48]. 800-171 itself does not require
  acknowledgement; 800-53 does. The plan's choice to require acknowledgement at every login
  (PLAN §14.4) exceeds the 800-171 minimum and matches AC-8, which is what FedRAMP-aligned
  customers expect. Keep it.
- **The DoD banner is not for us.** The DoD CIO's May 9, 2008 memorandum mandates the
  "Standard Mandatory DoD Notice and Consent Banner" on **DoD information systems**; its text
  begins "You are accessing a U.S. Government (USG) Information System (IS) that is provided for
  USG-authorized use only" and consents to USG interception, inspection and seizure [S49][S50].
  A commercial platform that displayed that text would be misrepresenting itself as a government
  system. Customers' own 800-171 scopes may require _their_ banner on _their_ endpoints; that is
  theirs, not Direwolf's.

### 3.2 What a commercial platform serving DoD contractors should display

Elements: (1) private system, authorized users only; (2) monitoring, logging and audit, and
that use constitutes consent; (3) unauthorized access prohibited, with reference to civil and
criminal law (18 U.S.C. 1030 and state computer-crime law); (4) an explicit statement that it
is **not** a U.S. Government system; (5) the prohibited-data reminder (no CUI/ITAR/PHI unless
agreed); (6) links to the Privacy Policy and Acceptable Use Policy; (7) an acknowledgement
control. Show it before the username field, retain until acknowledged, and record the
acknowledgement (§2.4). Review the text with counsel before launch (AC-8 guidance [S48]).

### 3.3 Suggested banner text (draft for counsel)

Full version:

> **Notice to users.** This is a private computer system owned and operated by Direwolf
> Cybersecurity [legal entity name] and provided for authorized users only. It is **not a U.S.
> Government information system.**
>
> By continuing you acknowledge and agree that:
>
> - Your use of this system may be monitored, recorded and audited, and the resulting records
>   may be used for security, operational, legal and compliance purposes, including to help our
>   customers meet NIST SP 800-171 and CMMC requirements, and may be disclosed as required by
>   law.
> - Unauthorized access or use is prohibited and may result in suspension or termination of
>   access and in civil and criminal penalties under the Computer Fraud and Abuse Act
>   (18 U.S.C. § 1030) and state law.
> - You will not upload Controlled Unclassified Information, export-controlled technical data
>   (ITAR/EAR), protected health information or payment card data unless your agreement with
>   Direwolf expressly permits it.
> - Your use is governed by the Customer Agreement, Acceptable Use Policy and Privacy Policy
>   [links, with versions].
>
> [ I acknowledge ]

Short version (for narrow screens or API tokens):

> Private system of Direwolf Cybersecurity. Authorized use only. Activity is monitored and
> logged. Unauthorized use is prohibited and may be prosecuted. This is not a U.S. Government
> system. By continuing you accept the Customer Agreement, Acceptable Use Policy and Privacy
> Policy. [ I acknowledge ]

Both omit any claim about Direwolf's own certifications, deliberately.

---

## 4. Contract terms for a cybersecurity provider to DoD contractors

This section lists what the Customer Agreement should contain and why. It is the brief for the
attorney, not the agreement.

### 4.1 Data ownership

- Customer owns Customer Data (account data, telemetry, alerts, documents) and grants Direwolf
  a limited license to process it to provide, secure and improve the service. Mirror the vendor
  pattern: SentinelOne's terms have customers keep ownership of Customer Data while SentinelOne
  retains rights to anonymized "System Data" (aggregate statistics, detected threats, system
  behavior) [S51]; NinjaOne's reseller EULA has the end user own "Your Data," lets NinjaOne use
  it only to provide the service and create "Aggregate Data," and gives 45 days after termination
  to retrieve data [S52].
- Define Direwolf's own derived data (de-identified detection statistics, triage feedback used
  to improve prompts and suppression rules, PLAN §6.11) and promise it is never re-identified or
  sold.
- Return and deletion: export on request during the term; deletion within a stated window after
  termination (30 days suggested), with crypto-shredding of per-org keys where used (PLAN §7
  3.8.3) and the exception for audit records and backups on their lifecycle.
- Audit log access: the org admin can view and export their own org's audit log (PLAN §2), which
  is evidence customers need for their own 3.3.x controls.

### 4.2 Subprocessor list and change notice

Publish `/legal/subprocessors` and incorporate it by reference, with notice of additions (email
to org admins, 30 days) and a termination right if the customer objects on reasonable
security grounds. Today's list, with the function each serves:

| Subprocessor                                                                  | Function                                                                                                              | Location                                                                   |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Amazon Web Services (AWS GovCloud (US)): ECS, RDS, S3, SQS, KMS, SES, Bedrock | hosting, storage, email delivery, AI model inference                                                                  | United States (GovCloud (US-West))                                         |
| Stripe, Inc.                                                                  | payment processing, invoicing, subscription management (card data never touches Direwolf)                             | United States                                                              |
| SentinelOne, Inc.                                                             | endpoint protection platform; resold subscription; receives endpoint telemetry directly from the customer's endpoints | United States (confirm data-residency option with SentinelOne; UNVERIFIED) |
| NinjaOne, LLC                                                                 | endpoint management; resold subscription; receives device inventory and management data                               | United States (confirm; UNVERIFIED)                                        |
| GitHub, Inc.                                                                  | hosts the marketing website only; logs visitor IP addresses [S13]                                                     | United States                                                              |

Note that SentinelOne and NinjaOne are both subprocessors (for Direwolf's connector data) and
direct licensors to the customer (§4.10). Bedrock is a feature of AWS, not a separate company;
AWS states Bedrock content is not shared with model providers or used for training [S15][S16].
Colorado's 6-1-713.5 flow-down duty (§1.1.5) is satisfied by the subprocessors' own terms plus
the DPA-style clause here.

### 4.3 Security incident notification commitments

- **Definition:** "Security Incident" = confirmed unauthorized access to, or acquisition,
  disclosure, loss or alteration of, Customer Data on Direwolf-controlled systems. Distinguish it
  from the threats the service _detects_ on the customer's endpoints (those are the product and
  are reported through the dashboard and alerts).
- **Timing:** notify the org's admin contacts "without undue delay and in any event within
  72 hours of confirming" a Security Incident, with what is known, what was affected, steps
  taken and a point of contact; follow-up as facts develop. 72 hours is chosen because DFARS
  252.204-7012 defines "rapidly report" as "within 72 hours of discovery of any cyber incident"
  and a customer that has flowed 7012 to Direwolf would itself need to report to DoD at
  https://dibnet.dod.mil within that window [S53]. Direwolf's clock starts earlier than the
  customer's, so the customer keeps time to meet theirs.
- **Statutory overlay:** Colorado requires consumer notice within 30 days of determination and
  AG notice at 500+ residents [S19]. Allocate: Direwolf notifies the customer; the customer
  (as owner of its users' data) makes consumer notices unless the breach is of Direwolf's own
  account data, in which case Direwolf notifies affected users directly. Other states' breach
  laws apply by residence of the individual; the clause should say Direwolf will "reasonably
  cooperate" with the customer's notifications and regulators.
- **Evidence preservation:** keep images and logs for at least 90 days (7012(e) requires
  preservation for at least 90 days from submission of a cyber incident report [S53]); the
  append-only audit log and Object-Lock archive (PLAN §6.12) are the mechanism.
- **CIRCIA** (72-hour reporting to CISA by covered critical-infrastructure entities) still has
  no final rule as of October 2026 (reported to be at OMB since October 1, 2026) [S54]; note
  it and revisit.

### 4.4 Prohibited data until the service is approved for it

Clause: Customer will not upload, and will configure the Services so they do not collect, the
following unless an Order expressly says the Service is approved for it:

- **CUI / Covered Defense Information.** Phase 1 data is Security Protection Data under the
  CMMC program rule (PLAN §8). A cloud service that stores, processes or transmits CUI for a DoD
  contractor must meet "security requirements equivalent to" the FedRAMP Moderate baseline and
  7012 (c)-(g) under 252.204-7012(b)(2)(ii)(D) [S53]; DoD's December 2023 equivalency memo
  requires 100 percent of the Moderate controls, a FedRAMP-recognized 3PAO assessment with no
  control findings, and a body of evidence (SSP, SAP, SAR, POA&M, continuous monitoring,
  incident response plan, customer responsibility matrix) [S55]. Direwolf is not there (and the
  site must never imply it is).
- **Export-controlled technical data** (ITAR 22 CFR 120-130; EAR 15 CFR 730-774). See §4.5.
- **Protected health information.** HHS's cloud guidance treats a CSP that stores encrypted
  ePHI as a business associate even if it holds no decryption key ("no-view" services), requires
  a BAA before a covered entity may use it, and limits the conduit exception to transient
  transmission [S56]; the business-associate definition covers anyone that creates, receives,
  maintains or transmits PHI for a covered entity or as a subcontractor [S57]. A SOC that sees
  file names, process arguments and alert payloads from a clinic's endpoints can incidentally
  receive PHI. Until Direwolf offers a BAA (and has a BAA with AWS and the EDR vendors),
  prohibit PHI and state that the customer must not deploy the sensors on systems that store
  PHI, or must accept that incidental telemetry may contain it at their risk. This is a
  real decision for the owner; healthcare is one of the named target industries.
- **Payment card data (PAN).** Never enters the platform; Stripe Checkout handles cards (§5.1).
- **Classified information.** Never.

Add the matching representation to the sign-up attestation (§2.3 item 8) and the banner (§3.3).

### 4.5 Export control (ITAR/EAR) and U.S.-person statements

- **Definitions.** ITAR 22 CFR 120.62: "U.S. person means a person who is a lawful permanent
  resident as defined by 8 U.S.C. 1101(a)(20) or who is a protected individual as defined by
  8 U.S.C. 1324b(a)(3)," plus entities incorporated to do business in the United States and
  government entities [S58]. Protected individuals include citizens, nationals, LPRs, refugees
  and asylees.
- **Encrypted data carve-outs.** Under ITAR 22 CFR 120.54(a)(5), sending, taking or storing
  unclassified technical data is not an export when it is secured with end-to-end encryption
  using FIPS 140-2 (or successor) validated modules or equivalent, "the means of decryption are
  not provided to any third party," and it is not intentionally stored in a §126.1 country
  [S59]; EAR 15 CFR 734.18(a)(5) and (b) are parallel (Country Group D:5) [S60]. These
  carve-outs are what make U.S.-hosted cloud storage of export-controlled data lawful _when the
  provider has no access to the plaintext_. A SOC provider necessarily reads telemetry, so the
  carve-out does not fit the core service; hence the prohibition in §4.4 until a reviewed
  offering exists.
- **Contract clause.** Customer represents it will not provide export-controlled technical data
  without prior written agreement; both parties comply with U.S. export and sanctions laws;
  customer is not on a restricted-party list; the Services may not be accessed from embargoed
  countries.
- **U.S.-person statement.** A factual statement such as "Direwolf platform operations and
  security staff with access to customer data are U.S. persons as defined in 22 CFR 120.62"
  is valuable to defense customers, **but only if it is true and kept true**; the owner must
  confirm before it appears anywhere (UNVERIFIED as a fact about Direwolf). Phrase it as
  "U.S. persons," never "U.S. citizens."
- **Hiring.** DOJ's Immigrant and Employee Rights Section (fact sheet issued April 18, 2023)
  states that export control laws do not justify limiting jobs to U.S. citizens, that U.S.
  persons include citizens, nationals, LPRs, refugees and asylees, that job ads should not state
  that export laws require a specific citizenship, and that any export assessment must be kept
  separate from Form I-9 verification; DOJ brought and settled cases on this theory (General
  Motors, 2023) and sued SpaceX in August 2023 [S61][S62]. Any careers text must say "must be a
  U.S. person as defined in 22 CFR 120.62 or be eligible for export authorization," not
  "citizens only."

### 4.6 DFARS 252.204-7012 flow-down awareness and the 72-hour DIBNet context

- **What 7012 does.** Requires "adequate security" (NIST SP 800-171 Rev 2 per the May 2, 2024
  class deviation [S47]) on contractor systems that process covered defense information; cloud
  providers used for CDI must meet FedRAMP Moderate-equivalent security and 7012 (c)-(g)
  ((b)(2)(ii)(D)); cyber incidents must be "rapidly" reported, defined as within 72 hours of
  discovery, at https://dibnet.dod.mil, which needs a DoD-approved medium assurance certificate
  ((c)); images and monitoring data preserved at least 90 days ((e)); the clause flows down
  "without alteration, except to identify the parties" to subcontracts for operationally
  critical support or that involve CDI, and subcontractors notify the prime when they submit
  reports or variance requests ((m)) [S53].
- **CMMC.** The 32 CFR 170 program rule and the DFARS 252.204-7021 clause rule took effect
  November 10, 2025 (Phase 1: self-assessments; Phase 2 with C3PAO Level 2 certifications
  begins November 10, 2026) [S63]. Under 170.4, an External Service Provider is "external
  people, technology, or facilities that an organization utilizes" for IT or cybersecurity
  services where CUI or Security Protection Data is processed on the ESP's assets; Security
  Protection Data is "data stored or processed by Security Protection Assets that are used to
  protect an OSC's assessed environment," such as configuration data, logs and credentials
  [S45]. Under 170.19(c)(2) Table 4, an ESP that is not a CSP and handles SPD without CUI has
  its services "in the OSA's assessment scope" and "assessed as Security Protection Assets";
  the ESP "may voluntarily undergo a CMMC certification assessment to reduce the ESP's effort,"
  and a CSP processing CUI "shall meet the FedRAMP requirements in 48 CFR 252.204-7012" [S64].
  (The exact row for a _CSP_ handling SPD only was not quoted back in my fetch; PLAN §8 reads
  it as "in scope, no FedRAMP needed"; mark UNVERIFIED and confirm with the C3PAO/RPO.)
- **What this means for the contract and the site:**
  1. Direwolf should **not accept a 7012 flow-down** that presumes it handles CDI, because the
     service is not approved for CUI (§4.4). Say so: "The Services are not designed for CDI;
     Customer will not flow down DFARS 252.204-7012 obligations premised on CDI handling."
  2. Direwolf should **commit to what an SPD-only ESP needs to give**: a customer responsibility
     matrix / shared responsibility matrix mapped to 800-171 Rev 2, access to its own control
     evidence for the customer's assessor under NDA, 72-hour incident notice (§4.3), 90-day
     evidence preservation, and cooperation with the customer's DIBNet reporting (the customer
     files; Direwolf supplies facts). PLAN §8 already plans the CRM.
  3. Offer a **DoD-contractor addendum** rather than burying this in the standard terms.
  4. On the website: "aligned to NIST SP 800-171" and "pursuing CMMC Level 2 certification"
     only (PLAN §14.3), and explain the ESP/SPD position in plain English on the Compliance
     page so assessors do not have to ask.
- **FedRAMP wording.** AWS currently describes GovCloud (US) as "FedRAMP Certified Class D
  (formerly High baseline)" and the US commercial regions as "Class C (formerly Moderate
  baseline)" [S65]. "AWS GovCloud (US), FedRAMP High authorized infrastructure" remains accurate
  as a description of the inherited authorization; record AWS's new "Class D" terminology in the
  claims register and never write "Direwolf is FedRAMP authorized."

### 4.7 Limitation of liability norms

Market practice from the sources reviewed: a general cap of **12 months of fees** paid or
payable before the claim; mutual exclusion of indirect, consequential, special and punitive
damages and lost profits; carve-outs for breach of confidentiality, indemnification obligations,
gross negligence, willful misconduct and fraud (and, by statute in California, no exculpation
of fraud, willful injury or violation of law, Civ. Code 1668); and, when customers push,
a **"super-cap" of roughly 2-5x fees** for data-security or privacy breaches [S66]. The two
vendors Direwolf resells use: SentinelOne, six months of fees generally, twelve months for its
privacy-and-security breaches, no cap for confidentiality or indemnity [S51]; NinjaOne, the
greater of 12 months' fees or $10,000, with a broad consequential-damages exclusion [S52].
Recommend: 12-month cap; 2x super-cap for Direwolf's breach of its security obligations;
consequential-damages exclusion both ways; carve-outs for confidentiality, indemnity, gross
negligence and willful misconduct; a specific exclusion of liability for threats that the
service does not detect or contain (no security product is a guarantee), and for losses from
the customer's own configuration choices (allow-lists, disabled actions). Keep caps symmetrical
so the customer's counsel accepts them.

### 4.8 SLA basics

Separate SLA document, referenced by the agreement: platform availability target (99.9 percent
monthly for the web app and API, measured by Direwolf's monitoring, excluding announced
maintenance windows, force majeure, third-party outages including SentinelOne/NinjaOne/AWS, and
customer-caused issues); service credits as the sole and exclusive remedy (tiered, capped at a
percentage of the monthly fee, claimed within 30 days); support channels and target response
times by severity (e.g., critical alert handling target of minutes via the automated pipeline,
human follow-up targets by severity; PLAN §6.11 promises an "analyst-quality first pass within
about a minute," which is an engineering goal, not an SLA, until measured); status page; and a
clear statement that detection and containment outcomes are not guaranteed. Do not publish
numbers on the website until they are measured in production (claims register).

### 4.9 Autonomous-response authorization

The AI acts on customer endpoints without a human in the loop (kill process, quarantine file,
network-isolate host; PLAN §6.11). The contract needs an express, informed authorization so the
actions are "authorized" access under the CFAA (18 U.S.C. 1030) and state computer-crime laws,
and so business-impact claims are allocated:

1. Customer authorizes Direwolf, acting through automated systems and its analysts, to take the
   containment actions listed in the Response Policy on Customer's endpoints, including actions
   that interrupt business operations, and acknowledges that isolation may disconnect a host
   from the network.
2. The Response Policy is configurable per org (action toggles, thresholds, never-isolate
   allow-list for domain controllers and `critical`-tagged hosts, hourly isolation cap, cool-down,
   kill switch; PLAN §6.11); Customer is responsible for maintaining the allow-list and for
   designating critical systems; actions taken in accordance with the policy are deemed
   authorized.
3. Every action is logged with reasoning and is reversible with one click; Direwolf notifies
   org admins when actions are taken.
4. Direwolf is not liable for losses from actions taken in good faith in accordance with the
   Response Policy, subject to the §4.7 carve-outs; Customer remains responsible for backups
   and business continuity.
5. Customer confirms it has authority over the endpoints (owns or controls them, has informed
   its own users consistent with its policies and applicable employee-monitoring law).
6. The customer accepts the EDR vendor's own terms for the actions executed through it (§4.10).

### 4.10 Reseller terms passing through the SentinelOne and NinjaOne EULAs

- **SentinelOne Terms of Service** (last updated May 14, 2026) are between SentinelOne, Inc. and
  the customer who accepts them or uses the Solutions; they contemplate purchase through an
  authorized "Partner" (reseller) with fees payable to the Partner; the customer keeps Customer
  Data, SentinelOne keeps anonymized System Data; liability caps as in §4.7 [S51].
- **NinjaOne End User License Agreement for End Users of Resellers** (last updated June 8, 2026)
  binds the end user that signs a Purchase Order or uses the software; fees go to the reseller;
  if NinjaOne suspends service "Your sole source of recourse for any such damages incurred by You
  is Your Reseller"; use is capped at the devices on the Purchase Order; the end user must give
  notices and obtain consents for third-party software it installs through the platform; AI
  feature inputs may be used in anonymized, aggregated form; 45-day data retrieval after
  termination; liability cap of the greater of 12 months' fees or $10,000 [S52].

Clause set: (1) the customer must accept the vendor EULA as a condition of the resold
subscription (present it as its own unchecked box in the purchase flow for that product, and
record the acceptance with the vendor document version); (2) the vendor, not Direwolf, provides
the vendor software and its warranties; Direwolf passes through only what the vendor gives;
(3) Direwolf's liability for vendor products is no greater than what it can recover from the
vendor (important because NinjaOne routes end-user claims to the reseller); (4) Direwolf's
right to suspend or terminate resold subscriptions follows the vendor's; (5) seat counts and
device limits are enforced per the vendor's terms; overages are billed; (6) vendor data use
(System Data / Usage Data / AI training on aggregated data) is disclosed in the privacy policy
and subprocessor list; (7) termination of Direwolf's partner agreement ends renewals but not
the current term (NinjaOne) [S52]; mirror that. Partner-program agreements with each vendor
will have their own required language; conform to them when signed (owner action).

### 4.11 Other standard clauses

Term and auto-renewal (consistent with §1.7.3), fees, taxes (customer pays applicable sales
tax; §5.3), suspension for non-payment or AUP breach, termination for cause and convenience
with data return, confidentiality (mutual), warranties and disclaimers (no guarantee that the
Services will detect or prevent every threat; roadmap features are not promised), IP and
feedback, mutual indemnities (IP infringement by Direwolf; customer's data and use), insurance
(cyber/tech E&O; state limits once bound), governing law and venue (Colorado), dispute
resolution (consider arbitration with a small-claims carve-out; if arbitration is used it must
be conspicuous in the clickwrap, which is where most of the §2 cases arise), publicity (no
customer names on the site without written consent, consistent with the no-testimonials rule),
assignment, force majeure, order of precedence (Order > DoD addendum > Agreement > AUP > SLA),
entire agreement, and a government-customer clause stating that no FAR/DFARS flow-downs apply
unless expressly accepted in an Order.

---

## 5. Payment

### 5.1 PCI DSS SAQ A with Stripe Checkout: **Required once live**

- PCI DSS applies to "all entities that store, process, or transmit cardholder" data; Stripe
  is a PCI Level 1 service provider and merchants must "annually attest" to their own compliance
  through the documents listed in the Stripe Dashboard [S67]. Stripe's guide states that
  Checkout and Elements host card inputs in a Stripe-served iframe and meet "PCI eligibility for
  the SAQ A"; passing raw card data to the API would require SAQ D [S68].
- **SAQ A v4.0.1 r1 (January 2025)** removed requirements 6.4.3 (script inventory and
  integrity) and 11.6.1 (payment-page change detection) from SAQ A and added an eligibility
  criterion that "the merchant has confirmed that their site is not susceptible to attacks from
  scripts." PCI SSC FAQ 1588 (February 2025) says that criterion "only applies to e-commerce
  merchants with a webpage that includes a TPSP's/payment processor's embedded payment
  page/form" (iframe) and "does not apply to e-commerce merchants with a webpage that
  redirects customers" to the processor; embedded-page merchants can meet it either with
  6.4.3/11.6.1-style controls or by obtaining the TPSP's confirmation that its embedded solution
  protects the page [S69][S70].
- **Recommendation:** use **Stripe-hosted Checkout (full redirect)**, not embedded Checkout or
  Elements, for the launch. That keeps Direwolf in the simplest SAQ A posture: no card data on
  Direwolf systems, TLS 1.2+ everywhere, keep the list of third-party service providers (Stripe)
  and their compliance status, maintain the incident-response contact procedure, complete SAQ A
  and the Attestation of Compliance annually in the Stripe Dashboard, and keep the Checkout
  pages free of third-party scripts (which `CLAUDE.md` already requires for the site and PLAN
  §14.1 for the app). Store only what Stripe returns (brand, last4, expiry) [S67]. Verify
  webhook signatures and allow-list Stripe IPs [S67].

### 5.2 Stripe-specific legal mechanics

Set the Terms of Service and Privacy Policy URLs in Stripe's public business details (required
before `consent_collection[terms_of_service]=required` will work), enable "Legal policies" and
the refund-policy display in Checkout settings, require ToS consent on each Checkout Session,
collect promotional-email consent separately, and keep Stripe's default payment-method-reuse and
subscription text unless counsel approves custom text [S27]. Publish a refund policy (Stripe
displays it); for B2B SaaS a "no refunds except as required by law or stated in the Order"
policy is common, but say it plainly.

### 5.3 Sales tax on SaaS in Colorado (one paragraph; ask an accountant)

Colorado's state sales tax has not reached SaaS (only prewritten software delivered in tangible
form was taxable), but **HB 26-1223, signed June 4, 2026, makes software taxable at the state
level by function regardless of delivery method, including SaaS subscriptions, effective
January 1, 2027**, with continuing exemptions for custom software and software sold under a
genuinely negotiated license; state-collected local jurisdictions follow the state base, while
the roughly 70 **home-rule** cities keep their own bases, definitions and sourcing rules, and
many of them (Denver is the named example) already tax SaaS [S71][S72]. Colorado Springs is a
home-rule city and vendor tables list it as taxing SaaS at a local rate of about 3.07 percent,
but I could not confirm that from the city code (UNVERIFIED) [S73]. Beyond Colorado, post-_Wayfair_
economic-nexus rules mean sales to customers in other states can create collection duties in
states that tax SaaS. Practical path: engage a Colorado CPA before the first invoice, register
with the Department of Revenue and with Colorado Springs, consider Stripe Tax for calculation,
and treat tax as "plus applicable taxes" in the Customer Agreement.

---

## 6. Marketing claims

### 6.1 FTC truth-in-advertising basics and the cybersecurity enforcement history

- **Standard.** Under the FTC Act, "advertising must be truthful and non-deceptive," not
  unfair, and "the law requires that advertisers have proof before the ad runs" (substantiation).
  An ad is deceptive if it is "likely to mislead consumers acting reasonably under the
  circumstances" and the claim is material; implied claims and omissions count; the same rules
  apply online, where disclosures must be "clear and conspicuous" [S74]. Colorado's Consumer
  Protection Act (C.R.S. 6-1-105) mirrors this for state enforcement and private suits.
- **Security claims are where companies get hurt.** The FTC has for a decade treated (a)
  unreasonable security as an _unfair_ practice and (b) overstated security as a _deceptive_
  one:
  - _FTC v. Wyndham_ (complaint June 2012; Third Circuit affirmed FTC authority August 24, 2015;
    stipulated order December 11, 2015) [S75].
  - _Zoom_ (November 9, 2020): alleged misrepresentation of "end-to-end, 256-bit encryption"
    while Zoom held the keys, of recording encryption, and secret installation of a web server;
    order requires a comprehensive security program, MFA, vulnerability management, independent
    assessments and bars misrepresenting privacy and security practices [S76].
  - _GoDaddy_ (proposed order January 15, 2025; finalized May 21, 2025): counts for unfair
    failure to maintain reasonable security (no asset inventory or patching, weak logging and
    monitoring, no MFA, no segmentation), deceptive claims about security, and deceptive
    Privacy Shield claims; order requires a security program reviewed by an independent assessor
    and bars misrepresentations [S77].
  - The FTC's _Start with Security_ guide distills ten lessons from these cases (collect only
    what you need; control access; strong authentication; encrypt in storage and transit;
    segment and monitor; secure remote access; secure development; hold service providers to
    standards; patch; secure physical media) [S78].
- **What this means for the Direwolf site.** Every claim about Direwolf's own security,
  compliance, hosting and AI must be true today and provable (the claims register); the FTC's
  theory in Zoom and GoDaddy is that a security company's marketing is itself a representation.
  Specifically: never say "certified," "authorized," "compliant," "FedRAMP," "guaranteed," or
  "unhackable"; say "aligned to NIST SP 800-171," "pursuing CMMC Level 2," "hosted on AWS
  GovCloud (US), FedRAMP High authorized infrastructure," "FIPS 140-validated cryptography for
  TLS and key management"; label roadmap items as roadmap; do not quote detection rates or
  response times until measured; keep "24x7" accurate (automated triage is 24x7; a single human
  analyst reviewing is not 24x7 coverage by a human, so say "AI-run security operations
  around the clock with human analyst review," not "24x7 analysts").
- **FIPS wording.** AWS's documentation says to use FIPS endpoints "if you require FIPS 140-3
  validated cryptographic modules" [S16]; the plan uses the ALB FIPS TLS policy, FIPS endpoints
  and KMS (PLAN §6.13). "FIPS 140-validated cryptography for TLS termination and key
  management" is the accurate scope; application code's PBKDF2/HMAC are not the validated
  modules (PLAN §6.13), so never say "the platform is FIPS validated."

### 6.2 Testimonials, reviews and endorsements

The FTC's Trade Regulation Rule on the Use of Consumer Reviews and Testimonials (16 CFR Part
465; announced August 14, 2024, effective 60 days after Federal Register publication, i.e.,
October 21, 2024 by my count) prohibits fake or AI-generated testimonials, buying positive
reviews, undisclosed insider reviews, review suppression and fake social-media indicators, and
allows civil penalties for knowing violations [S79]. The Endorsement Guides (16 CFR Part 255)
require disclosure of material connections. `CLAUDE.md` already bans invented testimonials;
when real ones exist, get written consent, keep them verifiable, and disclose any discount or
incentive given.

### 6.3 "Veteran-owned" claims

- The plain statement "veteran-owned" is a factual claim subject to FTC Act §5 and the Colorado
  Consumer Protection Act; it is lawful if true (the owner is a veteran who owns and controls
  the company). No certification is required to say it.
- "**Veteran-Owned Small Business (VOSB)**" and "**Service-Disabled Veteran-Owned Small
  Business (SDVOSB)**" are federal procurement statuses. Since January 1, 2023, SBA's Veteran
  Small Business Certification (VetCert, 13 CFR Part 128) is required for VOSB/SDVOSB sole-source
  and set-aside contracts; SBA states "there is no self-certification provision" for VA
  opportunities, and the self-certification grace period for subcontracting and goaling purposes
  ended December 22, 2024 [S80][S81]. Eligibility: at least 51 percent owned and controlled by
  one or more veterans (service-disabled veterans for SDVOSB), small under the applicable NAICS
  size standard [S80].
- Misrepresenting VOSB/SDVOSB status in procurement carries a presumption of loss equal to the
  contract value, suspension and debarment, False Claims Act liability and criminal exposure
  under 15 U.S.C. 645 and 18 U.S.C. 1001 and 287 (13 CFR 128.600) [S82].
- **Site rule (updated 2026-10-23 from `CLAUDE.md` "Owner facts"):** the owner states that
  Direwolf holds SBA VetCert certification as an SDVOSB, so the site says "Service-Disabled
  Veteran-Owned Small Business (SDVOSB), SBA certified" (claims register row F1). The certificate
  or the SAM.gov entity record must be filed under `docs/evidence/` before launch, and the SBA
  icon may be shown only under SBA's icon rules (`docs/claims-research.md` §7;
  `docs/launch-runbook.md`, "Logo use"). Do not write "VA-verified". Also consider state/local
  veteran-business preference programs (not researched).

### 6.4 EEO statement conventions

- **Who must say what.** Title VII applies at 15+ employees; Colorado's Anti-Discrimination Act
  (C.R.S. 24-34-401 et seq.) covers employers of any size (statute not fetched in this pass).
  For _federal contractors and subcontractors_: Executive Order 11246 was revoked by EO 14173
  (January 21, 2025) and OFCCP published three final rules on August 21, 2026 that rescind the
  EO 11246 regulations effective October 26, 2026, narrow Section 503 (threshold now $20,000)
  and make technical changes to VEVRAA (threshold now $200,000), both effective September 21,
  2026 [S83]. The VEVRAA clause still requires that "all solicitations or advertisements for
  employees" state that "all qualified applicants will receive consideration for employment
  without regard to their protected veteran status" (41 CFR 60-300.5(a) para. 12) and the
  Section 503 clause requires the same statement that applicants "will not be discriminated
  against on the basis of disability" (41 CFR 60-741.5(a) para. 7) [S84][S85]. Direwolf sells
  to contractors rather than to the government and will be below these thresholds unless it
  takes a subcontract that flows them down; so none of this is _required_ today (UNVERIFIED
  until the first contract is known).
- **Convention to adopt anyway** (it is what the owner asked for and what customers expect):
  "Direwolf Cybersecurity is an equal opportunity employer. All qualified applicants will
  receive consideration for employment without regard to race, color, religion, sex, sexual
  orientation, gender identity, national origin, age, disability, genetic information, military
  or veteran status, or any other characteristic protected by federal, state or local law."
  Pair it with the hiring note in §4.5 and the pay-transparency note in §1.7.4 on any careers
  page. Publish at `/legal/eeo` (or on About) and link from the footer.

### 6.5 Compliance-claim wording (consolidated)

| Topic           | Say                                                                                                                                                               | Do not say                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| NIST SP 800-171 | "aligned to NIST SP 800-171 (Rev 2)"                                                                                                                              | "NIST compliant," "NIST certified"                                                                                  |
| CMMC            | "pursuing CMMC Level 2 certification"                                                                                                                             | "CMMC certified," "CMMC compliant" until the C3PAO certificate exists                                               |
| Hosting         | "hosted in AWS GovCloud (US) on FedRAMP High authorized infrastructure" (note AWS's current "Class D (formerly High)" label [S65])                                | "Direwolf is FedRAMP authorized," "FedRAMP Moderate equivalent"                                                     |
| Cryptography    | "FIPS 140-validated cryptography for TLS termination and key management"                                                                                          | "FIPS validated platform"                                                                                           |
| AI              | "AI-run security operations around the clock with human analyst review"; "your data is not used to train models" [S15]                                            | "24x7 analysts," "AI never makes mistakes"                                                                          |
| Ownership       | "Service-Disabled Veteran-Owned Small Business (SDVOSB), SBA certified" (register F1; owner statement 2026-10-23; certificate to be filed under `docs/evidence/`) | "VA-verified," "VOSB" alone, any certification wording beyond the SBA VetCert status, SBA icons used as advertising |
| Data handling   | "not approved for CUI, ITAR technical data or PHI"                                                                                                                | silence on the point                                                                                                |
| Roadmap         | "on our roadmap"                                                                                                                                                  | present tense for GRC, LMS, dark-web, scanning, mapping, repository, sensor, SIEM                                   |

---

## 7. Security disclosure

### 7.1 security.txt (RFC 9116)

Serve `/.well-known/security.txt` over HTTPS as `text/plain; charset=utf-8`. **Contact** and
**Expires** are mandatory (Expires must appear exactly once; recommended less than a year out);
optional fields are **Encryption**, **Acknowledgments**, **Preferred-Languages**, **Canonical**,
**Policy** and **Hiring**; a PGP cleartext signature is recommended, and if signed, include
Canonical [S86]. Example for the site (the file lives in the website repo but should also be
served by the platform at `app.direwolfcybersecurity.com/.well-known/security.txt`):

```
Contact: mailto:security@direwolfcybersecurity.com
Contact: https://www.direwolfcybersecurity.com/security
Expires: 2027-10-01T00:00:00.000Z
Preferred-Languages: en
Canonical: https://www.direwolfcybersecurity.com/.well-known/security.txt
Policy: https://www.direwolfcybersecurity.com/security
Encryption: https://www.direwolfcybersecurity.com/pgp-key.txt
```

Add a calendar reminder to bump `Expires` and the PGP key before expiry (launch runbook).

### 7.2 Responsible disclosure policy outline (`/security`)

1. Commitment and scope: `www.direwolfcybersecurity.com`, `app.direwolfcybersecurity.com`
   and the public API; out of scope: customer endpoints, SentinelOne/NinjaOne/AWS/Stripe
   infrastructure (report to them), social engineering, physical attacks, DoS, automated
   scanning that degrades service.
2. How to report (email, PGP key, what to include), acknowledgement target (e.g., 3 business
   days) and status updates.
3. Rules for researchers: no data exfiltration beyond proof of concept, no privacy violations,
   stop and report on reaching customer data, no public disclosure before coordinated
   timeline (e.g., 90 days or fix, whichever first).
4. What Direwolf will do: validate, fix, credit (Acknowledgments page, opt-in), no bounty at
   launch (say so; bounties are "not a prerequisite" for a VDP [S20]).
5. Safe harbor (7.3).
6. Reference to NIST SP 800-53 RA-5(11): "Establish a public reporting channel for receiving
   reports of vulnerabilities," which should contain "clear language authorizing good-faith
   research" and not demand indefinite non-disclosure [S87]; a monitored published address
   meets the control. This is also a credible talking point with assessors.

### 7.3 Is a safe-harbor statement advisable? **Yes**

- DOJ's May 2022 CFAA charging policy (Justice Manual 9-48.000) directs prosecutors to decline
  prosecution where the conduct "consisted of, and the defendant intended, good-faith security
  research," defined as accessing a computer "solely for purposes of good-faith testing,
  investigation, and/or correction of a security flaw or vulnerability" in a manner "designed to
  avoid any harm to individuals or the public" with the information "used primarily to promote
  the security or safety" of the systems [S88]. That is federal prosecutorial policy, not a
  defense; a company's own authorization is what removes the "without authorization" element
  under 18 U.S.C. 1030 and the "circumvention" question under 17 U.S.C. 1201. disclose.io's
  "full safe harbor" tenets are exactly that: authorization under anti-hacking laws,
  exemption from anti-circumvention laws, exemption from the organization's ToS/AUP for testing,
  and an acknowledgement of good-faith research; CC0 template text is available [S20].
- Suggested statement: "If you make a good-faith effort to comply with this policy during your
  security research, we consider your research authorized under the Computer Fraud and Abuse
  Act and applicable state law, exempt from the anti-circumvention provisions of the DMCA, and
  exempt from restrictions in our Terms of Service and Acceptable Use Policy that would
  interfere with it. We will not pursue or support legal action against you for research
  conducted in accordance with this policy, and if a third party initiates legal action against
  you for such research we will make it known that your actions were authorized. This
  authorization does not extend to third-party systems."
- Counsel should confirm the DMCA sentence and the governing-law interaction.

### 7.4 DIB-VDP

DoD's Cyber Crime Center ran a free, voluntary DIB Vulnerability Disclosure Program pilot
(April 2021 to April 2022: 41 companies, 348 assets, 1,015 reports, 401 actionable) and DC3 and
DCSA subsequently announced a follow-on program open to companies supporting the DIB under
32 CFR part 236 [S89][S90]. Whether it is formally "permanent" and its current intake process
are UNVERIFIED (DC3's VDP page returned 404). It is a potential free external check on the
public assets once Direwolf is itself a DIB participant; note for later.

---

## 8. Verification notes and open items

Primary sources fetched directly: CalOPPA text via FindLaw (leginfo blocked automated
retrieval); Colorado statutes via colorado.public.law (the Colorado AG's pages returned empty);
CFR sections via Cornell LII (eCFR redirected to a block page); NIST control text via CSF Tools
(NIST's CPRT is a client-side app) with the DoD banner via a DoDEA mirror (the DoD CIO PDF
returned 403); FTC guides and press releases; Stripe, AWS, GitHub, SBA, RFC Editor, W3C,
Section508.gov and vendor EULAs directly. Law-firm summaries were used only where noted.

Items marked **UNVERIFIED** above, consolidated:

1. Whether C.R.S. 6-1-732 (auto-renewal) reaches B2B subscriptions after SB 25-145 (§1.7.3).
2. 32 CFR 170.19 Table 4 row for a _CSP_ handling SPD only (§4.6); confirm with C3PAO/RPO.
3. Whether Direwolf's staff with data access are all U.S. persons (a fact only the owner knows;
   §4.5) and whether SentinelOne/NinjaOne offer U.S.-only data residency (§4.2).
4. Colorado Springs' local taxation of SaaS (§5.3) and the broader multistate nexus picture.
5. Whether any federal subcontract will flow down VEVRAA/Section 503 clauses (§6.4).
6. Texas TDPSA small-business exemption (§1.1.3); Colorado's commercial-email statute (§1.6);
   the Eighth Circuit's vacatur of the FTC click-to-cancel rule (§1.7.3); DIB-VDP's current
   status (§7.4); CIRCIA's final rule (§4.3): each noted from secondary or remembered sources.
7. Cases cited from memory without re-fetching: _Specht_, _Douglas v. Talk America_, _Robles v.
   Domino's_; reporter citations for _Oberstein_ and _Chabolla_ omitted for that reason.
8. Owner inputs still needed: legal entity name and form (LLC/Inc.), postal address, privacy
   and security contact mailboxes, whether PHI will be accepted (BAA decision), whether to
   pursue VetCert, insurance, and the partner-program agreements with SentinelOne and NinjaOne
   (their required pass-through language supersedes §4.10's generic clause set).

Developments after this memo's date to watch: the Colorado AG's ADMT rules (hearing October
26, 2026), the OFCCP rescission taking effect October 26, 2026, CMMC Phase 2 (November 10,
2026), Colorado's software sales tax (January 1, 2027), and the CIRCIA final rule.

---

## 9. Final checklist

The full requirement-by-requirement table with status is in
`docs/legal-requirements-checklist.md`. In short, before launch:

- [ ] Privacy Policy (CalOPPA elements, CPA-grade contents, GitHub IP logging, SES, Stripe,
      Bedrock statement, DNT/GPC, children, contacts, effective date) at `/legal/privacy`.
- [ ] Website Terms of Use at `/legal/terms`; Customer Agreement + DoD-contractor addendum +
      SLA + Subprocessors for the platform; Acceptable Use Policy at `/legal/acceptable-use`.
- [ ] Cookie Notice at `/legal/cookies` (no banner); Accessibility statement at
      `/accessibility`; Security and responsible disclosure at `/security` with safe harbor;
      `/.well-known/security.txt` with Expires reminder; Compliance page with the §6.5 wording;
      EEO statement at `/legal/eeo`; all linked from the footer with "Last updated" and version.
- [ ] Claims register entries for every claim on those pages (`docs/claims-register.md`).
- [ ] Sign-up clickwrap per §2.3 (unchecked box, versions shown, links, button wording,
      authority line, prohibited-data attestation), `ConsentRecord` per §2.4, screenshots per
      version, re-acceptance on new versions.
- [ ] Login banner per §3.3 with acknowledgement recorded; not a USG banner.
- [ ] Stripe: hosted Checkout (redirect), ToS consent required, public-details URLs, refund
      policy, promotional-consent separate, SAQ A on the compliance calendar.
- [ ] Auto-renewal disclosures, 25-40-day reminders, one-step online cancellation (portal).
- [ ] CAN-SPAM mechanics on any marketing mail; postal address in config.
- [ ] Breach-response runbook aligned to C.R.S. 6-1-716 (30 days, AG at 500) and the 72-hour
      customer notice; disposal policy (6-1-713).
- [ ] Attorney review of every legal page and of the DoD addendum, autonomous-response
      authorization, reseller pass-through, safe harbor and banner text.
- [ ] Owner decisions: entity name/address, PHI/BAA, VetCert, accountant for sales tax,
      U.S.-person staffing statement, insurance.

---

## 10. Sources

Statutes, regulations and official guidance

- [S1] Cal. Bus. & Prof. Code § 22575 (CalOPPA), via FindLaw (current through Jan. 1, 2026):
  https://codes.findlaw.com/ca/business-and-professions-code/bpc-sect-22575/ (official text:
  https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=22575.&lawCode=BPC, blocked automated retrieval)
- [S2] C.R.S. 6-1-1304 (CPA applicability and exemptions): https://colorado.public.law/statutes/crs_6-1-1304
- [S3] C.R.S. 6-1-1303 (CPA definitions: consumer, personal data, sale, sensitive data): https://colorado.public.law/statutes/crs_6-1-1303
- [S4] C.R.S. 6-1-1308 (CPA controller duties, privacy notice contents): https://colorado.public.law/statutes/crs_6-1-1308
- [S5] C.R.S. 6-1-1306 (CPA consumer rights; universal opt-out effective July 1, 2024): https://colorado.public.law/statutes/crs_6-1-1306
- [S6] Baker Donelson, Consumer Data Privacy Law Guide: Colorado (UOOM shortlist incl. Global Privacy Control; penalties): https://bakerdonelson.com/consumer-data-privacy-law-guide-colorado
- [S7] C.R.S. 6-1-1309 (data protection assessments): https://colorado.public.law/statutes/crs_6-1-1309
- [S8] C.R.S. 6-1-1311 (CPA enforcement; cure period repealed Jan. 1, 2025; no private action): https://colorado.public.law/statutes/crs_6-1-1311
- [S9] Baker Donelson (CPA penalties up to $20,000 per violation under the Colorado Consumer Protection Act): https://bakerdonelson.com/consumer-data-privacy-law-guide-colorado
- [S10] Sidley, Effective Dates of US State Consumer Privacy Laws (HB 24-1130, SB 24-041 dates): https://datamatters.sidley.com/wp-content/uploads/sites/2/2024/11/Effective-Dates-US-State-Consumer-Privacy-Law-and-Recent-EU-Digital-and-Cybersecurity-Laws.pdf ; Sidley, Colorado Finalizes Privacy Act Rules (Jan. 9, 2025): https://datamatters.sidley.com/2025/01/09/colorado-finalizes-privacy-act-rules-key-updates-for-businesses/
- [S11] Cal. Civ. Code § 1798.140(d) ("business" thresholds), via FindLaw: https://codes.findlaw.com/ca/civil-code/civ-sect-1798-140/
- [S12] California Privacy Protection Agency, Updated Monetary Thresholds in CCPA ($26,625,000 effective Jan. 1, 2025): https://www.cppa.ca.gov/regulations/cpi_adjustment.html
- [S13] GitHub Docs, What is GitHub Pages (visitor IP logging): https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- [S14] GitHub Terms for Additional Products and Features, GitHub Pages (not for running an online business / commercial SaaS): https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features
- [S15] Amazon Bedrock FAQs (content not used to improve base models, not shared with model providers, stored in Region): https://aws.amazon.com/bedrock/faqs/
- [S16] Amazon Bedrock User Guide, Data protection (model providers have no access to prompts/completions; FIPS endpoints): https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html
- [S17] C.R.S. 6-1-713.5 (reasonable security; third-party service providers): https://colorado.public.law/statutes/crs_6-1-713.5
- [S18] Colorado data protection laws, law-firm summaries (6-1-713 disposal policy; AG page https://coag.gov/resources/data-protection-laws/ returned empty): https://www.wsgrdataadvisor.com/2018/10/new-colorado-law-requires-30-day-data-breach-notification/ ; https://www.alstonprivacy.com/colorado-enacts-expanded-data-privacy-law/
- [S19] C.R.S. 6-1-716 (breach notification): https://colorado.public.law/statutes/crs_6-1-716
- [S20] disclose.io dioterms repository (safe harbor tenets, VDP sections, CC0 templates): https://github.com/disclose/dioterms
- [S21] U.S. DOJ, Guidance on Web Accessibility and the ADA (Mar. 18, 2022): https://www.ada.gov/resources/web-guidance/
- [S22] U.S. DOJ, ADA Title II web and mobile app accessibility rule (Apr. 24, 2024; compliance dates extended by Apr. 20, 2026 interim final rule): https://www.ada.gov/resources/2024-03-08-web-rule/
- [S23] Colorado HB 21-1110 summaries (public entities; WCAG 2.1 AA; HB 24-1454 extension): https://www.levelaccess.com/blog/hb-21-1110-colorado-accessibility-law/ ; https://boia.org/blog/key-colorado-web-accessibility-law-gets-deadline-extension
- [S24] W3C WAI, Developing an Accessibility Statement: https://www.w3.org/WAI/planning/statements/
- [S25] GSA Section508.gov, Accessibility Conformance Reports: https://www.section508.gov/sell/acr/
- [S26] FTC, CAN-SPAM Act: A Compliance Guide for Business: https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
- [S27] Stripe Docs, Extend Checkout with custom components (consent_collection.terms_of_service; public details; promotional-email consent): https://docs.stripe.com/payments/checkout/custom-components
- [S28] Goodwin, Colorado Enacts Law Repealing and Replacing Landmark AI Act (SB 26-189 signed May 14, 2026; effective Jan. 1, 2027): https://www.goodwinlaw.com/en/insights/publications/2026/06/alerts-technology-fs-colorado-enacts-law-repealing-replacing-landmark-ai-act
- [S29] Baker Botts, Colorado Repeals and Replaces AI Act: https://ourtake.bakerbotts.com/post/102msga/colorado-repeals-and-replaces-ai-act
- [S30] Byte Back (Colorado category; AG draft ADMT rules Aug. 11, 2026, hearing Oct. 26, 2026): https://www.bytebacklaw.com/category/colorado/
- [S31] C.R.S. 6-1-732 (automatic renewal contracts): https://colorado.public.law/statutes/crs_6-1-732
- [S32] Colorado General Assembly, SB25-145 Online Cancellation of Automatic Renewal Contracts (signed June 3, 2025; effective Aug. 6, 2025): https://leg.colorado.gov/bills/sb25-145
- [S33] Ogletree Deakins, Colorado Updates Requirements for Consumer and Business-Facing Automatically Renewing Contracts: https://ogletree.com/insights-resources/blog-posts/colorado-updates-requirements-for-consumer-and-business-facing-automatically-renewing-contracts/

Case law and contract-formation commentary

- [S34] Nguyen v. Barnes & Noble, Inc., 763 F.3d 1171 (9th Cir. 2014), discussed in: https://www.fenwick.com/insights/publications/thats-a-wrap-ninth-circuit-signals-tougher-standards-for-enforceability-of-online-agreements
- [S35] California Lawyers Association, Berman v. Freedom Financial Network summary (Nguyen framework): https://calawyers.org/business-law/berman-v-freedom-financial-network-___-f-4th-___-9th-cir-april-5-2022-no-20-169000-2022-wl-1010531/
- [S36] Meyer v. Uber Technologies, Inc., 868 F.3d 66 (2d Cir. 2017): opinion PDF https://www.uschamber.com/assets/documents/Opinion20-20Meyer20v.20Kalanick2C20Uber20Technologies2C20Inc.2028Second20Circuit29.pdf ; summary https://wsgr.com/en/insights/federal-appellate-court-enforces-terms-of-use-including-arbitration-provision-entered-during-mobile-application-registration-process.html
- [S37] Berman v. Freedom Financial Network, LLC, 30 F.4th 849 (9th Cir. 2022): https://blog.ericgoldman.org/?p=23784
- [S38] Proskauer, Beware of the Fine Print: Website Design Choices That Carry Legal Significance: https://proskauer.com/blog/beware-of-the-fine-print-website-design-choices-that-carry-legal-significance
- [S39] Oberstein v. Live Nation Entertainment (9th Cir. Feb. 13, 2023): https://www.sheppard.com/insights/blogs/ninth-circuit-decision-in-live-nation-and-ticketmasters-favor-highlights-subtleties-of-drafting-enforceable-arbitration-provisions ; https://wlo.willamette.edu/9thcir/2023/02/oberstein-v-live-nation-entertainment-inc.html
- [S40] Chabolla v. ClassPass (9th Cir. Feb. 27, 2025): https://blog.ericgoldman.org/archives/2025/03/the-ninth-circuit-has-a-lot-to-say-about-online-contract-formation-much-of-it-confusing-chabolla-v-classpass.htm
- [S41] Hunton, It's a Wrap: The Latest from the Ninth Circuit on Sign-in Wrap Agreements: https://www.hunton.com/privacy-and-cybersecurity-law-blog/its-a-wrap-the-latest-from-the-ninth-circuit-on-sign-in-wrap-agreements
- [S42] 15 U.S.C. § 7001 (E-SIGN), via Cornell LII: https://www.law.cornell.edu/uscode/text/15/7001
- [S43] C.R.S. 24-71.3-107 (Colorado UETA): https://colorado.public.law/statutes/crs_24-71.3-107

NIST, DoD and CMMC

- [S44] NIST SP 800-171 Rev 2, 3.1.9, via CSF Tools: https://csf.tools/reference/nist-sp-800-171/r2/3-1/3-1-9/ (publication: https://doi.org/10.6028/NIST.SP.800-171r2)
- [S45] 32 CFR 170.4 (CMMC definitions; references NIST SP 800-171 R2), via Cornell LII: https://www.law.cornell.edu/cfr/text/32/170.4
- [S46] NIST SP 800-171 Rev 3, 03.01.09, via CSF Tools: https://csf.tools/reference/nist-sp-800-171/r3/03-01/03-01-09/
- [S47] DFARS 252.204-7012 class deviation pinning NIST SP 800-171 Rev 2 (May 2, 2024): https://govcon.mofo.com/topics/a-sigh-of-relief-dod-issues-class-deviation-for-dfars-252-204-7012 ; https://crowell.com/en/insights/client-alerts/miss-me-with-rev-3-says-dod-dod-issues-class-deviation-linking-dfars-7012-to-nist-sp-800-171-rev-2
- [S48] NIST SP 800-53 Rev 5, AC-8 System Use Notification, via CSF Tools: https://csf.tools/reference/nist-sp-800-53/r5/ac/ac-8/
- [S49] DoD CIO memorandum, Policy on Use of DoD Information Systems: Standard Consent Banner and User Agreement (May 9, 2008): https://dodcio.defense.gov/Portals/0/Documents/DoDBanner-9May2008-ocr.pdf (returned 403; summarized via https://www.army.mil/article/10445/DoD_establishes_departmental_policy_on_the_use_of_DoD_information_systems)
- [S50] Standard Mandatory DoD Notice and Consent text (DoDEA mirror): https://webapps.dodea.edu/app_banner/UserAgreement.htm
- [S51] SentinelOne Terms of Service (last updated May 14, 2026): https://www.sentinelone.com/legal/terms-of-service/
- [S52] NinjaOne End User License Agreement for End Users of Resellers (last updated June 8, 2026): https://www.ninjaone.com/license-for-end-users-of-resellers/
- [S53] DFARS 252.204-7012 Safeguarding Covered Defense Information and Cyber Incident Reporting: https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting.
- [S54] CIRCIA status (final rule at OMB Oct. 1, 2026): https://www.hunton.com/privacy-and-cybersecurity-law-blog/cisa-plans-to-finalize-cyber-incident-reporting-regulations-in-september-2026 ; https://cyberscoop.com/cisa-pushes-final-cyber-incident-reporting-rule-to-may-2026/
- [S55] DoD CIO FedRAMP Moderate Equivalency memo (Dec. 2023), summarized by Cloud Security Alliance (memo PDF returned 403): https://cloudsecurityalliance.org/articles/fedramp-moderate-equivalency-for-cloud-service-providers-explained
- [S56] HHS OCR, Guidance on HIPAA and Cloud Computing (Oct. 2016), summarized by Crowell and Mintz (HHS page returned 403): https://www.crowell.com/en/insights/client-alerts/the-office-of-civil-rights-issues-demanding-hipaa-guidance-to-cloud-services-providers ; https://www.mintz.com/insights-center/viewpoints/2146/2016-10-19-hhs-publishes-guidance-hipaa-and-cloud-computing
- [S57] 45 CFR 160.103 (business associate), via Cornell LII: https://www.law.cornell.edu/cfr/text/45/160.103
- [S58] 22 CFR 120.62 (U.S. person), via Cornell LII: https://www.law.cornell.edu/cfr/text/22/120.62
- [S59] 22 CFR 120.54 (activities that are not exports; end-to-end encryption), via Cornell LII: https://www.law.cornell.edu/cfr/text/22/120.54
- [S60] 15 CFR 734.18 (EAR; encrypted data not an export), via Cornell LII: https://www.law.cornell.edu/cfr/text/15/734.18
- [S61] DOJ IER fact sheet, How to Avoid Immigration-Related Discrimination When Complying with U.S. Export Control Laws (Apr. 18, 2023; PDF): https://www.justice.gov/crt/media/1287536/dl ; summary: https://www.hlc.com/en/publications/us-export-controls-compliance-while-avoiding-immigration-related-discrimination-doj-issues-guidance
- [S62] DOJ v. SpaceX (Aug. 2023) coverage: https://wsgr.com/en/insights/doj-sues-spacex-in-continuing-campaign-against-use-of-export-controls-to-justify-employment-discrimination.html
- [S63] CMMC DFARS final rule effective Nov. 10, 2025 (Phase 1; Phase 2 Nov. 10, 2026): https://www.schwabe.com/publication/dod-issues-final-rule-implementing-cmmc-requirements-in-dfars/ ; https://www.squirepattonboggs.com/en/insights/publications/2025/09/the-cmmc-dfars-final-rule-goes-live-ready-or-not-here-it-comes
- [S64] 32 CFR 170.19 (CMMC scoping; ESP Table 4), via Cornell LII: https://www.law.cornell.edu/cfr/text/32/170.19
- [S65] AWS Compliance, FedRAMP (GovCloud "Class D (formerly High baseline)"): https://aws.amazon.com/compliance/fedramp/

Contract norms, payments, tax

- [S66] Limitation-of-liability market norms: https://terms.law/insights/saas-liability-caps-california-case-law.html ; https://herzoglaw.co.il/wp-content/uploads/2024/02/Herzog-Tech-Division-Presents-Whats-Market-in-SaaS.pdf ; https://payproglobal.com/answers/what-is-saas-limitation-of-liability-lol-clause/
- [S67] Stripe Docs, Integration security guide (PCI DSS; TLS; webhooks): https://docs.stripe.com/security/guide
- [S68] Stripe, Guide to PCI compliance (Checkout/Elements: SAQ A; API: SAQ D): https://stripe.com/guides/pci-compliance
- [S69] PCI SSC FAQ 1588, How does an e-commerce merchant meet the SAQ A eligibility criteria for scripts? (Feb. 2025): https://pcisecuritystandards.org/faq/articles/Frequently_Asked_Question/how-does-an-e-commerce-merchant-meet-the-saq-a-eligibility-criteria-for-scripts
- [S70] SecurityMetrics, Big Changes for SAQ A (2025 updates for 11.6.1 and 6.4.3): https://maintenance.securitymetrics.com/blog/big-changes-for-saq-a ; Adyen, SAQ A eligibility: https://docs.adyen.com/development-resources/pci-dss-compliance-guide/saq-a-eligibility
- [S71] EisnerAmper, Colorado Expands Sales Tax to More Software Transactions Beginning in 2027 (HB 26-1223): https://www.eisneramper.com/insights/tax/colorado-expands-sales-tax-to-more-software-transactions-beginning-in-2027-0926/
- [S72] Weaver, Colorado Expands Sales Tax to Software, SaaS and Digital Products: https://weaver.com/resources/colorado-expands-sales-tax-to-software-saas-and-digital-products/ ; National Law Review: https://natlawreview.com/article/colorado-expands-sales-tax-saas-and-downloaded-software-beginning-jan-1-2027
- [S73] Vendor tables listing Colorado Springs as taxing SaaS (unconfirmed against city code): https://zamp.com/blog/colorado-taxes-saas-differently-by-city ; https://anrok.com/saas-sales-tax-by-state/colorado

FTC and marketing

- [S74] FTC, Advertising FAQ's: A Guide for Small Business: https://www.ftc.gov/business-guidance/resources/advertising-faqs-guide-small-business
- [S75] FTC case page, Wyndham Worldwide Corporation (complaint 2012; Third Circuit Aug. 24, 2015; order Dec. 11, 2015): https://www.ftc.gov/legal-library/browse/cases-proceedings/1023142-x120032-wyndham-worldwide-corporation
- [S76] FTC press release, FTC Requires Zoom to Enhance its Security Practices (Nov. 9, 2020): https://www.ftc.gov/news-events/news/press-releases/2020/11/ftc-requires-zoom-enhance-its-security-practices-part-settlement
- [S77] FTC press release, FTC Takes Action Against GoDaddy for Alleged Lax Data Security (Jan. 15, 2025): https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-takes-action-against-godaddy-alleged-lax-data-security-its-website-hosting-services ; finalization (May 21, 2025): https://www.hunton.com/privacy-and-cybersecurity-law-blog/ftc-issues-proposed-order-against-godaddy-and-provides-guidance-on-security-practices
- [S78] FTC, Start with Security: A Guide for Business: https://www.ftc.gov/business-guidance/resources/start-security-guide-business
- [S79] FTC press release, Final Rule Banning Fake Reviews and Testimonials (Aug. 14, 2024; 16 CFR Part 465): https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials
- [S80] SBA, Veteran contracting assistance programs (VetCert): https://www.sba.gov/federal-contracting/contracting-assistance-programs/veteran-contracting-assistance-programs
- [S81] Holland & Knight, SBA Establishes Certification Program for Veteran-Owned Small Businesses (Jan. 1, 2023 requirement): https://hklaw.com/en/insights/publications/2022/11/sba-establishes-certification-program-for-veteranowned
- [S82] 13 CFR 128.600 (VOSB/SDVOSB misrepresentation penalties), via Cornell LII: https://www.law.cornell.edu/cfr/text/13/128.600
- [S83] Crowell, OFCCP Completes Overhaul of Federal Contractor Compliance Framework (rules published Aug. 21, 2026): https://www.crowell.com/en/insights/client-alerts/ofccp-completes-overhaul-of-federal-contractor-compliance-framework-three-final-rules-rescind-eo-11246-regulations-narrow-section-503-affirmative-action
- [S84] 41 CFR 60-300.5 (VEVRAA equal opportunity clause; advertisement statement), via Cornell LII: https://www.law.cornell.edu/cfr/text/41/60-300.5
- [S85] 41 CFR 60-741.5 (Section 503 equal opportunity clause; advertisement statement), via Cornell LII: https://www.law.cornell.edu/cfr/text/41/60-741.5

Security disclosure

- [S86] RFC 9116, A File Format to Aid in Security Vulnerability Disclosure: https://www.rfc-editor.org/rfc/rfc9116.html
- [S87] NIST SP 800-53 Rev 5, RA-5(11) Public Disclosure Program, via CSF Tools: https://csf.tools/reference/nist-sp-800-53/r5/ra/ra-5/ra-5-11/
- [S88] DOJ Justice Manual 9-48.000, Computer Fraud and Abuse Act (charging policy, updated May 2022): https://www.justice.gov/jm/jm-9-48000-computer-fraud
- [S89] DC3 bulletin, 12-Month DIB-VDP Pilot Concludes (May 2, 2022): https://content.govdelivery.com/accounts/USDODDC3/bulletins/316004c
- [S90] DC3 and DCSA DIB-VDP announcement coverage: https://executivegov.com/articles/dc3-dcsa-unveil-defense-industrial-base-vulnerability-disclosure-program ; https://www.hackerone.com/press-release/dc3-and-dcsa-partner-announce-vulnerability-disclosure-program-defense-industrial
