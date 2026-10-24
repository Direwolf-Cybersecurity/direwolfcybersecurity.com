// @ts-check
import { readdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The canonical origin. GitHub Pages serves the site at this host (see public/CNAME);
// the apex domain redirects here. Used for canonical URLs, the sitemap and security.txt.
const SITE = 'https://www.direwolfcybersecurity.com';

/**
 * Vite copies every image a module imports into dist/_astro/, even one no page renders. No
 * unapproved organization logo is imported or committed (src/data/engagements.ts; the files are
 * gitignored), but if an image were ever imported without being shown, such as a logo whose
 * permission is not on file, it would be published at a hashed URL. As a safety net, after the
 * build delete every image in dist/_astro/ that no built page, stylesheet, script or manifest
 * references.
 * `npm run links` fails if an unreferenced image is ever left in dist/_astro/.
 * @returns {import('astro').AstroIntegration}
 */
function pruneUnreferencedImages() {
  return {
    name: 'direwolf:prune-unreferenced-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const assets = path.join(dist, '_astro');
        /** @param {string} folder @returns {Promise<string[]>} */
        const walk = async (folder) =>
          (await readdir(folder, { withFileTypes: true, recursive: true }))
            .filter((entry) => entry.isFile())
            .map((entry) => path.join(entry.parentPath, entry.name));
        const files = await walk(dist);
        const texts = await Promise.all(
          files
            .filter((file) => /\.(html|css|js|json|xml|txt|webmanifest)$/i.test(file))
            .map((file) => readFile(file, 'utf8')),
        );
        const corpus = texts.join('\n');
        for (const file of files) {
          if (path.dirname(file) !== assets) continue;
          if (!/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(file)) continue;
          const name = path.basename(file);
          if (!corpus.includes(`/_astro/${name}`)) {
            await rm(file);
            logger.info(`removed unreferenced image _astro/${name}`);
          }
        }
      },
    },
  };
}

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
    pruneUnreferencedImages(),
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
