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
    // Every stylesheet as a file under /_astro/, never an inline <style>: the Content Security
    // Policy in src/layouts/BaseLayout.astro allows style-src 'self' only.
    inlineStylesheets: 'never',
  },
  integrations: [
    mdx(),
    sitemap({
      // Keep the 404 page (noindex) out of the sitemap; every other page is listed.
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Never inline a bundled script or asset as a data: URL or inline <script>, so every
      // script stays a file that the policy's script-src 'self' allows.
      assetsInlineLimit: 0,
    },
  },
});
