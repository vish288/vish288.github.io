import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import About from './About'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('About Page', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockRejectedValue(new Error('Test error'))
  })

  it('renders the main heading', async () => {
    await act(async () => {
      render(<About />)
    })

    const heading = screen.getByRole('heading', { level: 1, name: /visweshwaran s/i })
    expect(heading).toBeInTheDocument()
  })

  it('displays the professional tagline', async () => {
    await act(async () => {
      render(<About />)
    })

    expect(screen.getByText(/full stack developer/i)).toBeInTheDocument()
    expect(screen.getByText(/open source enthusiast/i)).toBeInTheDocument()
    expect(screen.getByText(/problem solver/i)).toBeInTheDocument()
  })

  it('shows location information', async () => {
    await act(async () => {
      render(<About />)
    })

    expect(screen.getByText(/toronto, canada & india/i)).toBeInTheDocument()
  })

  it.skip('displays skills section', async () => {
    await act(async () => {
      render(<About />)
    })

    expect(screen.getByText(/skills & technologies/i)).toBeInTheDocument()
    expect(
      screen.getByText(/dynamic visualization based on my github repositories/i)
    ).toBeInTheDocument()

    // Wait for error state to appear since fetch is mocked to fail
    await waitFor(() => {
      expect(screen.getByText(/failed to load repository data/i)).toBeInTheDocument()
    })
  })

  it('renders about me section', async () => {
    await act(async () => {
      render(<About />)
    })

    expect(screen.getByText(/about me/i)).toBeInTheDocument()
    expect(screen.getByText(/passionate full-stack developer/i)).toBeInTheDocument()
  })

  it('shows contact section with GitHub link', async () => {
    await act(async () => {
      render(<About />)
    })

    expect(screen.getByText(/let's connect/i)).toBeInTheDocument()

    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/vish288')
    expect(githubLink).toHaveAttribute('target', '_blank')
  })

  it.skip('shows placeholder buttons for future features', async () => {
    await act(async () => {
      render(<About />)
    })

    expect(screen.getByText(/linkedin \\(coming soon\\)/i)).toBeInTheDocument()
    expect(screen.getByText(/contact \\(coming soon\\)/i)).toBeInTheDocument()
  })

  it('displays future enhancement note', async () => {
    await act(async () => {
      render(<About />)
    })

    expect(screen.getByText(/this page will be enhanced/i)).toBeInTheDocument()
  })

  it('uses proper semantic structure', async () => {
    await act(async () => {
      render(<About />)
    })

    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()

    // Should have multiple sections
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(1)
  })

  it.skip('displays word cloud with successful repository fetch', async () => {
    // Mock successful repository fetch
    const mockRepos = [
      {
        id: 1,
        name: 'test-repo',
        description: 'A test repository',
        html_url: 'https://github.com/vish288/test-repo',
        language: 'TypeScript',
        stargazers_count: 5,
        forks_count: 1,
        topics: ['react', 'typescript'],
        updated_at: '2025-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        fork: false,
        pushed_at: '2025-01-01T00:00:00Z',
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
    })

    await act(async () => {
      render(<About />)
    })

    // Should initially show loading
    expect(screen.getByText(/loading repositories/i)).toBeInTheDocument()

    // Wait for word cloud to appear
    await waitFor(() => {
      expect(screen.getByText(/showing .* skills from .* repositories/i)).toBeInTheDocument()
    })
  })
})
