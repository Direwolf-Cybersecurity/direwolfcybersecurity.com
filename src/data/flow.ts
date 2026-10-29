/**
 * The Home "How it works" flow (src/components/SystemFlow.astro): every visible string in it, all
 * in docs/claims-register.md row D1 ("The website itself"), verbatim. The three steps are the
 * present-tense Home wording approved before the flow existed, moved here from
 * src/pages/index.astro word for word: Detect (rows A1, A4), Investigate (row A8's analyst role
 * form) and Respond (rows A3 and A8's responder role form). They name only the AI roles built in
 * the platform's code; "engineers" never appears here (row A8's gate), and no AI role has a
 * person icon. The only people icon (`users`) is beside "our security professionals".
 *
 * `oversight.shown` stays false until the owner approves the second Home mention of the oversight
 * idea (rows A2 and A8, motion gate 2b). The figure works without it: the run keeps the same
 * timings, and the frame light follows a 400 ms rest instead.
 */
import type { IconName } from './icons';

export interface FlowStep {
  /** `data-flow-node`: the step's place in the grid and its lit time in the run. */
  id: 'detect' | 'investigate' | 'respond';
  icon: IconName;
  title: string;
  text: string;
}

export const flowSteps: FlowStep[] = [
  {
    id: 'detect',
    icon: 'scan-search',
    title: 'Detect',
    text: 'The EDR agent on each endpoint sends every alert to the Direwolf AI SOC.',
  },
  {
    id: 'investigate',
    icon: 'brain-circuit',
    title: 'Investigate',
    text: 'AI analysts enrich and triage each alert, with a verdict and a plain-English summary.',
  },
  {
    id: 'respond',
    icon: 'shield-check',
    title: 'Respond',
    text: 'AI responders contain confirmed threats under guardrails you control.',
  },
];

/** The frame's legend (aria-hidden; row A1's name). */
export const flowLegend = 'Direwolf AI SOC';

/** The oversight node (rows A2 / A8 Platform form; shown only once motion gate 2b closes). */
export const oversight = {
  shown: false,
  text: 'Overseen by our security professionals',
} as const;

/** The figure's caption: the flow is an illustration, not a live view (row D1). */
export const flowCaption = 'Illustrative. Not live data.';
