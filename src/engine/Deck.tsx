import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { deckConfig } from '@/deck.config'
import { useSlides } from '@/hooks/useSlides'
import { useSwipeNav } from '@/hooks/useSwipeNav'
import { slides } from '@/slides'
import { SlideRenderer } from './SlideRenderer'
import { Stage } from './Stage'
import { slideVariants, type TransitionCustom } from './transitions'

export function Deck() {
  const { index, previous, direction, overview } = useSlides()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  useSwipeNav(ref, { enabled: !overview, click: deckConfig.clickToNavigate, orientation: deckConfig.orientation })

  // Forward: the incoming slide's transition. Backward: the outgoing slide's, played in reverse.
  const source = direction > 0 ? slides[index] : (slides[previous] ?? slides[index])
  const custom: TransitionCustom = {
    direction,
    name: reduced ? 'fade' : (source?.transition ?? deckConfig.defaultTransition),
  }

  return (
    <motion.main
      ref={ref}
      className={cn('absolute inset-0', deckConfig.orientation === 'vertical' ? 'touch-pan-x' : 'touch-pan-y')}
      aria-live="polite"
      animate={overview ? { scale: 0.94, opacity: 0.35 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Stage>
        <AnimatePresence initial custom={custom}>
          <motion.section
            key={index}
            className="absolute inset-0 [transform-style:preserve-3d]"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${slides.length}${slides[index]?.title ? ` — ${slides[index].title}` : ''}`}
            custom={custom}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <SlideRenderer index={index} mode="stage" />
          </motion.section>
        </AnimatePresence>
      </Stage>
    </motion.main>
  )
}
