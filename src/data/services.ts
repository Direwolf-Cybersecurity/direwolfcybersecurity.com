import type { IconName } from './icons';
import type { ImageSlotId } from './images';
import type { ProductId } from './pricing';
import type { StatId } from './stats';

/**
 * Services. Owner direction 2026-10-24: Direwolf is an AI-driven managed security services
 * provider (MSSP) for any small or mid-size business, with no endpoint management or RMM service.
 * Owner decision 2026-10-29: the site shows no roadmap; the services that were listed as planned
 * for launch are current services (claims register rule 9, rows R2-R12), so this file has no
 * roadmap list. Every statement below is in docs/claims-register.md (rows A1-A4, A6-A9, C5,
 * R2-R12).
 *
 * How the services are worded (rule 9): each is a service Direwolf's team delivers to a customer,
 * described by its outcome and deliverable, never as a feature of the Direwolf Platform's software
 * while that platform is not in service (`PLATFORM_LIVE` in src/config.ts). So no "engine",
 * "dashboard", "portal", "tracker" (as software), "in the same queue as your alerts" or "real
 * time"; readiness, never "ready", "certified" or "compliant"; scanning is never called a
 * penetration test, and the reverse; "Breach-exposure monitoring", never "dark web monitoring".
 *
 * The MDR lede and bullets name only the AI roles built in the platform's code (analysts triage
 * and investigate, responders contain); the detection-engineer and advisor agents are owner
 * intent, not built, so this file never names them (row A8).
 *
 * Vendor names: the endpoint protection vendor is not named anywhere in this file until the
 * partner agreement is signed (register rule 5, rows V1 and A4). Microsoft 365 and Google
 * Workspace are named only as the customer's own services (row R7).
 */

/**
 * The four groups the Services page sorts every service into, in display order (owner request
 * 2026-10-29: show the services without overwhelming the reader). `id` is the section anchor on
 * /services/; `lede` is one sentence of 25 words or fewer (docs/design-direction.md rule 12).
 */
export const serviceGroups = [
  {
    id: 'detect-and-respond',
    icon: 'radar',
    title: 'Detect and respond',
    lede: 'Endpoint protection on every device, every alert investigated, and confirmed threats contained under guardrails you control.',
  },
  {
    id: 'test-and-harden',
    icon: 'crosshair',
    title: 'Test and harden',
    lede: 'Find the weak spots attackers look for in your systems and settings, train your staff, and get a clear list of what to fix first.',
  },
  {
    id: 'comply-and-prove',
    icon: 'clipboard-check',
    title: 'Comply and prove',
    lede: 'Readiness for NIST SP 800-171, CMMC and similar frameworks, and the evidence your insurers and customers ask for.',
  },
  {
    id: 'plan-and-lead',
    icon: 'compass',
    title: 'Plan and lead',
    lede: 'Security leadership and a plan your business can follow, without a full-time security hire.',
  },
] as const satisfies readonly { id: string; icon: IconName; title: string; lede: string }[];

export type ServiceGroupId = (typeof serviceGroups)[number]['id'];

/**
 * A service with its own detailed section on /services/ (the four original services). Its `id` is
 * the section anchor, the Home card's link target and the contact-form topic code that the
 * section's quote link preselects (ContactForm.astro).
 */
export interface Service {
  id: 'mdr' | 'endpoint-protection' | 'penetration-testing' | 'compliance-readiness';
  name: string;
  group: ServiceGroupId;
  /** Short line above the name on the Services page. */
  kicker: string;
  icon: IconName;
  /** One sentence of 20 words or fewer, for the Home card. */
  summary: string;
  /** One or two benefit-led sentences for the Services page. */
  lede: string;
  /** Three to five bullets. */
  whatYouGet: string[];
  /** One sentence. */
  whoItIsFor: string;
  productId: ProductId;
  /** Owner-supplied image beside the section, when its file exists (src/data/images.ts). */
  image?: ImageSlotId;
  /** A cited third-party statistic shown in the section (register rule 13). */
  stat?: StatId;
  /** Note shown under the section. */
  footnote?: string;
}

