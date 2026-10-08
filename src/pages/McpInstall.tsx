import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { siModelcontextprotocol } from 'simple-icons'
import { Button } from '@/components/ui/button'
import { Copy, Check, X, ExternalLink, ChevronDown, Blocks } from 'lucide-react'
import SimpleIcon from '@/components/icons/SimpleIcon'
import { SERVERS, type ServerConfig } from '@/constants/mcpServers'
import {
  CLIENTS,
  SECTIONS,
  resolveClient,
  type McpClient,
  type Os,
  type Output,
} from '@/constants/mcpClients'
import { genDeeplink, renderOutputs, secretKeys, type RenderedOutput } from '@/lib/mcpInstall'

// ── Per-client helpers ──────────────────────────────────────────────

const OS_LABEL: Record<Os, string> = { mac: 'macOS', linux: 'Linux', win: 'Windows' }

function isDeeplink(client: McpClient): Extract<Output, { kind: 'deeplink' }> | null {
  const o = client.outputs[0]
  return o && o.kind === 'deeplink' ? o : null
}

// Pill action word by the primary output kind.
function actionWord(client: McpClient): string {
  const kind = client.outputs[0]?.kind
  if (kind === 'deeplink') return 'Install'
  if (kind === 'cli') return 'Command'
  return 'Config'
}

function leadLine(client: McpClient): string {
  const o = client.outputs[0]
  if (o?.kind === 'cli') return 'Run this in your terminal.'
  const p = client.paths
  if (p && typeof p === 'object' && 'ui' in p) return `Paste this into ${p.ui}.`
  if (client.merge) return 'Merge this into your existing settings.'
  return 'Add this to the file below.'
}

// File-path rows for the modal <dl>: a string path is one "All" row, a per-OS
// map is one row each. UI-location clients have no file rows.
function pathRows(client: McpClient): [string, string][] | null {
  const p = client.paths
  if (!p) return null
  if (typeof p === 'string') return [['All', p]]
  if ('ui' in p) return null
  return (Object.entries(p) as [Os, string][]).map(([os, v]) => [OS_LABEL[os], v])
}

function copyButtonLabel(count: number, block: RenderedOutput): string {
  if (count === 1) return 'Copy to clipboard'
  return block.label === 'Command' ? 'Copy command' : 'Copy config'
}

function copyAnnouncement(block: RenderedOutput): string {
  return block.label === 'Command' ? 'Command copied' : 'Config copied'
}

function deeplinkHref(server: ServerConfig, client: McpClient): string | undefined {
  const o = isDeeplink(client)
  return o ? genDeeplink(server, o) : undefined
}

// ── Icon tile ───────────────────────────────────────────────────────

function ClientIcon({ client }: { client: McpClient }) {
  return (
    <div
      aria-hidden='true'
      className='h-6 w-6 rounded bg-muted flex items-center justify-center flex-shrink-0 text-foreground'
    >
      {client.icon ? (
        <SimpleIcon icon={client.icon} className='w-4 h-4' decorative />
      ) : client.iconUrl ? (
        <img src={client.iconUrl} alt='' className='w-4 h-4 object-contain' />
      ) : (
        <Blocks className='w-4 h-4' aria-hidden='true' />
      )}
    </div>
  )
}

// ── Modal ───────────────────────────────────────────────────────────

