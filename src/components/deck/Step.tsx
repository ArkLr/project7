import { motion } from 'motion/react'
import { useId, useLayoutEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useSlideContext, useStepContext } from './context'
import { effectVariants, type RevealEffect } from './effects'

interface StepProps {
  children?: ReactNode
  className?: string
  /**
   * Step number at which this appears (1-based). Omit to number steps automatically
   * in document order. Give several <Step>s the same `at` to show them together.
   */
  at?: number
  effect?: RevealEffect
  /** Fade this step back once a later step is shown. */
  dim?: boolean
  as?: 'div' | 'li' | 'span'
}

const tags = { div: motion.div, li: motion.li, span: motion.span } as const

/** A build step: hidden until you press → / Space enough times on the slide. */
export function Step({ children, className, at, effect = 'fade-up', dim = false, as = 'div' }: StepProps) {
  const id = useId()
  const { step, register, resolve } = useStepContext()
  const { mode } = useSlideContext()

  useLayoutEffect(() => register(id, at), [id, at, register])

  const index = resolve(id)
  const visible = step >= index
  const state = !visible ? 'hidden' : dim && step > index ? 'dim' : 'show'
  const Comp = tags[as] as typeof motion.div

  return (
    <Comp
      className={cn(as === 'span' && 'inline-block', !visible && 'pointer-events-none', className)}
      aria-hidden={!visible || undefined}
      variants={effectVariants[effect]}
      initial={mode === 'thumbnail' ? false : 'hidden'}
      animate={state}
    >
      {children}
    </Comp>
  )
}
