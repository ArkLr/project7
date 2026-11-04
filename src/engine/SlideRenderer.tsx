import { useMemo } from 'react'
import { SlideContext, type SlideMode } from '@/components/deck/context'
import { StepScope } from '@/components/deck/StepScope'
import { slides } from '@/slides'

/** Renders slide `index` with its slide + step contexts. */
export function SlideRenderer({ index, mode }: { index: number; mode: SlideMode }) {
  const value = useMemo(() => ({ index, mode }), [index, mode])
  const entry = slides[index]
  if (!entry) return null
  const Component = entry.component

  return (
    <SlideContext.Provider value={value}>
      <StepScope active={mode === 'stage'}>
        <Component />
      </StepScope>
    </SlideContext.Provider>
  )
}
