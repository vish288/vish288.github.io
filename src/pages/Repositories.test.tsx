import type { ReactElement } from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Repositories from './Repositories'
import { resetGitHubCache } from '../hooks/useGitHubRepositories'
import { CLIENTS } from '../constants/mcpClients'

function renderWithRouter(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock IntersectionObserver
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()
vi.stubGlobal(
  'IntersectionObserver',
  vi.fn(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: vi.fn(),
  }))
)

const mockRepositories = [
  {
    id: 1,
    name: 'test-repo-1',
    description: 'A test repository',
    html_url: 'https://github.com/testuser/test-repo-1',
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
    html_url: 'https://github.com/testuser/forked-repo',
    language: 'JavaScript',
    stargazers_count: 5,
    forks_count: 1,
    topics: ['javascript'],
    updated_at: '2024-12-01T00:00:00Z',
    created_at: '2024-06-01T00:00:00Z',
    fork: true,
    pushed_at: '2024-12-01T00:00:00Z',
  },
  {
    // An MCP server repo, deliberately the oldest and least-starred so that
    // pinning it first (not sort order) is observable.
    id: 3,
    name: 'mcp-coda',
    description: 'Coda MCP server',
    html_url: 'https://github.com/vish288/mcp-coda',
    language: 'Python',
    stargazers_count: 0,
    forks_count: 0,
    topics: ['mcp'],
    updated_at: '2023-01-01T00:00:00Z',
    created_at: '2023-01-01T00:00:00Z',
    fork: false,
    pushed_at: '2023-01-01T00:00:00Z',
  },
]

describe('Repositories Page', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    resetGitHubCache()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    renderWithRouter(<Repositories />)

    expect(screen.getByText(/loading repositories/i)).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders repositories after successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    renderWithRouter(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    })
    expect(screen.getByText('A test repository')).toBeInTheDocument()
    // Forks are hidden by default (Original view, decision O10); All reveals them.
    expect(screen.queryByText('forked-repo')).not.toBeInTheDocument()
    await userEvent.setup().click(screen.getByText('All'))
    expect(screen.getByText('forked-repo')).toBeInTheDocument()
    expect(screen.getByText('A forked repository')).toBeInTheDocument()
  })

  it('shows inline stats', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    renderWithRouter(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('original')).toBeInTheDocument()
    })

    expect(screen.getByText('stars')).toBeInTheDocument()
    expect(screen.getByText('forks')).toBeInTheDocument()
  })

  it('handles API error gracefully with a calm message and recovery actions', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'))

    renderWithRouter(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText(/could not load repositories/i)).toBeInTheDocument()
    })

    // No raw error string is shown to visitors.
    expect(screen.queryByText(/api error/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view on github/i })).toHaveAttribute(
      'href',
      'https://github.com/vish288'
    )
  })

  it('filters repositories by type', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    renderWithRouter(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    })

    // Filter by original repos — segmented control buttons
    const originalBtn = screen.getByText('Original')
    await user.click(originalBtn)

    expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    expect(screen.queryByText('forked-repo')).not.toBeInTheDocument()

    // Filter by forked repos
    const forkedBtn = screen.getByText('Forked')
    await user.click(forkedBtn)

    expect(screen.getByText('forked-repo')).toBeInTheDocument()
    expect(screen.queryByText('test-repo-1')).not.toBeInTheDocument()
  })

  it('sorts repositories by different criteria', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    renderWithRouter(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    })

    // Test sorting by stars
    await user.click(screen.getByText('Stars'))

    // Verify sort controls are present
    expect(screen.getByText('Updated')).toBeInTheDocument()
    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('displays repository information correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    renderWithRouter(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    })

    // Check repository details
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()

    // Fork badge lives on the forked repo, hidden in the default Original view.
    await userEvent.setup().click(screen.getByText('All'))
    expect(screen.getByText('Fork')).toBeInTheDocument()
  })

  it('provides links to GitHub repositories', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    renderWithRouter(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument()
    })

    // Repo names are inside <a> tags that link to github
    const repoLink = screen.getByText('test-repo-1').closest('a')
    expect(repoLink).toHaveAttribute('href', 'https://github.com/testuser/test-repo-1')
    expect(repoLink).toHaveAttribute('target', '_blank')
  })

  it('pins MCP server repos first and badges them', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    renderWithRouter(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('mcp-coda')).toBeInTheDocument()
    })

    const rows = screen
      .getAllByRole('link')
      .filter(a => a.getAttribute('href')?.startsWith('https://github.com/'))
    // mcp-coda is oldest and least-starred, yet pinned above test-repo-1.
    expect(rows[0]).toHaveTextContent('mcp-coda')
    expect(rows[0]).toHaveTextContent('MCP server')
    expect(rows[1]).toHaveTextContent('test-repo-1')
    expect(within(rows[1]!).queryByText('MCP server')).not.toBeInTheDocument()
  })

  it('derives the client count in the MCP banner', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepositories,
    })

    renderWithRouter(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText('mcp-coda')).toBeInTheDocument()
    })

    expect(screen.getByText(new RegExp(`config for ${CLIENTS.length} clients`))).toBeInTheDocument()
  })

  it('shows empty state when no repositories match filter', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    renderWithRouter(<Repositories />)

    await waitFor(() => {
      expect(screen.getByText(/no original repositories/i)).toBeInTheDocument()
    })
  })
})
