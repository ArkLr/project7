import { useEffect } from 'react'
import { parseHash } from '@/lib/hash'
import { useDeckStore } from '@/store/deck'

/** Keeps `#n` in the URL in sync with the current slide (1-based), both ways. */
export function useHashSync() {
  const index = useDeckStore((s) => s.index)

  useEffect(() => {
    const hash = `#${index + 1}`
    if (window.location.hash !== hash) history.replaceState(null, '', hash)
  }, [index])

  useEffect(() => {
    const onHashChange = () => {
      const i = parseHash()
      if (i !== null) useDeckStore.getState().goTo(i)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
}
