# Image generator prompts for the website

The website draws no artwork of its own. It has five optional image slots, and each one shows an
image only when its file exists in `src/assets/images/` (README, "Adding images"), so the site
looks complete without them. These prompts are for an image generator whose licence allows
commercial use (for example Midjourney on a paid plan, Adobe Firefly or ChatGPT image
generation). Keep the licence terms with your records.

The goal is images that do **not** look like AI art. Two styles follow: **A, photographs of real
things** (recommended; the least "AI" result) and **B, flat graphics** (if you would rather have
graphics than photographs). Pick one style and use it for all five images so the site looks like
one set. Neither style has people in it.

## What makes an image look "AI", and what to ask for instead

| Looks like AI art                                    | Ask for instead                                           |
| ---------------------------------------------------- | --------------------------------------------------------- |
| Glow, bloom, lens flare, light rays, floating sparks | One hard light source and deep, honest shadow             |
| Floating glass panels, holograms, glowing screens    | A real object you could touch                             |
| Network nodes, plexus lines, circuit boards, globes  | Real materials: metal, stone, asphalt, paint, paper       |
| Chrome shields, padlocks, keyholes                   | Nothing symbolic; the logo is already a shield            |
| Perfect, spotless, over-sharpened surfaces           | Dust, fine scratches, worn edges, a little film grain     |
| Teal-and-orange grading, neon, purple                | Near-black and graphite with a single cool blue accent    |
| Everything centred and symmetrical                   | A plain, slightly off-centre composition with empty space |

## Tool settings

