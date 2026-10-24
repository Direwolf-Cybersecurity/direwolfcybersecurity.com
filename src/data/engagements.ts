import type { ImageMetadata } from 'astro';

/*
 * Experience section (src/components/Experience.astro, on Home and About).
 *
 * OWNER CONFIRMATION (gate G18). Before an organization is named, the owner must confirm that the
 * engagement happened as stated and that no contract publicity clause (e.g. DFARS 252.204-7000)
 * or confidentiality obligation forbids naming it. That confirmation is recorded (date, and "no
 * publicity or confidentiality restriction known") in the entry's claims register row (E1-E6,
 * docs/claims-register.md, "Experience") and then here as `ownerConfirmed`; only entries with it
 * are shown. All six carry the owner's confirmation dated 2026-10-23: his instruction that day to
 * list them as previous engagements of his team, which, he confirmed on 2026-10-24, is his G18
 * confirmation. Gate G18 (docs/launch-runbook.md) is therefore closed for names; logos stay off
 * (below). The owner should still check each client contract for a publicity or confidentiality
 * clause; if one forbids naming an organization, remove its `ownerConfirmed` and update its E-row
 * in the same change. Never set a date before the row records the confirmation.
 *
 * WHY EVERY LOGO IS OFF. The owner asked (2026-10-23) for these organizations to be shown with
 * their logos. Each logo is a trademark (the DoD seal is also protected by statute), and none of
 * the owners has given Direwolf permission to show its mark as a past-engagement logo, so every
 * entry has `logoApproved: false` and no `logo`, and the page shows the organization's name in
 * text instead. docs/logo-use-research.md ("logo research") has each owner's rules and the
 * permission it takes.
 *
 * LOGO FILES ARE NOT COMMITTED. This repository is public, so `src/assets/engagements/*` is
 * gitignored and the files the owner supplied stay in local or private storage. To show a logo:
 * file the owner's written permission under docs/evidence/ and record it in the entry's E-row,
 * then, in one change, commit the file (add a `!src/assets/engagements/<file>` line to
 * .gitignore), import it here, set `logo` and set `logoApproved: true`. The type below allows a
 * `logo` only on an approved entry. Never for the Department of Defense (the seal is reserved for
 * official use and DoD offers no substitute logo; logo research section 1) or The Cyber AB (its
 * corporate logo needs its express written consent, and register wording rule 4 bars it).
 * astro.config.mjs and `npm run links` still keep any imported but unshown image out of dist/.
 *
 * WORDING. The section's lead sentence is "Our team has supported programs and organizations
 * including:", which is true whether the work was done by Direwolf or by team members in prior
 * roles. Never call these organizations clients, customers or partners, never "trusted by", and
 * never imply that any of them endorses Direwolf (register rows E1-E6 list the forbidden
 * phrasings). Order is the owner's.
 */

interface EngagementBase {
  /** Claims register row that governs this entry. */
  register: `E${number}`;
  /** Organization name, shown as text while the logo is not approved. */
  name: string;
  /** Alt text for the logo, once one is approved: the organization's name. */
  alt: string;
  /**
   * Date (YYYY-MM-DD) the owner's confirmation was recorded in this entry's E-row: the engagement
   * happened as stated and no publicity or confidentiality restriction is known (gate G18). The
   * entry is shown only when this is set.
   */
  ownerConfirmed?: string;
  /** Optional context shown under the name, e.g. a later name of the organization. */
  note?: string;
}

interface EngagementWithoutLogo extends EngagementBase {
  /** False until the mark owner's written permission is filed (see the comment above). */
  logoApproved: false;
  /** No logo file is referenced, or committed, before approval. */
  logo?: never;
}

interface EngagementWithLogo extends EngagementBase {
  /** True only after the mark owner's written permission is filed (see the comment above). */
  logoApproved: true;
  /** The organization's logo, committed in the same change that sets `logoApproved: true`. */
  logo: ImageMetadata;
}

export type Engagement = EngagementWithoutLogo | EngagementWithLogo;

export const engagements: Engagement[] = [
  {
    register: 'E1',
    name: 'Department of Defense',
    alt: 'Department of Defense',
    ownerConfirmed: '2026-10-23',
    logoApproved: false,
  },
  {
    register: 'E2',
    name: 'Maxar Space Systems',
    alt: 'Maxar Space Systems',
    ownerConfirmed: '2026-10-23',
    logoApproved: false,
    // Renamed 2025-10-01, acquired by Intuitive Machines 2026-01-13 (logo research section 2).
    note: 'Now Lanteris Space Systems',
  },
  {
    register: 'E3',
    name: 'The Cyber AB',
    alt: 'The Cyber AB',
    ownerConfirmed: '2026-10-23',
    logoApproved: false,
  },
  {
    register: 'E4',
    name: 'Boeing',
    alt: 'Boeing',
    ownerConfirmed: '2026-10-23',
    logoApproved: false,
  },
  {
    register: 'E5',
    name: 'National Institute of Standards and Technology (NIST)',
    alt: 'National Institute of Standards and Technology (NIST)',
    ownerConfirmed: '2026-10-23',
    logoApproved: false,
  },
  {
    register: 'E6',
    name: 'MEP National Network',
    alt: 'MEP National Network',
    ownerConfirmed: '2026-10-23',
    logoApproved: false,
  },
];

/** Entries the Experience section shows: those whose owner confirmation is recorded (gate G18). */
export const shownEngagements = engagements.filter((engagement) => engagement.ownerConfirmed);
