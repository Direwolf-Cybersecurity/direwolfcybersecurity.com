// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'public/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  ...astro.configs['flat/jsx-a11y-strict'],
  {
    // Node scripts (link checker, a11y runner) and config files.
    files: ['scripts/**/*.mjs', '*.config.{js,mjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // Checks that drive a page (motion, hero contrast): their page.evaluate callbacks run in the
    // browser, so these files see both sets of globals.
    files: ['scripts/check-motion.mjs', 'scripts/hero-contrast.mjs', 'scripts/lib/freeze.mjs'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    // Client-side <script> blocks inside .astro files run in the browser.
    files: ['**/*.astro/*.js', '**/*.astro/*.ts'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // Astro hoists scripts into modules; "no-unused-expressions" style rules are fine here.
    },
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
);
