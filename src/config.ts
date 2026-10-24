/**
 * Site-wide constants.
 *
 * Everything the site says about the company that could change lives here or in
 * `src/data/`, never inline in a page. Items marked TODO are placeholders that must be
 * confirmed before launch (see docs/launch-runbook.md).
 */

/**
 * Launch switch. While `false`:
 *   - `/robots.txt` disallows all crawling and every page carries `noindex`,
 *   - a "preview build" notice is shown at the top of every page,
 *   - `.github/workflows/deploy.yml` refuses to publish to GitHub Pages.
 * Flip to `true` only after the launch runbook's legal-review and claims gates are done.
 */
export const SITE_LAUNCHED = false;

export const siteName = 'Direwolf Cybersecurity';
export const siteTagline = 'AI-run security operations for small and mid-size organizations';
export const siteDescription =
  'Direwolf Cybersecurity provides AI-run security operations with human analyst review, managed endpoint protection, and NIST SP 800-171 / CMMC guidance for small and mid-size organizations and government contractors. An SBA-certified Service-Disabled Veteran-Owned Small Business headquartered in Colorado Springs, Colorado.';

/** Canonical origin of this site. Must match `site` in astro.config.mjs and public/CNAME. */
export const siteOrigin = 'https://www.direwolfcybersecurity.com';

/**
 * Legal entity name, used in the footer copyright line; the legal pages spell it out the same
 * way. Owner facts (CLAUDE.md, 2026-10-23): the name is exactly "Direwolf Cybersecurity" and the
 * entity type is not yet confirmed.
 * TODO(mitch): confirm the registered entity type (LLC, Inc., etc.) against the Colorado
 * Secretary of State record before launch. Do not append "LLC" or "Inc." here or anywhere else
 * until then.
 */
export const legalEntityName = 'Direwolf Cybersecurity';

/**
 * Ownership status. Claims register row F1: `true today` on the owner's statement; the SBA
 * VetCert certificate or SAM.gov entity record must be filed under docs/evidence/ before launch.
 * Use this exact phrase, or `ownershipPhrase` inside a sentence. Before showing any SBA mark,
 * read "Logo use" in docs/launch-runbook.md.
 */
export const ownershipStatement =
  'Service-Disabled Veteran-Owned Small Business (SDVOSB), SBA certified';
/** The same fact as a noun phrase for running text: "Direwolf is <ownershipPhrase> ...". */
export const ownershipPhrase = 'an SBA-certified Service-Disabled Veteran-Owned Small Business';

/**
 * Headquarters line shown in the footer and on the contact page.
 * PLACEHOLDER (CLAUDE.md owner facts): no business mailing address is available yet.
 */
export const hqLine = 'Colorado Springs, Colorado';
/**
 * TODO(mitch): business mailing address (PO box or registered agent). Publishing one here and in
 * the Privacy Policy and Terms is a launch gate in docs/launch-runbook.md. Empty hides the line.
 */
export const streetAddress = '';

/** TODO(mitch): replace with the real mailboxes once the domain's mail is set up. */
export const contactEmail = 'contact@direwolfcybersecurity.com';
export const securityEmail = 'security@direwolfcybersecurity.com';
export const privacyEmail = 'privacy@direwolfcybersecurity.com';

/** TODO(mitch): business phone. Leave empty to hide the phone line everywhere. */
export const phone: string = '';

/** Social profiles. Empty until the company has any; the footer hides the block when empty. */
export const socials: { name: string; url: string }[] = [];

/**
 * Where "Log in" and "Sign up" point. Override at build time with PUBLIC_APP_URL
 * (for example to a staging platform). Always an absolute origin without a trailing slash.
 */
export const appUrl = (
  import.meta.env.PUBLIC_APP_URL || 'https://app.direwolfcybersecurity.com'
).replace(/\/+$/, '');
export const loginUrl = `${appUrl}/login`;
export const signupUrl = `${appUrl}/signup`;

/**
 * Optional. When set, the contact form POSTs JSON to this URL (the platform's public
 * contact endpoint). When unset, the form falls back to opening the visitor's mail app.
 */
export const contactEndpoint: string | undefined =
  import.meta.env.PUBLIC_CONTACT_ENDPOINT || undefined;

/**
 * Compliance strip, rendered by ComplianceStrip.astro on the Platform page only. Each phrase
 * is the short form of a claims-register row (C1, C2, H1 GovCloud-only form, H4/H5) and the
 * Compliance page explains what each one means. Row H1 forbids hosting wording on Home,
 * Services and About, so never render the strip there; those pages link to /compliance/
 * instead. Change a phrase only after updating docs/claims-register.md.
 */
export const complianceStrip = [
  'Aligned to NIST SP 800-171',
  'Pursuing CMMC Level 2',
  'Hosted on AWS GovCloud (US)',
  'FIPS 140-validated TLS and key management',
] as const;

/**
 * `/.well-known/security.txt` (RFC 9116) requires an Expires field of at most a year out.
 * TODO(mitch): renew this date annually; the build warns when it is within 30 days.
 */
export const securityTxtExpires = '2027-10-23T00:00:00.000Z';

/** Industries our team has worked in. Order is intentional (owner's list). */
export const industries = [
  'Healthcare',
  'Manufacturing',
  'Defense',
  'Aerospace',
  'Space',
  'Technology',
] as const;
