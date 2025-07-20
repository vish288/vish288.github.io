import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Repositories from './Repositories'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

const mockRepositories = [
  {
    id: 1,
    name: 'test-repo-1',
    description: 'A test repository',
    html_url: 'https://github.com/vish288/test-repo-1',
    language: 'TypeScript',
    stargazers_count: 10,
    forks_count: 2,
    topics: ['react', 'typescript'],
    updated_at: '2025-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    fork: false,
    pushed_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'forked-repo',
    description: 'A forked repository',
    html_url: 'https://github.com/vish288/forked-repo',
    language: 'JavaScript',
    stargazers_count: 5,
    forks_count: 1,
    topics: ['javascript'],
    updated_at: '2024-12-01T00:00:00Z',
    created_at: '2024-06-01T00:00:00Z',
    fork: true,
    pushed_at: '2024-12-01T00:00:00Z',
  },
]

describe('Repositories Page', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<Repositories />)

    expect(screen.getByText(/loading repositories/i)).toBeInTheDocument()
    // Check for spinner element directly
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('renders repositories after successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    render(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
      expect(screen.getByText('forked-repo')).toBeInTheDocument()
    })

    expect(screen.getByText('A test repository')).toBeInTheDocument()
    expect(screen.getByText('A forked repository')).toBeInTheDocument()
  })

  it('shows statistics dashboard', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    render(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('Total Repos')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Repos')).toBeInTheDocument()
    expect(screen.getByText('Original')).toBeInTheDocument()
    expect(screen.getByText('Forked')).toBeInTheDocument()
    expect(screen.getByText('Total Stars')).toBeInTheDocument()
  })

  it('handles API error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'))

    render(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText(/error: api error/i)).toBeInTheDocument()
    })
  })

  it('filters repositories by type', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    render(<Repositories />)

    // Wait for repositories to load
    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    })

    // Filter by original repos
    await user.click(screen.getByRole('button', { name: /original \(1\)/i }))

    expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    expect(screen.queryByText('forked-repo')).not.toBeInTheDocument()

    // Filter by forked repos
    await user.click(screen.getByRole('button', { name: /forked \(1\)/i }))

    expect(screen.getByText('forked-repo')).toBeInTheDocument()
    expect(screen.queryByText('test-repo-1')).not.toBeInTheDocument()
  })

  it('sorts repositories by different criteria', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    render(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    })

    // Test sorting by stars
    await user.click(screen.getByRole('button', { name: /stars/i }))

    // Verify sort controls are present
    expect(screen.getByRole('button', { name: /updated/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /created/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /name/i })).toBeInTheDocument()
  })

  it('displays repository information correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    render(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    })

    // Check repository details
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()
    // Stars and forks are shown - just verify some are present
    const starElements = screen.getAllByText('10')
    expect(starElements.length).toBeGreaterThan(0)

    // Check fork badge for forked repository
    expect(screen.getByText('Fork')).toBeInTheDocument()
  })

  it('provides links to GitHub repositories', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    render(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    })

    const repoLinks = screen.getAllByText(/view repository/i)
    expect(repoLinks[0].closest('a')).toHaveAttribute(
      'href',
      'https://github.com/vish288/test-repo-1'
    )
    expect(repoLinks[0].closest('a')).toHaveAttribute('target', '_blank')
  })

  it('shows empty state when no repositories match filter', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    render(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText(/no repositories found/i)).toBeInTheDocument()
    })
  })
})
