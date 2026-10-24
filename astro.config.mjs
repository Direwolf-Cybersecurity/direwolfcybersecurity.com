// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The canonical origin. GitHub Pages serves the site at this host (see public/CNAME);
// the apex domain redirects here. Used for canonical URLs, the sitemap and security.txt.
const SITE = 'https://www.direwolfcybersecurity.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // /about/index.html, which GitHub Pages serves at /about/ without a redirect hop.
    format: 'directory',
  },
  integrations: [
    mdx(),
    sitemap({
      // Keep the 404 page and the legal index out of the sitemap.
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
