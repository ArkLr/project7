import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const sizes = {
  1: 'text-6xl font-semibold tracking-tight',
  2: 'text-5xl font-semibold tracking-tight',
  3: 'text-3xl font-medium',
} as const

interface HeadingProps {
  children?: ReactNode
  level?: 1 | 2 | 3
  /** Accent gradient text. */
  gradient?: boolean
  className?: string
}

export function Heading({ children, level = 2, gradient, className }: HeadingProps) {
  const Tag = `h${level}` as const
  return (
    <Tag className={cn('font-display leading-[1.05]', sizes[level], gradient && 'text-gradient', className)}>
      {children}
    </Tag>
  )
}
