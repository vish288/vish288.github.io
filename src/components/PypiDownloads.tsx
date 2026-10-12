import { cn } from '@/lib/utils'
import { formatDownloads, type PypiStats } from '@/lib/pypiStats'
import snapshot from '@/generated/pypi-stats.json'

// Honest build-time download total. Renders nothing when there is no data
// (empty/zero snapshot), so the build never shows a fake number. The "as of"
// date is visible text, not a hover-only title, so it stays accessible.
export function PypiDownloads({
  className,
  stats = snapshot as PypiStats,
}: {
  className?: string
  stats?: PypiStats
}) {
  if (!stats || stats.lastMonth <= 0) return null
  return (
    <p className={cn('text-xs text-muted-foreground', className)}>
      {formatDownloads(stats.lastMonth)} downloads last month
      <span className='opacity-70'> · as of {stats.fetchedAt}</span>
    </p>
  )
}
