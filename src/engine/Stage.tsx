import { useRef, type CSSProperties, type ReactNode } from 'react'
import { deckConfig } from '@/deck.config'
import { useElementSize } from '@/hooks/useElementSize'

/** Fixed-size slide canvas scaled to fit its container (keeps 16:9 layouts identical on every screen). */
export function Stage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useElementSize(ref)
  const { width: W, height: H } = deckConfig
  const scale = width && height ? Math.min(width / W, height / H) : 0
  // Empty space (in slide px) between the slide box and the viewport edge on each side.
  // Slides can bleed into it, e.g. `mr-[calc(-1*var(--bleed-x))]` to touch the window edge.
  const bleedX = scale ? Math.max(0, (width / scale - W) / 2) : 0
  const bleedY = scale ? Math.max(0, (height / scale - H) / 2) : 0

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      <div
        className="relative shrink-0"
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          perspective: 1800,
          visibility: scale ? 'visible' : 'hidden',
          '--bleed-x': `${bleedX}px`,
          '--bleed-y': `${bleedY}px`,
        } as CSSProperties}
      >
        {children}
      </div>
    </div>
  )
}
