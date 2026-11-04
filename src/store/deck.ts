import { create } from 'zustand'
import { parseHash } from '@/lib/hash'

export type Direction = 1 | -1

interface DeckState {
  /** Current slide (zero-based). */
  index: number
  /** Slide we came from (drives backward transitions). */
  previous: number
  direction: Direction
  /** Current build step on the slide (0 = no <Step> revealed yet). */
  step: number
  /** Number of steps registered by the active slide. */
  totalSteps: number
  total: number
  overview: boolean
  /** Highlighted tile in the overview grid. */
  cursor: number

  setTotal: (total: number) => void
  goTo: (index: number, options?: { step?: number }) => void
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  setTotalSteps: (n: number) => void
  openOverview: () => void
  closeOverview: () => void
  toggleOverview: () => void
  setCursor: (i: number) => void
  moveCursor: (delta: number) => void
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

export const useDeckStore = create<DeckState>()((set, get) => ({
  index: parseHash() ?? 0,
  previous: 0,
  direction: 1,
  step: 0,
  totalSteps: 0,
  total: 0,
  overview: false,
  cursor: 0,

  setTotal: (total) =>
    set((s) => ({ total, index: clamp(s.index, 0, Math.max(0, total - 1)) })),

  goTo: (target, options) =>
    set((s) => {
      const index = clamp(target, 0, Math.max(0, s.total - 1))
      if (index === s.index) {
        return options?.step !== undefined ? { step: Math.min(options.step, s.totalSteps) } : {}
      }
      return {
        index,
        previous: s.index,
        direction: index > s.index ? 1 : -1,
        step: options?.step ?? 0,
        // The new slide re-registers its steps once it mounts.
        totalSteps: 0,
      }
    }),

  next: () => {
    const s = get()
    if (s.step < s.totalSteps) set({ step: s.step + 1 })
    else if (s.index < s.total - 1) s.goTo(s.index + 1)
  },

  prev: () => {
    const s = get()
    const current = Math.min(s.step, s.totalSteps)
    if (current > 0) set({ step: current - 1 })
    // Going back lands on the previous slide fully built.
    else if (s.index > 0) s.goTo(s.index - 1, { step: Number.POSITIVE_INFINITY })
  },

  first: () => get().goTo(0),
  last: () => get().goTo(get().total - 1),

  setTotalSteps: (n) => set((s) => ({ totalSteps: n, step: Math.min(s.step, n) })),

  openOverview: () => set((s) => ({ overview: true, cursor: s.index })),
  closeOverview: () => set({ overview: false }),
  toggleOverview: () => (get().overview ? get().closeOverview() : get().openOverview()),
  setCursor: (cursor) => set((s) => ({ cursor: clamp(cursor, 0, s.total - 1) })),
  moveCursor: (delta) => get().setCursor(get().cursor + delta),
}))
