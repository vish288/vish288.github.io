import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PypiDownloads } from './PypiDownloads'
import type { PypiStats } from '@/lib/pypiStats'

const snapshot: PypiStats = {
  fetchedAt: '2026-10-11',
  stale: false,
  lastMonth: 24672,
  lastWeek: 10821,
  packages: { 'mcp-gitlab': { lastMonth: 19493, lastWeek: 9401 } },
}

describe('PypiDownloads', () => {
  it('renders the compact monthly total with an honest as-of date', () => {
    render(<PypiDownloads stats={snapshot} />)
    expect(screen.getByText(/24\.7k downloads last month/)).toBeInTheDocument()
    expect(screen.getByText(/as of 2026-10-11/)).toBeInTheDocument()
  })

  it('renders nothing when there is no snapshot data', () => {
    const { container } = render(
      <PypiDownloads stats={{ ...snapshot, lastMonth: 0, packages: {} }} />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
