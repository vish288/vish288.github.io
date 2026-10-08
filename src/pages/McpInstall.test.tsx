import { render, screen, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import McpInstall from './McpInstall'
import { CLIENTS } from '@/constants/mcpClients'

function renderMcpInstall(initialEntry = '/mcp-install') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <McpInstall />
    </MemoryRouter>
  )
}

describe('McpInstall Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the heading and all four server sections', () => {
    renderMcpInstall()
    expect(
      screen.getByRole('heading', { level: 1, name: /mcp installation gateway/i })
    ).toBeInTheDocument()
    expect(screen.getByText('GitLab MCP Server')).toBeInTheDocument()
    expect(screen.getByText('Atlassian Extended MCP Server')).toBeInTheDocument()
    expect(screen.getByText('Coda MCP Server')).toBeInTheDocument()
    expect(screen.getByText('Argo CD MCP Server')).toBeInTheDocument()
  })

  it('shows the client count from data in each accordion header', () => {
    renderMcpInstall()
    const counts = screen.getAllByText(`${CLIENTS.length} clients`)
    expect(counts).toHaveLength(4)
    expect(CLIENTS.length).toBe(20)
  })

  it('renders the four section labels inside each server', () => {
    renderMcpInstall()
    for (const section of ['Editors and IDEs', 'Editor extensions', 'CLI agents', 'Desktop apps']) {
      // one per server section
      expect(screen.getAllByText(section).length).toBe(4)
    }
  })

  it('collapses and re-expands an accordion', async () => {
    const user = userEvent.setup()
    renderMcpInstall()
    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'true')
    await user.click(gitlabButton)
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'false')
    await user.click(gitlabButton)
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('opens the Claude Code modal with the CLI command', async () => {
    const user = userEvent.setup()
    renderMcpInstall()
    await user.click(screen.getAllByText('Claude Code')[0].closest('button')!)
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText(/GitLab for Claude Code/)).toBeInTheDocument()
    expect(within(modal).getByText(/claude mcp add gitlab --scope user/)).toBeInTheDocument()
  })

  it('Claude Desktop modal shows a paths dl with macOS and Windows rows and a secrets line', async () => {
    const user = userEvent.setup()
    renderMcpInstall()
    await user.click(screen.getAllByText('Claude Desktop')[0].closest('button')!)
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText('macOS')).toBeInTheDocument()
    expect(within(modal).getByText('Windows')).toBeInTheDocument()
    expect(within(modal).getAllByText(/claude_desktop_config\.json/).length).toBeGreaterThan(0)
    expect(within(modal).getByText(/Secrets: GITLAB_TOKEN/)).toBeInTheDocument()
  })

  it('Codex modal shows two copy buttons with distinct names', async () => {
    const user = userEvent.setup()
    renderMcpInstall()
    await user.click(screen.getAllByText('Codex')[0].closest('button')!)
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByRole('button', { name: /copy command/i })).toBeInTheDocument()
    expect(within(modal).getByRole('button', { name: /copy config/i })).toBeInTheDocument()
    expect(within(modal).getByText(/codex mcp add/)).toBeInTheDocument()
    expect(within(modal).getByText(/\[mcp_servers\.gitlab\]/)).toBeInTheDocument()
  })

  it('auto-opens the Devin Desktop modal for legacy install=windsurf', () => {
    renderMcpInstall('/mcp-install?server=mcp-gitlab&install=windsurf')
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText(/GitLab for Devin Desktop \(Windsurf\)/)).toBeInTheDocument()
  })

  it('auto-opens the JetBrains AI Assistant modal for legacy install=intellij', () => {
    renderMcpInstall('/mcp-install?server=mcp-coda&install=intellij')
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText(/Coda for JetBrains AI Assistant/)).toBeInTheDocument()
  })

  it('auto-opens the Visual Studio config modal for install=vs', () => {
    renderMcpInstall('/mcp-install?server=mcp-gitlab&install=vs')
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText(/GitLab for Visual Studio/)).toBeInTheDocument()
    const pre = modal.querySelector('pre')!
    expect(JSON.parse(pre.textContent!).servers.gitlab.type).toBe('stdio')
  })

  it('auto-opens the Claude Code modal for legacy install=claude', () => {
    renderMcpInstall('/mcp-install?server=mcp-gitlab&install=claude')
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText(/GitLab for Claude Code/)).toBeInTheDocument()
  })

  it('ignores an unknown install target', () => {
    renderMcpInstall('/mcp-install?server=mcp-gitlab&install=nope')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the modal and returns without crash', async () => {
    const user = userEvent.setup()
    renderMcpInstall()
    await user.click(screen.getAllByText('Claude Code')[0].closest('button')!)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders GitHub and PyPI links in expanded sections', () => {
    renderMcpInstall()
    const github = screen.getAllByRole('link', { name: /github/i })
    expect(github[0]).toHaveAttribute('href', expect.stringContaining('github.com'))
    const pypi = screen.getAllByRole('link', { name: /pypi/i })
    expect(pypi[0]).toHaveAttribute('href', expect.stringContaining('pypi.org'))
  })

  it('renders package name badges', () => {
    renderMcpInstall()
    expect(screen.getByText('mcp-gitlab')).toBeInTheDocument()
    expect(screen.getByText('mcp-argocd')).toBeInTheDocument()
  })
})

describe('McpInstall auto-redirect', () => {
  let originalLocation: Location

  beforeEach(() => {
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

  it('redirects to the deeplink after 400ms for a deeplink install target', () => {
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
