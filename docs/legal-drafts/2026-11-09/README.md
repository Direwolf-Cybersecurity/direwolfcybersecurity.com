# Legal re-issue draft, 2026-11-09 (for counsel and the owner)

**Status: draft. Nothing here is published or in effect.** The site builds only
`src/content/legal/*.mdx` and `src/pages/security.astro`, and this draft changes neither. The
files in this folder are complete proposed new versions, ready to replace the published file
once counsel has reviewed them and the owner says yes.

**Why.** Owner decision 4 of 2026-11-09 ("Draft fixes for my review") on the combined decisions
sheet (owner's tools folder, `.direwolf-tools/roadmap/combined-decisions-and-build-order.md`
§2 decision 4), which also says every Terms and Privacy change ships as the counsel-reviewed
re-issue of decision 5, as a new version. The wording comes from the AI SOC plan's Option B
(`.direwolf-tools/aisoc/ai-soc-autonomy-plan.md` §7.3-§7.4), the platform improvement review of
2026-11-09 (items 3 and 9) and the compliance foundations plan (decisions 22 and 23, §5.5).
Claims register row L12 tracks this draft; rows A2, A7, A8, C1, L5, L8, L11 and P2 carry each
change.

| Draft file           | Replaces (published version)                          |
| -------------------- | ----------------------------------------------------- |
| `terms.mdx`          | `src/content/legal/terms.mdx`, v2026.10.25            |
| `privacy.mdx`        | `src/content/legal/privacy.mdx`, v2026.10.25          |
| `subprocessors.mdx`  | `src/content/legal/subprocessors.mdx`, v2026.10.25    |
| `acceptable-use.mdx` | `src/content/legal/acceptable-use.mdx`, v2026.10.24.2 |
| `cookies.mdx`        | `src/content/legal/cookies.mdx`, v2026.10.23          |
| `accessibility.mdx`  | `src/content/legal/accessibility.mdx`, v2026.10.28    |
| (passage below only) | `src/pages/security.astro`, policy v2026.10.29        |

Bracketed text, such as "[30] days", is an owner decision still to be made, as in the published
documents.

## The three changes

1. **People.** "A team of security professionals" and "our security professionals" become
   "Direwolf's security personnel" (Terms) or "Direwolf security personnel" (Privacy Policy),
   until two or more named people, employees or contracted partner staff, are on the escalation
   rota by contract. "Around the clock" stays only with the AI's automated work. Terms §3.1 adds
   that human response is provided during the coverage hours in the Order and on a
   reasonable-efforts basis outside them.
2. **Phishing simulation** is not offered (platform ADR 0060), so it leaves Terms §3.6, AUP §5.4
   and Privacy Policy §§3.4 and 4.
3. **Stripe, checkout and the billing portal** are removed (owner decision of 2026-11-09:
   owner-managed access, no Stripe). Fees are invoiced under the Order.

Also: Terms §12 puts company practices in the documenting tense (owner decision 4; compliance
foundations plan decision 23).

## Changed passages

### Terms of Service

