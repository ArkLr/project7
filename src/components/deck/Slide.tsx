import { motion } from 'motion/react'
import { Children, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useSlideContext } from './context'
import { effectVariants, staggerContainer, type RevealEffect } from './effects'
import { ScrollArea } from './ScrollArea'

export type SlideLayout = 'center' | 'top' | 'split'

interface SlideProps {
  children?: ReactNode
  className?: string
  /** `center` (default) · `top` · `split` (two columns). */
  layout?: SlideLayout
  /** Animate each direct child in turn when the slide enters. Default: true. */
  stagger?: boolean
  /** Entrance effect for staggered children. Default: `fade-up`. */
  effect?: RevealEffect
  /** Seconds between children. */
  staggerDelay?: number
  /** Seconds before the first child starts (lets the slide transition land). */
  delay?: number
}

const layouts: Record<SlideLayout, string> = {
  center: 'items-center justify-center text-center gap-6',
  top: 'justify-start gap-8',
  split: 'grid grid-cols-2 items-center gap-16',
}

/** Root layout for a slide: padding, layout preset, staggered entrance and smooth overflow scroll. */
export function Slide({
  children,
  className,
  layout = 'center',
  stagger = true,
  effect = 'fade-up',
  staggerDelay = 0.09,
  delay = 0.2,
}: SlideProps) {
  const { mode } = useSlideContext()
  const thumbnail = mode === 'thumbnail'
  const item = effectVariants[effect]

  return (
    <ScrollArea disabled={thumbnail} className="h-full w-full">
      <motion.div
        className={cn('flex min-h-[720px] flex-col px-24 py-20', layouts[layout], className)}
        variants={staggerContainer(staggerDelay, delay)}
        initial={thumbnail ? false : 'hidden'}
        animate="show"
      >
        {stagger
          ? Children.map(children, (child) =>
              child == null || typeof child === 'boolean' ? child : (
                <motion.div variants={item}>{child}</motion.div>
              ),
            )
          : children}
      </motion.div>
    </ScrollArea>
  )
}
