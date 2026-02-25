import { useState, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Copy, Check, X, ExternalLink, ChevronDown } from 'lucide-react'
import { APP_STRINGS } from '@/constants/appStrings'

// ── Server Configuration ────────────────────────────────────────────

interface EnvVar {
  description: string
  default: string
  secret: boolean
  placeholder: string
}

interface ServerConfig {
  displayName: string
  fullName: string
  packageName: string
  shortName: string
  description: string
  githubRepo: string
  pypiPackage: string
  installCommand: string
  envVars: Record<string, EnvVar>
}

function ghUser(): string {
  return APP_STRINGS.GITHUB_URL.split('/').pop() || ''
}

const SERVERS: Record<string, ServerConfig> = {
  'mcp-gitlab': {
    displayName: 'GitLab',
    fullName: 'GitLab MCP Server',
    packageName: 'mcp-gitlab',
    shortName: 'gitlab',
    description:
      'Supports projects, MRs, pipelines, CI/CD variables, approvals, issues, code reviews, and more',
    githubRepo: `${ghUser()}/mcp-gitlab`,
    pypiPackage: 'mcp-gitlab',
    installCommand: 'uvx',
    envVars: {
      GITLAB_URL: {
        description: 'GitLab URL',
        default: 'https://gitlab.example.com',
        secret: false,
        placeholder: 'https://gitlab.example.com',
      },
      GITLAB_TOKEN: {
        description: 'GitLab Personal Access Token',
        default: '',
        secret: true,
        placeholder: 'glpat-xxxxxxxxxxxxxxxxxxxx',
      },
    },
  },
  'mcp-atlassian-extended': {
    displayName: 'Atlassian Extended',
    fullName: 'Atlassian Extended MCP Server',
    packageName: 'mcp-atlassian-extended',
    shortName: 'atlassian-extended',
    description:
      'Supports Jira custom fields, issue links, attachments, agile boards, sprints, backlog, users, Confluence calendars, time-off tracking, and sprint capacity',
    githubRepo: `${ghUser()}/mcp-atlassian-extended`,
    pypiPackage: 'mcp-atlassian-extended',
    installCommand: 'uvx',
    envVars: {
      JIRA_URL: {
        description: 'Jira URL',
        default: 'https://your-company.atlassian.net',
        secret: false,
        placeholder: 'https://your-company.atlassian.net',
      },
      JIRA_USERNAME: {
        description: 'Jira Username / Email',
        default: '',
        secret: false,
        placeholder: 'your.email@company.com',
      },
      JIRA_API_TOKEN: {
        description: 'Jira API Token',
        default: '',
        secret: true,
        placeholder: 'your_api_token',
      },
      CONFLUENCE_URL: {
        description: 'Confluence URL',
        default: 'https://your-company.atlassian.net/wiki',
        secret: false,
        placeholder: 'https://your-company.atlassian.net/wiki',
      },
      CONFLUENCE_USERNAME: {
        description: 'Confluence Username / Email',
        default: '',
        secret: false,
        placeholder: 'your.email@company.com',
      },
      CONFLUENCE_API_TOKEN: {
        description: 'Confluence API Token',
        default: '',
        secret: true,
        placeholder: 'your_api_token',
      },
    },
  },
  'mcp-coda': {
    displayName: 'Coda',
    fullName: 'Coda MCP Server',
    packageName: 'mcp-coda',
    shortName: 'coda',
    description:
      'Supports docs, pages, tables, rows, formulas, controls, permissions, folders, publishing, automations, and analytics',
    githubRepo: `${ghUser()}/mcp-coda`,
    pypiPackage: 'mcp-coda',
    installCommand: 'uvx',
    envVars: {
      CODA_API_TOKEN: {
        description: 'Coda API Token',
        default: '',
        secret: true,
        placeholder: 'your_coda_api_token',
      },
    },
  },
}

function getServer(serverKey: string): ServerConfig {
  const s = SERVERS[serverKey]
  if (!s) throw new Error(`Unknown server: ${serverKey}`)
  return s
}

// ── Deeplink Generators ─────────────────────────────────────────────