| §    | Published (v2026.10.25)                                                                                                                                                                                                                                                   | Proposed                                                                                                                                                                                                                                                                                                                                                                            |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | "... or by purchasing a subscription."                                                                                                                                                                                                                                    | "... or by signing an Order that references them."                                                                                                                                                                                                                                                                                                                                  |
| 2    | "Service Data" ... "the feedback of our security professionals and your Users."                                                                                                                                                                                           | "... the feedback of Direwolf's security personnel and your Users."                                                                                                                                                                                                                                                                                                                 |
| 3.1  | "and its work is monitored by a team of security professionals, who take the cases it cannot decide. Nothing in these Terms commits Direwolf to a staffing level or to hours of coverage for that monitoring unless your Order states one."                               | "and its work is overseen by Direwolf's security personnel, who are alerted to major incidents and review the AI's decisions. Human response is provided during the coverage hours stated in your Order and on a reasonable-efforts basis outside them. Nothing in these Terms commits Direwolf to a staffing level, or to hours of human coverage beyond those your Order states." |
| 3.6  | "Direwolf performs penetration testing, including phishing simulation, only under rules of engagement ..." and "Every target, whether a network, system, application, cloud account or email recipient, must be listed ..."                                               | "Direwolf performs penetration testing only under rules of engagement ..." and "Every target, whether a network, system, application or cloud account, must be listed ..."                                                                                                                                                                                                          |
| 4.1  | "Administrators may ... download installers, buy and cancel subscriptions, and view your organization's audit log."                                                                                                                                                       | "Administrators may ... download installers, and view your organization's audit log."                                                                                                                                                                                                                                                                                               |
| 6.1  | "... for the term stated at checkout or in your Order. You may increase quantities at any time; increases are charged pro rata ..."                                                                                                                                       | "... for the term stated in your Order. You may increase quantities at any time by a written request that Direwolf confirms or by an amended Order; increases are invoiced pro rata ..."                                                                                                                                                                                            |
| 6.2  | "Payment processor. Payments are processed by Stripe. Direwolf never sees or stores your card number. By providing a payment method you authorize Stripe to charge it ... Invoices, receipts and payment-method management are provided through Stripe and the Platform." | "Invoices and payment. Direwolf invoices the fees stated in your Order [monthly in advance], by email to your billing contact. Invoices are due within [30] days of the invoice date and are payable by [ACH transfer or check], as the invoice states. Direwolf does not take card payments and does not collect or store payment card numbers."                                   |
| 6.3  | "The renewal term, the recurring charge, and how to cancel are shown at checkout and in your Platform billing page before you buy."                                                                                                                                       | "The renewal term, the recurring charge, and how to cancel are stated in your Order before you sign it."                                                                                                                                                                                                                                                                            |
| 6.4  | "You may cancel a subscription at any time, in one step, from the Platform billing page or the billing portal linked from it, without having to contact us."                                                                                                              | "You may cancel a subscription at any time, in one step, by emailing legal@direwolfcybersecurity.com from an administrator's or your billing contact's email address of record; we will confirm the cancellation by email."                                                                                                                                                         |
| 6.5  | "Prices are those shown at checkout or in your Order."                                                                                                                                                                                                                    | "Prices are those stated in your Order."                                                                                                                                                                                                                                                                                                                                            |
| 6.7  | "If a payment fails, Stripe will retry it and we will email your billing contact."                                                                                                                                                                                        | "If an invoice is not paid when due, we will email your billing contact."                                                                                                                                                                                                                                                                                                           |
| 7.1  | "... for separate acceptance in the purchase flow."                                                                                                                                                                                                                       | "... for separate acceptance before we provision the product."                                                                                                                                                                                                                                                                                                                      |
| 10.1 | "acting through its automated systems and its security professionals"                                                                                                                                                                                                     | "acting through its automated systems and its security personnel"                                                                                                                                                                                                                                                                                                                   |
| 10.5 | "Direwolf's security professionals or your administrators will decide."                                                                                                                                                                                                   | "Direwolf's security personnel or your administrators will decide."                                                                                                                                                                                                                                                                                                                 |
| 12   | "The Platform and our internal practices are built and operated to align with NIST SP 800-171 Rev. 2, the standard that CMMC Level 2 is based on. Direwolf is preparing for a CMMC Level 2 assessment."                                                                   | "The Platform is built to align with NIST SP 800-171 Rev. 2, the standard that CMMC Level 2 is based on, and our company policies and records are being documented as part of preparing for a CMMC Level 2 assessment."                                                                                                                                                             |
| 15   | "SentinelOne, AWS, Stripe and other product names ..."                                                                                                                                                                                                                    | "SentinelOne, AWS and other product names ..."                                                                                                                                                                                                                                                                                                                                      |

### Privacy Policy

| §   | Published (v2026.10.25)                                                                                                                                                                                                                                  | Proposed                                                                                                                                                                                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.2 | Billing data: "... the brand, last four digits and expiry of a payment card, and payment status. Full card numbers are handled by our payment processor and never reach Direwolf"; source "Your organization's administrators and our payment processor" | "... subscription and invoice history, and payment status. Direwolf does not take card payments and does not collect payment card numbers"; source "Your organization's administrators" |
| 3.2 | Support communications: "notes exchanged with our security professionals about an alert"                                                                                                                                                                 | "notes exchanged with Direwolf security personnel about an alert"                                                                                                                       |
| 3.4 | "For phishing simulation, we receive the names and work email addresses of the staff your organization asks us to include, and we record how each person responded to the simulated messages."                                                           | Removed.                                                                                                                                                                                |
| 4   | "... notify administrators, support monitoring by our team of security professionals"                                                                                                                                                                    | "... notify administrators, and support Direwolf security personnel, who oversee the AI SOC and handle the cases referred to a person"                                                  |
| 4   | "Perform the penetration tests your organization orders, including phishing simulation, ..."; "... phishing-simulation recipients and their responses"                                                                                                   | "Perform the penetration tests your organization orders and prepare their reports"; "Engagement contacts, targets and test accounts"                                                    |
| 4   | "... agree with the decisions of our security professionals"; "can be reviewed by our security professionals"                                                                                                                                            | "... agree with the decisions of Direwolf security personnel"; "can be reviewed by Direwolf security personnel"                                                                         |
| 5   | "The AI SOC's work is monitored by a team of security professionals, who take the cases it cannot decide."                                                                                                                                               | "The AI SOC's work is overseen by Direwolf security personnel, who are alerted to major incidents and handle the cases referred to a person."                                           |
| 6   | Subprocessors summary: "Stripe (payment processing and subscription billing);"                                                                                                                                                                           | Removed.                                                                                                                                                                                |
| 7   | "... except to the endpoint protection vendor's cloud that your sensors already report to, to our payment processor for billing, and in email ..."                                                                                                       | "... except to the endpoint protection vendor's cloud that your sensors already report to, and in email ..."                                                                            |

