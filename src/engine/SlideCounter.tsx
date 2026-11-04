import { AnimatePresence, motion } from 'motion/react'
import { useSlides } from '@/hooks/useSlides'

const pad = (n: number, width: number) => String(n).padStart(width, '0')

/** "03 / 12" with a rolling digit animation that follows the navigation direction. */
export function SlideCounter() {
  const { index, total, direction, step, totalSteps } = useSlides()
  const width = Math.max(2, String(total).length)

  return (
    <div className="flex min-w-[5.5rem] flex-col items-center px-2 font-mono text-sm tabular-nums">
      <div className="flex items-center gap-1.5">
        <span className="relative inline-flex h-5 overflow-hidden text-fg">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.span
              key={index}
              custom={direction}
              variants={{
                enter: (d: number) => ({ y: d > 0 ? '100%' : '-100%', opacity: 0 }),
                center: { y: '0%', opacity: 1 },
                exit: (d: number) => ({ y: d > 0 ? '-100%' : '100%', opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            >
              {pad(index + 1, width)}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="text-muted">/</span>
        <span className="text-muted">{pad(total, width)}</span>
      </div>
      {totalSteps > 0 && (
        <div className="mt-1 flex gap-1" aria-label={`Step ${Math.min(step, totalSteps)} of ${totalSteps}`}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <motion.span
              key={i}
              className="h-1 w-1 rounded-full"
              animate={{
                backgroundColor: i < step ? 'var(--accent)' : 'var(--border)',
                scale: i === step - 1 ? 1.4 : 1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
