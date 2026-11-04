import type { FC } from 'react'

export interface SplitTextProps {
  text: string
  className?: string
  /** Stagger between pieces, in ms. */
  delay?: number
  duration?: number
  ease?: string | ((t: number) => number)
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars'
  from?: Record<string, unknown>
  to?: Record<string, unknown>
  threshold?: number
  rootMargin?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div'
  staggerFrom?: 'start' | 'center' | 'end' | 'edges' | 'random' | number
  mask?: boolean
  effect?: 'rise' | 'fade' | 'blur' | 'flip' | 'pop' | 'skew' | 'wave'
  /** Use `load` inside slides (they don't scroll into view). */
  trigger?: 'view' | 'load' | 'hover' | 'click'
  loop?: boolean
  loopDelay?: number
  hoverEffect?: 'none' | 'lift' | 'wave'
  color?: string
  accentColor?: string
  onLetterAnimationComplete?: () => void
}

declare const SplitText: FC<SplitTextProps>
export default SplitText
