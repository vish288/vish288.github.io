import { render, screen, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import McpInstall from './McpInstall'
import { CLIENTS, SECTIONS } from '@/constants/mcpClients'
import { SERVERS } from '@/constants/mcpServers'

function renderMcpInstall(initialEntry = '/mcp-install') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <McpInstall />
    </MemoryRouter>
  )
}

const FULL_NAMES = Object.values(SERVERS).map(s => s.fullName)

describe('McpInstall Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('renders the heading and all four server names', () => {
    renderMcpInstall()
    expect(
      screen.getByRole('heading', { level: 1, name: /mcp installation gateway/i })
    ).toBeInTheDocument()
    for (const name of FULL_NAMES) expect(screen.getByText(name)).toBeInTheDocument()
  })

  it('renders one client picker with 20 radios in 4 groups', () => {
    renderMcpInstall()
    expect(screen.getByRole('group', { name: /which client do you use/i })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(CLIENTS.length)
    expect(CLIENTS.length).toBe(20)
    for (const section of SECTIONS) expect(screen.getAllByText(section)).toHaveLength(1)
  })

  it('renders no row actions until a client is chosen', () => {
    renderMcpInstall()
    expect(screen.queryAllByRole('link', { name: /^install /i })).toHaveLength(0)
    expect(screen.queryAllByRole('button', { name: /^(config|command):/i })).toHaveLength(0)
    expect(screen.getAllByRole('link', { name: /github/i })).toHaveLength(4)
    expect(screen.getAllByRole('link', { name: /pypi/i })).toHaveLength(4)
  })

  it('choosing Cursor gives every row an Install link with a unique name and remembers it', async () => {
    const user = userEvent.setup()
    renderMcpInstall()
    await user.click(screen.getByRole('radio', { name: 'Cursor' }))
    for (const label of [
      'Install GitLab for Cursor',
      'Install Atlassian Extended for Cursor',
      'Install Coda for Cursor',
      'Install Argo CD for Cursor',
    ]) {
      const link = screen.getByRole('link', { name: label })
      expect(link.getAttribute('href')).toMatch(/^cursor:\/\//)
    }
    expect(localStorage.getItem('mcp-client')).toBe('cursor')
    expect(screen.getByText('Client: Cursor')).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /which client/i })).not.toBeInTheDocument()
  })

  it('restores the remembered client on load', () => {
    localStorage.setItem('mcp-client', 'zed')
    renderMcpInstall()
    expect(screen.getByText('Client: Zed')).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /which client/i })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^config: .* for Zed$/i })).toHaveLength(4)
  })

  it('?client= beats localStorage', () => {
    localStorage.setItem('mcp-client', 'zed')
    renderMcpInstall('/mcp-install?client=codex')
    expect(screen.getByText('Client: Codex')).toBeInTheDocument()
  })

  it('?install= beats ?client= and opens the modal', () => {
    localStorage.setItem('mcp-client', 'zed')
    renderMcpInstall('/mcp-install?server=mcp-gitlab&install=windsurf&client=zed')
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText(/GitLab for Devin Desktop \(Windsurf\)/)).toBeInTheDocument()
    expect(screen.getByText('Client: Devin Desktop (Windsurf)')).toBeInTheDocument()
  })

  it('ignores an unknown stored client', () => {
    localStorage.setItem('mcp-client', 'nope')
    renderMcpInstall()
    expect(screen.getByRole('group', { name: /which client do you use/i })).toBeInTheDocument()
    expect(screen.getAllByRole('radio').every(r => !(r as HTMLInputElement).checked)).toBe(true)
  })

  it('Change reopens the picker with the current client checked and moves focus to it', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mcp-client', 'cursor')
    renderMcpInstall()
    const change = screen.getByRole('button', { name: 'Change' })
    expect(change).toHaveAttribute('aria-expanded', 'false')
    await user.click(change)
    expect(change).toHaveAttribute('aria-expanded', 'true')
    const cursor = screen.getByRole('radio', { name: 'Cursor' }) as HTMLInputElement
    expect(cursor.checked).toBe(true)
    expect(document.activeElement).toBe(cursor)
  })

  it('?server=mcp-coda puts Coda first and collapses the rest', () => {
    renderMcpInstall('/mcp-install?server=mcp-coda')
    const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)
    expect(headings[0]).toBe('Coda MCP Server')
    const details = document.querySelector('details') as HTMLDetailsElement
    expect(details).toBeTruthy()
    expect(details.open).toBe(false)
    expect(within(details).getByText('Other servers (3)')).toBeInTheDocument()
    const inside = within(details)
      .getAllByRole('heading', { level: 2 })
      .map(h => h.textContent)
    expect(inside).toEqual([
      'GitLab MCP Server',
      'Atlassian Extended MCP Server',
      'Argo CD MCP Server',
    ])
  })

  it('?server=mcp-coda with a remembered client scrolls to and focuses the Coda row', () => {
    localStorage.setItem('mcp-client', 'cursor')
    const scrollSpy = vi.fn()
    Element.prototype.scrollIntoView = scrollSpy
    renderMcpInstall('/mcp-install?server=mcp-coda')
    expect(scrollSpy).toHaveBeenCalledTimes(1)
    const codaHeading = screen.getByRole('heading', { level: 2, name: 'Coda MCP Server' })
    expect(document.activeElement).toBe(codaHeading)
    expect(codaHeading.closest('li')).toHaveAttribute('aria-current', 'true')
  })

  it('?server=mcp-coda with no client names the server in the legend and does not scroll', () => {
    const scrollSpy = vi.fn()
    Element.prototype.scrollIntoView = scrollSpy
    renderMcpInstall('/mcp-install?server=mcp-coda')
    expect(
      screen.getByText('Install Coda MCP Server: which client do you use?')
    ).toBeInTheDocument()
    expect(scrollSpy).not.toHaveBeenCalled()
  })

  it('?server=nope renders all four rows in order with no details', () => {
    renderMcpInstall('/mcp-install?server=nope')
    const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)
    expect(headings).toEqual(FULL_NAMES)
    expect(screen.queryByText(/other servers/i)).not.toBeInTheDocument()
  })

  it('row headings contain only the server name', () => {
    renderMcpInstall()
    const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)
    expect(headings).toEqual(FULL_NAMES)
    expect(document.querySelector('h2 button')).toBeNull()
  })

  it('package names are not hidden at any width', () => {
    renderMcpInstall()
    const chip = screen.getByText('mcp-gitlab')
    expect(chip.classList.contains('hidden')).toBe(false)
  })

  it('Codex modal labels the command and the file as options and says uv is required', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mcp-client', 'codex')
    renderMcpInstall()
    await user.click(screen.getByRole('button', { name: 'Command: GitLab for Codex' }))
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText(/Option 1: run this command/)).toBeInTheDocument()
    expect(within(modal).getByText(/Option 2:/)).toBeInTheDocument()
    expect(within(modal).getByText('~/.codex/config.toml')).toBeInTheDocument()
    const uv = within(modal).getByRole('link', { name: /install uv/i })
    expect(uv).toHaveAttribute('href', 'https://docs.astral.sh/uv/getting-started/installation/')
    expect(within(modal).queryByText(/Run this in your terminal\./)).not.toBeInTheDocument()
  })

  it('Devin Desktop modal labels the single path File, not All', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mcp-client', 'devin')
    renderMcpInstall()
    await user.click(
      screen.getByRole('button', { name: 'Config: GitLab for Devin Desktop (Windsurf)' })
    )
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText('File')).toBeInTheDocument()
    expect(within(modal).queryByText('All')).not.toBeInTheDocument()
  })

  it('secrets step links the GitLab token page and names the scope', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mcp-client', 'zed')
    renderMcpInstall()
    await user.click(screen.getByRole('button', { name: 'Config: GitLab for Zed' }))
    const modal = screen.getByRole('dialog')
    const link = within(modal).getByRole('link', { name: 'your GitLab access tokens page' })
    expect(link.getAttribute('href')).toContain('gitlab.com')
    expect(within(modal).getByText(/api.*scope/)).toBeInTheDocument()
  })

  it('Atlassian modal shows two token lines with one link host', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mcp-client', 'zed')
    renderMcpInstall()
    await user.click(screen.getByRole('button', { name: 'Config: Atlassian Extended for Zed' }))
    const modal = screen.getByRole('dialog')
    const tokenLinks = within(modal)
      .getAllByRole('link')
      .filter(a => a.getAttribute('href')?.includes('id.atlassian.com'))
    expect(tokenLinks).toHaveLength(2)
  })

  it('check step names the client and short name', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mcp-client', 'claude-desktop')
    renderMcpInstall()
    await user.click(screen.getByRole('button', { name: 'Config: Coda for Claude Desktop' }))
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText(/Check Claude Desktop lists/)).toBeInTheDocument()
    expect(within(modal).getByText('coda')).toBeInTheDocument()
    expect(within(modal).getByText('Quit and reopen Claude Desktop.')).toBeInTheDocument()
  })

  it('copy says Copied without an exclamation and announces one wording on failure', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mcp-client', 'claude-code')
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
    renderMcpInstall()
    await user.click(screen.getByRole('button', { name: 'Command: GitLab for Claude Code' }))
    const modal = screen.getByRole('dialog')
    await user.click(within(modal).getByRole('button', { name: /copy to clipboard/i }))
    expect(within(modal).getByRole('button', { name: /^copied$/i })).toBeInTheDocument()

    writeText.mockRejectedValueOnce(new Error('denied'))
    await user.click(within(modal).getByRole('button', { name: /^copied$/i }))
    const matches = await within(modal).findAllByText(
      'Copy failed. Select the text above and copy it.'
    )
    // One visible line plus the polite live region carry the same wording.
    expect(matches.length).toBeGreaterThanOrEqual(2)
    const visible = matches.find(el => !el.classList.contains('sr-only'))!
    expect(visible.classList.contains('text-destructive')).toBe(false)
  })

  it('command block wraps instead of scrolling', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mcp-client', 'claude-code')
    renderMcpInstall()
    await user.click(screen.getByRole('button', { name: 'Command: GitLab for Claude Code' }))
    const pre = screen.getByRole('dialog').querySelector('pre')!
    expect(pre.classList.contains('whitespace-pre-wrap')).toBe(true)
    expect(pre.classList.contains('overflow-x-auto')).toBe(false)
  })

  it('modal locks body scroll and restores it on close', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mcp-client', 'claude-code')
    renderMcpInstall()
    await user.click(screen.getByRole('button', { name: 'Command: GitLab for Claude Code' }))
    expect(document.body.style.overflow).toBe('hidden')
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(document.body.style.overflow).toBe('')
  })

  it('renders GitHub and PyPI links for every server', () => {
    renderMcpInstall()
    expect(screen.getAllByRole('link', { name: /github/i })).toHaveLength(4)
    expect(screen.getAllByRole('link', { name: /pypi/i })).toHaveLength(4)
  })
})

describe('McpInstall auto-redirect', () => {
  let originalLocation: Location

  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { href: '' },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    })
  })

  it('redirects to the deeplink after 400ms and remembers the client', () => {
    render(
      <MemoryRouter initialEntries={['/mcp-install?server=mcp-gitlab&install=vscode']}>
        <McpInstall />
      </MemoryRouter>
    )
    expect(window.location.href).toBe('')
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(window.location.href.startsWith('vscode:mcp/install?')).toBe(true)
    expect(localStorage.getItem('mcp-client')).toBe('vscode')
  })

  it('does not redirect for a json/cli install target (install=claude)', () => {
    render(
      <MemoryRouter initialEntries={['/mcp-install?server=mcp-gitlab&install=claude']}>
        <McpInstall />
      </MemoryRouter>
    )
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(window.location.href).toBe('')
  })
})
