import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Copy, Check, X, ExternalLink } from 'lucide-react'
import { type ServerConfig } from '@/constants/mcpServers'
import { type McpClient, type Os } from '@/constants/mcpClients'
import { renderOutputs, secretKeys, type RenderedOutput } from '@/lib/mcpInstall'

// The per-(server, client) install dialog: uv prerequisite, a stepped <ol>
// (command or config, secrets, check), copy buttons and a polite live region.
// Split out of McpInstall.tsx to keep the page under the size budget (D9).

const OS_LABEL: Record<Os, string> = { mac: 'macOS', linux: 'Linux', win: 'Windows' }

const COPY_FAILED = 'Could not copy. Select the text above and copy it.'

// File-path rows for the modal <dl>: a string path is one "File" row, a per-OS
// map is one row each. UI-location clients have no file rows.
function pathRows(client: McpClient): [string, string][] | null {
  const p = client.paths
  if (!p) return null
  if (typeof p === 'string') return [['File', p]]
  if ('ui' in p) return null
  return (Object.entries(p) as [Os, string][]).map(([os, v]) => [OS_LABEL[os], v])
}

// Name the object copied, for one block or two (so the label never changes
// meaning between the single- and two-block layouts).
function copyButtonLabel(_count: number, block: RenderedOutput): string {
  return block.label === 'Command' ? 'Copy command' : 'Copy config'
}

function copyAnnouncement(block: RenderedOutput): string {
  return block.label === 'Command' ? 'Command copied' : 'Config copied'
}

function CodeBlock({
  block,
  index,
  count,
  copiedIndex,
  failedIndex,
  onCopy,
}: {
  block: RenderedOutput
  index: number
  count: number
  copiedIndex: number | null
  failedIndex: number | null
  onCopy: (block: RenderedOutput, i: number) => void
}) {
  return (
    <div className='mt-2'>
      <pre className='bg-muted border rounded p-4 text-sm font-mono whitespace-pre-wrap [overflow-wrap:anywhere] mb-2'>
        {block.code}
      </pre>
      <Button onClick={() => onCopy(block, index)} size='sm' className='gap-2'>
        {copiedIndex === index ? (
          <>
            <Check className='h-4 w-4' />
            Copied
          </>
        ) : (
          <>
            <Copy className='h-4 w-4' />
            {copyButtonLabel(count, block)}
          </>
        )}
      </Button>
      {failedIndex === index && (
        <p className='text-sm text-destructive font-medium mt-1'>{COPY_FAILED}</p>
      )}
    </div>
  )
}

