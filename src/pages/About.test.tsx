import { render, screen, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import About from './About'
import { resetGitHubCache } from '../hooks/useGitHubRepositories'
import { APP_STRINGS } from '../constants/appStrings'

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
    resetGitHubCache()
  })

  it('renders the main heading', async () => {
    await act(async () => {
      renderAbout()
    })

    const heading = screen.getByRole('heading', { level: 1, name: /visweshwaran s/i })
    expect(heading).toBeInTheDocument()
  })

  it('displays the role line and tagline', async () => {
    await act(async () => {
      renderAbout()
    })

    expect(screen.getByText(/senior staff engineer & architect/i)).toBeInTheDocument()
    expect(
      screen.getByText(/i lead platform modernization for large enterprises/i)
    ).toBeInTheDocument()
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

    expect(screen.getByRole('heading', { level: 2, name: /what i do/i })).toBeInTheDocument()
    expect(screen.getByText(/i have built software since 2010/i)).toBeInTheDocument()
    expect(
      screen.getByText(/mcp servers for gitlab, atlassian, coda and argo cd/i)
    ).toBeInTheDocument()
  })

  it('renders the capabilities section', async () => {
    await act(async () => {
      renderAbout()
    })

    expect(
      screen.getByRole('heading', { level: 2, name: /where i add the most/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Frontend platforms')).toBeInTheDocument()
    expect(screen.getByText('Engineering leadership')).toBeInTheDocument()
  })

  it('renders the experience section with one h3 per entry', async () => {
    await act(async () => {
      renderAbout()
    })

    expect(screen.getByRole('heading', { level: 2, name: /^career$/i })).toBeInTheDocument()

    // Each experience entry contributes exactly one h3 (the Skills card adds one more).
    expect(screen.getByText(/senior staff consultant/i)).toBeInTheDocument()
    expect(screen.getByText(/ai \/ platform engineer/i)).toBeInTheDocument()
    expect(
      screen.getByText(/b\.e\. electronics and communication, anna university/i)
    ).toBeInTheDocument()

    const fullHistory = screen.getByRole('link', { name: /full history on linkedin/i })
    expect(fullHistory).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/suryanarayananvisweshwaran/'
    )
  })

  it('exposes experience entries as level-3 headings', async () => {
    await act(async () => {
      renderAbout()
    })

    const h3s = screen.getAllByRole('heading', { level: 3 })
    // 4 experience entries + 1 Skills card title
    expect(h3s.length).toBe(5)
  })

  it('names no employer or client', async () => {
    await act(async () => {
      renderAbout()
    })

    const banned = ['Loblaw', 'Shoppers', 'Publicis', 'Sapient', 'Virtusa', 'Infosys']
    const text = document.body.textContent ?? ''
    for (const name of banned) {
      expect(text.toLowerCase()).not.toContain(name.toLowerCase())
    }
  })

  it('shows hero connect buttons with GitHub and LinkedIn links', async () => {
    await act(async () => {
      renderAbout()
    })

    const githubLinks = screen.getAllByRole('link', { name: /github/i })
    const heroGithub = githubLinks.find(
      l => l.getAttribute('href') === 'https://github.com/vish288'
    )
    expect(heroGithub).toBeDefined()
    expect(heroGithub).toHaveAttribute('target', '_blank')

    const linkedinLinks = screen.getAllByRole('link', { name: /linkedin/i })
    const heroLinkedin = linkedinLinks.find(
      l => l.getAttribute('target') === '_blank' && /^linkedin$/i.test(l.textContent?.trim() ?? '')
    )
    expect(heroLinkedin).toBeDefined()
    expect(heroLinkedin).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/suryanarayananvisweshwaran/'
    )
  })

  it('shows highlight cards', async () => {
    await act(async () => {
      renderAbout()
    })

    expect(screen.getByText('4 MCP servers')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /4 mcp servers/i })).toHaveAttribute(
      'href',
      '/mcp-install'
    )
    expect(screen.getByText('Public repos')).toBeInTheDocument()
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

describe('STE-100 sentence length', () => {
  // One idea per sentence: every sentence stays within the STE descriptive ceiling.
  const MAX_WORDS = 25

  function sentences(text: string): string[] {
    return text
      .split(/[.!?](?:\s|$)/)
      .map(s => s.trim())
      .filter(Boolean)
  }

  function wordCount(sentence: string): number {
    return sentence.split(/\s+/).filter(Boolean).length
  }

  const copy: [string, string][] = [
    ['ABOUT_P1', APP_STRINGS.ABOUT_P1],
    ['ABOUT_P2', APP_STRINGS.ABOUT_P2],
    ['ABOUT_P3', APP_STRINGS.ABOUT_P3],
    ...APP_STRINGS.EXPERIENCE.flatMap((entry, ei) =>
      entry.bullets.map((b, bi): [string, string] => [`EXPERIENCE[${ei}].bullets[${bi}]`, b])
    ),
  ]

  it.each(copy)('%s: every sentence is at most 25 words', (_label, text) => {
    for (const sentence of sentences(text)) {
      expect(wordCount(sentence)).toBeLessThanOrEqual(MAX_WORDS)
    }
  })
})
