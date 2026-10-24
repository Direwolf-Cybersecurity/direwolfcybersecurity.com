/**
 * Image slots. The owner supplies every image (generated with an image tool whose licence allows
 * commercial use, or otherwise original or licensed for commercial use); the site draws no
 * artwork of its own (owner direction 2026-10-24). Drop a file with the exact name below into
 * src/assets/images/ and it appears in its placement on the next build; with no file the slot
 * renders nothing and its section closes up around it. Prompts for each slot:
 * docs/image-prompts.md. How to add one: README.md, "Adding images".
 *
 * Rendered by src/components/ImageSlot.astro through Astro's image pipeline (AVIF and WebP at
 * several widths, never upscaled). Any of .webp, .avif, .png, .jpg or .jpeg works; the names
 * below are the expected ones.
 */

import type { ImageMetadata } from 'astro';

export type ImageSlotId = 'hero' | 'mdr' | 'pentest' | 'platform' | 'about';

export interface ImageSlotSpec {
  id: ImageSlotId;
  /** File name in src/assets/images/. */
  file: string;
  /** Intended aspect ratio, width:height. The slot crops to it (object-fit: cover). */
  aspect: '16:9' | '4:3' | '16:10' | '3:2';
  /** Tailwind class for that aspect ratio (a static string, so Tailwind generates it). */
  aspectClass: string;
  /** Minimum source size in pixels; smaller files still work but may look soft on large screens. */
  minWidth: number;
  minHeight: number;
  /** Alt text, describing the image as supplied. Update it if the image changes. */
  alt: string;
  /** Where the slot appears. */
  placement: string;
  /** The `sizes` attribute: the slot's rendered width at each breakpoint. */
  sizes: string;
}

/** Two-column rows (`.split`) in the 72rem container: half its width from lg up. */
const halfWidth = '(min-width: 1152px) 544px, (min-width: 1024px) 46vw, 100vw';

export const imageSlots: Record<ImageSlotId, ImageSlotSpec> = {
  hero: {
    id: 'hero',
    file: 'hero.webp',
    aspect: '16:9',
    aspectClass: 'aspect-video',
    minWidth: 2400,
    minHeight: 1350,
    alt: 'A brushed-silver shield standing on a dark grid of glowing blue network nodes',
    placement:
      'Home, hero: full-bleed background, the shield on the right from 640 px wide up and low behind the buttons on phones',
    // Rendered width of the cover-cropped background (.hero-media): the full width on wide
    // screens, about 1280 px from 640 px up (the hero is taller than a 16:9 strip there), and
    // about 900 px on phones (the image is 62% of a roughly 800 px tall hero).
    sizes: '(min-width: 1280px) 100vw, (min-width: 640px) 1280px, 900px',
  },
  mdr: {
    id: 'mdr',
    file: 'mdr.webp',
    aspect: '4:3',
    aspectClass: 'aspect-[4/3]',
    minWidth: 1600,
    minHeight: 1200,
    alt: 'Layered glass panels showing networks of connected nodes, one node glowing bright blue',
    placement: 'Services, managed detection and response section',
    sizes: halfWidth,
  },
  pentest: {
    id: 'pentest',
    file: 'pentest.webp',
    aspect: '4:3',
    aspectClass: 'aspect-[4/3]',
    minWidth: 1600,
    minHeight: 1200,
    alt: 'Dark hexagonal metal plates, one lifted slightly with blue light shining through the seam',
    placement: 'Services, penetration testing section',
    sizes: halfWidth,
  },
  platform: {
    id: 'platform',
    file: 'platform.webp',
    aspect: '16:10',
    aspectClass: 'aspect-[16/10]',
    minWidth: 2000,
    minHeight: 1250,
    alt: 'Abstract modular data center of black blocks edged with electric blue light',
    placement: 'Platform, beside "What your administrators will see"',
    sizes: halfWidth,
  },
  about: {
    id: 'about',
    file: 'about.webp',
    aspect: '3:2',
    aspectClass: 'aspect-[3/2]',
    minWidth: 1800,
    minHeight: 1200,
    alt: 'A mountain range at night drawn in fine lines of blue light under a starry sky',
    placement: 'About, beside the mission',
    sizes: halfWidth,
  },
};

/** Every image file present in src/assets/images/, loaded lazily (only a slot's own file is read). */
const imageFiles = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/*.{webp,avif,png,jpg,jpeg}',
);

/** "hero.webp" -> "hero". */
const stemOf = (name: string) => name.replace(/\.[^.]+$/, '');

/**
 * The loader for a slot's file: the exact name in `imageSlots`, or the same name with another
 * supported extension. Undefined when the owner has not supplied the image.
 */
export function imageLoader(
  id: ImageSlotId,
): (() => Promise<{ default: ImageMetadata }>) | undefined {
  const { file } = imageSlots[id];
  const paths = Object.keys(imageFiles);
  const path =
    paths.find((p) => p.endsWith(`/${file}`)) ??
    paths.find((p) => stemOf(p.split('/').pop() ?? '') === stemOf(file));
  return path ? imageFiles[path] : undefined;
}

/** Whether the slot's image exists, so a page can lay out its row with or without it. */
export function hasImage(id: ImageSlotId): boolean {
  return imageLoader(id) !== undefined;
}
