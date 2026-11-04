import { useIsPresent } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useDeckStore } from '@/store/deck'
import { ALL_STEPS, countSteps, resolveStep, StepContext, type StepContextValue, type StepEntry } from './context'

/**
 * Collects the <Step>s of one slide and reports how many there are to the deck store
 * while the slide is active.
 */
export function StepScope({ active, children }: { active: boolean; children: ReactNode }) {
  const entries = useRef<StepEntry[]>([])
  const [snapshot, setSnapshot] = useState<StepEntry[]>([])
  const present = useIsPresent()
  const storeStep = useDeckStore((s) => s.step)
  const setTotalSteps = useDeckStore((s) => s.setTotalSteps)

  // While a slide is exiting, freeze its step so its builds don't collapse mid-transition.
  const [frozen, setFrozen] = useState(storeStep)
  if (present && frozen !== storeStep) setFrozen(storeStep)
  const step = !active ? ALL_STEPS : present ? storeStep : frozen

  const register = useCallback((id: string, at?: number) => {
    entries.current = [...entries.current, { id, at }]
    setSnapshot(entries.current)
    return () => {
      entries.current = entries.current.filter((e) => e.id !== id)
      setSnapshot(entries.current)
    }
  }, [])

  // Passive effects run after every child's layout effect, so all <Step>s are registered here.
  useEffect(() => {
    if (active && present) setTotalSteps(countSteps(entries.current))
  }, [active, present, snapshot, setTotalSteps])

  const value = useMemo<StepContextValue>(
    () => ({ step, register, resolve: (id) => resolveStep(snapshot, id) }),
    [step, register, snapshot],
  )

  return <StepContext.Provider value={value}>{children}</StepContext.Provider>
}
