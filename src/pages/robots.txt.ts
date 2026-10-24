import type { APIRoute } from 'astro';
import { SITE_LAUNCHED, siteOrigin } from '../config';

/**
 * Generated at build time from SITE_LAUNCHED. Until launch, every crawler is told to stay
 * out (pages also carry a noindex meta tag). After launch, everything is allowed and the
 * sitemap is advertised.
 */
export const GET: APIRoute = () => {
  const body = SITE_LAUNCHED
    ? ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteOrigin}/sitemap-index.xml`, ''].join('\n')
    : ['User-agent: *', 'Disallow: /', ''].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
