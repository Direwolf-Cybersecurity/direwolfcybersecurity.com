import type { ProductId } from './pricing';

/**
 * Services offered at launch and the roadmap. Only `launchServices` may be described as
 * available; `roadmap` items are always labeled as roadmap on the site (CLAUDE.md,
 * platform PLAN.md section 14.5). Every factual statement below is in docs/claims-register.md.
 *
 * Vendor names: the endpoint protection and endpoint management vendors are not named
 * anywhere in this file until the partner agreements are signed (register rule 5, rows
 * V1/V2 and A4/A5). When a gate closes, update the register row first, then this file.
 */

export interface Service {
  id: string;
  name: string;
  /** One sentence for cards and teasers. */
  summary: string;
  /** Two or three sentences for the services page. */
  description: string;
  whatYouGet: string[];
  whoItIsFor: string[];
  productId: ProductId;
  /** Trademark or reseller note shown under the section. */
  footnote?: string;
}

export const launchServices: Service[] = [
  {
    id: 'ai-soc',
    name: 'Direwolf AI SOC',
    summary:
      '24x7 AI-run security operations for your endpoints, with a human analyst reviewing the decisions that matter.',
    description:
      'Every alert from your endpoints is triaged by our AI analyst around the clock: enriched with context about your organization, given a verdict and a plain-English summary, and, when a threat is confirmed, contained automatically under guardrails you control. A Direwolf analyst reviews what the AI did and handles anything it could not decide.',
    whatYouGet: [
      'Around-the-clock monitoring of endpoint detection alerts from your sensors.',
      'AI triage of every alert with a verdict, a confidence level, and a summary written for people who are not security specialists.',
      'Automatic containment of confirmed threats (stopping the process, quarantining the file, isolating the host) under per-organization guardrails, with one-click undo.',
      'Human analyst review of autonomous actions and of every alert the AI could not decide.',
      'A dashboard with open alerts, sensor health, license usage, users, and your organization’s own audit log.',
      'Email notifications to your administrators for confirmed threats and the actions taken.',
    ],
    whoItIsFor: [
      'Small and mid-size organizations without a security team of their own.',
      'Government contractors who need monitoring, incident handling, and the evidence trail that goes with them.',
      'Firms that want security operations without buying hardware or hiring analysts.',
    ],
    productId: 'ai-soc',
  },
  {
    id: 'endpoint-protection',
    name: 'Managed endpoint protection',
    summary:
      'An enterprise EDR agent deployed to your endpoints and bound to your organization, with alerts flowing into the Direwolf AI SOC.',
    description:
      'Your endpoint protection is the platform our SOC is built around. We set up a dedicated tenant for your organization and give you installers that are tied to it, so every sensor reports to the right place from its first check-in and every alert flows into the Direwolf AI SOC.',
    whatYouGet: [
      'Endpoint protection licenses for Windows, macOS, and Linux endpoints, purchased and managed from the Direwolf Platform.',
      'A dedicated tenant for your organization, provisioned automatically when you buy.',
      'Installers and install commands bound to your organization, downloadable by your administrators.',
      'Seat tracking in your dashboard, with sensors that go offline or fall out of date flagged.',
      'Response actions carried out through your endpoint protection by the Direwolf AI SOC.',
    ],
    whoItIsFor: [
      'Organizations replacing consumer or legacy antivirus with a modern endpoint protection platform.',
      'Teams that want one vendor to license, deploy, and monitor their endpoint protection.',
    ],
    productId: 'endpoint-protection',
  },
  {
    id: 'endpoint-management',
    name: 'Endpoint management',
    summary:
      'Remote monitoring, patching and inventory for your fleet through an enterprise RMM platform, managed under your Direwolf organization.',
    description:
      'Endpoint management keeps your devices inventoried, patched, and reachable. We set up a tenant for your organization on an enterprise remote monitoring and management platform, with an installer bound to it, so you can manage your fleet from day one.',
    whatYouGet: [
      'Endpoint management licenses, purchased and managed from the Direwolf Platform.',
      'A tenant set up for your organization, with an installer bound to it.',
      'Device inventory, operating system and software patching, remote management, and automation.',
    ],
    whoItIsFor: [
      'Organizations without an IT team who need their devices kept patched and inventoried.',
      'Contractors who need patching and configuration evidence for their compliance program.',
    ],
    productId: 'endpoint-management',
  },
  {
    id: 'compliance-guidance',
    name: 'NIST SP 800-171 and CMMC guidance',
    summary:
      'Practical help understanding what NIST SP 800-171 and CMMC Level 2 ask of you, and how Direwolf services fit into your program.',
    description:
      'Our team has worked inside regulated industries and understands what an assessor will ask. We help you understand the requirements, show where Direwolf services apply, and document the responsibilities that remain yours, so your security program and your assessment tell the same story.',
    whatYouGet: [
      'Gap assessment against NIST SP 800-171 Rev. 2.',
      'System Security Plan and POA&M drafting.',
      'Assessment preparation, including how Direwolf services fit into your program and which responsibilities remain yours.',
    ],
    whoItIsFor: [
      'Department of Defense contractors and subcontractors with DFARS safeguarding and CMMC obligations.',
      'Any organization preparing for an assessment that needs clear answers about an external service provider.',
    ],
    productId: 'compliance-guidance',
    footnote:
      'Guidance only. Direwolf does not certify organizations and is not an assessor; see our Compliance page for the current status of the CMMC program.',
  },
];

export interface RoadmapItem {
  name: string;
  summary: string;
}

/** Later services. Never described as available. */
export const roadmap: RoadmapItem[] = [
  {
    name: 'GRC and compliance tracker',
    summary:
      'Track NIST SP 800-171 control status, implementation statements, evidence, and plans of action in one place, and export a system security plan.',
  },
  {
    name: 'Security awareness training',
    summary:
      'Short courses on phishing, malware, social engineering, CUI handling, and acceptable use, with completion tracking that feeds your compliance evidence.',
  },
  {
    name: 'Dark-web exposure monitoring',
    summary:
      'Scheduled searches for your domains and accounts in breach data, with findings routed into the same alert queue.',
  },
  {
    name: 'Vulnerability scanning',
    summary: 'External vulnerability scanning with findings normalized alongside your alerts.',
  },
  {
    name: 'Network mapping',
    summary:
      'Discovery of the devices and applications on your network, starting from sensor telemetry.',
  },
  {
    name: 'Secure CUI document repository',
    summary:
      'A managed repository for controlled unclassified information, subject to the authorization path that storing CUI requires.',
  },
  {
    name: 'Direwolf sensor and SIEM',
    summary:
      'Our own lightweight endpoint sensor and log platform, designed to lower per-endpoint cost over time.',
  },
];
