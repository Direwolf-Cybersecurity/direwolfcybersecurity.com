import type { IconName } from './icons';
import type { ImageSlotId } from './images';
import type { ProductId } from './pricing';
import type { StatId } from './stats';

/**
 * Services and the roadmap. Owner direction 2026-10-24: Direwolf is an AI-driven managed
 * security services provider (MSSP) for any small or mid-size business, with no endpoint
 * management or RMM service. Only `services` may be described as offered; `roadmap` items are
 * always labelled as roadmap on the site (CLAUDE.md, register rule 9). Every statement below is
 * in docs/claims-register.md (rows A1-A4, A6-A8, C5, R1). While PLATFORM_LIVE is false, bullets
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

export interface RoadmapItem {
  name: string;
  summary: string;
}

/** Later services (register row R1). Never described as available. */
export const roadmap: RoadmapItem[] = [
  {
    name: 'Vulnerability scanning',
    summary: 'Scheduled external scans, with findings in the same alert queue.',
  },
  {
    name: 'Dark web monitoring',
    summary: 'Searches for your domains and accounts in breach data.',
  },
  {
    name: 'Security awareness training',
    summary: 'Short courses for your staff, with completion tracking.',
  },
  {
    name: 'GRC and compliance tracker',
    summary: 'Control status, evidence and plans of action in one place.',
  },
];
