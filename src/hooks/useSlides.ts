import { useShallow } from 'zustand/react/shallow'
import { useDeckStore } from '@/store/deck'

/** Current position in the deck plus navigation actions. */
export function useSlides() {
  return useDeckStore(
    useShallow((s) => ({
      index: s.index,
      previous: s.previous,
      direction: s.direction,
      step: s.step,
      totalSteps: s.totalSteps,
      total: s.total,
      overview: s.overview,
      isFirst: s.index === 0 && Math.min(s.step, s.totalSteps) === 0,
      isLast: s.index === s.total - 1 && s.step >= s.totalSteps,
      next: s.next,
      prev: s.prev,
      goTo: s.goTo,
      first: s.first,
      last: s.last,
      toggleOverview: s.toggleOverview,
      closeOverview: s.closeOverview,
    })),
  )
}
