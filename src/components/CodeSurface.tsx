import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

// The single dark code surface in the codebase — dark in both themes (D).
// Carries the manifest hero. Defined by its #code-border in dark so it stays
// visible against the near-black page ground (#15141a on #0b0c0f).
export default function CodeSurface({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded border-2 border-code-border bg-code text-code-foreground font-mono text-sm overflow-x-auto px-4 py-4',
        className
      )}
    >
      {children}
    </div>
  )
}
