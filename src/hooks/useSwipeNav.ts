import { useEffect, type RefObject } from 'react'
import { useDeckStore } from '@/store/deck'

interface SwipeNavOptions {
  enabled?: boolean
  /** Advance on click (left 30% of the element goes back). */
  click?: boolean
  threshold?: number
}

const INTERACTIVE = 'a, button, input, textarea, select, label, summary, [role="button"], [data-no-nav]'

/** Swipe (touch/pen) and click navigation on an element. */
export function useSwipeNav(ref: RefObject<HTMLElement | null>, { enabled = true, click = true, threshold = 50 }: SwipeNavOptions = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    let start: { x: number; y: number; type: string } | null = null

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0) return
      if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return
      start = { x: e.clientX, y: e.clientY, type: e.pointerType }
    }

    const onUp = (e: PointerEvent) => {
      if (!start) return
      const dx = e.clientX - start.x
      const dy = e.clientY - start.y
      const type = start.type
      start = null
      const { next, prev } = useDeckStore.getState()

      if (type !== 'mouse' && Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0) next()
        else prev()
        return
      }

      const isTap = Math.abs(dx) < 6 && Math.abs(dy) < 6
      if (!click || !isTap) return
      if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return
      if (window.getSelection()?.toString()) return
      const rect = el.getBoundingClientRect()
      if (e.clientX - rect.left < rect.width * 0.3) prev()
      else next()
    }

    const onCancel = () => {
      start = null
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onCancel)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onCancel)
    }
  }, [ref, enabled, click, threshold])
}
