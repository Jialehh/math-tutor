# Visual Language

Use this file when choosing the page's atmosphere, palette, typography, glass treatment, and section composition.

## Tone

Aim for:
- cinematic
- premium
- futuristic
- dark
- controlled
- luminous

Avoid:
- playful
- candy-color cyberpunk
- flat enterprise dashboard styling
- default Tailwind demo aesthetics

## Palette

Use a restrained dark palette and let glow accents do the work.

Suggested anchors:
- canvas black: `#02040a`
- deep space navy: `#07111f`
- text high: `#f5f7ff`
- text medium: `#94a3b8`
- cyan glow: `#22d3ee`
- purple glow: `#a855f7`
- border light: `rgba(255,255,255,0.12)`
- glass fill: `rgba(255,255,255,0.06)`

Use cyan and purple together, but do not saturate the whole page. Keep one accent dominant and let the other support it.

## Background Recipes

Prefer layered backgrounds over a single flat fill.

Example Tailwind direction:

```tsx
className="
  min-h-screen bg-[#02040a] text-white
  [background-image:
    radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.14),transparent_28%),
    radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.16),transparent_24%),
    radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.10),transparent_40%),
    linear-gradient(180deg,#040816_0%,#02040a_45%,#010208_100%)
  ]
"
```

Add a light vignette, subtle grid, or faint noise only if it supports the mood without becoming visible clutter.

## Glass Surfaces

Use glassmorphism as a premium material, not a novelty effect.

Recommended recipe:

```tsx
className="
  rounded-3xl border border-white/10 bg-white/6
  backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]
"
```

Improve depth with:
- a 1px highlight edge
- internal top glow
- a faint colored shadow on focal cards

Avoid:
- opaque cards
- thick solid borders
- muddy gray fills

## Typography

Prefer a modern sans with personality. Good defaults:
- `Space Grotesk`
- `Sora`
- `Manrope`

Use typography to create pacing:
- hero headline: bold, large, tight leading
- eyebrow labels: uppercase, wide tracking, compact
- support copy: shorter line length, softer contrast
- metrics or badges: monospaced feel only if it helps the sci-fi tone

Use negative space aggressively. A cinematic layout should breathe.

## Layout Composition

Build depth through layers and staggered focal points.

Reliable composition patterns:
- oversized hero headline on one side, floating glass stack on the other
- center-stage statement with orbiting chips or stat bubbles
- asymmetrical two-column section with one dominant visual anchor
- section dividers created by glow falloff, not hard rules alone

Avoid perfectly even card grids unless the content truly demands them. If a grid is necessary, vary card scale, emphasis, or overlap so the section still feels directed.

## Iconography

Use `lucide-react` for restrained tech accents.

Prefer:
- `Sparkles`
- `Bot`
- `Radar`
- `Cpu`
- `Satellite`
- `Shield`
- `WandSparkles`

Wrap icons in small glowing pills or glass badges. Keep stroke width crisp and the icon count low.

## Mobile Adaptation

Keep the atmosphere on mobile. Reduce density instead of stripping the concept.

On mobile:
- shrink glow sizes, not contrast
- reduce floating offsets
- keep the hero statement dominant
- stack glass panels cleanly
- preserve one strong spring interaction pattern
