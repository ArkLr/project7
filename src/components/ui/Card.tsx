import type { MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children?: ReactNode
  className?: string
}

/** Glass card with hover lift and a spotlight that follows the cursor. */
export function Card({ children, className }: CardProps) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <div
      onMouseMove={onMove}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft',
        'transition-[transform,border-color,box-shadow] duration-300 ease-out',
        'hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,transparent)]',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
