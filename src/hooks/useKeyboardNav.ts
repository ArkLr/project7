import { useEffect, useLayoutEffect, useRef } from 'react'
import { overviewColumns } from '@/lib/overview'
import { useDeckStore } from '@/store/deck'

interface KeyboardNavOptions {
  onToggleFullscreen?: () => void
}

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
}

/**
 * Deck:     → ↓ Space PageDown = next · ← ↑ Shift+Space PageUp = previous · Home/End
 *           F = fullscreen · T = theme · Esc/O = overview
 * Overview: arrows move · Enter/Space open · Esc/O close
 */
export function useKeyboardNav(options: KeyboardNavOptions = {}) {
  const opts = useRef(options)
  useLayoutEffect(() => {
    opts.current = options
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isEditable(e.target)) return
      // Let focused buttons/links handle their own activation keys.
      const onControl = e.target instanceof HTMLElement && e.target.closest('button, a')
      if (onControl && (e.key === ' ' || e.key === 'Enter')) return

      const s = useDeckStore.getState()
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      let handled = true

      if (key === 'f') opts.current.onToggleFullscreen?.()
      else if (s.overview) {
        const cols = overviewColumns()
        switch (key) {
          case 'ArrowRight': s.moveCursor(1); break
          case 'ArrowLeft': s.moveCursor(-1); break
          case 'ArrowDown': s.moveCursor(cols); break
          case 'ArrowUp': s.moveCursor(-cols); break
          case 'Home': s.setCursor(0); break
          case 'End': s.setCursor(s.total - 1); break
          case 'Enter':
          case ' ':
            s.goTo(s.cursor)
            s.closeOverview()
            break
          case 'Escape':
          case 'o':
            s.closeOverview()
            break
          default: handled = false
        }
      } else {
        switch (key) {
          case 'ArrowRight':
          case 'ArrowDown':
          case 'PageDown':
          case 'Enter':
            s.next()
            break
          case ' ':
            if (e.shiftKey) s.prev()
            else s.next()
            break
          case 'ArrowLeft':
          case 'ArrowUp':
          case 'PageUp':
          case 'Backspace':
            s.prev()
            break
          case 'Home': s.first(); break
          case 'End': s.last(); break
          case 'Escape':
          case 'o':
            s.openOverview()
            break
          default: handled = false
        }
      }
      if (handled) e.preventDefault()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
