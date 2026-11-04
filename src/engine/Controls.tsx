import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, Minimize } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useSlides } from '@/hooks/useSlides'
import { IconButton } from './IconButton'
import { SlideCounter } from './SlideCounter'
import { ThemeToggle } from './ThemeToggle'

/** Floating control pill; fades away while the pointer is idle. */
export function Controls({ idle }: { idle: boolean }) {
  const { next, prev, isFirst, isLast, toggleOverview, overview } = useSlides()
  const { isFullscreen, toggle, supported } = useFullscreen()
  const [hovered, setHovered] = useState(false)
  const hidden = idle && !hovered && !overview

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <motion.nav
        aria-label="Slide controls"
        data-no-nav
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: hidden ? 16 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-surface p-1.5 shadow-soft"
      >
        <IconButton label="Previous" shortcut="←" onClick={prev} disabled={isFirst || overview}>
          <ChevronLeft className="size-5" />
        </IconButton>
        <SlideCounter />
        <IconButton label="Next" shortcut="→" onClick={next} disabled={isLast || overview}>
          <ChevronRight className="size-5" />
        </IconButton>

        <span className="mx-1 h-6 w-px bg-border" />

        <IconButton label="Overview" shortcut="O" onClick={toggleOverview} className={overview ? 'text-accent' : undefined}>
          <LayoutGrid className="size-[18px]" />
        </IconButton>
        <ThemeToggle />
        {supported && (
          <IconButton label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} shortcut="F" onClick={toggle}>
            {isFullscreen ? <Minimize className="size-[18px]" /> : <Maximize className="size-[18px]" />}
          </IconButton>
        )}
      </motion.nav>
    </div>
  )
}
