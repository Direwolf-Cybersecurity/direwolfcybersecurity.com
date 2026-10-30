/**
 * "How Direwolf fits into your business" (src/components/ServiceFit.astro, on /services/; owner
 * request 2026-10-29: a simple graphic of how Direwolf and its services fit into a customer's
 * business, not overcomplicated). Every visible string is here, and each is in
 * docs/claims-register.md row D2, verbatim.
 *
 * Three bands, left to right from 1,024 px and top to bottom below it, with nine labelled items in
 * all (the owner's "not overcomplicated": at most nine). The MDR item names only the AI roles built
 * in the platform's code and carries the oversight (rows A8 and A2); no AI role has a person icon.
 * The caption is the figure's text equivalent: it says in words what the arrows (decorative,
 * aria-hidden) show.
 *
 * Only the computers and servers report to Direwolf (through the EDR, to MDR). The customer's
 * Microsoft 365 or Google Workspace and its websites and internet-facing systems are what Direwolf
 * reviews and tests (rows R7, R2 and A7), not accounts it monitors, so the caption says "report"
 * of the devices only (rows A9 and D2).
 */
import type { IconName } from './icons';

export interface FitItem {
  icon: IconName;
  text: string;
}

export interface FitBand {
  title: string;
  /** The middle band, drawn as Direwolf's near-black panel. */
  direwolf?: boolean;
  items: FitItem[];
}

export const fitTitle = 'How Direwolf fits into your business';

export const fitBands: FitBand[] = [
  {
    title: 'Your business',
    items: [
      { icon: 'server', text: 'Computers and servers' },
      { icon: 'mail', text: 'Microsoft 365 or Google Workspace' },
      { icon: 'globe', text: 'Websites and internet-facing systems' },
    ],
  },
  {
    title: 'Direwolf',
    direwolf: true,
    items: [
      { icon: 'shield-check', text: 'EDR on your devices' },
      {
        icon: 'radar',
        text: 'MDR: AI analysts and responders, overseen by our security professionals',
      },
      { icon: 'crosshair', text: 'Testing and compliance' },
    ],
  },
  {
    title: 'What you get',
    items: [
      { icon: 'shield', text: 'Confirmed threats contained' },
      { icon: 'scroll-text', text: 'Plain-English reports' },
      { icon: 'clipboard-check', text: 'Evidence for insurers and auditors' },
    ],
  },
];

/** The text equivalent of the arrows, shown under the figure for everyone. */
export const fitCaption =
  'Your computers and servers report to Direwolf. We protect and watch them, test your systems and cloud setup, and you get confirmed threats contained, plain-English reports and evidence for insurers and auditors.';
