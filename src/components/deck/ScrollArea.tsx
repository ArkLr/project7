import Lenis from 'lenis'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScrollAreaProps {
  children?: ReactNode
  className?: string
  contentClassName?: string
  /** Disable smooth scrolling (native scrolling still works). */
  disabled?: boolean
}

/** Overflow container with Lenis smooth scrolling. */
export function ScrollArea({ children, className, contentClassName, disabled }: ScrollAreaProps) {
  const wrapper = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (disabled || reduced || !wrapper.current || !content.current) return
    const lenis = new Lenis({
      wrapper: wrapper.current,
      content: content.current,
      autoRaf: true,
      lerp: 0.12,
      smoothWheel: true,
    })
    return () => lenis.destroy()
  }, [disabled, reduced])

  return (
    <div ref={wrapper} className={cn('overflow-y-auto overscroll-contain [scrollbar-width:thin]', className)}>
      <div ref={content} className={contentClassName}>
        {children}
      </div>
    </div>
  )
}
