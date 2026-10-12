// Build-time PyPI download fetch. Runs before `vite build` (wired into the
// build scripts) so the app can import a static JSON — no client-side calls,
// no CORS, no CSP change. We report a 15-day window: pypistats.org's /recent
// endpoint has no 15-day field, so we read the daily /overall feed
// (?mirrors=false → only the "without_mirrors" category, ~180 daily rows,
// newest = yesterday) and sum the 15 most recent days per package. It caps at
// 60 requests; we make 4 per build.
//
// A failed fetch never breaks the build: we fall back to the last committed
// snapshot and mark it stale, and if there is no snapshot we write a zero
// snapshot (the UI then renders nothing).
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SERVERS_TS = resolve(ROOT, 'src/constants/mcpServers.ts')
const OUT = resolve(ROOT, 'src/generated/pypi-stats.json')
const TIMEOUT_MS = 10000
const WINDOW_DAYS = 15

// Derive the package list from the single source of truth rather than keeping
// a second copy here. Match `pypiPackage: '...'` in mcpServers.ts.
export function packageNames(source) {
  const names = [...source.matchAll(/pypiPackage:\s*'([^']+)'/g)].map(m => m[1])
  if (names.length === 0) throw new Error('no pypiPackage entries found in mcpServers.ts')
  return names
}

// One package: 10s timeout, one retry, then give up (the caller handles it).
// Returns the raw daily rows for the "without_mirrors" category.
async function fetchOverall(pkg) {
  let lastErr
  for (let attempt = 0; attempt < 2; attempt++) {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(`https://pypistats.org/api/packages/${pkg}/overall?mirrors=false`, {
        signal: ac.signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { data } = await res.json()
      if (!Array.isArray(data)) throw new Error('unexpected payload: data is not an array')
      return data.filter(d => d.category === 'without_mirrors')
    } catch (err) {
      lastErr = err
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastErr
}

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

// External data is untrusted: a daily count must be a non-negative integer,
// else we throw so resolveStats falls back to the committed snapshot rather
// than writing a garbage number.
function assertCount(value, pkg, field) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`invalid ${field} for ${pkg}: ${JSON.stringify(value)}`)
  }
  return value
}

function addDays(iso, delta) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return isoDate(d)
}

// Sum a package's downloads within [windowStart, windowEnd]. Returns null when
// the package can't honestly cover the window: an *older* package (its first
// row predates the window) must have a row for all WINDOW_DAYS days — fewer
// means a real gap, so skip it. A *young* package (first released inside the
// window, e.g. a new package) contributes all its in-window rows: that IS its
// complete 15-day total, not a partial. A bad daily value throws (via
// assertCount), a hard data-integrity failure that falls back to the snapshot.
function sumWindow(rows, pkg, windowStart, windowEnd) {
  if (rows.length === 0) return null
  const oldest = rows.reduce((min, r) => (r.date < min ? r.date : min), rows[0].date)
  const inWindow = rows.filter(r => r.date >= windowStart && r.date <= windowEnd)
  const bornInsideWindow = oldest >= windowStart
  if (!bornInsideWindow && inWindow.length < WINDOW_DAYS) return null // gapped old package
  if (inWindow.length === 0) return null
  let total = 0
  for (const r of inWindow) total += assertCount(r.downloads, pkg, 'daily downloads')
  return { total }
}

// Fetch every package, then sum each one's 15-day window. The window is the 15
// calendar days ending at the newest date seen across all packages. Throws
// (→ snapshot fallback) if nothing is usable or any daily value is invalid.
async function buildStats({ names, fetchOverallImpl, now }) {
  const rowsByPkg = {}
  for (const pkg of names) rowsByPkg[pkg] = await fetchOverallImpl(pkg)

  let windowEnd = null
  for (const rows of Object.values(rowsByPkg)) {
    for (const r of rows) if (!windowEnd || r.date > windowEnd) windowEnd = r.date
  }
  if (!windowEnd) throw new Error('no download rows for any package')
  const windowStart = addDays(windowEnd, -(WINDOW_DAYS - 1))

  const packages = {}
  let lastFifteenDays = 0
  for (const pkg of names) {
    const window = sumWindow(rowsByPkg[pkg], pkg, windowStart, windowEnd)
    if (!window) continue // skip packages that can't honestly cover the window
    packages[pkg] = { lastFifteenDays: window.total }
    lastFifteenDays += window.total
  }
  if (Object.keys(packages).length === 0) throw new Error('no package can cover the 15-day window')
  return { windowEnd, fetchedAt: isoDate(now()), stale: false, lastFifteenDays, packages }
}

// The failure-tolerant core: fresh stats on success; else the committed
// snapshot marked stale (its dates/numbers untouched); else a zero snapshot.
export async function resolveStats({
  names,
  fetchOverallImpl = fetchOverall,
  existing,
  now = () => new Date(),
}) {
  try {
    return await buildStats({ names, fetchOverallImpl, now })
  } catch (err) {
    console.error(`pypi-stats: refresh failed (${err?.message ?? err}); using last snapshot`)
    if (existing) return { ...existing, stale: true }
    const today = isoDate(now())
    return { windowEnd: today, fetchedAt: today, stale: true, lastFifteenDays: 0, packages: {} }
  }
}

async function readExisting() {
  try {
    const json = JSON.parse(await readFile(OUT, 'utf8'))
    return typeof json?.lastFifteenDays === 'number' ? json : null
  } catch {
    return null
  }
}

async function main() {
  const onSignal = (name, code) => () => {
    console.error(`\npypi-stats: ${name} received; aborting`)
    process.exit(code)
  }
  process.on('SIGINT', onSignal('SIGINT', 130))
  process.on('SIGTERM', onSignal('SIGTERM', 143))

  const source = await readFile(SERVERS_TS, 'utf8')
  const names = packageNames(source)
  const existing = await readExisting()
  const stats = await resolveStats({ names, existing })
  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, JSON.stringify(stats, null, 2) + '\n', 'utf8')
  console.log(
    `pypi-stats: ${stats.stale ? 'stale snapshot kept' : `refreshed ${stats.lastFifteenDays} in 15 days`} ` +
      `(window ending ${stats.windowEnd})`
  )
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(err => {
    // Even an unexpected error must not break the build: leave whatever
    // snapshot is already committed in place and exit 0.
    console.error('pypi-stats: unexpected error, leaving committed snapshot:', err)
    process.exit(0)
  })
}
