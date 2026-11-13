import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Badge({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 tag-surface rounded-full px-3.5 py-1.5',
        'font-mono text-xs tracking-[0.14em] text-fg/80 uppercase',
        className,
      )}
    >
      <span className="size-1.5 animate-pulse rounded-full bg-accent" />
      {children}
    </span>
  )
}
