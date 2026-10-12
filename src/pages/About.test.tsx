import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import About from './About'
import { APP_STRINGS } from '../constants/appStrings'
import { bannedNames } from '../test/bannedNames'
import snapshot from '../generated/pypi-stats.json'
import { formatDownloads } from '../lib/pypiStats'

function renderAbout() {
  return render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  )
}

describe('About — manifest ledger', () => {
  it('renders the manifest hero: name, role, location', () => {
    renderAbout()
    expect(screen.getByRole('heading', { level: 1, name: /visweshwaran s/i })).toBeInTheDocument()
    expect(screen.getAllByText(/senior staff engineer & architect/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/toronto, canada & india/i)).toBeInTheDocument()
  })

  it('links each builds entry into the gateway', () => {
    renderAbout()
    for (const pkg of ['mcp-gitlab', 'mcp-atlassian-extended', 'mcp-coda', 'mcp-argocd']) {
      expect(screen.getByRole('link', { name: pkg })).toHaveAttribute(
        'href',
        `/mcp-install?server=${pkg}`
      )
    }
  })

  it('puts a contact row in the manifest (linkedin + github)', () => {
    renderAbout()
    expect(screen.getByRole('link', { name: 'linkedin' })).toHaveAttribute(
      'href',
      APP_STRINGS.LINKEDIN_URL
    )
    expect(screen.getByRole('link', { name: 'github' })).toHaveAttribute(
      'href',
      APP_STRINGS.GITHUB_URL
    )
  })

  it('shows the four-cell proof strip with the live downloads figure', () => {
    renderAbout()
    for (const cell of APP_STRINGS.PROOF) {
      expect(screen.getByText(cell.value)).toBeInTheDocument()
    }
    // Fourth cell is the live 15-day downloads total from the snapshot.
    expect(screen.getByText(formatDownloads(snapshot.lastFifteenDays))).toBeInTheDocument()
    expect(screen.getByText(/pypistats\.org/i)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(snapshot.windowEnd))).toBeInTheDocument()
  })

  it('renders sections 01–04 with no 00 index', () => {
    renderAbout()
    expect(screen.getByRole('heading', { level: 2, name: /what i do/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /what i build/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /^career$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /get in touch/i })).toBeInTheDocument()
    expect(screen.queryByText('00')).not.toBeInTheDocument()
  })

  it('renders the about body and a capability', () => {
    renderAbout()
    expect(screen.getByText(/i have built software since 2010/i)).toBeInTheDocument()
    expect(screen.getByText('Frontend platforms')).toBeInTheDocument()
  })

  it('renders every experience entry as one h3, with education and a LinkedIn link', () => {
    renderAbout()
    const h3s = screen.getAllByRole('heading', { level: 3 })
    expect(h3s.length).toBe(APP_STRINGS.EXPERIENCE.length)
    expect(
      screen.getByText(/b\.e\. electronics and communication, anna university/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /full history on linkedin/i })).toHaveAttribute(
      'href',
      APP_STRINGS.LINKEDIN_URL
    )
  })

  it('labels the proof strip with an sr-only "Key numbers" heading', () => {
    renderAbout()
    const heading = screen.getByRole('heading', { level: 2, name: /key numbers/i })
    expect(heading).toHaveClass('sr-only')
    expect(heading).toHaveAttribute('id', 'proof-heading')
    expect(document.querySelector('dl[aria-labelledby="proof-heading"]')).not.toBeNull()
  })

  it('puts only the first role in each h3, with later titles in a paragraph', () => {
    renderAbout()
    const h3s = screen.getAllByRole('heading', { level: 3 })
    // The 2015–2024 entry carries four titles; only the first is a heading.
    const consultancy = h3s.find(h => /2023 – 2024/.test(h.textContent ?? ''))
    expect(consultancy?.textContent).toBe('Senior Staff Engineer / Architect (2023 – 2024)')
    // A later title for that entry is present, but not as a heading.
    expect(screen.getByText(/Staff Engineer \/ Architect \(2021 – 2023\)/)).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /staff engineer \/ architect \(2021 – 2023\)/i })
    ).not.toBeInTheDocument()
  })

  it('shows two bullets per role and discloses the rest behind native details', async () => {
    renderAbout()
    const user = userEvent.setup()
    // digital-health has six bullets: two visible, "4 more" reveals the other four.
    const section = within(document.getElementById('digital-health')!)
    const summary = section.getByText('4 more')
    const hidden = section.getByText(/build and deployment times fell by 40%/i)
    expect(hidden).not.toBeVisible()
    await user.click(summary)
    expect(hidden).toBeVisible()
  })

  it('makes LinkedIn the primary hero CTA alongside GitHub', () => {
    renderAbout()
    const linkedin = screen
      .getAllByRole('link', { name: /linkedin/i })
      .find(l => /^linkedin$/i.test(l.textContent?.trim() ?? ''))
    expect(linkedin).toHaveAttribute('href', APP_STRINGS.LINKEDIN_URL)
    expect(linkedin).toHaveAttribute('target', '_blank')
    const github = screen
      .getAllByRole('link', { name: /github/i })
      .find(l => /^github$/i.test(l.textContent?.trim() ?? ''))
    expect(github).toHaveAttribute('href', APP_STRINGS.GITHUB_URL)
  })

  it('names no employer or client', () => {
    renderAbout()
    const text = `${document.body.textContent ?? ''} ${JSON.stringify(APP_STRINGS)}`.toLowerCase()
    for (const name of bannedNames) {
      expect(text).not.toContain(name.toLowerCase())
    }
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
    ['TAGLINE', APP_STRINGS.TAGLINE],
    ['ABOUT_BODY', APP_STRINGS.ABOUT_BODY],
    ['CONTACT_BODY', APP_STRINGS.CONTACT_BODY],
    ['LLMS_SUMMARY', APP_STRINGS.LLMS_SUMMARY],
    ...APP_STRINGS.CAPABILITIES.map((c): [string, string] => [`CAPABILITIES.${c.title}`, c.body]),
    ...APP_STRINGS.LLMS_KEY_FACTS.map((f, i): [string, string] => [`LLMS_KEY_FACTS[${i}]`, f]),
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
