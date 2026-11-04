import type { ComponentType } from 'react'
import type { TransitionName } from '@/engine/transitions'

export interface SlideEntry {
  /** The slide component (default export of a file in src/slides/). */
  component: ComponentType
  /** Shown in the overview grid. */
  title?: string
  /** How this slide enters: fade · slide · zoom · blur · flip · none. */
  transition?: TransitionName
}
