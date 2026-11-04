import { useReducedMotion } from 'motion/react'
import { useCallback, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { applyTheme, readStoredTheme, useThemeStore, type Theme } from '@/store/theme'

interface Origin {
  x: number
  y: number
}

/** Current theme + a toggle that plays a circular reveal from `origin` (View Transitions API). */
export function useTheme() {
  const theme = useThemeStore((s) => s.theme)
  const reduced = useReducedMotion()

  const setTheme = useCallback(
    (next: Theme, origin?: Origin) => {
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> }
      }
      if (!doc.startViewTransition || reduced) {
        applyTheme(next, true)
        return
      }

      const x = origin?.x ?? window.innerWidth / 2
      const y = origin?.y ?? window.innerHeight / 2
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

      const transition = doc.startViewTransition(() => {
        flushSync(() => applyTheme(next, true))
      })
      transition.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 650, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
          )
        })
        .catch(() => {})
    },
    [reduced],
  )

  const toggle = useCallback(
    (origin?: Origin) => setTheme(useThemeStore.getState().theme === 'dark' ? 'light' : 'dark', origin),
    [setTheme],
  )

  return { theme, setTheme, toggle }
}

/** Follows the OS theme until the user picks one explicitly. Mount once. */
export function useSystemThemeSync() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (!readStoredTheme()) applyTheme(mq.matches ? 'dark' : 'light', false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
}
