// Build-time PyPI download fetch. Runs before `vite build` (wired into the
// build scripts) so the app can import a static JSON — no client-side calls,
// no CORS, no CSP change. pypistats.org keeps ~180 days and caps at 60
// requests; we make 4 per build. A failed fetch never breaks the build: we
// fall back to the last committed snapshot and mark it stale, and if there is
// no snapshot we write a zero snapshot (the UI then renders nothing).
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SERVERS_TS = resolve(ROOT, 'src/constants/mcpServers.ts')
const OUT = resolve(ROOT, 'src/generated/pypi-stats.json')
const TIMEOUT_MS = 10000

// Derive the package list from the single source of truth rather than keeping
// a second copy here. Match `pypiPackage: '...'` in mcpServers.ts.
export function packageNames(source) {
  const names = [...source.matchAll(/pypiPackage:\s*'([^']+)'/g)].map(m => m[1])
  if (names.length === 0) throw new Error('no pypiPackage entries found in mcpServers.ts')
  return names
}

// One package: 10s timeout, one retry, then give up (the caller handles it).
async function fetchRecent(pkg) {
  let lastErr
  for (let attempt = 0; attempt < 2; attempt++) {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(`https://pypistats.org/api/packages/${pkg}/recent`, {
        signal: ac.signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { data } = await res.json()
      return { lastMonth: data.last_month, lastWeek: data.last_week }
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

// External data is untrusted: a count must be a non-negative integer, else we
// throw so resolveStats falls back to the committed snapshot rather than
// writing a garbage number.
function assertCount(value, pkg, field) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`invalid ${field} for ${pkg}: ${JSON.stringify(value)}`)
  }
  return value
}

// Fetch every package and sum the rolling-window totals. Throws if any fetch
// fails so resolveStats can fall back as a whole (never a half-filled number).
async function buildStats({ names, fetchRecentImpl, now }) {
  const packages = {}
  let lastMonth = 0
  let lastWeek = 0
  for (const pkg of names) {
    const r = await fetchRecentImpl(pkg)
    const month = assertCount(r.lastMonth, pkg, 'last_month')
    const week = assertCount(r.lastWeek, pkg, 'last_week')
    packages[pkg] = { lastMonth: month, lastWeek: week }
    lastMonth += month
    lastWeek += week
  }
  return { fetchedAt: isoDate(now()), stale: false, lastMonth, lastWeek, packages }
}

// The failure-tolerant core: fresh stats on success; else the committed
// snapshot marked stale (its date/numbers untouched); else a zero snapshot.
export async function resolveStats({
  names,
  fetchRecentImpl = fetchRecent,
  existing,
  now = () => new Date(),
}) {
  try {
    return await buildStats({ names, fetchRecentImpl, now })
  } catch (err) {
    console.error(`pypi-stats: refresh failed (${err?.message ?? err}); using last snapshot`)
    if (existing) return { ...existing, stale: true }
    return { fetchedAt: isoDate(now()), stale: true, lastMonth: 0, lastWeek: 0, packages: {} }
  }
}

async function readExisting() {
  try {
    const json = JSON.parse(await readFile(OUT, 'utf8'))
    return typeof json?.lastMonth === 'number' ? json : null
  } catch {
    return null
  }
}

async function main() {
  const controller = new AbortController()
  const onSignal = (name, code) => () => {
    controller.abort()
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
    `pypi-stats: ${stats.stale ? 'stale snapshot kept' : `refreshed ${stats.lastMonth} last-month`} ` +
      `(as of ${stats.fetchedAt})`
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