### Subprocessors, AUP, Cookie Notice, Accessibility Statement, Security page

| Document                              | Published                                                                                                                                                                                     | Proposed                                                                                                                                                                                |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Subprocessors (v2026.10.25)           | The "Stripe, Inc." row (payment processing, invoicing, subscription billing, renewal reminders and the self-service billing portal).                                                          | Row removed.                                                                                                                                                                            |
| Subprocessors                         | SentinelOne's licence terms, "which you accept when you buy its product through the Platform."                                                                                                | "which you accept before Direwolf provisions its product for you."                                                                                                                      |
| AUP §5.4 (v2026.10.24.2)              | "... including any permission a hosting, cloud or other service provider requires, and include in a phishing simulation only your own staff's work email addresses, never personal accounts." | "... including any permission a hosting, cloud or other service provider requires."                                                                                                     |
| Cookie Notice (v2026.10.23)           | "Payment pages. When you buy a subscription you are taken to a checkout page hosted by Stripe, our payment processor. Stripe sets its own cookies ..."                                        | Section removed.                                                                                                                                                                        |
| Accessibility Statement (v2026.10.28) | "Third-party software. Some tasks, such as the Stripe checkout page, take place in software we do not build."                                                                                 | "Third-party software. Some tasks may take place in software we do not build."                                                                                                          |
| Security page (policy v2026.10.29)    | Out of scope: "our hosting providers (GitHub for this website, Amazon Web Services for the Platform), our payment processor (Stripe), and SentinelOne's products and cloud."                  | "our hosting providers (GitHub for this website, Amazon Web Services for the Platform) and SentinelOne's products and cloud." (new policy version, nothing a researcher may do changes) |

## Questions for counsel on these passages

1. Does "Direwolf's security personnel" or "a Direwolf security professional" (the website's
   form) imply more than one person? (AI SOC autonomy plan, question U15.)
2. Terms §3.1 refers to coverage hours "stated in your Order", and no Order Form exists yet
   (decision 5 drafts one). Is the sentence safe to publish before the Order Form, given that
   §3.5 also points to the Order?
3. Terms §6.4: is cancellation by email, with a written confirmation, enough under the automatic
   renewal laws that apply to business customers in Colorado and elsewhere, now that there is no
   online billing page?
4. Terms §1 and §4.1 still describe a customer who creates its own organization; under
   owner-managed access Direwolf creates each organization from a signed Order. This draft only
   removes the purchase and billing wording; the account-creation wording is left for the Order
   Form work.
5. Removing Stripe from the Subprocessors list: the list's "Changes" section requires 30 days'
   notice only for adding or replacing a subprocessor. Confirm no notice is needed for a removal
   (no customer organization exists yet).

## Not in this draft (for the counsel session of decision 5)

Decision 2's customer-control wording (Terms §3.1's Response Policy sentence, §4.1, §10.1-§10.5;
drafted separately by SOC-1); §9's "at your own risk" PHI path and the BAA gate; §8.4 deletion
matched to locked storage; the §11.2 incident-notice clock; §2's list of the services actually
sold (it names four); §3.3 "Roadmap features" and §9's CUI-repository sentence (runbook gate
G21); collective defense §8.6 and §14; the US-person statement (Terms §13 TODO); the business
mailing address and entity type (gates G2 and G4).

## At publication

1. Counsel's comments applied; the owner's yes recorded.
2. For each file: set `version` and `effectiveDate` to the publication day, set `status:
published`, remove the draft comment, and replace the file in `src/content/legal/`.
3. Security page: apply the passage above and bump `policyVersion` with a note in its comment.
4. Claims register: rows A2, A7, A8, C1, L5, L8, L11, L12 and P2 record the published versions.
5. The platform records which version each user accepted, so the new Terms, Privacy Policy, AUP
   and Subprocessors versions are presented for acceptance (Terms §21: 30 days' notice of a
   material change to existing customers' administrators).