export const services: Service[] = [
  {
    id: 'mdr',
    name: 'Managed detection and response',
    group: 'detect-and-respond',
    kicker: 'Powered by the Direwolf AI SOC',
    icon: 'radar',
    summary: 'The Direwolf AI SOC triages every endpoint alert and contains confirmed threats.',
    lede: 'AI security analysts and responders work every alert from your endpoints around the clock. Our team of security professionals oversees their work and takes the cases the AI cannot decide.',
    whatYouGet: [
      'AI analysts triage and investigate each alert, returning a verdict, a confidence level, a MITRE ATT&CK mapping and a plain-English summary.',
      'AI responders contain confirmed threats (stop the process, quarantine the file, isolate the host) under guardrails you control, with one-click undo.',
      'Email alerts for your administrators, with a plain-English summary of each alert and a full record of every action taken.',
    ],
    whoItIsFor:
      'Businesses without an in-house security team that want threats handled, not just reported.',
    productId: 'mdr',
    image: 'mdr',
  },
  {
    id: 'endpoint-protection',
    name: 'Managed endpoint protection (EDR)',
    group: 'detect-and-respond',
    kicker: 'Enterprise EDR on every endpoint',
    icon: 'shield-check',
    summary:
      'An enterprise EDR agent on every endpoint, bound to your organization, with alerts flowing into the AI SOC.',
    lede: 'Replace legacy antivirus with an enterprise endpoint detection and response (EDR) agent on your Windows, macOS and Linux endpoints, reporting to the Direwolf AI SOC from its first check-in.',
    whatYouGet: [
      // Not "licenses": Direwolf supplies EDR licenses only once the partner agreement is signed
      // (rows V1 and A4).
      'Enterprise EDR for Windows, macOS and Linux, deployed and managed by Direwolf.',
      'A dedicated endpoint-protection tenant for your organization.',
      'Installers bound to your organization, so every sensor reports to the right place.',
      'We flag sensors that go offline or fall out of date.',
    ],
    whoItIsFor:
      'Businesses replacing consumer or legacy antivirus with modern endpoint protection.',
    productId: 'endpoint-protection',
  },
  {
    id: 'penetration-testing',
    name: 'Penetration testing',
    group: 'test-and-harden',
    kicker: 'See your business the way an attacker would',
    icon: 'crosshair',
    summary:
      'Scoped tests of your networks, web applications, cloud and email defenses, with a written report.',
    lede: 'We agree the scope with you, test it, and deliver a written report of what we found and how to fix it.',
    whatYouGet: [
      'External and internal network penetration testing.',
      'Web application testing.',
      'Cloud configuration testing.',
      'Phishing simulation for your staff.',
      'A scoped engagement and a written report of findings and recommended fixes.',
    ],
    whoItIsFor:
      'Businesses that need a test for a customer, an insurer, a compliance program or their own peace of mind.',
    productId: 'penetration-testing',
    image: 'pentest',
    stat: 'S-STAT-5',
  },
  {
    id: 'compliance-readiness',
    name: 'Compliance readiness',
    group: 'comply-and-prove',
    kicker: 'NIST SP 800-171, CMMC and similar frameworks',
    icon: 'clipboard-check',
    summary:
      'Gap assessments, security plan drafting and assessment preparation for NIST SP 800-171, CMMC and similar frameworks.',
    lede: 'Know where you stand before an assessor asks. We map your environment to the framework, document the gaps and help you prepare.',
    whatYouGet: [
      'Gap assessment against NIST SP 800-171 Rev. 2, CMMC Level 2 or a similar framework.',
      'Drafting of your System Security Plan and plan of action and milestones (POA&M).',
      'Assessment preparation, including which responsibilities Direwolf services cover and which remain yours.',
    ],
    whoItIsFor:
      'Government contractors and other businesses with a framework to meet, by contract or by choice.',
    productId: 'compliance-readiness',
    footnote:
      'Readiness support only. Direwolf does not certify organizations and is not an assessor.',
  },
];

/**
 * The other services (owner decision 2026-10-29; register rows R2-R12, one row per service), each
 * shown on /services/ as a short card in its group: the name, one sentence and what you get. `id`
 * is the card's anchor on /services/ and the contact-form topic code its quote link preselects.
 * Priced per engagement: "contact us" (row P1), so no product and no price here.
 */
export interface MoreService {
  id: string;
  name: string;
  group: ServiceGroupId;
  icon: IconName;
  /** One sentence, 25 words or fewer. */
  summary: string;
  /** The deliverable, as a short noun phrase. */
  youGet: string;
  /** Show the name as a linked tag on Home, after the four service cards (four items). */
  homeTag?: boolean;
}

