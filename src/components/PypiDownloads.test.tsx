import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PypiDownloads } from './PypiDownloads'
import type { PypiStats } from '@/lib/pypiStats'

const snapshot: PypiStats = {
  windowEnd: '2026-10-10',
  fetchedAt: '2026-10-11',
  stale: false,
  lastFifteenDays: 18891,
  packages: { 'mcp-gitlab': { lastFifteenDays: 18891 } },
}

describe('PypiDownloads', () => {
  it('renders the compact 15-day total with the window end as the as-of date', () => {
    render(<PypiDownloads stats={snapshot} />)
    expect(screen.getByText(/18\.9k downloads in the last 15 days/)).toBeInTheDocument()
    expect(screen.getByText(/as of 2026-10-10/)).toBeInTheDocument()
  })

  it('renders nothing when there is no snapshot data', () => {
    const { container } = render(
      <PypiDownloads stats={{ ...snapshot, lastFifteenDays: 0, packages: {} }} />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
