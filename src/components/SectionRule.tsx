import { cn } from '@/lib/utils'

// Numbered mono rule used as every About section heading — the ledger voice
// carried beyond the hero. The index is aria-hidden so the accessible name is
// exactly the heading text. Indexes start at 01 (there is no 00).
export default function SectionRule({
  index,
  children,
  className,
}: {
  index: string
  children: string
  className?: string
}) {
  return (
    <h2
      className={cn(
        'flex items-baseline gap-4 border-t border-border pt-4 text-2xl sm:text-3xl font-bold tracking-tight',
        className
      )}
    >
      <span
        aria-hidden
        className='font-mono text-sm font-normal text-muted-foreground tabular-nums'
      >
        {index}
      </span>
      {children}
    </h2>
  )
}
