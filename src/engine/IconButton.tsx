import { motion } from 'motion/react'
import type { MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface IconButtonProps {
  label: string
  /** Keyboard shortcut shown in the tooltip. */
  shortcut?: string
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  children: ReactNode
  className?: string
  'data-theme-toggle'?: boolean
}

export function IconButton({ label, shortcut, onClick, disabled, children, className, ...rest }: IconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.1 }}
      whileTap={disabled ? undefined : { scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 26 }}
      className={cn(
        'group relative grid size-10 place-items-center rounded-full text-muted outline-none',
        'transition-colors hover:bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] hover:text-fg',
        'focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-30',
        className,
      )}
      {...rest}
    >
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full mb-3 whitespace-nowrap rounded-lg border border-border bg-surface-strong px-2.5 py-1',
          'text-xs text-fg opacity-0 shadow-soft transition-all duration-200',
          'translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100',
        )}
      >
        {label}
        {shortcut && <kbd className="ml-2 font-mono text-muted">{shortcut}</kbd>}
      </span>
    </motion.button>
  )
}
