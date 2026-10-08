import {
  siCursor,
  siClaude,
  siGooglegemini,
  siGoogle,
  siJetbrains,
  siZedindustries,
  siGithubcopilot,
  siCline,
  siOpencode,
  siWarp,
} from 'simple-icons'

// Single source of truth for the MCP client catalogue. No React imports, so the
// prerender script can pull it through the SSR bundle (JSON-LD HowTo, llms.txt).
// Server data lives in mcpServers.ts; the pure generators in lib/mcpInstall.ts
// turn a (server, client) pair into the deeplink / config / command shown here.

export type Os = 'mac' | 'linux' | 'win'

// Section render order (pills are grouped under these labels, in this order).
export const SECTIONS = [
  'Editors and IDEs',
  'Editor extensions',
  'CLI agents',
  'Desktop apps',
] as const
export type Section = (typeof SECTIONS)[number]

export type Output =
  | { kind: 'deeplink'; encoding: 'json-url' | 'b64'; prefix: string }
  | { kind: 'cli'; template: string; envFlag: string }
  | { kind: 'json'; topKey: string; shape: 'standard' | 'cline' | 'opencode' | 'typed' }
  | { kind: 'toml' }

// simple-icons glyph shape ({ title, path }); icon omitted → lucide fallback.
type SimpleIconGlyph = { title: string; path: string }

export interface McpClient {
  id: string // canonical install= value
  name: string
  section: Section
  aliases?: string[] // extra install= values (legacy + synonyms)
  icon?: SimpleIconGlyph // bundled simple-icons glyph
  iconUrl?: string // remote SVG for glyphs not in simple-icons (VS Code only)
  outputs: Output[] // 1 or 2 blocks; deeplink clients have exactly 1
  // A single file path (same on every OS), a file per OS, or a UI location.
  paths?: string | Partial<Record<Os, string>> | { ui: string }
  merge?: true // config merges into an existing settings file, not a fresh one
  notes?: string[] // short lines under the code (restart, scope, rename)
  docs: string // official URL shown as the "Docs" link in the modal
}

const WIKIMEDIA_VSCODE =
  'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg'

