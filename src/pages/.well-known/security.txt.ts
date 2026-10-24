import type { APIRoute } from 'astro';
import { securityEmail, securityTxtExpires, siteOrigin } from '../../config';

/**
 * RFC 9116 security.txt, generated from src/config.ts. `Expires` must be renewed at least
 * yearly; the build prints a warning when it is within 30 days of expiring or already past.
 */
export const GET: APIRoute = () => {
  const expires = new Date(securityTxtExpires);
  if (Number.isNaN(expires.getTime())) {
    throw new Error(
      `securityTxtExpires in src/config.ts is not a valid date: ${securityTxtExpires}`,
    );
  }
  const daysLeft = (expires.getTime() - Date.now()) / 86_400_000;
  if (daysLeft < 30) {
    console.warn(
      `[security.txt] Expires (${securityTxtExpires}) is ${daysLeft < 0 ? 'in the past' : 'within 30 days'}. Renew securityTxtExpires in src/config.ts.`,
    );
  }

  // RFC 9116: Contact and Expires are required; Contact may repeat, listed in order of
  // preference. No Encryption field until a PGP key is published (TODO(mitch), launch runbook).
  // The platform should serve this same file at app.direwolfcybersecurity.com.
  const body = [
    `Contact: mailto:${securityEmail}`,
    `Contact: ${siteOrigin}/security/`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: en',
    `Canonical: ${siteOrigin}/.well-known/security.txt`,
    `Policy: ${siteOrigin}/security/`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