export function InstallModal({
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
      resetTimer.current = setTimeout(() => {
        setCopiedIndex(null)
        setAnnounce('')
      }, 2000)
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission).
      setFailedIndex(i)
      setCopiedIndex(null)
      setAnnounce(COPY_FAILED)
    }
  }, [])

  useEffect(() => () => clearTimeout(resetTimer.current ?? undefined), [])

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const root = document.getElementById('root')
    if (root) root.setAttribute('inert', '')
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      if (root) root.removeAttribute('inert')
      document.body.style.overflow = prevOverflow
      trigger?.focus()
    }
  }, [onClose])

  const twoBlocks = blocks.length === 2
  const secrets = secretKeys(server)
  const notes = client.notes ?? []
  const rows = pathRows(client)

  // Single-block step 1: heading by output kind + whether to show the file <dl>.
  const out0 = client.outputs[0]
  const paths = client.paths
  let singleHeading = 'Add this to your config'
  let showDl = false
  if (out0?.kind === 'cli') {
    singleHeading = 'Run this command'
  } else if (paths && typeof paths === 'object' && 'ui' in paths) {
    singleHeading = `Paste this into ${paths.ui}`
  } else if (typeof paths === 'string') {
    singleHeading = client.merge ? 'Merge this into the file' : 'Add this to the file'
    showDl = true
  } else if (paths) {
    singleHeading = 'Add this to the file for your OS'
    showDl = true
  }

  const copyProps = { copiedIndex, failedIndex, onCopy: handleCopy }

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
      <div className='bg-background border-2 border-border rounded w-full max-w-[600px] p-8 max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between mb-5'>
          <h2 id='install-modal-title' className='text-lg font-semibold'>
            {server.displayName} for {client.name}
          </h2>
          <Button ref={closeRef} variant='ghost' size='sm' onClick={onClose} aria-label='Close'>
            <X className='h-4 w-4' />
          </Button>
        </div>

        {server.installCommand === 'uvx' && (
          <p className='text-sm text-muted-foreground mb-4'>
            Requires uv.{' '}
            <a
              href='https://docs.astral.sh/uv/getting-started/installation/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-link hover:underline inline-flex items-center gap-1'
            >
              Install uv
              <ExternalLink aria-hidden='true' className='h-3 w-3' />
            </a>
          </p>
        )}

        <ol className='space-y-5 text-sm list-decimal pl-5 marker:text-muted-foreground'>
          <li>
            {twoBlocks ? (
              <>
                <p className='font-medium'>Do one of these</p>
                <div className='mt-2'>
                  <p className='text-muted-foreground'>Option 1: run this command</p>
                  <CodeBlock block={blocks[0]!} index={0} count={2} {...copyProps} />
                </div>
                <div className='mt-4'>
                  <p className='text-muted-foreground'>
                    Option 2: {client.merge ? 'merge this into' : 'add this to'}{' '}
                    <code className='text-xs bg-muted px-1.5 py-0.5 rounded [overflow-wrap:anywhere]'>
                      {typeof client.paths === 'string' ? client.paths : ''}
                    </code>
                  </p>
                  <CodeBlock block={blocks[1]!} index={1} count={2} {...copyProps} />
                </div>
              </>
            ) : (
              <>
                <p className='font-medium'>{singleHeading}</p>
                {showDl && rows && (
                  <dl className='mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1'>
                    {rows.map(([label, path]) => (
                      <div key={label} className='contents'>
                        <dt className='text-muted-foreground'>{label}</dt>
                        <dd>
                          <code className='text-xs bg-muted px-1.5 py-0.5 rounded [overflow-wrap:anywhere]'>
                            {path}
                          </code>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
                <CodeBlock block={blocks[0]!} index={0} count={1} {...copyProps} />
              </>
            )}
          </li>

          {secrets.length > 0 && (
            <li>
              <p className='font-medium'>Replace the placeholder</p>
              <ul className='mt-1 space-y-1 list-none text-muted-foreground'>
                {secrets.map(key => {
                  const v = server.envVars[key]!
                  return (
                    <li key={key}>
                      <code className='text-xs bg-muted px-1.5 py-0.5 rounded'>{key}</code> from{' '}
                      {v.tokenUrl ? (
                        <a
                          href={v.tokenUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-link hover:underline inline-flex items-center gap-1'
                        >
                          {v.tokenLabel}
                          <ExternalLink aria-hidden='true' className='h-3 w-3' />
                        </a>
                      ) : (
                        v.tokenLabel
                      )}
                      {v.tokenHint ? `. ${v.tokenHint}` : '.'}
                    </li>
                  )
                })}
              </ul>
            </li>
          )}

          <li>
            {`Check ${client.name} lists `}
            <code className='text-xs bg-muted px-1.5 py-0.5 rounded'>{server.shortName}</code>
            {' under its MCP servers.'}
            {notes.length > 0 && (
              <ul className='mt-1 list-disc pl-4 space-y-0.5 text-muted-foreground'>
                {notes.map(note => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </li>
        </ol>

        <a
          href={client.docs}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-5 text-sm text-link hover:underline inline-flex items-center gap-1'
        >
          {client.name} MCP docs <ExternalLink aria-hidden='true' className='h-3 w-3' />
        </a>

        <p aria-live='polite' className='sr-only'>
          {announce}
        </p>
      </div>
    </div>,
    document.body
  )
}