export const moreServices: MoreService[] = [
  {
    id: 'breach-exposure-monitoring',
    name: 'Breach-exposure monitoring',
    group: 'detect-and-respond',
    icon: 'key-round',
    summary:
      'We check your domains and staff accounts against known breach data and tell you which passwords to reset.',
    youGet: 'A breach-exposure report on an agreed schedule.',
    homeTag: true,
  },
  {
    id: 'managed-firewall',
    name: 'Managed firewall',
    group: 'detect-and-respond',
    icon: 'network',
    summary:
      'We set up your firewall to a security baseline, keep it updated, watch its security events and review its rules every quarter.',
    youGet: 'A hardened, patched firewall and a quarterly rule review.',
  },
  {
    id: 'incident-response-readiness',
    name: 'Incident-response readiness',
    group: 'detect-and-respond',
    icon: 'list-checks',
    summary:
      'An incident-response plan, a tabletop exercise with your team, and the notification deadlines that may apply, for your counsel to confirm.',
    youGet: 'A written plan, an annual tabletop exercise and a deadlines list.',
  },
  {
    id: 'vulnerability-scanning',
    name: 'Vulnerability scanning',
    group: 'test-and-harden',
    icon: 'scan-search',
    summary:
      'Scheduled scans of the internet-facing systems you authorize in writing, with findings ranked so you fix the most serious first. Not a penetration test.',
    youGet: 'A scan report after every scheduled scan.',
    homeTag: true,
  },
  {
    id: 'workspace-security-reviews',
    name: 'Microsoft 365 and Google Workspace security reviews',
    group: 'test-and-harden',
    icon: 'cloud',
    summary:
      'A review of settings such as MFA coverage, admin accounts and stale users, with a short list of what to fix first.',
    youGet: 'A prioritized list of setting changes for your administrator.',
  },
  {
    id: 'security-awareness-training',
    name: 'Security awareness training',
    group: 'test-and-harden',
    icon: 'graduation-cap',
    summary: 'Short security courses for your staff, with a completion record for each person.',
    youGet: 'Courses, reminders and a training completion record.',
    homeTag: true,
  },
  {
    id: 'compliance-tracking',
    name: 'Compliance tracking (GRC)',
    group: 'comply-and-prove',
    icon: 'folder-check',
    summary:
      'After your gap assessment, we keep each requirement’s status, evidence and plan of action current with you, and update your System Security Plan and POA&M.',
    youGet: 'Control status, evidence and a plan of action, kept current. Readiness support only.',
    homeTag: true,
  },
  {
    id: 'cyber-insurance-readiness',
    name: 'Cyber-insurance readiness',
    group: 'comply-and-prove',
    icon: 'umbrella',
    summary:
      'Dated evidence for each security question on your cyber-insurance application or renewal, for your executive to review before signing the carrier’s form.',
    youGet: 'An evidence pack keyed to your carrier’s questions.',
  },
  {
    id: 'security-questionnaires',
    name: 'Security questionnaire support',
    group: 'comply-and-prove',
    icon: 'clipboard-list',
    summary:
      'Draft answers to the security questionnaires your customers send, each citing its evidence. Anything we cannot support is marked unknown, and you review and sign.',
    youGet: 'Draft answers with their evidence, for your review and signature.',
  },
  {
    id: 'risk-analysis',
    name: 'Risk analysis',
    group: 'plan-and-lead',
    icon: 'file-search',
    summary:
      'A dated, versioned risk analysis of your business, drafted from your profile and evidence, for you to review and approve.',
    youGet: 'A risk analysis document that is yours to keep.',
  },
  {
    id: 'fractional-security-officer',
    name: 'Fractional security officer',
    group: 'plan-and-lead',
    icon: 'compass',
    summary:
      'Ongoing security program leadership from our team: a security plan, regular reviews, and the policies and reports your business needs, drafted for your approval.',
    youGet: 'Regular reviews, a security plan, and policies and reports.',
  },
];

/** Every group with its detailed services and its other services, in display order. */
export const servicesByGroup = serviceGroups.map((group) => ({
  ...group,
  featured: services.filter((service) => service.group === group.id),
  more: moreServices.filter((service) => service.group === group.id),
}));
