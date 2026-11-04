import type { TargetAndTransition, Variants } from 'motion/react'
import type { Direction } from '@/store/deck'

/** Slide-to-slide transitions. Set per slide with `transition` in `src/slides/index.ts`. */
export type TransitionName = 'fade' | 'slide' | 'zoom' | 'blur' | 'flip' | 'none'

export interface TransitionCustom {
  direction: Direction
  name: TransitionName
}

interface Preset {
  initial: TargetAndTransition
  animate: TargetAndTransition
  exit: TargetAndTransition
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
const exitEase: [number, number, number, number] = [0.4, 0, 0.6, 1]

const presets: Record<TransitionName, (d: Direction) => Preset> = {
  fade: () => ({
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.55, ease } },
    exit: { opacity: 0, transition: { duration: 0.35, ease: exitEase } },
  }),
  slide: (d) => ({
    initial: { x: `${d * 100}%`, opacity: 0.4 },
    animate: { x: '0%', opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 30 } },
    exit: { x: `${-d * 40}%`, opacity: 0, transition: { duration: 0.45, ease: exitEase } },
  }),
  zoom: (d) => ({
    initial: { scale: d > 0 ? 0.82 : 1.18, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.6, ease } },
    exit: { scale: d > 0 ? 1.18 : 0.82, opacity: 0, transition: { duration: 0.4, ease: exitEase } },
  }),
  blur: () => ({
    initial: { filter: 'blur(24px)', opacity: 0, scale: 1.04 },
    animate: { filter: 'blur(0px)', opacity: 1, scale: 1, transition: { duration: 0.7, ease } },
    exit: { filter: 'blur(24px)', opacity: 0, scale: 0.98, transition: { duration: 0.4, ease: exitEase } },
  }),
  flip: (d) => ({
    initial: { rotateY: d * 75, opacity: 0, scale: 0.9 },
    animate: { rotateY: 0, opacity: 1, scale: 1, transition: { duration: 0.75, ease } },
    exit: { rotateY: -d * 75, opacity: 0, scale: 0.9, transition: { duration: 0.45, ease: exitEase } },
  }),
  none: () => ({
    initial: { opacity: 1 },
    animate: { opacity: 1, transition: { duration: 0 } },
    exit: { opacity: 0, transition: { duration: 0 } },
  }),
}

/**
 * Variants resolved from AnimatePresence's `custom`, so the *exiting* slide uses the same
 * transition (and direction) as the entering one.
 */
export const slideVariants: Variants = {
  initial: (c: TransitionCustom) => presets[c.name](c.direction).initial,
  animate: (c: TransitionCustom) => presets[c.name](c.direction).animate,
  exit: (c: TransitionCustom) => presets[c.name](c.direction).exit,
}
