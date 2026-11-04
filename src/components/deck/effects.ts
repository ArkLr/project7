import type { TargetAndTransition, Transition, Variants } from 'motion/react'

/** Entrance effects shared by <Slide>, <Reveal> and <Step>. */
export type RevealEffect =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale'
  | 'blur'
  | 'flip'

const spring: Transition = { type: 'spring', stiffness: 240, damping: 26, mass: 0.9 }

const neutral: Record<string, string | number> = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotateX: 0,
  filter: 'blur(0px)',
}

/** Builds hidden/show/dim variants; `show` resets exactly the properties `hidden` changes. */
function make(hidden: Record<string, string | number>): Variants {
  const reset = Object.fromEntries(Object.keys(hidden).map((k) => [k, neutral[k]]))
  return {
    hidden: { ...hidden, transition: { duration: 0.25, ease: 'easeIn' } } as TargetAndTransition,
    show: { ...reset, transition: spring } as TargetAndTransition,
    dim: { ...reset, opacity: 0.35, transition: { duration: 0.3 } } as TargetAndTransition,
  }
}

export const effectVariants: Record<RevealEffect, Variants> = {
  fade: make({ opacity: 0 }),
  'fade-up': make({ opacity: 0, y: 28 }),
  'fade-down': make({ opacity: 0, y: -28 }),
  'fade-left': make({ opacity: 0, x: 40 }),
  'fade-right': make({ opacity: 0, x: -40 }),
  scale: make({ opacity: 0, scale: 0.85 }),
  blur: make({ opacity: 0, filter: 'blur(12px)' }),
  flip: make({ opacity: 0, rotateX: -80 }),
}

export function staggerContainer(stagger = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }
}

/** Adds a delay to an effect's `show` state. */
export function withDelay(variants: Variants, delay: number): Variants {
  if (!delay) return variants
  const show = variants.show as TargetAndTransition
  return { ...variants, show: { ...show, transition: { ...show.transition, delay } } }
}