function InstallModal({
  server,
  client,
  onClose,
}: {
  server: ServerConfig
  client: McpClient
  onClose: () => void
}) {
  const blocks = useMemo(() => renderOutputs(server, client), [server, client])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [failedIndex, setFailedIndex] = useState<number | null>(null)
  const [announce, setAnnounce] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopy = useCallback(async (block: RenderedOutput, i: number) => {
    try {
      await navigator.clipboard.writeText(block.code)
      setCopiedIndex(i)
      setFailedIndex(null)
      setAnnounce(copyAnnouncement(block))
      if (resetTimer.current) clearTimeout(resetTimer.current)
      // Clear announce too so copying the same block again re-announces it.
      resetTimer.current = setTimeout(() => {
        setCopiedIndex(null)
        setAnnounce('')
      }, 2000)
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission).
      setFailedIndex(i)
      setAnnounce('Copy failed. Select the text above and copy it manually.')
    }
  }, [])

  // Clear the reset timer on unmount so it can't fire on a gone component.
  useEffect(() => () => clearTimeout(resetTimer.current ?? undefined), [])

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const root = document.getElementById('root')
    if (root) root.setAttribute('inert', '')
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (root) root.removeAttribute('inert')
      trigger?.focus()
    }
  }, [onClose])

  const rows = pathRows(client)
  const secrets = secretKeys(server)
  const notes = client.notes ?? []

  return createPortal(
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6'
      role='dialog'
      aria-modal='true'
      aria-labelledby='install-modal-title'
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='bg-background border rounded-xl w-full max-w-[600px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between mb-5'>
          <h2 id='install-modal-title' className='text-lg font-semibold'>
            {server.displayName} for {client.name}
          </h2>
          <Button ref={closeRef} variant='ghost' size='sm' onClick={onClose} aria-label='Close'>
            <X className='h-4 w-4' />
          </Button>
        </div>

        <p className='text-sm text-muted-foreground mb-3'>{leadLine(client)}</p>

        {rows && (
          <dl className='text-sm mb-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1'>
            {rows.map(([label, path]) => (
              <div key={label} className='contents'>
                <dt className='text-muted-foreground'>{label}</dt>
                <dd>
                  <code className='text-xs bg-muted px-1.5 py-0.5 rounded break-all'>{path}</code>
                </dd>
              </div>
            ))}
          </dl>
        )}

        {blocks.map((block, i) => (
          <div key={block.label} className='mb-4'>
            <p className='text-xs font-medium text-muted-foreground mb-1'>
              <code>{block.label}</code>
            </p>
            <pre className='bg-muted border rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre mb-2'>
              {block.code}
            </pre>
            <Button onClick={() => handleCopy(block, i)} size='sm' className='gap-2'>
              {copiedIndex === i ? (
                <>
                  <Check className='h-4 w-4' />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className='h-4 w-4' />
                  {copyButtonLabel(blocks.length, block)}
                </>
              )}
            </Button>
            {failedIndex === i && (
              <p className='text-xs text-destructive mt-1'>Copy failed — select the text above</p>
            )}
          </div>
        ))}

        {secrets.length > 0 && (
          <p className='text-sm text-muted-foreground mb-3'>
            Secrets: {secrets.join(', ')}. Replace the placeholder before you save.
          </p>
        )}

        {notes.length > 0 && (
          <ul className='text-xs text-muted-foreground list-disc pl-4 mb-3 space-y-0.5'>
            {notes.map(note => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}

        <a
          href={client.docs}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-primary hover:underline inline-flex items-center gap-1'
        >
          Docs <ExternalLink className='h-3 w-3' />
        </a>

        <p aria-live='polite' className='sr-only'>
          {announce}
        </p>
      </div>
    </div>,
    document.body
  )
}

// ── Client pill ─────────────────────────────────────────────────────

function ClientPill({
  server,
  client,
  onOpen,
}: {
  server: ServerConfig
  client: McpClient
  onOpen: (client: McpClient) => void
}) {
  const href = deeplinkHref(server, client)
  const inner = (
    <>
      <ClientIcon client={client} />
      <div className='min-w-0'>
        <span className='font-medium text-xs block'>{client.name}</span>
        <span className='text-[10px] text-primary'>{actionWord(client)}</span>
      </div>
    </>
  )
  const className =
    'touch-target flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm hover:bg-muted/50 hover:border-primary/30 transition-all w-full text-left cursor-pointer bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return href ? (
    <a href={href} className={className}>
      {inner}
    </a>
  ) : (
    <button onClick={() => onOpen(client)} className={className}>
      {inner}
    </button>
  )
}

// ── Server section ──────────────────────────────────────────────────

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

  const targetClient = useMemo(
    () => (autoExpand && installTarget ? resolveClient(installTarget) : null),
    [autoExpand, installTarget]
  )

  const [modalClient, setModalClient] = useState<McpClient | null>(() =>
    targetClient && !isDeeplink(targetClient) ? targetClient : null
  )
  const [expanded, setExpanded] = useState(true)

  // Auto-redirect for link-based installs (deeplink clients).
  useEffect(() => {
    if (!targetClient || !server) return
    const href = deeplinkHref(server, targetClient)
    if (!href) return
    const timer = setTimeout(() => {
      window.location.href = href
    }, 400)
    return () => clearTimeout(timer)
  }, [targetClient, server])

  if (!server) return null

  return (
    <div className='border rounded-xl overflow-hidden'>
      <h2>
        <button
          className='w-full flex items-center gap-4 p-5 text-left hover:bg-muted/30 transition-colors cursor-pointer bg-transparent border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <div
            aria-hidden='true'
            className='h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-foreground'
          >
            <SimpleIcon icon={siModelcontextprotocol} className='w-5 h-5' decorative />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>{server.fullName}</span>
              <code className='text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded hidden sm:inline'>
                {server.packageName}
              </code>
            </div>
            <p className='text-sm text-muted-foreground line-clamp-1'>{server.description}</p>
          </div>
          <div className='flex items-center gap-2 flex-shrink-0'>
            <span className='text-xs text-muted-foreground hidden sm:inline'>
              {CLIENTS.length} clients
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground motion-safe:transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
      </h2>

      {expanded && (
        <div className='border-t px-5 py-4'>
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

          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2'>
            {SECTIONS.map((section, i) => {
              const inSection = CLIENTS.filter(c => c.section === section)
              return (
                <div key={section} className='contents'>
                  {/* first:mt-0 can't apply: the `contents` wrapper, not the h3,
                      is the grid's first child, so gate the top margin on index. */}
                  <h3
                    className={`col-span-full text-xs uppercase tracking-widest text-muted-foreground ${i === 0 ? '' : 'mt-2'}`}
                  >
                    {section}
                  </h3>
                  {inSection.map(client => (
                    <ClientPill
                      key={client.id}
                      server={server}
                      client={client}
                      onOpen={setModalClient}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {modalClient && (
        <InstallModal server={server} client={modalClient} onClose={() => setModalClient(null)} />
      )}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────

export default function McpInstall() {
  const [searchParams] = useSearchParams()
  const targetServer = searchParams.get('server')
  const installTarget = searchParams.get('install')

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl'>
      <section className='mb-10'>
        <p className='text-xs font-semibold uppercase tracking-widest text-primary mb-2'>
          MCP Client Tools
        </p>
        <h1 className='text-3xl sm:text-4xl font-bold tracking-tight mb-3'>
          MCP Installation Gateway
        </h1>
        <p className='text-lg text-muted-foreground max-w-2xl'>
          Open the server in your editor, or copy a config or command for {CLIENTS.length} MCP
          clients.
        </p>
      </section>

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
