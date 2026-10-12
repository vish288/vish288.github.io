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

  it('counts an old package over the full window and includes a young package in full', async () => {
    const out = await resolveStats({
      names: ['mcp-gitlab', 'mcp-argocd'],
      fetchOverallImpl: async pkg =>
        pkg === 'mcp-gitlab'
          ? // 20 days of history (older than the window); only the 15 in-window count → 15000
            rows(20, 1000, '2026-10-10')
          : // released 2026-10-06 → 5 rows, all inside the window; that is its complete total
            rows(5, 100, '2026-10-10'),
      existing: null,
      now: () => new Date('2026-10-11T00:00:00Z'),
    })
    expect(out.stale).toBe(false)
    expect(out.windowEnd).toBe('2026-10-10')
    expect(out.fetchedAt).toBe('2026-10-11')
    expect(out.lastFifteenDays).toBe(15500) // 15*1000 + 5*100 (young pkg contributes all 5)
    expect(out.packages['mcp-gitlab']).toEqual({ lastFifteenDays: 15000 })
    expect(out.packages['mcp-argocd']).toEqual({ lastFifteenDays: 500 })
  })

  it('takes the window end from the newest date seen across packages', async () => {
    const out = await resolveStats({
      names: ['mcp-gitlab', 'mcp-coda'],
      // both young, different newest dates; window end is the latest (10-10)
      fetchOverallImpl: async pkg =>
        pkg === 'mcp-gitlab' ? rows(3, 100, '2026-10-10') : rows(2, 50, '2026-10-09'),
      existing: null,
      now: () => new Date('2026-10-11T00:00:00Z'),
    })
    expect(out.windowEnd).toBe('2026-10-10')
    expect(out.lastFifteenDays).toBe(400) // 3*100 + 2*50
  })

  it('skips an old package with a real gap inside the window', async () => {
    const out = await resolveStats({
      names: ['mcp-gitlab', 'mcp-coda'],
      fetchOverallImpl: async pkg =>
        pkg === 'mcp-gitlab'
          ? rows(15, 1000, '2026-10-10')
          : // first seen long ago (old) but only 2 in-window rows → gap → skip
            [
              { category: 'without_mirrors', date: '2026-08-01', downloads: 5 },
              { category: 'without_mirrors', date: '2026-10-10', downloads: 9 },
              { category: 'without_mirrors', date: '2026-10-09', downloads: 9 },
            ],
      existing: null,
      now: () => new Date('2026-10-11T00:00:00Z'),
    })
    expect(out.stale).toBe(false)
    expect(out.lastFifteenDays).toBe(15000) // gapped old package excluded
    expect(out.packages['mcp-coda']).toBeUndefined()
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

  it('falls back to the snapshot when nothing can cover the window', async () => {
    const out = await resolveStats({
      names: ['mcp-gitlab'],
      // old package (first seen long ago) with only a 2-day gapped remnant
      fetchOverallImpl: async () => [
        { category: 'without_mirrors', date: '2026-08-01', downloads: 5 },
        { category: 'without_mirrors', date: '2026-10-10', downloads: 9 },
      ],
      existing: snapshot,
    })
    expect(out.stale).toBe(true)
    expect(out.lastFifteenDays).toBe(100)
  })

  it('falls back when a package has no rows at all', async () => {
    const out = await resolveStats({
      names: ['mcp-gitlab'],
      fetchOverallImpl: async () => [],
      existing: snapshot,
    })
    expect(out.stale).toBe(true)
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