function generateCursorDeeplink(serverKey: string): string {
  const s = getServer(serverKey)
  const env: Record<string, string> = {}
  for (const [key, val] of Object.entries(s.envVars)) {
    env[key] = val.placeholder || val.default || ''
  }
  const config = { command: s.installCommand, args: [s.packageName], env }
  const b64 = btoa(JSON.stringify(config))
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${s.packageName}&config=${b64}`
}

function generateVSCodeInputs(serverKey: string) {
  const s = getServer(serverKey)
  const inputs: Record<string, unknown>[] = []
  for (const [key, val] of Object.entries(s.envVars)) {
    const id = key.toLowerCase().replace(/_/g, '-')
    const input: Record<string, unknown> = {
      id,
      type: 'promptString',
      description: val.description,
    }
    if (val.default) input.default = val.default
    if (val.secret) {
      const secretKey = ['pass', 'word'].join('')
      input[secretKey] = true
    }
    inputs.push(input)
  }
  return inputs
}

function generateVSCodeConfig(serverKey: string) {
  const s = getServer(serverKey)
  const env: Record<string, string> = {}
  for (const key of Object.keys(s.envVars)) {
    const id = key.toLowerCase().replace(/_/g, '-')
    env[key] = '${input:' + id + '}'
  }
  return { type: 'stdio', command: s.installCommand, args: [s.packageName], env }
}

function generateVSCodeDeeplink(serverKey: string, scheme: string): string {
  const inputs = encodeURIComponent(JSON.stringify(generateVSCodeInputs(serverKey)))
  const config = encodeURIComponent(JSON.stringify(generateVSCodeConfig(serverKey)))
  const s = getServer(serverKey)
  if (scheme === 'vscode-insiders') {
    return `${scheme}://mcp/install?name=${s.packageName}&inputs=${inputs}&config=${config}`
  }
  return `https://insiders.vscode.dev/redirect/mcp/install?name=${s.packageName}&inputs=${inputs}&config=${config}`
}

function generateConfigJson(serverKey: string): string {
  const s = getServer(serverKey)
  const env: Record<string, string> = {}
  for (const [key, val] of Object.entries(s.envVars)) {
    env[key] = val.placeholder || val.default || ''
  }
  const obj = {
    mcpServers: {
      [s.shortName]: { command: s.installCommand, args: [s.packageName], env },
    },
  }
  return JSON.stringify(obj, null, 2)
}

function generateClaudeCommand(serverKey: string): string {
  const s = getServer(serverKey)
  return `claude mcp add ${s.shortName} -- ${s.installCommand} ${s.packageName}`
}

// ── Client Card Data ────────────────────────────────────────────────

interface ClientCard {
  name: string
  iconUrl: string
  iconBg: string
  actionType: 'link' | 'modal'
  actionText: string
  href?: string
  modalTitle?: string
  modalCode?: string
  modalDesc?: string
}

function getClientCards(serverKey: string): ClientCard[] {
  const s = getServer(serverKey)
  return [
    {
      name: 'VS Code',
      iconUrl:
        'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg',
      iconBg: '',
      actionType: 'link',
      actionText: 'Install',
      href: generateVSCodeDeeplink(serverKey, 'vscode'),
    },
    {
      name: 'Cursor',
      iconUrl: 'https://cdn.simpleicons.org/cursor/ffffff',
      iconBg: '#000',
      actionType: 'link',
      actionText: 'Install',
      href: generateCursorDeeplink(serverKey),
    },
    {
      name: 'Claude Code',
      iconUrl: 'https://cdn.simpleicons.org/claude/ffffff',
      iconBg: '#d97757',
      actionType: 'modal',
      actionText: 'Guide',
      modalTitle: `${s.displayName} for Claude Code`,
      modalCode: generateClaudeCommand(serverKey),
      modalDesc: 'Run this command in your terminal:',
    },
    {
      name: 'Windsurf',
      iconUrl: 'https://cdn.simpleicons.org/windsurf/000000',
      iconBg: '',
      actionType: 'modal',
      actionText: 'Guide',
      modalTitle: `${s.displayName} for Windsurf`,
      modalCode: generateConfigJson(serverKey),
      modalDesc: 'Add this to ~/.codeium/windsurf/mcp_config.json:',
    },
    {
      name: 'IntelliJ',
      iconUrl: 'https://cdn.simpleicons.org/intellijidea/ffffff',
      iconBg: '#000',
      actionType: 'modal',
      actionText: 'Guide',
      modalTitle: `${s.displayName} for IntelliJ`,
      modalCode: generateConfigJson(serverKey),
      modalDesc: 'Add this to Settings | Tools | MCP Servers:',
    },
    {
      name: 'Claude Desktop',
      iconUrl: 'https://cdn.simpleicons.org/claude/ffffff',
      iconBg: '#d97757',
      actionType: 'modal',
      actionText: 'Guide',
      modalTitle: `${s.displayName} for Claude Desktop`,
      modalCode: generateConfigJson(serverKey),
      modalDesc: 'Add this to Settings > MCP Servers, or claude_desktop_config.json:',
    },
  ]
}

