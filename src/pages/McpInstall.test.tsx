import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import McpInstall from './McpInstall'

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

  it('renders the page heading and all three server sections', () => {
    renderMcpInstall()

    expect(
      screen.getByRole('heading', { level: 1, name: /mcp installation gateway/i })
    ).toBeInTheDocument()
    expect(screen.getByText('GitLab MCP Server')).toBeInTheDocument()
    expect(screen.getByText('Atlassian Extended MCP Server')).toBeInTheDocument()
    expect(screen.getByText('Coda MCP Server')).toBeInTheDocument()
  })

  it('all accordions are expanded by default', () => {
    renderMcpInstall()

    const buttons = screen.getAllByRole('button', { expanded: true })
    // 3 accordion buttons should be expanded
    expect(
      buttons.filter(b => b.getAttribute('aria-expanded') === 'true').length
    ).toBeGreaterThanOrEqual(3)

    // Client cards should be visible
    expect(screen.getAllByText('VS Code').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Cursor').length).toBeGreaterThanOrEqual(1)
  })

  it('collapses accordion on click and re-expands', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'true')

    // Collapse
    await user.click(gitlabButton)
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'false')

    // Re-expand
    await user.click(gitlabButton)
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'true')

    // All 7 client cards visible in the GitLab section
    const section = gitlabButton.closest('.border.rounded-xl')!
    expect(within(section as HTMLElement).getByText('VS Code')).toBeInTheDocument()
    expect(within(section as HTMLElement).getByText('Cursor')).toBeInTheDocument()
    expect(within(section as HTMLElement).getByText('Claude Code')).toBeInTheDocument()
    expect(within(section as HTMLElement).getByText('Windsurf')).toBeInTheDocument()
    expect(within(section as HTMLElement).getByText('IntelliJ')).toBeInTheDocument()
    expect(within(section as HTMLElement).getByText('Claude Desktop')).toBeInTheDocument()
    expect(within(section as HTMLElement).getByText('Gemini CLI')).toBeInTheDocument()
  })

  it('collapses accordion on click', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'true')

    await user.click(gitlabButton)
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('all accordions expanded even with ?server= param', () => {
    renderMcpInstall('/mcp-install?server=mcp-gitlab')

    // All accordions should be expanded
    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'true')

    const atlassianButton = screen.getByText('Atlassian Extended MCP Server').closest('button')!
    expect(atlassianButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('handles unknown server param gracefully', () => {
    renderMcpInstall('/mcp-install?server=unknown-server')

    // Page renders without crash, all accordions expanded
    expect(screen.getByText('GitLab MCP Server')).toBeInTheDocument()
    expect(screen.getAllByText('VS Code').length).toBeGreaterThanOrEqual(1)
  })

  it('opens modal for Claude Code guide', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    // All sections expanded by default — click first Claude Code button
    const claudeCodeButton = screen.getAllByText('Claude Code')[0].closest('button')!
    await user.click(claudeCodeButton)

    // Modal should be visible with correct content
    const modal = screen.getByRole('dialog')
    expect(modal).toBeInTheDocument()
    expect(within(modal).getByText(/gitlab for claude code/i)).toBeInTheDocument()
    expect(within(modal).getByText(/run this command/i)).toBeInTheDocument()
    expect(within(modal).getByText(/claude mcp add/)).toBeInTheDocument()
  })

  it('opens modal for Claude Desktop guide', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const claudeDesktopButton = screen.getAllByText('Claude Desktop')[0].closest('button')!
    await user.click(claudeDesktopButton)

    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText(/gitlab for claude desktop/i)).toBeInTheDocument()
    expect(within(modal).getByText(/claude_desktop_config\.json/i)).toBeInTheDocument()
  })

  it('closes modal on close button click', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const claudeCodeButton = screen.getAllByText('Claude Code')[0].closest('button')!
    await user.click(claudeCodeButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows copy button in modal', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const claudeCodeButton = screen.getAllByText('Claude Code')[0].closest('button')!
    await user.click(claudeCodeButton)

    const copyButton = screen.getByRole('button', { name: /copy to clipboard/i })
    expect(copyButton).toBeInTheDocument()
  })

  it('shows GitHub and PyPI links in expanded section', () => {
    renderMcpInstall()

    // All sections expanded — multiple GitHub/PyPI links exist
    const githubLinks = screen.getAllByRole('link', { name: /github/i })
    expect(githubLinks[0]).toHaveAttribute('href', expect.stringContaining('github.com'))
    expect(githubLinks[0]).toHaveAttribute('target', '_blank')

    const pypiLinks = screen.getAllByRole('link', { name: /pypi/i })
    expect(pypiLinks[0]).toHaveAttribute('href', expect.stringContaining('pypi.org'))
    expect(pypiLinks[0]).toHaveAttribute('target', '_blank')
  })

  it('VS Code card renders as a link', () => {
    renderMcpInstall()

    // All sections expanded — multiple VS Code links exist
    const vscodeLink = screen.getAllByText('VS Code')[0].closest('a')
    expect(vscodeLink).toBeInTheDocument()
    expect(vscodeLink).toHaveAttribute('href', expect.stringContaining('vscode'))
  })

  it('Cursor card renders as a link with deeplink', () => {
    renderMcpInstall()

    const cursorLink = screen.getAllByText('Cursor')[0].closest('a')
    expect(cursorLink).toBeInTheDocument()
    expect(cursorLink).toHaveAttribute('href', expect.stringContaining('cursor://'))
  })

  it('auto-opens modal with ?server=mcp-gitlab&install=claude', () => {
    renderMcpInstall('/mcp-install?server=mcp-gitlab&install=claude')

    // Modal should open automatically for Claude Code
    const modal = screen.getByRole('dialog')
    expect(modal).toBeInTheDocument()
    expect(within(modal).getByText(/gitlab for claude code/i)).toBeInTheDocument()
  })

  it('auto-opens modal with install=claude-desktop', () => {
    renderMcpInstall('/mcp-install?server=mcp-coda&install=claude-desktop')

    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText(/coda for claude desktop/i)).toBeInTheDocument()
  })

  it('ignores unknown install target', () => {
    renderMcpInstall('/mcp-install?server=mcp-gitlab&install=unknown')

    // All accordions expanded, no modal for unknown target
    expect(screen.getAllByText('VS Code').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows correct client count in accordion header', () => {
    renderMcpInstall()

    const clientCounts = screen.getAllByText('7 clients')
    expect(clientCounts).toHaveLength(3)
  })

  it('opens modal for Gemini CLI guide', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const geminiButton = screen.getAllByText('Gemini CLI')[0].closest('button')!
    await user.click(geminiButton)

    const modal = screen.getByRole('dialog')
    expect(modal).toBeInTheDocument()
    expect(within(modal).getByText(/gitlab for gemini cli/i)).toBeInTheDocument()
    expect(within(modal).getByText(/gemini mcp add/)).toBeInTheDocument()
  })

  it('renders package name badge in accordion header', () => {
    renderMcpInstall()

    expect(screen.getByText('mcp-gitlab')).toBeInTheDocument()
    expect(screen.getByText('mcp-atlassian-extended')).toBeInTheDocument()
    expect(screen.getByText('mcp-coda')).toBeInTheDocument()
  })
})
