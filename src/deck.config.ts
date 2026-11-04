import type { TransitionName } from '@/engine/transitions'

/** Global presentation settings. */
export const deckConfig = {
  title: 'Cloud and Parallel Architectures',
  subtitle: 'Facebook & Amazon — dedicated hardware architectures',

  /** Logical slide size. Slides are laid out at this size and scaled to fit the screen. */
  width: 1280,
  height: 720,

  /** Used when a slide entry has no `transition`. */
  defaultTransition: 'fade' as TransitionName,

  /** Click on the slide to advance. Off: navigate with the arrow keys / controls only. */
  clickToNavigate: false,

  /** Hide controls + cursor after this many ms without pointer movement. */
  idleTimeout: 2500,
}
