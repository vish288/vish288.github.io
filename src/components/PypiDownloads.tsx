import { cn } from '@/lib/utils'
import { formatDownloads, type PypiStats } from '@/lib/pypiStats'
import snapshot from '@/generated/pypi-stats.json'

// Honest build-time download total for the last 15 days. Renders nothing when
// there is no data (empty/zero snapshot), so the build never shows a fake
// number. The "as of" date (the window's newest day) is visible text, not a
// hover-only title, so it stays accessible.
export function PypiDownloads({
  className,
  stats = snapshot as PypiStats,
}: {
  className?: string
  stats?: PypiStats
}) {
  if (!stats || stats.lastFifteenDays <= 0) return null
  return (
    <p className={cn('text-xs text-muted-foreground', className)}>
      {formatDownloads(stats.lastFifteenDays)} downloads in the last 15 days
      <span className='opacity-70'> · as of {stats.windowEnd}</span>
    </p>
  )
}
