import { motion } from 'motion/react'
import { Children, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useSlideContext } from './context'
import { effectVariants, staggerContainer, withDelay, type RevealEffect } from './effects'

type RevealTag = 'div' | 'section' | 'ul' | 'ol'

interface RevealProps {
  children?: ReactNode
  className?: string
  /** Class added to each wrapped child. */
  itemClassName?: string
  effect?: RevealEffect
  /** Seconds before the first item appears. */
  delay?: number
  /** Seconds between items. */
  stagger?: number
  /** `ul`/`ol` wrap children in <li>. */
  as?: RevealTag
  /** Animate children one by one (true) or the whole block at once (false). */
  each?: boolean
}

const tags = { div: motion.div, section: motion.section, ul: motion.ul, ol: motion.ol } as const

/** Staggered entrance for a group of elements, played when the slide appears. */
export function Reveal({
  children,
  className,
  itemClassName,
  effect = 'fade-up',
  delay = 0.3,
  stagger = 0.08,
  as = 'div',
  each = true,
}: RevealProps) {
  const { mode } = useSlideContext()
  const initial = mode === 'thumbnail' ? false : 'hidden'
  const Comp = tags[as] as typeof motion.div
  const Item = (as === 'ul' || as === 'ol' ? motion.li : motion.div) as typeof motion.div

  if (!each) {
    return (
      <Comp className={className} variants={withDelay(effectVariants[effect], delay)} initial={initial} animate="show">
        {children}
      </Comp>
    )
  }

  return (
    <Comp className={className} variants={staggerContainer(stagger, delay)} initial={initial} animate="show">
      {Children.map(children, (child) =>
        child == null || typeof child === 'boolean' ? child : (
          <Item variants={effectVariants[effect]} className={cn(itemClassName)}>
            {child}
          </Item>
        ),
      )}
    </Comp>
  )
}
