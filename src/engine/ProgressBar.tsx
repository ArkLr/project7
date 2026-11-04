import { motion, useSpring } from 'motion/react'
import { useEffect } from 'react'
import { useSlides } from '@/hooks/useSlides'

/** Top progress bar; fills smoothly per slide and per build step. */
export function ProgressBar() {
  const { index, total, step, totalSteps } = useSlides()
  const within = totalSteps > 0 ? Math.min(step, totalSteps) / totalSteps : 1
  const progress = total ? (index + within) / total : 0
  const scaleX = useSpring(progress, { stiffness: 140, damping: 26 })

  useEffect(() => {
    scaleX.set(progress)
  }, [progress, scaleX])

  return (
    <div
      className="fixed inset-x-0 top-0 z-30 h-[3px] bg-[color-mix(in_oklab,var(--border)_60%,transparent)]"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <motion.div
        style={{ scaleX }}
        className="h-full origin-left bg-linear-to-r from-accent to-accent-2 shadow-[0_0_14px_var(--accent)]"
      />
    </div>
  )
}
