import type { IconName } from './icons';
import type { ImageSlotId } from './images';
import type { ProductId } from './pricing';
import type { StatId } from './stats';

/**
 * Services and the roadmap. Owner direction 2026-10-24: Direwolf is an AI-driven managed
 * security services provider (MSSP) for any small or mid-size business, with no endpoint
 * management or RMM service. Only `services` may be described as offered; `roadmap` items are
 * always labelled as roadmap on the site (CLAUDE.md, register rule 9). Every statement below is
 * in docs/claims-register.md (rows A1-A4, A6-A8, C5, R1-R11). While PLATFORM_LIVE is false, bullets
 * that describe the Direwolf Platform use the future tense (row W6). The MDR lede and bullets
 * name only the AI roles built in the platform's code (analysts triage and investigate,
 * responders contain); the detection-engineer and advisor agents are owner intent, not built, so
 * this file never names them (row A8). Each idea is said once: the lede carries the roles and
 * the oversight, the bullets the detail.
 *
 * Vendor names: the endpoint protection vendor is not named anywhere in this file until the
 * partner agreement is signed (register rule 5, rows V1 and A4). When the gate closes, update
 * the register row first, then this file.
 */

export interface Service {
  /** Anchor on /services/ and the card link target. */
  id: string;
  name: string;
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
  /** Contact-form topic preselected by the section's quote link (ContactForm.astro). */
  contactTopic: 'mdr' | 'endpoint-protection' | 'penetration-testing' | 'compliance-readiness';
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
    kicker: 'Powered by the Direwolf AI SOC',
    icon: 'radar',
    summary: 'The Direwolf AI SOC triages every endpoint alert and contains confirmed threats.',
    lede: 'AI security analysts and responders work every alert from your endpoints around the clock. Our team of security professionals oversees their work and takes the cases the AI cannot decide.',
    whatYouGet: [
      'AI analysts triage and investigate each alert, returning a verdict, a confidence level, a MITRE ATT&CK mapping and a plain-English summary.',
      'AI responders contain confirmed threats (stop the process, quarantine the file, isolate the host) under guardrails you control, with one-click undo.',
      'Email alerts for your administrators, and a dashboard in the Direwolf Platform that will show alerts, sensor health and your audit log.',
    ],
    whoItIsFor:
      'Businesses without an in-house security team that want threats handled, not just reported.',
    productId: 'mdr',
    contactTopic: 'mdr',
    image: 'mdr',
  },
  {
    id: 'endpoint-protection',
    name: 'Managed endpoint protection (EDR)',
    kicker: 'Enterprise EDR on every endpoint',
    icon: 'shield-check',
    summary:
      'An enterprise EDR agent on every endpoint, bound to your organization, with alerts flowing into the AI SOC.',
    lede: 'Replace legacy antivirus with an enterprise endpoint detection and response (EDR) agent on your Windows, macOS and Linux endpoints, reporting to the Direwolf AI SOC from its first check-in.',
    whatYouGet: [
      'EDR licenses for Windows, macOS and Linux, which will be bought and managed from the Direwolf Platform.',
      'A dedicated tenant for your organization, provisioned automatically when you buy.',
      'Installers bound to your organization, so every sensor reports to the right place.',
      'Sensors that go offline or fall out of date will be flagged in your dashboard.',
    ],
    whoItIsFor:
      'Businesses replacing consumer or legacy antivirus with modern endpoint protection.',
    productId: 'endpoint-protection',
    contactTopic: 'endpoint-protection',
  },
  {
    id: 'penetration-testing',
    name: 'Penetration testing',
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
    contactTopic: 'penetration-testing',
    image: 'pentest',
    stat: 'S-STAT-5',
  },
  {
    id: 'compliance-readiness',
    name: 'Compliance readiness',
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
    contactTopic: 'compliance-readiness',
    footnote:
      'Readiness support only. Direwolf does not certify organizations and is not an assessor.',
  },
];

