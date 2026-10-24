import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Legal and policy documents (`src/content/legal/*.mdx`).
 *
 * Versioning rule (see CLAUDE.md): the platform records which `version` a user accepted,
 * so a published document is never edited in place. Bump `version` and `effectiveDate`
 * on every change to a published document.
 */
const legal = defineCollection({
  loader: glob({ base: './src/content/legal', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    /**
     * vYYYY.MM.DD, matching the platform's consent records. A further version published the same
     * day adds a sequence suffix, vYYYY.MM.DD.N with N from 2 (first used for v2026.10.24.2).
     * A version string is never reused for different text.
     */
    version: z
      .string()
      .regex(
        /^v\d{4}\.\d{2}\.\d{2}(\.[2-9]|\.[1-9]\d+)?$/,
        'version must look like v2026.10.23, or v2026.10.24.2 for a later version the same day',
      ),
    effectiveDate: z.coerce.date(),
    /** One or two sentences shown under the title and on the legal index. */
    summary: z.string().min(1),
    /**
     * `published` documents show the in-effect sentence; a `draft` shows a draft notice
     * (src/layouts/LegalLayout.astro). All documents were published at launch, 2026-10-23.
     */
    status: z.enum(['draft', 'published']).default('draft'),
    /** Footer link label, when shorter than the title. */
    shortTitle: z.string().optional(),
    /** Sort order on the legal index and in the footer. */
    order: z.number().int().default(100),
  }),
});

export const collections = { legal };