export const CLIENTS: McpClient[] = [
  // ── Editors and IDEs ──────────────────────────────────────────────
  {
    id: 'vscode',
    name: 'VS Code',
    section: 'Editors and IDEs',
    aliases: ['code', 'vs-code'],
    iconUrl: WIKIMEDIA_VSCODE,
    outputs: [{ kind: 'deeplink', encoding: 'json-url', prefix: 'vscode:mcp/install?' }],
    docs: 'https://code.visualstudio.com/api/extension-guides/ai/mcp',
  },
  {
    id: 'vscode-insiders',
    name: 'VS Code Insiders',
    section: 'Editors and IDEs',
    aliases: ['insiders'],
    iconUrl: WIKIMEDIA_VSCODE,
    outputs: [{ kind: 'deeplink', encoding: 'json-url', prefix: 'vscode-insiders:mcp/install?' }],
    docs: 'https://code.visualstudio.com/api/extension-guides/ai/mcp',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    section: 'Editors and IDEs',
    icon: siCursor,
    outputs: [
      {
        kind: 'deeplink',
        encoding: 'b64',
        prefix: 'cursor://anysphere.cursor-deeplink/mcp/install?name={name}&config=',
      },
    ],
    docs: 'https://cursor.com/docs/mcp/install-links',
  },
  {
    id: 'visualstudio',
    name: 'Visual Studio',
    section: 'Editors and IDEs',
    aliases: ['vs', 'visual-studio'],
    outputs: [{ kind: 'json', topKey: 'servers', shape: 'typed' }],
    paths: { win: '%USERPROFILE%\\.mcp.json' },
    notes: ['Windows only. Visual Studio 2022 17.14+ or Visual Studio 2026.'],
    docs: 'https://learn.microsoft.com/en-us/visualstudio/ide/mcp-servers',
  },
  {
    id: 'devin',
    name: 'Devin Desktop (Windsurf)',
    section: 'Editors and IDEs',
    aliases: ['windsurf', 'devin-desktop', 'devin-cli'],
    outputs: [{ kind: 'json', topKey: 'mcpServers', shape: 'standard' }],
    paths: '~/.codeium/windsurf/mcp_config.json',
    notes: ['Windsurf became Devin Desktop on 2 Jun 2026.'],
    docs: 'https://docs.devin.ai/desktop/cascade/mcp',
  },
  {
    id: 'zed',
    name: 'Zed',
    section: 'Editors and IDEs',
    icon: siZedindustries,
    outputs: [{ kind: 'json', topKey: 'context_servers', shape: 'standard' }],
    merge: true,
    paths: {
      mac: '~/.config/zed/settings.json',
      linux: '~/.config/zed/settings.json',
      win: '%APPDATA%\\Zed\\settings.json',
    },
    notes: ['Reload the client if the server does not appear.'],
    docs: 'https://zed.dev/docs/ai/mcp',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains AI Assistant',
    section: 'Editors and IDEs',
    aliases: ['intellij', 'ai-assistant', 'pycharm', 'webstorm'],
    icon: siJetbrains,
    outputs: [{ kind: 'json', topKey: 'mcpServers', shape: 'standard' }],
    paths: { ui: 'Settings | Tools | AI Assistant | Model Context Protocol (MCP)' },
    notes: ['Reload the client if the server does not appear.'],
    docs: 'https://www.jetbrains.com/help/ai-assistant/mcp.html',
  },
  {
    id: 'junie',
    name: 'Junie',
    section: 'Editors and IDEs',
    icon: siJetbrains,
    outputs: [{ kind: 'json', topKey: 'mcpServers', shape: 'standard' }],
    paths: '~/.junie/mcp/mcp.json',
    notes: ['Junie does not read secrets from a store; the token sits in this file.'],
    docs: 'https://junie.jetbrains.com/docs/junie-ide-plugin.html',
  },
  {
    id: 'kiro',
    name: 'Kiro',
    section: 'Editors and IDEs',
    aliases: ['kiro-cli', 'amazonq', 'q'],
    outputs: [{ kind: 'json', topKey: 'mcpServers', shape: 'standard' }],
    paths: '~/.kiro/settings/mcp.json',
    notes: ['Changes apply on save; no restart needed.'],
    docs: 'https://kiro.dev/docs/mcp/configuration/',
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    section: 'Editors and IDEs',
    icon: siGoogle,
    outputs: [{ kind: 'json', topKey: 'mcpServers', shape: 'standard' }],
    paths: '~/.gemini/config/mcp_config.json',
    docs: 'https://antigravity.google/docs/mcp',
  },
  // ── Editor extensions ─────────────────────────────────────────────
  {
    id: 'cline',
    name: 'Cline',
    section: 'Editor extensions',
    icon: siCline,
    outputs: [{ kind: 'json', topKey: 'mcpServers', shape: 'cline' }],
    paths: { ui: 'MCP Servers > Configure > Configure MCP Servers' },
    docs: 'https://docs.cline.bot/mcp/configuring-mcp-servers',
  },
  {
    id: 'roo',
    name: 'Roo Code',
    section: 'Editor extensions',
    aliases: ['roo-code', 'roocode'],
    outputs: [{ kind: 'json', topKey: 'mcpServers', shape: 'standard' }],
    paths: { ui: 'MCP settings > Edit Global MCP' },
    docs: 'https://roocodeinc.github.io/Roo-Code/features/mcp/using-mcp-in-roo',
  },
  {
    id: 'continue',
    name: 'Continue',
    section: 'Editor extensions',
    outputs: [{ kind: 'json', topKey: 'mcpServers', shape: 'standard' }],
    paths: '.continue/mcpServers/mcp.json',
    notes: ['MCP works in Agent mode only.', 'At the workspace root.'],
    docs: 'https://docs.continue.dev/customize/deep-dives/mcp',
  },
  // ── CLI agents ────────────────────────────────────────────────────
  {
    id: 'claude-code',
    name: 'Claude Code',
    section: 'CLI agents',
    aliases: ['claude'],
    icon: siClaude,
    outputs: [
      { kind: 'cli', template: 'claude mcp add {name} --scope user {env} -- {cmd}', envFlag: '-e' },
    ],
    docs: 'https://code.claude.com/docs/en/mcp',
  },
  {
    id: 'codex',
    name: 'Codex',
    section: 'CLI agents',
    aliases: ['openai', 'codex-cli', 'chatgpt'],
    outputs: [
      { kind: 'cli', template: 'codex mcp add {name} {env} -- {cmd}', envFlag: '--env' },
      { kind: 'toml' },
    ],
    merge: true,
    paths: '~/.codex/config.toml',
    notes: ['The IDE extension and the ChatGPT desktop app read the same file.'],
    docs: 'https://learn.chatgpt.com/docs/extend/mcp?surface=cli',
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    section: 'CLI agents',
    aliases: ['gemini'],
    icon: siGooglegemini,
    outputs: [
      { kind: 'cli', template: 'gemini mcp add -s user {env} {name} {cmd}', envFlag: '-e' },
    ],
    docs: 'https://geminicli.com/docs/tools/mcp-server/',
  },
  {
    id: 'copilot-cli',
    name: 'GitHub Copilot CLI',
    section: 'CLI agents',
    aliases: ['copilot'],
    icon: siGithubcopilot,
    outputs: [{ kind: 'cli', template: 'copilot mcp add {name} {env} -- {cmd}', envFlag: '--env' }],
    docs: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers',
  },
  {
    id: 'opencode',
    name: 'opencode',
    section: 'CLI agents',
    icon: siOpencode,
    outputs: [{ kind: 'json', topKey: 'mcp', shape: 'opencode' }],
    merge: true,
    paths: 'opencode.json',
    notes: ['Global config: ~/.config/opencode/opencode.json.'],
    docs: 'https://opencode.ai/docs/mcp-servers/',
  },
  // ── Desktop apps ──────────────────────────────────────────────────
  {
    id: 'claude-desktop',
    name: 'Claude Desktop',
    section: 'Desktop apps',
    aliases: ['desktop'],
    icon: siClaude,
    outputs: [{ kind: 'json', topKey: 'mcpServers', shape: 'standard' }],
    paths: {
      mac: '~/Library/Application Support/Claude/claude_desktop_config.json',
      win: '%APPDATA%\\Claude\\claude_desktop_config.json',
    },
    notes: ['Quit and reopen Claude Desktop.'],
    docs: 'https://modelcontextprotocol.io/docs/develop/connect-local-servers',
  },
  {
    id: 'warp',
    name: 'Warp',
    section: 'Desktop apps',
    icon: siWarp,
    outputs: [{ kind: 'json', topKey: 'mcpServers', shape: 'standard' }],
    paths: { ui: 'Settings > Agents > MCP servers' },
    notes: ['Reload the client if the server does not appear.', 'Or save to ~/.warp/.mcp.json.'],
    docs: 'https://docs.warp.dev/knowledge-and-collaboration/mcp',
  },
]

// Lower-cases, then matches the canonical id or any alias. Every existing
// ?server=<key>&install=<alias> deep link resolves through here.
export function resolveClient(param: string): McpClient | null {
  const key = param.toLowerCase()
  return CLIENTS.find(c => c.id === key || c.aliases?.includes(key)) ?? null
}
