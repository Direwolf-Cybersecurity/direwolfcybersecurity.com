/**
 * Site-wide constants.
 *
 * Everything the site says about the company that could change lives here or in
 * `src/data/`, never inline in a page. Items marked TODO are open owner items tracked as
 * post-launch gates in docs/launch-runbook.md.
 */

/**
 * Launch switch. Set to `true` on 2026-10-23 at the owner's direction (docs/launch-runbook.md,
 * "Launch record"), with gates G1 (attorney review), G2 (mailing address) and G3 (SBA
 * certificate on file) still open as post-launch items. While `true`, `/robots.txt` allows
 * crawling and names the sitemap, pages carry `index, follow` (except the 404 page), and
 * `.github/workflows/deploy.yml` publishes `main` to GitHub Pages. Setting it back to `false`
 * restores `noindex`, the preview notice and the publish refusal; it does not take down what
 * is already on Pages. The deploy workflow greps for this exact line, so keep its form.
 */
export const SITE_LAUNCHED = true;

export const siteName = 'Direwolf Cybersecurity';
/**
 * Positioning (owner direction 2026-10-24): an AI-driven managed security services provider
 * (MSSP) for any small or mid-size business; government contractors are one audience among
 * several. The tagline is also set on the social card (scripts/generate-brand-assets.mjs reads
 * this exact line), so run `npm run brand:assets` after changing it. Claims register row F5.
 */
export const siteTagline = 'AI-driven managed security for small and mid-size businesses';
export const siteDescription =
  'Direwolf Cybersecurity is a managed security services provider for small and mid-size businesses: AI-driven detection and response monitored by a team of security professionals, managed endpoint protection, penetration testing and compliance readiness. An SBA-certified Service-Disabled Veteran-Owned Small Business headquartered in Colorado Springs, Colorado.';

/** Canonical origin of this site. Must match `site` in astro.config.mjs and public/CNAME. */
export const siteOrigin = 'https://www.direwolfcybersecurity.com';

/**
 * Legal entity name, used in the footer copyright line; the legal pages spell it out the same
 * way. Owner facts (CLAUDE.md, 2026-10-23): the name is exactly "Direwolf Cybersecurity" and the
 * entity type is not yet confirmed.
 * TODO(mitch, gate G4): confirm the registered entity type (LLC, Inc., etc.) against the Colorado
 * Secretary of State record. Do not append "LLC" or "Inc." here or anywhere else until then.
 */
export const legalEntityName = 'Direwolf Cybersecurity';

/**
 * Ownership status. Claims register row F1: `true today` on the owner's statement; the SBA
 * VetCert certificate or SAM.gov entity record is still to be filed under docs/evidence/ (gate G3,
 * open after launch).
 * Use this exact phrase, or `ownershipPhrase` inside a sentence. Before showing any SBA mark,
 * read "Logo use" in docs/launch-runbook.md.
 */
export const ownershipStatement =
  'Service-Disabled Veteran-Owned Small Business (SDVOSB), SBA certified';
/** The same fact as a noun phrase for running text: "Direwolf is <ownershipPhrase> ...". */
export const ownershipPhrase = 'an SBA-certified Service-Disabled Veteran-Owned Small Business';

/**
 * Headquarters line shown in the footer and on the contact page (CLAUDE.md owner facts).
 */
export const hqLine = 'Colorado Springs, Colorado';
/**
 * TODO(mitch, gate G2): business mailing address (PO box or registered agent). Unpublished at
 * launch; add it here and in the Privacy Policy (sections 1 and 15) and the Terms (section 1),
 * bumping their versions. Empty hides the line everywhere, so nothing shows until it is set.
 */
export const streetAddress = '';

/**
 * Domain mailboxes. Each is an alias on the owner's Google Workspace mailbox (README.md,
 * "Email"); the legal pages, the footer, the contact page and security.txt read them from
 * here. Change an address here, never in a page.
 */
/** General inquiries, accessibility feedback, EEO accommodation requests. */
export const contactEmail = 'contact@direwolfcybersecurity.com';
/** Vulnerability reports and suspected compromise; also the security.txt Contact. */
export const securityEmail = 'security@direwolfcybersecurity.com';
/** Legal notices and questions about the Terms of Service and the Acceptable Use Policy. */
export const legalEmail = 'legal@direwolfcybersecurity.com';
/** Privacy requests and questions about the Privacy Policy, Cookie Notice and Subprocessors. */
export const privacyEmail = 'privacy@direwolfcybersecurity.com';

/**
 * Optional business phone. Unset at launch, so no phone line appears anywhere on the site; the
 * footer and the contact page show one only when this is set to a real number.
 */
export const phone: string | undefined = undefined;

/** Social profiles. Empty until the company has any; the footer hides the block when empty. */
export const socials: { name: string; url: string }[] = [];

/**
 * Platform switch. `false` until the Direwolf Platform is in service at PUBLIC_APP_URL (it has no
 * DNS record yet; claims register rows H1 and W6). While `false`, every "Log in" / "Sign up" call
 * to action (header, footer, Home hero, the call-to-action band, the Platform and Contact pages)
 * becomes a single "Request early access" link to `earlyAccessUrl`, the Platform page says the
 * platform is opening to early customers, the platform origin is left out of the Content Security
 * Policy, and `npm run links` fails if any built page links to the platform host. Set it to `true`
 * the day the platform serves sign-in, and the Log in / Sign up links return.
 * scripts/check-links.mjs greps for this exact line, so keep its form.
 */
export const PLATFORM_LIVE = false;

/** Where "Request early access" points while PLATFORM_LIVE is false (preselects the form topic). */
export const earlyAccessUrl = '/contact/?topic=early-access';

/**
 * Where "Log in" and "Sign up" point once PLATFORM_LIVE is true. Override at build time with
 * PUBLIC_APP_URL (for example to a staging platform). Always an absolute origin without a
 * trailing slash.
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
 * is the short form of a claims-register row (C1, C2, H1 strip form, H4/H5 strip form) and the
 * Compliance page explains what each one means. Row H1 forbids hosting wording on Home,
 * Services and About, so never render the strip there; those pages link to /compliance/
 * instead. Change a phrase only after updating docs/claims-register.md.
 */
export const complianceStrip = [
  'Aligned to NIST SP 800-171',
  'Pursuing CMMC Level 2',
  'Built for AWS US West (Oregon)',
  'Designed for FIPS 140-validated TLS and key management',
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
