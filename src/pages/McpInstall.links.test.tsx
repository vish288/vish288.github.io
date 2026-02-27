import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import McpInstall from './McpInstall'

/**
 * Link integrity tests for McpInstall.
 *
 * These tests act as a merge gate to ensure no broken, placeholder, or dead
 * URLs ship in the MCP Installation Gateway. They validate:
 *
 * 1. All rendered <a> hrefs point to real domains (no example.com, localhost, etc.)
 * 2. All icon <img> srcs use valid CDN URLs
 * 3. Generated deeplinks use correct protocol schemes
 * 4. Modal commands contain the right tool names (uvx, claude, gemini)
 * 5. No href="#" or empty href links exist
 * 6. GitHub and PyPI links resolve to the correct repos/packages
 */

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/mcp-install']}>
      <McpInstall />
    </MemoryRouter>
  )
}

// Domains that must never appear in production hrefs
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

// Expected real domains for external links
const ALLOWED_LINK_DOMAINS = [
  'github.com',
  'pypi.org',
  'cursor.com',
  'vscode.dev',
  'vish288.github.io',
  'cdn.simpleicons.org',
  'upload.wikimedia.org',
]

// Expected client names (kept in sync with getClientCards)
const EXPECTED_CLIENTS = [
  'VS Code',
  'Cursor',
  'Claude Code',
  'Windsurf',
  'IntelliJ',
  'Claude Desktop',
  'Gemini CLI',
]

// Expected servers (kept in sync with SERVERS config)
const EXPECTED_SERVERS = ['mcp-gitlab', 'mcp-atlassian-extended', 'mcp-coda']

