import { describe, it, expect } from 'vitest'
import { formatDownloads } from './pypiStats'

describe('formatDownloads', () => {
  it('formats thousands compactly with one decimal, lowercased', () => {
    expect(formatDownloads(24672)).toBe('24.7k')
  })

  it('never rounds up and drops a trailing .0', () => {
    expect(formatDownloads(24000)).toBe('24k')
  })

  it('leaves small numbers unabbreviated', () => {
    expect(formatDownloads(950)).toBe('950')
  })

  it('formats millions', () => {
    expect(formatDownloads(1250000)).toBe('1.3m')
  })
})
