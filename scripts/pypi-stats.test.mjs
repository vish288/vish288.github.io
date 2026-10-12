import { describe, it, expect } from 'vitest'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { packageNames, resolveStats } from './pypi-stats.mjs'
import { SERVERS } from '@/constants/mcpServers'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

describe('packageNames', () => {
  it('derives the list from mcpServers.ts, not a hard-coded copy', async () => {
    const source = await readFile(resolve(ROOT, 'src/constants/mcpServers.ts'), 'utf8')
    const expected = Object.values(SERVERS).map(s => s.pypiPackage)
    expect(packageNames(source)).toEqual(expected)
  })
})

describe('resolveStats', () => {
  const names = ['mcp-gitlab', 'mcp-argocd']

  it('falls back to the committed snapshot and marks it stale when a fetch fails', async () => {
    const existing = {
      fetchedAt: '2026-01-01',
      stale: false,
      lastMonth: 100,
      lastWeek: 20,
      packages: { 'mcp-gitlab': { lastMonth: 100, lastWeek: 20 } },
    }
    const out = await resolveStats({
      names,
      fetchRecentImpl: async () => {
        throw new Error('network down')
      },
      existing,
    })
    expect(out.stale).toBe(true)
    expect(out.fetchedAt).toBe('2026-01-01') // keeps the snapshot's date
    expect(out.lastMonth).toBe(100) // keeps the snapshot's numbers
  })

  it('sums per-package totals on success', async () => {
    const out = await resolveStats({
      names,
      fetchRecentImpl: async pkg =>
        pkg === 'mcp-gitlab'
          ? { lastMonth: 19493, lastWeek: 9401 }
          : { lastMonth: 0, lastWeek: 265 },
      existing: null,
      now: () => new Date('2026-10-11T00:00:00Z'),
    })
    expect(out.stale).toBe(false)
    expect(out.fetchedAt).toBe('2026-10-11')
    expect(out.lastMonth).toBe(19493)
    expect(out.lastWeek).toBe(9666)
    expect(out.packages['mcp-argocd']).toEqual({ lastMonth: 0, lastWeek: 265 })
  })
})

describe('committed snapshot', () => {
  it('has the shape the UI consumes', async () => {
    const json = JSON.parse(await readFile(resolve(ROOT, 'src/generated/pypi-stats.json'), 'utf8'))
    expect(json.fetchedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(typeof json.stale).toBe('boolean')
    expect(typeof json.lastMonth).toBe('number')
    expect(typeof json.lastWeek).toBe('number')
    expect(Object.keys(json.packages).sort()).toEqual(
      Object.values(SERVERS)
        .map(s => s.pypiPackage)
        .sort()
    )
  })
})
