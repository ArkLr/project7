import type { SlideEntry } from './types'
import Title from './01-title'
import Placeholder02 from './02-placeholder'
import Placeholder03 from './03-placeholder'

/**
 * Slide order. To add a slide: create `src/slides/NN-name.tsx` (default-export a component),
 * import it above, and add one line here.
 */
export const slides: SlideEntry[] = [
  { component: Title, title: 'Title', transition: 'fade' },
  { component: Placeholder02, title: 'Placeholder (steps)', transition: 'slide' },
  { component: Placeholder03, title: 'Placeholder (reveal)', transition: 'zoom' },
]

export type { SlideEntry }