describe('McpInstall link integrity', () => {
  it('all <a> hrefs use allowed domains — no placeholder or dead URLs', () => {
    renderPage()

    const allLinks = screen.getAllByRole('link')
    const hrefs = allLinks.map(a => a.getAttribute('href')).filter(Boolean) as string[]

    expect(hrefs.length).toBeGreaterThan(0)

    for (const href of hrefs) {
      // Skip deeplink protocols (cursor://, vscode-insiders://)
      if (href.startsWith('cursor://') || href.startsWith('vscode-insiders://')) continue

      if (href.startsWith('http')) {
        const url = new URL(href)

        // Hostname must not be a placeholder/blocked domain
        for (const blocked of BLOCKED_DOMAINS) {
          expect(url.hostname).not.toContain(blocked)
        }

        // Hostname must be an allowed domain
        const matchesAllowed = ALLOWED_LINK_DOMAINS.some(d => url.hostname.endsWith(d))
        expect(matchesAllowed).toBe(true)
      }
    }
  })

  it('no empty or hash-only hrefs exist', () => {
    renderPage()

    const allLinks = screen.getAllByRole('link')
    for (const link of allLinks) {
      const href = link.getAttribute('href')
      expect(href).not.toBe('')
      expect(href).not.toBe('#')
      expect(href).not.toBe('#/')
      expect(href).toBeTruthy()
    }
  })

  it('all icon images use valid CDN sources', () => {
    renderPage()

    const allImages = screen.getAllByRole('img')
    for (const img of allImages) {
      const src = img.getAttribute('src')
      expect(src).toBeTruthy()
      expect(src).toMatch(/^https:\/\/(cdn\.simpleicons\.org|upload\.wikimedia\.org)\//)
    }
  })

  it('Cursor deeplinks use correct protocol and contain config', () => {
    renderPage()

    const cursorLinks = screen.getAllByText('Cursor').map(el => el.closest('a'))
    for (const link of cursorLinks) {
      expect(link).not.toBeNull()
      const href = link!.getAttribute('href')!
      expect(href).toMatch(/^cursor:\/\/anysphere\.cursor-deeplink\/mcp\/install/)
      expect(href).toContain('name=mcp-')
      expect(href).toContain('config=')
      // config should be valid base64
      const configParam = new URLSearchParams(href.split('?')[1]).get('config')
      expect(configParam).toBeTruthy()
      expect(() => atob(configParam!)).not.toThrow()
      // Decoded config should contain uvx
      const decoded = JSON.parse(atob(configParam!))
      expect(decoded.command).toBe('uvx')
      expect(decoded.args).toEqual(expect.arrayContaining([expect.stringMatching(/^mcp-/)]))
    }
  })

  it('VS Code links use correct install redirect URL', () => {
    renderPage()

    const vscodeLinks = screen
      .getAllByText('VS Code')
      .map(el => el.closest('a'))
      .filter(Boolean)
    expect(vscodeLinks.length).toBe(EXPECTED_SERVERS.length)

    for (const link of vscodeLinks) {
      const href = link!.getAttribute('href')!
      expect(href).toContain('vscode')
      expect(href).toContain('mcp/install')
      expect(href).toContain('name=mcp-')
      expect(href).toContain('inputs=')
      expect(href).toContain('config=')
    }
  })

  it('GitHub links point to correct repos', () => {
    renderPage()

    const githubLinks = screen
      .getAllByRole('link', { name: /github/i })
      .map(a => a.getAttribute('href')!)

    expect(githubLinks.length).toBe(EXPECTED_SERVERS.length)
    for (const href of githubLinks) {
      expect(href).toMatch(/^https:\/\/github\.com\/\w+\/mcp-/)
    }
  })

  it('PyPI links point to correct packages', () => {
    renderPage()

    const pypiLinks = screen
      .getAllByRole('link', { name: /pypi/i })
      .map(a => a.getAttribute('href')!)

    expect(pypiLinks.length).toBe(EXPECTED_SERVERS.length)
    for (const href of pypiLinks) {
      expect(href).toMatch(/^https:\/\/pypi\.org\/project\/mcp-/)
      expect(href).toMatch(/\/$/) // Must end with trailing slash
    }
  })

  it('every server section has all expected client cards', () => {
    renderPage()

    for (const clientName of EXPECTED_CLIENTS) {
      const clientElements = screen.getAllByText(clientName)
      // Each client should appear once per server
      expect(clientElements.length).toBe(EXPECTED_SERVERS.length)
    }
  })

  it('Claude Code modal contains valid CLI command', async () => {
    const user = userEvent.setup()
    renderPage()

    const claudeButtons = screen.getAllByText('Claude Code').map(el => el.closest('button'))
    await user.click(claudeButtons[0]!)

    const modal = screen.getByRole('dialog')
    const pre = within(modal).getByText(/claude mcp add/)
    expect(pre.textContent).toMatch(/^claude mcp add \S+ -- uvx mcp-\S+$/)
  })

  it('Gemini CLI modal contains valid CLI command', async () => {
    const user = userEvent.setup()
    renderPage()

    const geminiButtons = screen.getAllByText('Gemini CLI').map(el => el.closest('button'))
    await user.click(geminiButtons[0]!)

    const modal = screen.getByRole('dialog')
    const pre = within(modal).getByText(/gemini mcp add/)
    const cmd = pre.textContent!
    // Should have -e flags, server name, uvx, and package name
    expect(cmd).toContain('-e ')
    expect(cmd).toContain('uvx')
    expect(cmd).toMatch(/mcp-\S+$/)
    // Should not be empty or malformed
    expect(cmd.split(' ').length).toBeGreaterThan(5)
  })

  it('Windsurf modal contains valid JSON config', async () => {
    const user = userEvent.setup()
    renderPage()

    const windsurfButtons = screen.getAllByText('Windsurf').map(el => el.closest('button'))
    await user.click(windsurfButtons[0]!)

    const modal = screen.getByRole('dialog')
    const pre = modal.querySelector('pre')!
    const json = JSON.parse(pre.textContent!)

    // Must have mcpServers with a single key
    expect(json.mcpServers).toBeDefined()
    const serverKeys = Object.keys(json.mcpServers)
    expect(serverKeys).toHaveLength(1)

    const config = json.mcpServers[serverKeys[0]]
    expect(config.command).toBe('uvx')
    expect(config.args).toEqual(expect.arrayContaining([expect.stringMatching(/^mcp-/)]))
    expect(config.env).toBeDefined()
    // env values should be placeholders, not empty
    for (const val of Object.values(config.env)) {
      expect(val).not.toBe('')
    }
  })

  it('no server config has mismatched packageName and pypiPackage', () => {
    renderPage()

    // Both GitHub and PyPI links for each server should reference the same package
    const githubHrefs = screen
      .getAllByRole('link', { name: /github/i })
      .map(a => a.getAttribute('href')!.split('/').pop())

    const pypiHrefs = screen.getAllByRole('link', { name: /pypi/i }).map(a => {
      const parts = a.getAttribute('href')!.split('/')
      return parts[parts.length - 2] // pypi.org/project/{name}/
    })

    expect(githubHrefs).toEqual(pypiHrefs)
  })

  it('client count label matches actual number of client cards', () => {
    renderPage()

    const countLabels = screen.getAllByText(/\d+ clients/)
    for (const label of countLabels) {
      const count = parseInt(label.textContent!.match(/(\d+)/)?.[1] || '0', 10)
      expect(count).toBe(EXPECTED_CLIENTS.length)
    }
  })
})
