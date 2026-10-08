import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import McpInstall from './McpInstall'
import { CLIENTS } from '@/constants/mcpClients'

/**
 * Link integrity tests for McpInstall — a merge gate against broken, placeholder
 * or dead URLs. Deeplink schemes (cursor://, vscode:, vscode-insiders:) carry no
 * host and are skipped by the domain checks.
 */

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/mcp-install']}>
      <McpInstall />
    </MemoryRouter>
  )
}

const BLOCKED_DOMAINS = [
  'example.com',
  'example.org',
  'localhost',
  '127.0.0.1',
  'your-company',
  'your-org',
  'placeholder',
  'TODO',
]

// Real hosts allowed in hrefs: static site hosts plus every modal "Docs" host,
// derived from the data so a new client's docs host can't drift out of sync.
const STATIC_HOSTS = ['github.com', 'pypi.org', 'vish288.github.io', 'upload.wikimedia.org']
const ALLOWED_HOSTS = [...new Set([...STATIC_HOSTS, ...CLIENTS.map(c => new URL(c.docs).hostname)])]

const EXPECTED_CLIENTS = CLIENTS.map(c => c.name)
const EXPECTED_SERVERS = ['mcp-gitlab', 'mcp-atlassian-extended', 'mcp-coda', 'mcp-argocd']

describe('McpInstall link integrity', () => {
  it('all http <a> hrefs use allowed domains', () => {
    renderPage()
    const hrefs = screen
      .getAllByRole('link')
      .map(a => a.getAttribute('href'))
      .filter(Boolean) as string[]
    expect(hrefs.length).toBeGreaterThan(0)
    for (const href of hrefs) {
      if (!href.startsWith('http')) continue // deeplink schemes
      const url = new URL(href)
      for (const blocked of BLOCKED_DOMAINS) expect(url.hostname).not.toContain(blocked)
      // Match on a dot boundary so "github.io" can't satisfy "github.com".
      expect(ALLOWED_HOSTS.some(d => url.hostname === d || url.hostname.endsWith('.' + d))).toBe(
        true
      )
    }
  })

  it('no empty or hash-only hrefs exist', () => {
    renderPage()
    for (const link of screen.getAllByRole('link')) {
      const href = link.getAttribute('href')
      expect(href).not.toBe('')
      expect(href).not.toBe('#')
      expect(href).toBeTruthy()
    }
  })

  it('all icon images use the wikimedia source', () => {
    renderPage()
    const images = Array.from(document.querySelectorAll('img'))
    expect(images.length).toBeGreaterThan(0)
    for (const img of images) {
      expect(img.getAttribute('src')).toMatch(/^https:\/\/upload\.wikimedia\.org\//)
    }
  })

  // Byte-level deeplink goldens live in src/lib/mcpInstall.test.ts; here we only
  // smoke-test that a deeplink client renders as an <a> carrying its scheme.
  it('a deeplink client renders as an anchor with its scheme', () => {
    renderPage()
    const cursor = screen.getAllByText('Cursor')[0].closest('a')!
    expect(cursor.getAttribute('href')).toMatch(/^cursor:\/\//)
  })

  it('GitHub links point to correct repos', () => {
    renderPage()
    const hrefs = screen.getAllByRole('link', { name: /github/i }).map(a => a.getAttribute('href')!)
    expect(hrefs.length).toBe(EXPECTED_SERVERS.length)
    for (const href of hrefs) expect(href).toMatch(/^https:\/\/github\.com\/\w+\/mcp-/)
  })

  it('PyPI links point to correct packages', () => {
    renderPage()
    const hrefs = screen.getAllByRole('link', { name: /pypi/i }).map(a => a.getAttribute('href')!)
    expect(hrefs.length).toBe(EXPECTED_SERVERS.length)
    for (const href of hrefs) {
      expect(href).toMatch(/^https:\/\/pypi\.org\/project\/mcp-/)
      expect(href).toMatch(/\/$/)
    }
  })

  it('every server section renders every client', () => {
    renderPage()
    for (const name of EXPECTED_CLIENTS) {
      expect(screen.getAllByText(name).length).toBe(EXPECTED_SERVERS.length)
    }
  })

  it('Claude Code modal contains a valid CLI command', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getAllByText('Claude Code')[0].closest('button')!)
    const modal = screen.getByRole('dialog')
    const pre = within(modal).getByText(/claude mcp add/)
    expect(pre.textContent).toMatch(
      /^claude mcp add \S+ --scope user( -e \S+=\S*)+ -- uvx mcp-\S+$/
    )
  })

  it('Devin Desktop modal contains a valid JSON config', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getAllByText('Devin Desktop (Windsurf)')[0].closest('button')!)
    const modal = screen.getByRole('dialog')
    const json = JSON.parse(modal.querySelector('pre')!.textContent!)
    const key = Object.keys(json.mcpServers)[0]
    expect(json.mcpServers[key].command).toBe('uvx')
    for (const val of Object.values(json.mcpServers[key].env)) expect(val).not.toBe('')
  })

  it('GitHub and PyPI reference the same package per server', () => {
    renderPage()
    const github = screen
      .getAllByRole('link', { name: /github/i })
      .map(a => a.getAttribute('href')!.split('/').pop())
    const pypi = screen.getAllByRole('link', { name: /pypi/i }).map(a => {
      const parts = a.getAttribute('href')!.split('/')
      return parts[parts.length - 2]
    })
    expect(github).toEqual(pypi)
  })

  it('mcp-argocd exposes working Cursor, VS Code and Insiders deep links', () => {
    render(
      <MemoryRouter initialEntries={['/mcp-install?server=mcp-argocd&install=vscode-insiders']}>
        <McpInstall />
      </MemoryRouter>
    )
    const section = screen
      .getByText('Argo CD MCP Server')
      .closest('.border.rounded-xl') as HTMLElement
    const cursorHref = within(section).getByText('Cursor').closest('a')!.getAttribute('href')!
    expect(cursorHref).toMatch(/^cursor:\/\/anysphere\.cursor-deeplink\/mcp\/install/)
    expect(cursorHref).toContain('name=argocd')
    const insidersHref = within(section)
      .getByText('VS Code Insiders')
      .closest('a')!
      .getAttribute('href')!
    expect(insidersHref.startsWith('vscode-insiders:mcp/install?')).toBe(true)
  })
})
