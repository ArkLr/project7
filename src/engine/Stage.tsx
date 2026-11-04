import { useRef, type ReactNode } from 'react'
import { deckConfig } from '@/deck.config'
import { useElementSize } from '@/hooks/useElementSize'

/** Fixed-size slide canvas scaled to fit its container (keeps 16:9 layouts identical on every screen). */
export function Stage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useElementSize(ref)
  const { width: W, height: H } = deckConfig
  const scale = width && height ? Math.min(width / W, height / H) : 0

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
        }}
      >
        {children}
      </div>
    </div>
  )
}
