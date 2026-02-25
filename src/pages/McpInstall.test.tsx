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

  it('all accordions are collapsed by default', () => {
    renderMcpInstall()

    const buttons = screen.getAllByRole('button', { expanded: false })
    // 3 accordion buttons should exist
    expect(
      buttons.filter(b => b.getAttribute('aria-expanded') === 'false').length
    ).toBeGreaterThanOrEqual(3)

    // Client cards should not be visible
    expect(screen.queryByText('VS Code')).not.toBeInTheDocument()
    expect(screen.queryByText('Cursor')).not.toBeInTheDocument()
  })

  it('expands accordion on click and shows client cards', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(gitlabButton)

    expect(gitlabButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('VS Code')).toBeInTheDocument()
    expect(screen.getByText('Cursor')).toBeInTheDocument()
    expect(screen.getByText('Claude Code')).toBeInTheDocument()
    expect(screen.getByText('Windsurf')).toBeInTheDocument()
    expect(screen.getByText('IntelliJ')).toBeInTheDocument()
    expect(screen.getByText('Claude Desktop')).toBeInTheDocument()
  })

  it('collapses accordion on second click', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    await user.click(gitlabButton)
    expect(screen.getByText('VS Code')).toBeInTheDocument()

    await user.click(gitlabButton)
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('VS Code')).not.toBeInTheDocument()
  })

  it('auto-expands when ?server= param matches', () => {
    renderMcpInstall('/mcp-install?server=mcp-gitlab')

    // GitLab accordion should be expanded
    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    expect(gitlabButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('VS Code')).toBeInTheDocument()

    // Others should stay collapsed
    const atlassianButton = screen.getByText('Atlassian Extended MCP Server').closest('button')!
    expect(atlassianButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('handles unknown server param gracefully', () => {
    renderMcpInstall('/mcp-install?server=unknown-server')

    // Page renders without crash
    expect(screen.getByText('GitLab MCP Server')).toBeInTheDocument()
    // All accordions stay collapsed
    expect(screen.queryByText('VS Code')).not.toBeInTheDocument()
  })

  it('opens modal for Claude Code guide', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    // Expand GitLab section
    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    await user.click(gitlabButton)

    // Click Claude Code guide button
    const claudeCodeButton = screen.getByText('Claude Code').closest('button')!
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

    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    await user.click(gitlabButton)

    const claudeDesktopButton = screen.getByText('Claude Desktop').closest('button')!
    await user.click(claudeDesktopButton)

    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText(/gitlab for claude desktop/i)).toBeInTheDocument()
    expect(within(modal).getByText(/claude_desktop_config\.json/i)).toBeInTheDocument()
  })

  it('closes modal on close button click', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    await user.click(gitlabButton)

    const claudeCodeButton = screen.getByText('Claude Code').closest('button')!
    await user.click(claudeCodeButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows copy button in modal', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    await user.click(gitlabButton)

    const claudeCodeButton = screen.getByText('Claude Code').closest('button')!
    await user.click(claudeCodeButton)

    const copyButton = screen.getByRole('button', { name: /copy to clipboard/i })
    expect(copyButton).toBeInTheDocument()
  })

  it('shows GitHub and PyPI links in expanded section', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    await user.click(gitlabButton)

    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toHaveAttribute('href', expect.stringContaining('github.com'))
    expect(githubLink).toHaveAttribute('target', '_blank')

    const pypiLink = screen.getByRole('link', { name: /pypi/i })
    expect(pypiLink).toHaveAttribute('href', expect.stringContaining('pypi.org'))
    expect(pypiLink).toHaveAttribute('target', '_blank')
  })

  it('VS Code card renders as a link', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    await user.click(gitlabButton)

    const vscodeLink = screen.getByText('VS Code').closest('a')
    expect(vscodeLink).toBeInTheDocument()
    expect(vscodeLink).toHaveAttribute('href', expect.stringContaining('vscode'))
  })

  it('Cursor card renders as a link with deeplink', async () => {
    const user = userEvent.setup()
    renderMcpInstall()

    const gitlabButton = screen.getByText('GitLab MCP Server').closest('button')!
    await user.click(gitlabButton)

    const cursorLink = screen.getByText('Cursor').closest('a')
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

    // Accordion should expand but no modal
    expect(screen.getByText('VS Code')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows correct client count in accordion header', () => {
    renderMcpInstall()

    const clientCounts = screen.getAllByText('6 clients')
    expect(clientCounts).toHaveLength(3)
  })

  it('renders package name badge in accordion header', () => {
    renderMcpInstall()

    expect(screen.getByText('mcp-gitlab')).toBeInTheDocument()
    expect(screen.getByText('mcp-atlassian-extended')).toBeInTheDocument()
    expect(screen.getByText('mcp-coda')).toBeInTheDocument()
  })
})
