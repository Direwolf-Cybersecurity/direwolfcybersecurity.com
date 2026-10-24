# Image generator prompts for the website

The website has five optional image slots. Each one renders only when its file exists in
`src/assets/images/`, so the site looks complete without them. Generate the images with a
tool whose license allows commercial use (Adobe Firefly, Midjourney on a paid plan, or
ChatGPT image generation), then send them over to be placed.

## Shared style (paste at the start of every prompt)

```text
Abstract cybersecurity technology graphic. Near-black background (#05070d). Electric blue (#0184f7) and soft cyan light accents with a gentle glow. Brushed silver and dark graphite metallic surfaces. Clean geometric shapes, precise and minimal, premium enterprise aesthetic, cinematic low-key lighting, subtle depth of field, photorealistic 3D render, sharp detail.
```

## Negative prompt (use the tool's "avoid" field, or append "Avoid:" to the prompt)

```text
people, faces, hands, silhouettes, hooded hacker, padlock icon, skull, binary code rain, matrix code, text, letters, numbers, logos, watermark, cartoon, clip art, neon pink, purple, rainbow colors, cluttered, busy background, fantasy, wolf
```

## The five images

| Slot | File name | Aspect | Minimum size |
|------|-----------|--------|--------------|
| Home hero | `hero.webp` | 16:9 | 2400 x 1350 |
| Managed detection and response | `mdr.webp` | 4:3 | 1600 x 1200 |
| Penetration testing | `pentest.webp` | 4:3 | 1600 x 1200 |
| Platform | `platform.webp` | 16:10 | 2000 x 1250 |
| About | `about.webp` | 3:2 | 1800 x 1200 |

**Home hero**

```text
A vast dark digital landscape seen from a low angle: a grid of faint glowing blue nodes linked by thin lines of light stretching toward the horizon. At the center right, a single faceted silver shield shape rests on the grid and casts a soft blue glow. Fine light particles drift upward. The left third of the frame stays dark and empty for headline text. Aspect ratio 16:9.
```

**Managed detection and response**

```text
Layered translucent glass panels floating in darkness, each etched with thin glowing blue line graphs and clusters of connected nodes. One node in the foreground glows brighter than the rest, as if it has just been detected. Shallow depth of field, calm and focused. Aspect ratio 4:3.
```

**Penetration testing**

```text
Macro view of a dark graphite surface made of interlocking hexagonal metal plates. One plate is lifted slightly out of place, and bright electric blue light seeps through the seam around it. Precise, technical, high detail. Aspect ratio 4:3.
```

**Platform**

```text
Isometric three-quarter view of an abstract modular data center built from matte black blocks with thin electric blue edge lighting. Fine silver circuit traces run between the blocks and pulse faintly. The structure floats in darkness with soft reflections below. Aspect ratio 16:10.
```

**About (nod to Colorado Springs and the Front Range)**

```text
Wide panoramic view of a mountain range at night, rendered as a wireframe mesh of thin electric blue light lines over dark terrain, with a faint starfield above. Calm, expansive, quiet. Aspect ratio 3:2.
```

## Tips for a consistent, less "AI" look

- Generate 4 to 8 variations per prompt and pick the cleanest one. Reject any with
  garbled symbols, warped edges or stray text.
- Keep one look across all five: in Midjourney, reuse the hero as a style reference
  (`--sref`); in Firefly, use the hero as the "Style" reference image.
- Prefer images with lots of dark negative space; they sit better behind and beside text.
- Export as PNG or WebP at or above the sizes above. Larger is fine; the site resizes them.
- Keep the generator's license terms with the files, in case anyone asks where they came from.