/** The three groups the Services page sorts the roadmap into, in display order. */
export const roadmapGroups = [
  { id: 'exposure', title: 'Exposure and posture' },
  { id: 'compliance', title: 'Compliance and evidence' },
  { id: 'readiness', title: 'Readiness and advisory' },
] as const;

export type RoadmapGroupId = (typeof roadmapGroups)[number]['id'];

export interface RoadmapItem {
  /** Short name, shown on Services and, when `homeTag` is set, as a Home roadmap tag. */
  name: string;
  /** One or two sentences for the Services roadmap section. */
  summary: string;
  group: RoadmapGroupId;
  /**
   * Show the name as a tag on Home (design-direction rule 6: a single muted row of tags). Set on
   * four items only (rows R2-R5), so the roadmap does not outweigh the four services there.
   */
  homeTag?: boolean;
}

/**
 * Services planned for the platform's launch (owner direction 2026-10-27; register rows R1 to
 * R11, one row per item). Never described as available, never priced, and always under the
 * "Roadmap" label (register rule 9). Each item stays here until its register row's gate closes
 * (its platform milestone in service); it then moves to a service row and to `services` above.
 * The AI that will do much of this work is described once, in the Services roadmap lede, with
 * row A2's oversight wording, so no summary below repeats it.
 *
 * Honest names: "Breach-exposure monitoring", never "dark web monitoring" (row R3); scanning is
 * "authorized" and "not a penetration test" (row R2); the GRC tracker is "readiness support
 * only" and never says "ready" or "certified" (rule 4, row R5); the security officer program
 * names no one and never says "Qualified Individual" (row R11).
 */
export const roadmap: RoadmapItem[] = [
  {
    name: 'Authorized external vulnerability scanning',
    summary:
      'Scheduled scans of the internet-facing addresses you authorize in writing, with findings in the same queue as your alerts. Not a penetration test.',
    group: 'exposure',
    homeTag: true,
  },
  {
    name: 'Breach-exposure monitoring',
    summary: 'Searches for your domains and accounts in breach data.',
    group: 'exposure',
    homeTag: true,
  },
  {
    name: 'Microsoft 365 and Google Workspace posture reviews',
    summary:
      'Checks of settings such as MFA coverage, admin accounts and stale users, with a short list of what to fix first.',
    group: 'exposure',
  },
  {
    name: 'GRC compliance tracker',
    summary:
      'Mark each requirement not started, in progress or complete, and attach evidence, notes and policies. Exports include a NIST SP 800-171 System Security Plan and POA&M that show the evidence. Readiness support only.',
    group: 'compliance',
    homeTag: true,
  },
  {
    name: 'Cyber-insurance evidence pack',
    summary:
      'Dated evidence for each security question on your cyber-insurance application or renewal. Your executive reviews and signs the carrier’s form.',
    group: 'compliance',
  },
  {
    name: 'Security questionnaire engine',
    summary:
      'Draft answers to the security questionnaires your customers send, each citing its evidence. Anything we cannot cite is marked Unknown, and you review and sign.',
    group: 'compliance',
  },
  {
    name: 'Risk analysis',
    summary:
      'A dated, versioned risk analysis of your business, drafted from your profile and evidence, for you to review and approve.',
    group: 'compliance',
  },
  {
    name: 'Incident-response readiness',
    summary:
      'An incident-response plan, an annual tabletop exercise and tracking of the notification deadlines that may apply, for your counsel to decide.',
    group: 'readiness',
  },
  {
    name: 'Security awareness training',
    summary: 'Short courses for your staff, with completion tracking.',
    group: 'readiness',
    homeTag: true,
  },
  {
    name: 'Fractional security officer program',
    summary:
      'Ongoing security program leadership from our team, with AI keeping the obligations calendar and drafting the reports and policies.',
    group: 'readiness',
  },
];
