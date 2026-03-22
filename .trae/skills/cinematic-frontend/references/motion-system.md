# Motion System

Use this file when implementing Framer Motion behavior, staggered typography, spring tokens, and tactile interactions.

## Package Choice

Use the project's existing motion package first.

- If the repo already uses Motion 12, import from `motion/react`.
- If the repo already uses Framer Motion, import from `framer-motion`.
- Keep the API semantics identical in either case.

## Baseline Spring

Use this as the default for entrances and tactile interaction:

```tsx
const cinematicSpring = {
  type: "spring",
  stiffness: 260,
  damping: 15,
};
```

Adjust only when the component clearly needs it:
- raise `stiffness` slightly for small buttons or chips
- raise `damping` slightly for large panels if rebound becomes noisy

Do not replace core movement with `linear`.

## Core Variants

Start from these patterns:

```tsx
const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.12,
    },
  },
};

const wordReveal = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(10px)",
    textShadow: "0 0 0 rgba(34,211,238,0)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    textShadow: "0 0 18px rgba(34,211,238,0.22)",
    transition: cinematicSpring,
  },
};

const panelReveal = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.94,
    filter: "blur(12px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: cinematicSpring,
  },
};
```

Use `panelReveal` for hero cards, dialog shells, feature tiles, and floating stat blocks.

## Kinetic Typography

Animate AI explanation copy, hero headlines, and section intros token by token.

English copy can split by spaces. Chinese copy needs a different strategy:
- use `text.split(" ")` for English words
- use `Array.from(text)` for short Chinese copy
- use hand-built semantic chunks for long Chinese lines

A simple reusable component:

```tsx
import { motion } from "motion/react";

type KineticTextProps = {
  text: string;
  className?: string;
  tokens?: string[];
};

export function KineticText({ text, className, tokens }: KineticTextProps) {
  const fallbackTokens =
    /[\u4e00-\u9fff]/.test(text) ? Array.from(text) : text.split(" ");
  const items = tokens?.length ? tokens : fallbackTokens;

  return (
    <motion.span
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className={className}
    >
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="inline-block overflow-hidden align-top">
          <motion.span variants={wordReveal} className="inline-block pr-2">
            {item}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
```

For long Chinese paragraphs, prefer semantic chunks to avoid hundreds of motion nodes.

## Buttons, Chips, and Bubbles

Give buttons tactile compression and rebound:

```tsx
<motion.button
  whileHover={{ y: -2, scale: 1.02 }}
  whileTap={{ scale: 0.97, y: 1 }}
  transition={cinematicSpring}
/>
```

Use small floating chips sparingly. A subtle idle loop is enough:

```tsx
animate={{ y: [0, -6, 0], rotate: [0, 0.8, 0] }}
transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
```

Do not make every element float forever. Keep motion hierarchy clear.

## Scroll Reveals

Reveal major sections once as they enter view:

```tsx
whileInView="show"
initial="hidden"
viewport={{ once: true, amount: 0.3 }}
```

Use this for section shells, not every tiny child, when a page already has rich hero motion.

## Anti-Patterns

Avoid these mistakes:
- `ease: "linear"` for entrances or tactile interactions
- huge slide distances that feel like template motion
- every element using the same delay without hierarchy
- glow that keeps intensifying after the reveal settles
- mixing Tailwind `transition-all` with Framer motion on the same transform properties

## Motion QA

Before finishing, check:
- does each major reveal have spring rebound?
- does the page have one obvious motion hierarchy?
- do text reveals feel deliberate rather than noisy?
- do hover and tap states feel tactile?
- does mobile keep the same emotional tone with fewer moving parts?
