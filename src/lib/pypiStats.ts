// Shape of the build-time snapshot written by scripts/pypi-stats.mjs and
// consumed by the UI. `stale` is true when a build could not refresh the data
// and fell back to the last committed snapshot. Numbers are rolling-window
// totals from pypistats.org (it keeps ~180 days — never an all-time figure).
export interface PypiStats {
  fetchedAt: string // ISO date, YYYY-MM-DD
  stale: boolean
  lastMonth: number
  lastWeek: number
  packages: Record<string, { lastMonth: number; lastWeek: number }>
}

// Honest compact formatting, one decimal, lowercased to match the site's
// copy ("24.7k"). No rounding up: 24,672 → "24.7k", 950 → "950".
export function formatDownloads(n: number): string {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
    .format(n)
    .toLowerCase()
}