- **Midjourney:** add `--style raw --stylize 50` (less of Midjourney's own look), the aspect ratio
  (`--ar 16:9`, `--ar 4:3`, `--ar 16:10` or `--ar 3:2`) and the negative prompt as `--no ...`.
  Then use **Upscale (Subtle)** so the file reaches the minimum size below.
- **Adobe Firefly:** content type **Photo** (style A) or **Art** (style B), visual intensity low,
  the aspect ratio set in the panel, and the negative prompt in **Exclude**.
- **ChatGPT image generation:** paste the shared style, the slot prompt and "Avoid: ..." with the
  negative prompt. Its largest output (about 1536 px wide) is below most minimums, so upscale
  the chosen image with your tool's upscaler before sending it.
- Make 4 to 8 versions of each and choose the one that looks most like a real photograph (or a
  printed poster, for style B). Reject any with warped edges, melted details, impossible
  geometry, or anything that looks like letters or numbers.
- **Your own photographs beat any generator.** A real photo you took of the Front Range, a server
  room or a machined part, cropped to the slot's shape, is the best possible image for the slot.

## Sizes

Export at the minimum size or larger, in the slot's aspect ratio (the site crops to it). PNG,
high-quality JPEG or WebP are all fine; the site converts and resizes them. Smaller files still
work, but the build warns and they can look soft on large, high-density screens.

| Slot                           | File name       | Aspect | Minimum size | Where it appears                                     |
| ------------------------------ | --------------- | ------ | ------------ | ---------------------------------------------------- |
| Home hero                      | `hero.webp`     | 16:9   | 2400 x 1350  | Home, full-bleed background behind the headline      |
| Managed detection and response | `mdr.webp`      | 4:3    | 1600 x 1200  | Services, managed detection and response             |
| Penetration testing            | `pentest.webp`  | 4:3    | 1600 x 1200  | Services, penetration testing                        |
| Platform                       | `platform.webp` | 16:10  | 2000 x 1250  | Platform, beside "What your administrators will see" |
| About                          | `about.webp`    | 3:2    | 1800 x 1200  | About, beside the mission                            |

The hero is a full-bleed background behind the headline at every width, under a near-black
scrim that fades from the left (`.hero-media` in `src/styles/global.css`). From 640 px wide up
the text sits on the left and the image is cropped around a point about three-quarters of the
way across, so **keep the left third dark and empty and the subject in the right third**; on
narrower phones the image fills the lower part of the hero, centred on that point, so **keep the
subject roughly centred top to bottom with dark space above it**. If the image changes, re-check
the hero text contrast against it (4.5:1) at phone, tablet and desktop widths.

## Style A: photographs of real things (recommended)

### Shared style (paste at the start of every prompt)

```text
Editorial photograph of real objects and real materials, shot on a full-frame camera. One hard light source, deep shadow, a near-black and graphite palette with a single cool blue accent. Natural surface imperfections: dust, fine scratches, worn edges. Subtle film grain, true-to-life colour, shallow depth of field, lots of dark empty space. Calm and minimal. No glow.
```

### Negative prompt (the tool's "avoid", "exclude" or `--no` field)

```text
people, faces, hands, silhouettes, hooded hacker, text, letters, numbers, labels, logos, watermark, signature, glow, bloom, lens flare, light rays, particles, sparkles, bokeh orbs, hologram, floating glass panels, glowing screens, network nodes, plexus, connected dots, circuit board, binary code, matrix code, shield, padlock, keyhole, globe, world map, skull, wolf, CGI, 3D render, octane render, unreal engine, isometric, sci-fi, wireframe, neon, purple, pink, rainbow colours, teal and orange grading, HDR, oversaturated, oversharpened, cartoon, illustration, clip art, cluttered background
```

### The five prompts

**Home hero** (16:9, at least 2400 x 1350)

```text
Long-exposure photograph looking straight down from high above a dark highway at night. Thin, crisp streaks of white and cool blue vehicle lights curve through the right two-thirds of the frame; the rough texture of the asphalt and a painted lane line are faintly visible. The left third of the frame is almost black and empty. No bloom around the light trails. Aspect ratio 16:9.
```

Alt text once placed: "Long-exposure light trails on a dark road at night, seen from above"

**Managed detection and response** (4:3, at least 1600 x 1200)

```text
Macro photograph of the front of a server rack in a dark room, 100mm macro lens. Rows of tiny white status lights on brushed metal faceplates with screws, vent holes and a little dust; one single status light is lit cool blue and is the only thing in sharp focus, everything else falls off into soft blur. Aspect ratio 4:3.
```

Alt text once placed: "Close-up of status lights on a server rack in a dark room, one lit blue"

**Penetration testing** (4:3, at least 1600 x 1200)

```text
Macro photograph of a precision-machined aluminium plate, anodized dark grey, held by a neat grid of hex-socket bolts. One bolt is missing, leaving an empty threaded hole in sharp focus. Hard raking light from the side shows tool marks and fine scratches; a thin line of cool blue light reflects along one machined edge. Unlabelled, no engraving. Aspect ratio 4:3.
```

Alt text once placed: "A machined metal plate held by a grid of bolts, with one bolt missing"

**Platform** (16:10, at least 2000 x 1250)

```text
Top-down photograph of an anodized black aluminium control panel: a tidy grid of toggle switches, knurled knobs and small round indicator lights, with one indicator lit cool blue. Unlabelled, no printed or engraved text. Low raking light, matte surfaces, fine machining marks, slightly off-centre framing. Aspect ratio 16:10.
```

Alt text once placed: "Top-down view of a black control panel with switches and knobs, one blue light lit"

**About** (3:2, at least 1800 x 1200; a nod to Colorado Springs)

```text
Landscape photograph of the Front Range of the Rocky Mountains at blue hour, seen from the open plains to the east. Layered dark ridgelines, a clear deep-blue sky fading paler toward the horizon, a few small distant lights at the foot of the mountains. Natural colour, no dramatic clouds, no stars. Aspect ratio 3:2.
```

Alt text once placed: "Mountain ridgelines at blue hour under a clear sky"

## Style B: flat graphics

Use this set instead of style A if you would rather have graphics than photographs.

### Shared style

```text
Flat two-dimensional graphic design in a Swiss modernist poster style. A few bold geometric shapes on a near-black (#05070d) background, soft graphite grey shapes and one electric blue (#0184f7) accent. Crisp edges, generous empty space, a subtle printed-paper grain. No gradients, no shading, no glow, no 3D.
```

### Negative prompt

```text
3D, render, glow, bloom, gradient, drop shadow, perspective, photorealistic, people, faces, hands, text, letters, numbers, logos, watermark, shield, padlock, globe, network nodes, connected dots, circuit board, isometric, sci-fi, neon, purple, pink, cluttered
```

### The five prompts (paste after the shared style)

**Home hero**

```text
A tall stack of thin horizontal grey lines filling the right two-thirds of the frame, one line electric blue and slightly offset; the left third empty. Aspect ratio 16:9.
```

**Managed detection and response**

```text
An even grid of small grey squares, one square replaced by an electric blue outline. Aspect ratio 4:3.
```

**Penetration testing**

```text
A row of interlocking grey rectangles with one rectangle pushed out of line and outlined in electric blue. Aspect ratio 4:3.
```

**Platform**

```text
A tidy grid of rounded squares like a control panel, most graphite grey, one filled electric blue. Aspect ratio 16:10.
```

**About**

```text
Three layered flat mountain ridgelines in graded greys under a single thin electric blue horizon line. Aspect ratio 3:2.
```

Write the alt text for a style B image as a plain description of the shapes, for example "Grey
horizontal lines with one blue line offset".

## Placing the images

Save each file in `src/assets/images/` with the exact file name above (or send it over to be
placed), then update that slot's `alt` text in `src/data/images.ts` to describe the new picture.
No photos of real people, no other organizations' logos and no text in any image.

## Placed images (2026-10-24)

Supplied by the owner from an image generator, converted to WebP (quality 90) and placed in
`src/assets/images/`. A design review on 2026-10-24 found that they have the "AI art" look this
page now steers away from (glowing chrome, glass panels, node grids, a wireframe landscape), that
the hero's shield repeats the logo's own shield a few hundred pixels away, and that all four are
below their slot's minimum size. They stay in place until replacements made with the prompts
above arrive.

| Slot                           | File           | Source size | Minimum     | Notes                                                         |
| ------------------------------ | -------------- | ----------- | ----------- | ------------------------------------------------------------- |
| Home hero                      | `hero.webp`    | 1672 x 941  | 2400 x 1350 | Silver shield on a blue node grid; replace (repeats the logo) |
| Managed detection and response | `mdr.webp`     | 1448 x 1086 | 1600 x 1200 | Glass panels with node graphs; replace                        |
| Penetration testing            | `pentest.webp` | 1448 x 1086 | 1600 x 1200 | Hexagonal plates, blue light through one seam; replace        |
| About                          | `about.webp`   | 1536 x 1024 | 1800 x 1200 | Wireframe mountain range at night; replace                    |
| Platform                       | (none yet)     |             | 2000 x 1250 | Slot renders nothing until `platform.webp` is added           |
