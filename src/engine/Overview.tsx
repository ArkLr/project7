import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/deck/ScrollArea'
import { TextShimmer } from '@/components/wensity/text-shimmer'
import { deckConfig } from '@/deck.config'
import { useElementSize } from '@/hooks/useElementSize'
import { useOverviewColumns } from '@/hooks/useOverviewColumns'
import { cn } from '@/lib/utils'
import { slides } from '@/slides'
import { useDeckStore } from '@/store/deck'
import { SlideRenderer } from './SlideRenderer'

function Thumbnail({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(ref)
  const scale = width / deckConfig.width

  return (
    <div ref={ref} className="relative aspect-video w-full overflow-hidden rounded-xl bg-bg">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_60%)]" />
      {width > 0 && (
        <div
          inert
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: deckConfig.width, height: deckConfig.height, transform: `scale(${scale})` }}
        >
          <SlideRenderer index={index} mode="thumbnail" />
        </div>
      )}
    </div>
  )
}

/** Grid of all slides (Esc / O). Arrow keys move the highlight, Enter opens. */
export function Overview() {
  const open = useDeckStore((s) => s.overview)
  const current = useDeckStore((s) => s.index)
  const cursor = useDeckStore((s) => s.cursor)
  const { goTo, closeOverview, setCursor } = useDeckStore.getState()
  const cols = useOverviewColumns()

  useEffect(() => {
    if (!open) return
    document.querySelector(`[data-overview-index="${cursor}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [cursor, open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overview"
          role="dialog"
          aria-label="Slide overview"
          className="fixed inset-0 z-40 bg-[color-mix(in_oklab,var(--bg)_94%,transparent)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <ScrollArea className="h-full" contentClassName="mx-auto max-w-7xl px-6 pb-32 pt-12 md:px-10">
            <motion.header
              className="mb-8 flex items-end justify-between gap-4"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              <div>
                <TextShimmer as="h2" text="Overview" className="font-display text-3xl font-semibold" />
                <p className="mt-1 text-sm text-muted">
                  {slides.length} slides · arrows to move · Enter to open · Esc to close
                </p>
              </div>
              <button
                type="button"
                onClick={closeOverview}
                aria-label="Close overview"
                className="grid size-10 place-items-center rounded-full border border-border bg-surface text-muted transition hover:rotate-90 hover:text-fg"
              >
                <X className="size-5" />
              </button>
            </motion.header>

            <motion.ul
              className="grid gap-5"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } } }}
            >
              {slides.map((slide, i) => (
                <motion.li
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.95 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 26 } },
                  }}
                >
                  <motion.button
                    type="button"
                    data-overview-index={i}
                    onClick={() => {
                      goTo(i)
                      closeOverview()
                    }}
                    onMouseEnter={() => setCursor(i)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'block w-full rounded-2xl border bg-surface p-2 text-left shadow-soft outline-none transition-colors',
                      i === cursor ? 'border-accent ring-2 ring-[color-mix(in_oklab,var(--accent)_35%,transparent)]' : 'border-border',
                    )}
                  >
                    <Thumbnail index={i} />
                    <div className="flex items-center gap-2 px-1.5 pb-1 pt-2.5 text-sm">
                      <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                      <span className="truncate">{slide.title ?? 'Untitled'}</span>
                      {i === current && (
                        <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-fg">
                          current
                        </span>
                      )}
                    </div>
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
