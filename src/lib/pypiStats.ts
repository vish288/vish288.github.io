// Shape of the build-time snapshot written by scripts/pypi-stats.mjs and
// consumed by the UI. `stale` is true when a build could not refresh the data
// and fell back to the last committed snapshot. `lastFifteenDays` is the sum
// of the 15 most recent daily download counts (from pypistats.org's /overall
// feed) across the packages that have a full 15-day window; `windowEnd` is the
// newest day in that window and is shown as the "as of" date.
export interface PypiStats {
  windowEnd: string // ISO date of the newest day counted, YYYY-MM-DD
  fetchedAt: string // ISO date the build ran, YYYY-MM-DD
  stale: boolean
  lastFifteenDays: number
  packages: Record<string, { lastFifteenDays: number }>
}

// Honest compact formatting, one decimal, lowercased to match the site's
// copy ("18.9k"). No rounding up: 18,891 → "18.9k", 950 → "950".
export function formatDownloads(n: number): string {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
    .format(n)
    .toLowerCase()
}
