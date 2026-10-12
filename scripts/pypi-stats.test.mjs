import { describe, it, expect } from 'vitest'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { packageNames, resolveStats } from './pypi-stats.mjs'
import { SERVERS } from '@/constants/mcpServers'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// `/overall?mirrors=false` returns one row per day; newest first after sort.
// Build `count` rows of `downloads` each, ending at `end` (descending dates).
function rows(count, downloads, end = '2026-10-10') {
  const base = new Date(`${end}T00:00:00Z`)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base)
    d.setUTCDate(d.getUTCDate() - i)
    return { category: 'without_mirrors', date: d.toISOString().slice(0, 10), downloads }
  })
}

describe('packageNames', () => {
  it('derives the list from mcpServers.ts, not a hard-coded copy', async () => {
    const source = await readFile(resolve(ROOT, 'src/constants/mcpServers.ts'), 'utf8')
    const expected = Object.values(SERVERS).map(s => s.pypiPackage)
    expect(packageNames(source)).toEqual(expected)
  })
})

describe('resolveStats', () => {
  const snapshot = {
    windowEnd: '2026-01-01',
    fetchedAt: '2026-01-01',
    stale: false,
    lastFifteenDays: 100,
    packages: { 'mcp-gitlab': { lastFifteenDays: 100 } },
  }

  it('sums the 15 most recent daily rows per package and uses the newest date as the window end', async () => {
    const out = await resolveStats({
      names: ['mcp-gitlab', 'mcp-coda'],
      fetchOverallImpl: async pkg =>
        pkg === 'mcp-gitlab'
          ? // 20 rows of 1000; only the newest 15 count → 15000
            rows(20, 1000, '2026-10-10')
          : rows(15, 100, '2026-10-10'),
      existing: null,
      now: () => new Date('2026-10-11T00:00:00Z'),
    })
    expect(out.stale).toBe(false)
    expect(out.windowEnd).toBe('2026-10-10')
    expect(out.fetchedAt).toBe('2026-10-11')
    expect(out.lastFifteenDays).toBe(16500) // 15*1000 + 15*100
    expect(out.packages['mcp-gitlab']).toEqual({ lastFifteenDays: 15000 })
    expect(out.packages['mcp-coda']).toEqual({ lastFifteenDays: 1500 })
  })

  it.each([
    ['null', null],
    ['a string', '1000'],
    ['negative', -5],
    ['a float', 1000.5],
  ])('rejects %s daily counts and falls back to the snapshot', async (_label, bad) => {
    const badRows = rows(15, 1000)
    badRows[3].downloads = bad
    const out = await resolveStats({
      names: ['mcp-gitlab'],
      fetchOverallImpl: async () => badRows,
      existing: snapshot,
    })
    expect(out.stale).toBe(true)
    expect(out.lastFifteenDays).toBe(100) // kept from the snapshot
    expect(out.windowEnd).toBe('2026-01-01')
  })

  it('skips a package without a full 15-day window rather than poisoning the total', async () => {
    const out = await resolveStats({
      names: ['mcp-gitlab', 'mcp-argocd'],
      fetchOverallImpl: async pkg =>
        pkg === 'mcp-gitlab' ? rows(15, 1000, '2026-10-10') : rows(5, 999, '2026-10-10'),
      existing: null,
      now: () => new Date('2026-10-11T00:00:00Z'),
    })
    expect(out.stale).toBe(false)
    expect(out.lastFifteenDays).toBe(15000) // argocd's 5 partial days excluded
    expect(out.packages['mcp-argocd']).toBeUndefined()
  })

  it('falls back to the snapshot when no package has a full 15-day window', async () => {
    const out = await resolveStats({
      names: ['mcp-gitlab'],
      fetchOverallImpl: async () => rows(5, 999),
      existing: snapshot,
    })
    expect(out.stale).toBe(true)
    expect(out.lastFifteenDays).toBe(100)
  })
})

describe('committed snapshot', () => {
  it('has the shape the UI consumes', async () => {
    const json = JSON.parse(await readFile(resolve(ROOT, 'src/generated/pypi-stats.json'), 'utf8'))
    expect(json.windowEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(json.fetchedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(typeof json.stale).toBe('boolean')
    expect(typeof json.lastFifteenDays).toBe('number')
    const pkgKeys = Object.keys(json.packages)
    const allowed = Object.values(SERVERS).map(s => s.pypiPackage)
    expect(pkgKeys.every(k => allowed.includes(k))).toBe(true)
    const perPkgSum = Object.values(json.packages).reduce((s, p) => s + p.lastFifteenDays, 0)
    expect(perPkgSum).toBe(json.lastFifteenDays)
  })
})
