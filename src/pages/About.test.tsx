import { render, screen, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import About from './About'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

function renderAbout() {
  return render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  )
}

describe('About Page', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockRejectedValue(new Error('Test error'))
  })

  it('renders the main heading', async () => {
    await act(async () => {
      renderAbout()
    })

    const heading = screen.getByRole('heading', { level: 1, name: /visweshwaran s/i })
    expect(heading).toBeInTheDocument()
  })

  it('displays the professional tagline', async () => {
    await act(async () => {
      renderAbout()
    })

    expect(screen.getByText(/full stack developer/i)).toBeInTheDocument()
    expect(screen.getByText(/open source enthusiast/i)).toBeInTheDocument()
    expect(screen.getByText(/problem solver/i)).toBeInTheDocument()
  })

  it('shows location information', async () => {
    await act(async () => {
      renderAbout()
    })

    expect(screen.getByText(/toronto, canada & india/i)).toBeInTheDocument()
  })

  it('renders about section with narrative', async () => {
    await act(async () => {
      renderAbout()
    })

    expect(screen.getByText(/passionate full-stack developer/i)).toBeInTheDocument()
    expect(screen.getByText(/building software that solves real problems/i)).toBeInTheDocument()
  })

  it('shows hero connect buttons with GitHub and LinkedIn links', async () => {
    await act(async () => {
      renderAbout()
    })

    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/vish288')
    expect(githubLink).toHaveAttribute('target', '_blank')

    const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
    expect(linkedinLink).toBeInTheDocument()
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/suryanarayananvisweshwaran/'
    )
    expect(linkedinLink).toHaveAttribute('target', '_blank')
  })

  it('shows highlight cards', async () => {
    await act(async () => {
      renderAbout()
    })

    expect(screen.getByText('Open Source')).toBeInTheDocument()
    expect(screen.getByText('Full Stack')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
  })

  it('uses proper semantic structure', async () => {
    await act(async () => {
      renderAbout()
    })

    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()

    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(1)
  })

  it.skip('displays word cloud with successful repository fetch', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'test-repo',
        description: 'A test repository',
        html_url: 'https://github.com/testuser/test-repo',
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
      renderAbout()
    })

    expect(screen.getByText(/loading repositories/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/showing .* skills from .* repositories/i)).toBeInTheDocument()
    })
  })
})
