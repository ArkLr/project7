import { createContext, useContext } from 'react'

/* ───────────── Slide context ───────────── */

export type SlideMode = 'stage' | 'thumbnail'

export interface SlideContextValue {
  index: number
  /** `thumbnail` = rendered in the overview grid (static, fully built). */
  mode: SlideMode
}

export const SlideContext = createContext<SlideContextValue>({ index: 0, mode: 'stage' })
export const useSlideContext = () => useContext(SlideContext)

/* ───────────── Step context ───────────── */

export interface StepEntry {
  id: string
  at?: number
}

export interface StepContextValue {
  /** Current build step for this slide. */
  step: number
  register: (id: string, at?: number) => () => void
  /** Step number at which the given <Step> becomes visible. */
  resolve: (id: string) => number
}

export const ALL_STEPS = Number.POSITIVE_INFINITY

export const StepContext = createContext<StepContextValue>({
  step: ALL_STEPS,
  register: () => () => {},
  resolve: () => 0,
})
export const useStepContext = () => useContext(StepContext)

/** Auto steps are numbered 1, 2, 3… in document order; `at` overrides. */
export function resolveStep(entries: StepEntry[], id: string): number {
  let auto = 0
  for (const e of entries) {
    if (e.at === undefined) auto++
    if (e.id === id) return e.at ?? auto
  }
  return ALL_STEPS
}

export function countSteps(entries: StepEntry[]): number {
  let auto = 0
  let max = 0
  for (const e of entries) {
    if (e.at === undefined) max = Math.max(max, ++auto)
    else max = Math.max(max, e.at)
  }
  return max
}