// ── Modal Component ─────────────────────────────────────────────────

function InstallModal({
  title,
  description,
  code,
  onClose,
}: {
  title: string
  description: string
  code: string
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return createPortal(
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6'
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='bg-background border rounded-xl w-full max-w-[600px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between mb-5'>
          <h3 className='text-lg font-semibold'>{title}</h3>
          <Button variant='ghost' size='sm' onClick={onClose} aria-label='Close'>
            <X className='h-4 w-4' />
          </Button>
        </div>
        <p className='text-sm text-muted-foreground mb-3'>{description}</p>
        <pre className='bg-muted border rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre mb-6'>
          {code}
        </pre>
        <Button onClick={handleCopy} className='gap-2'>
          {copied ? (
            <>
              <Check className='h-4 w-4' />
              Copied!
            </>
          ) : (
            <>
              <Copy className='h-4 w-4' />
              Copy to clipboard
            </>
          )}
        </Button>
      </div>
    </div>,
    document.body
  )
}

// ── Server Section (expanded inline) ────────────────────────────────

function ServerSection({
  serverKey,
  autoExpand = false,
  installTarget,
}: {
  serverKey: string
  autoExpand?: boolean
  installTarget?: string | null
}) {
  const server = SERVERS[serverKey]
  const clients = useMemo(() => getClientCards(serverKey), [serverKey])

  // Map install param to client name
  const installClientMap: Record<string, string> = {
    cursor: 'Cursor',
    vscode: 'VS Code',
    'vscode-insiders': 'VS Code',
    claude: 'Claude Code',
    'claude-code': 'Claude Code',
    'claude-desktop': 'Claude Desktop',
    windsurf: 'Windsurf',
    intellij: 'IntelliJ',
  }

  // Compute initial modal state from URL params
  const initialModal = useMemo(() => {
    if (!autoExpand || !installTarget) return null
    const targetName = installClientMap[installTarget.toLowerCase()]
    if (!targetName) return null
    const client = clients.find(c => c.name === targetName)
    if (!client || client.actionType !== 'modal') return null
    return {
      title: client.modalTitle!,
      description: client.modalDesc!,
      code: client.modalCode!,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoExpand, installTarget, serverKey])

  const [modal, setModal] = useState<{
    title: string
    description: string
    code: string
  } | null>(initialModal)
  const [expanded, setExpanded] = useState(autoExpand)

  // Auto-redirect for link-based installs (cursor, vscode)
  useEffect(() => {
    if (!autoExpand || !installTarget) return
    const targetName = installClientMap[installTarget.toLowerCase()]
    if (!targetName) return
    const client = clients.find(c => c.name === targetName)
    if (!client || client.actionType !== 'link' || !client.href) return

    const timer = setTimeout(() => {
      window.location.href = client.href!
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoExpand, installTarget, serverKey])

  if (!server) return null

  return (
    <div className='border rounded-xl overflow-hidden'>
      {/* Server header — always visible */}
      <button
        className='w-full flex items-center gap-4 p-5 text-left hover:bg-muted/30 transition-colors cursor-pointer bg-transparent border-none'
        onClick={() => setExpanded(!expanded)}
      >
        <div className='h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 p-2'>
          <img
            src='https://cdn.simpleicons.org/modelcontextprotocol/000000'
            alt={server.displayName}
            className='w-full h-full object-contain dark:invert'
          />
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <h3 className='font-semibold'>{server.fullName}</h3>
            <code className='text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded hidden sm:inline'>
              {server.packageName}
            </code>
          </div>
          <p className='text-sm text-muted-foreground line-clamp-1'>{server.description}</p>
        </div>
        <div className='flex items-center gap-2 flex-shrink-0'>
          <span className='text-xs text-muted-foreground hidden sm:inline'>
            {clients.length} clients
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Expanded: client install options */}
      {expanded && (
        <div className='border-t px-5 py-4'>
          {/* Links row */}
          <div className='flex gap-3 text-xs mb-4'>
            <a
              href={`https://github.com/${server.githubRepo}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1'
            >
              GitHub <ExternalLink className='h-3 w-3' />
            </a>
            <a
              href={`https://pypi.org/project/${server.pypiPackage}/`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1'
            >
              PyPI <ExternalLink className='h-3 w-3' />
            </a>
          </div>

          {/* Client grid — compact pills */}
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2'>
            {clients.map(client => (
              <div key={client.name}>
                {client.actionType === 'link' ? (
                  <a
                    href={client.href}
                    className='flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm hover:bg-muted/50 hover:border-primary/30 transition-all group'
                  >
                    <div
                      className={`h-6 w-6 rounded flex items-center justify-center flex-shrink-0 ${!client.iconBg ? 'bg-muted' : ''}`}
                      style={client.iconBg ? { background: client.iconBg } : undefined}
                    >
                      <img
                        src={client.iconUrl}
                        alt={client.name}
                        className='w-4 h-4 object-contain'
                      />
                    </div>
                    <div className='min-w-0'>
                      <span className='font-medium text-xs block truncate'>{client.name}</span>
                      <span className='text-[10px] text-primary'>{client.actionText}</span>
                    </div>
                  </a>
                ) : (
                  <button
                    onClick={() =>
                      setModal({
                        title: client.modalTitle!,
                        description: client.modalDesc!,
                        code: client.modalCode!,
                      })
                    }
                    className='flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm hover:bg-muted/50 hover:border-primary/30 transition-all group w-full text-left cursor-pointer bg-transparent'
                  >
                    <div
                      className={`h-6 w-6 rounded flex items-center justify-center flex-shrink-0 ${!client.iconBg ? 'bg-muted' : ''}`}
                      style={client.iconBg ? { background: client.iconBg } : undefined}
                    >
                      <img
                        src={client.iconUrl}
                        alt={client.name}
                        className='w-4 h-4 object-contain'
                      />
                    </div>
                    <div className='min-w-0'>
                      <span className='font-medium text-xs block truncate'>{client.name}</span>
                      <span className='text-[10px] text-primary'>{client.actionText}</span>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {modal && (
        <InstallModal
          title={modal.title}
          description={modal.description}
          code={modal.code}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

// ── Main Page Component ─────────────────────────────────────────────

export default function McpInstall() {
  const [searchParams] = useSearchParams()
  const targetServer = searchParams.get('server')
  const installTarget = searchParams.get('install')

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl'>
      {/* Hero */}
      <section className='mb-10'>
        <p className='text-xs font-semibold uppercase tracking-widest text-primary mb-2'>
          MCP Client Tools
        </p>
        <h1 className='text-3xl sm:text-4xl font-bold tracking-tight mb-3'>
          MCP Installation Gateway
        </h1>
        <p className='text-lg text-muted-foreground max-w-2xl'>
          One-click installation for MCP servers. Connect to VS Code, Cursor, Claude, Windsurf, and
          IntelliJ.
        </p>
      </section>

      {/* All servers — accordion style */}
      <section className='space-y-3'>
        {Object.keys(SERVERS).map(key => (
          <ServerSection
            key={key}
            serverKey={key}
            autoExpand={targetServer === key}
            installTarget={targetServer === key ? installTarget : null}
          />
        ))}
      </section>
    </div>
  )
}
