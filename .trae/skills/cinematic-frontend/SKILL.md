---
name: cinematic-frontend
description: Build or refactor React and Next.js frontend pages in a cinematic dark sci-fi PV style using Tailwind CSS, Framer Motion or motion/react, and lucide-react. Use when the user asks for cinematic, futuristic, dark-mode sci-fi, glassmorphism, word-by-word or chunked PV text reveals, springy elastic motion, immersive landing pages, product showcases, hero sections, AI interfaces, or any UI that needs premium visual drama and spring-driven interaction.
---

# Cinematic PV Frontend

Build pages that feel like a premium cinematic PV instead of a generic SaaS layout. Match the host project's structure first, then enforce the visual and motion rules in this skill.

## Workflow

### 1. Inspect the stack before changing UI

Check whether the project already uses `motion/react` or `framer-motion`. Use the existing dependency if present; if neither exists and dependency changes are in scope, add the Framer Motion-compatible package that best matches the repo.

Preserve the app's routing, data flow, and component architecture. Change the page language, layout, styling, and motion system without inventing unnecessary abstractions.

### 2. Lock the art direction early

Use a dark sci-fi canvas: near-black or deep-space navy, layered with restrained cyan and purple ambient glows.

Use premium glassmorphism surfaces:
- `backdrop-blur-xl`
- `border-white/10` to `border-white/15`
- `bg-white/5` to `bg-white/8`
- luminous shadows instead of heavy matte drop shadows

Keep generous whitespace. Prefer a strong modern sans. If a font change is cheap and appropriate, prefer options such as `Space Grotesk`, `Sora`, or `Manrope` over default system-looking stacks.

Read [references/visual-language.md](references/visual-language.md) when choosing palette, surfaces, composition, or typography.

### 3. Define motion rules before filling details

Treat motion as a first-class system, not decoration. Use spring motion for all core entrances and tactile interactions.

Use this spring as the baseline:

```ts
const cinematicSpring = {
  type: "spring",
  stiffness: 260,
  damping: 15,
};
```

Apply overshoot and rebound with restraint. The result should feel elastic and expensive, not cartoonish.

Do not use `linear` easing for component entrances, panel reveals, button travel, card motion, or bubble motion. Limit plain CSS transitions to color or opacity-only polish when motion primitives are not involved.

Read [references/motion-system.md](references/motion-system.md) before implementing reveals, hover states, or narrative text animation.

### 4. Implement kinetic typography for narrative copy

Animate hero copy, section intros, AI explanation text, and key callouts word by word or chunk by chunk. Do not reveal important narrative text as one static block.

Use `staggerChildren` with a baseline of `0.04`. Pair each token reveal with:
- slight upward travel
- opacity fade-in
- blur-to-sharp transition
- subtle cyan or purple glow that settles quickly

For Chinese text, do not rely on spaces. Split by characters or by hand-crafted short semantic chunks. Prefer chunked phrases for long paragraphs to avoid hundreds of animated children.

### 5. Compose with cinematic depth

Prefer layered scenes over flat sections:
- atmospheric background glows
- one dominant hero statement
- floating glass chips, stat cards, or command panels
- restrained sci-fi iconography from `lucide-react`
- one or two high-contrast CTAs with tactile spring feedback

Favor asymmetry, overlap, and depth cues. Avoid plain centered marketing blocks unless the brief explicitly calls for them.

Do not default to:
- white backgrounds
- generic dashboard card grids
- default Tailwind button shapes
- purple-only gradients
- motionless blocks separated only by spacing

### 6. Ship only after a quality gate

Verify all of the following before finishing:
- Every major entrance uses spring motion rather than linear easing.
- Narrative text uses staggered word or chunk reveals.
- The page reads as dark, futuristic, and cinematic at first glance.
- Glass panels have edge highlights and meaningful blur.
- `lucide-react` icons feel integrated rather than decorative filler.
- Desktop and mobile both retain hierarchy and dramatic pacing.
- Motion density stays readable and does not flood the screen with constant movement.

## Non-Negotiables

Do not compromise on these rules unless the user explicitly overrides them:
- Use Tailwind CSS for styling.
- Use Framer Motion semantics through `motion/react` or `framer-motion`.
- Use `lucide-react` for the sci-fi icon layer.
- Keep the visual language dark, premium, and futuristic.
- Use spring-based entrances with visible but controlled overshoot.
- Use staggered kinetic typography for key narrative copy.

## Execution Notes

Extract repeated motion configs and repeated glass surface recipes into local constants or small helper components when the page starts duplicating them.

Prefer layered gradients, blur, borders, and composition work over expensive custom rendering. Do not introduce Canvas, WebGL, or particle engines unless the user explicitly asks for them.

When working inside an existing design system, preserve naming, file organization, and data contracts. Translate the cinematic PV language into that system instead of fighting it.