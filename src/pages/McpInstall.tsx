import { useState, useEffect, useCallback, useMemo, useRef, type Ref } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ExternalLink, Blocks } from 'lucide-react'
import SimpleIcon from '@/components/icons/SimpleIcon'
import { InstallModal } from '@/components/InstallModal'
import { PypiDownloads } from '@/components/PypiDownloads'
import { SERVERS, type ServerConfig } from '@/constants/mcpServers'
import { CLIENTS, SECTIONS, resolveClient, type McpClient } from '@/constants/mcpClients'
import { genDeeplink } from '@/lib/mcpInstall'

const STORAGE_KEY = 'mcp-client'

// ── Per-client helpers ──────────────────────────────────────────────

// Clients without a one-click deeplink (they install via a copied config or
// command). Derived from the catalogue so the intro count never drifts.
const CONFIG_CLIENT_COUNT = CLIENTS.filter(c => c.outputs[0]?.kind !== 'deeplink').length

// A deeplink client's single output, or null for config/command clients.
function deeplinkOutput(client: McpClient) {
  const o = client.outputs[0]
  return o && o.kind === 'deeplink' ? o : null
}

// Visible action word by the primary output kind (also the first word of the
// row action's accessible name, so WCAG 2.5.3 holds).
function actionWord(client: McpClient): string {
  const kind = client.outputs[0]?.kind
  if (kind === 'deeplink') return 'Install'
  if (kind === 'cli') return 'Command'
  return 'Config'
}

function deeplinkHref(server: ServerConfig, client: McpClient): string | undefined {
  const o = deeplinkOutput(client)
  return o ? genDeeplink(server, o) : undefined
}

// localStorage client on load; null on the server (SSR shows the open picker).
function readStoredClient(): McpClient | null {
  if (typeof window === 'undefined') return null
  try {
    return resolveClient(localStorage.getItem(STORAGE_KEY) ?? '')
  } catch {
    // Storage can throw (disabled cookies, sandboxed iframe).
    return null
  }
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

// ── Client picker (one native radio group) ──────────────────────────

function ClientPicker({
  value,
  onChange,
  onCommit,
  onEscape,
  legend,
  fieldsetRef,
}: {
  value: McpClient | null
  onChange: (client: McpClient) => void
  // Deliberate commit (click, Enter/Space): collapse and move focus to Change.
  onCommit: () => void
  // Escape while reopened: collapse and restore focus to Change.
  onEscape: () => void
  legend: string
  fieldsetRef: Ref<HTMLFieldSetElement>
}) {
  return (
    <fieldset
      id='client-picker'
      ref={fieldsetRef}
      // No collapse-on-blur: clicking an sr-only radio's label fires a transient
      // focusout to an element outside the fieldset BEFORE the click reaches the
      // new radio, so a blur-collapse here tears the picker down and discards the
      // re-pick (every pick after the first would be lost). Collapse only on a
      // deliberate commit (click / Enter / Space / Escape), handled below.
      onKeyDown={e => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onEscape()
        } else if ((e.key === 'Enter' || e.key === ' ') && value) {
          onCommit()
        }
      }}
      className='min-w-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2'
    >
      <legend className='col-span-full text-base font-medium mb-3'>{legend}</legend>
      {SECTIONS.map((section, i) => (
        <div key={section} className='contents'>
          <p
            className={`col-span-full text-xs uppercase tracking-widest text-muted-foreground ${i === 0 ? '' : 'mt-2'}`}
          >
            {section}
          </p>
          {CLIENTS.filter(c => c.section === section).map(client => (
            <div key={client.id} className='relative'>
              <input
                id={`client-${client.id}`}
                type='radio'
                name='mcp-client'
                value={client.id}
                checked={value?.id === client.id}
                onChange={() => onChange(client)}
                // Commit only on a genuine pointer click (detail > 0); keyboard
                // navigation synthesises a click with detail 0, which must not
                // collapse the picker. Enter/Space are handled on keydown.
                onClick={e => {
                  if (e.detail > 0) onCommit()
                }}
                className='sr-only peer'
              />
              <label
                htmlFor={`client-${client.id}`}
                className='touch-target flex items-center gap-2 rounded border px-3 py-2.5 text-sm cursor-pointer transition-all hover:bg-muted/50 hover:border-primary/30 peer-checked:border-primary peer-checked:bg-muted/50 peer-focus-visible:ring-2 peer-focus-visible:ring-ring'
              >
                <ClientIcon client={client} />
                <span className='font-medium min-w-0 truncate'>{client.name}</span>
              </label>
            </div>
          ))}
        </div>
      ))}
    </fieldset>
  )
}

// ── Server row ──────────────────────────────────────────────────────

function ServerRow({
  server,
  client,
  current = false,
  onOpen,
  headingRef,
  liRef,
}: {
  server: ServerConfig
  client: McpClient | null
  current?: boolean
  onOpen: (server: ServerConfig) => void
  headingRef?: Ref<HTMLHeadingElement>
  liRef?: Ref<HTMLLIElement>
}) {
  const href = client ? deeplinkHref(server, client) : undefined
  const linkClass =
    'touch-target px-2 -mx-2 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors'

  let action = null
  if (client) {
    if (href) {
      action = (
        <a
          href={href}
          aria-label={`Install ${server.displayName} for ${client.name}`}
          className='touch-target sm:ml-auto inline-flex items-center justify-center rounded bg-primary text-primary-foreground text-sm font-medium px-4 h-9 hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          Install
        </a>
      )
    } else {
      const word = actionWord(client)
      action = (
        <button
          type='button'
          onClick={() => onOpen(server)}
          aria-label={`${word}: ${server.displayName} for ${client.name}`}
          className='touch-target sm:ml-auto inline-flex items-center justify-center rounded bg-primary text-primary-foreground text-sm font-medium px-4 h-9 cursor-pointer hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          {word}
        </button>
      )
    }
  }

  return (
    <li
      ref={liRef}
      aria-current={current ? 'true' : undefined}
      className={`border rounded p-5 scroll-mt-20 ${current ? 'border-l-4 border-l-primary' : ''}`}
    >
      <div className='flex flex-wrap items-center gap-2'>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className='font-semibold outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-ring'
        >
          {server.fullName}
        </h2>
        <code className='text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded'>
          {server.packageName}
        </code>
      </div>
      <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>{server.description}</p>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-xs mt-3'>
        <a
          href={`https://github.com/${server.githubRepo}`}
          target='_blank'
          rel='noopener noreferrer'
          className={linkClass}
        >
          GitHub <ExternalLink aria-hidden='true' className='h-3 w-3' />
        </a>
        <a
          href={`https://pypi.org/project/${server.pypiPackage}/`}
          target='_blank'
          rel='noopener noreferrer'
          className={linkClass}
        >
          PyPI <ExternalLink aria-hidden='true' className='h-3 w-3' />
        </a>
        {action}
      </div>
    </li>
  )
}

// ── Page ────────────────────────────────────────────────────────────

export default function McpInstall() {
  const [searchParams, setSearchParams] = useSearchParams()
  const serverParam = searchParams.get('server')
  const clientParam = searchParams.get('client')
  const installParam = searchParams.get('install')

  // hasOwnProperty, not truthiness: a bare `SERVERS[serverParam]` is also truthy
  // for prototype keys like "constructor", which would later throw in genDeeplink.
  const targetKey =
    serverParam && Object.prototype.hasOwnProperty.call(SERVERS, serverParam) ? serverParam : null
  const installClient = useMemo(
    () => (installParam ? resolveClient(installParam) : null),
    [installParam]
  )

  const resolveInitial = () =>
    installClient ?? (clientParam ? resolveClient(clientParam) : null) ?? readStoredClient()
  const [client, setClient] = useState<McpClient | null>(resolveInitial)
  // Picker is open when there is no client yet; collapses to a summary once set.
  const [pickerOpen, setPickerOpen] = useState(() => resolveInitial() === null)
  const [modalServer, setModalServer] = useState<ServerConfig | null>(() =>
    targetKey && installClient && !deeplinkOutput(installClient) ? SERVERS[targetKey]! : null
  )

  const fieldsetRef = useRef<HTMLFieldSetElement>(null)
  const changeRef = useRef<HTMLButtonElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const targetLiRef = useRef<HTMLLIElement>(null)
  const justPicked = useRef(false)
  // Mount-time captures: whether a client and/or a modal existed at first render.
  const hadClientAtMount = useRef(client !== null)
  const modalAtMount = useRef(modalServer !== null)
  const mountTargetKey = useRef(targetKey)

  // A README install link is a strong signal: remember the client (D4).
  useEffect(() => {
    if (installClient) {
      try {
        localStorage.setItem(STORAGE_KEY, installClient.id)
      } catch {
        /* storage can be unavailable (private mode) */
      }
    }
  }, [installClient])

  // Auto-redirect for link-based installs (deeplink clients), lifted from the
  // old per-section effect and keyed on the resolved target.
  useEffect(() => {
    if (!targetKey || !installClient) return
    const o = deeplinkOutput(installClient)
    if (!o) return
    const href = genDeeplink(SERVERS[targetKey]!, o)
    const timer = setTimeout(() => {
      window.location.href = href
    }, 400)
    return () => clearTimeout(timer)
  }, [targetKey, installClient])

  // Deep link that arrived WITH a client (and no modal): scroll the target row
  // into view and focus its heading, once at mount only — never on a later pick.
  // Scroll the <li> so its scroll-mt-20 clears the sticky header; focus the <h2>.
  // jsdom lacks scrollIntoView, hence the optional call.
  useEffect(() => {
    if (mountTargetKey.current && hadClientAtMount.current && !modalAtMount.current) {
      targetLiRef.current?.scrollIntoView?.({ block: 'start' })
      headingRef.current?.focus()
    }
  }, [])

  // A modal opened straight from ?install= has no trigger button to restore to,
  // so return focus to the target heading when it closes.
  useEffect(() => {
    if (modalServer === null && modalAtMount.current) {
      modalAtMount.current = false
      headingRef.current?.focus()
    }
  }, [modalServer])

  // Move focus to the checked radio when the picker is reopened via Change.
  useEffect(() => {
    if (pickerOpen) {
      fieldsetRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus()
    }
  }, [pickerOpen])

  // After a commit, return focus to the summary Change button.
  useEffect(() => {
    if (justPicked.current && changeRef.current) {
      changeRef.current.focus()
      justPicked.current = false
    }
  })

  // Persist the choice on every change (including arrow-key navigation) WITHOUT
  // collapsing the picker.
  const pick = useCallback(
    (c: McpClient) => {
      setClient(c)
      try {
        localStorage.setItem(STORAGE_KEY, c.id)
      } catch {
        /* storage can be unavailable (private mode) */
      }
      const next = new URLSearchParams(searchParams)
      next.set('client', c.id)
      next.delete('install')
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams]
  )

  // A click/Enter/Space on a radio is a deliberate pick: collapse and focus
  // Change. Unconditional — the same interaction also selects a client.
  const commitPicker = useCallback(() => {
    setPickerOpen(false)
    justPicked.current = true
  }, [])

  const escapePicker = useCallback(() => {
    if (client) {
      setPickerOpen(false)
      changeRef.current?.focus()
    }
  }, [client])

  const closeModal = useCallback(() => setModalServer(null), [])

  const serverKeys = Object.keys(SERVERS)
  const otherKeys = targetKey ? serverKeys.filter(k => k !== targetKey) : []

  const legend = targetKey
    ? `Install ${SERVERS[targetKey]!.fullName}: which client do you use?`
    : 'Which client do you use?'

  const showPicker = pickerOpen

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl'>
      <section className='mb-10'>
        <p className='text-xs font-semibold uppercase tracking-widest text-link mb-2'>
          MCP Client Tools
        </p>
        <h1 className='text-3xl sm:text-4xl font-bold tracking-tight mb-3'>
          Install an MCP server
        </h1>
        <p className='text-lg text-muted-foreground max-w-2xl'>
          Pick your client once, then install any server. VS Code, VS Code Insiders and Cursor
          install in one click; the other {CONFIG_CLIENT_COUNT} clients get a config or command.
        </p>
        <PypiDownloads className='mt-3' />
      </section>

      <section className='mb-8'>
        {client && (
          <div className='flex items-center gap-3 mb-4'>
            <ClientIcon client={client} />
            <span className='font-medium'>Client: {client.name}</span>
            <button
              type='button'
              ref={changeRef}
              onClick={() => setPickerOpen(o => !o)}
              aria-expanded={pickerOpen}
              aria-controls={pickerOpen ? 'client-picker' : undefined}
              className='text-sm text-link hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded'
            >
              Change
            </button>
          </div>
        )}
        {showPicker && (
          <ClientPicker
            value={client}
            onChange={pick}
            onCommit={commitPicker}
            onEscape={escapePicker}
            legend={legend}
            fieldsetRef={fieldsetRef}
          />
        )}
      </section>

      <section>
        <ul className='space-y-3'>
          {targetKey ? (
            <ServerRow
              server={SERVERS[targetKey]!}
              client={client}
              current
              onOpen={setModalServer}
              headingRef={headingRef}
              liRef={targetLiRef}
            />
          ) : (
            serverKeys.map(key => (
              <ServerRow key={key} server={SERVERS[key]!} client={client} onOpen={setModalServer} />
            ))
          )}
        </ul>

        {targetKey && (
          <details className='mt-3 border rounded p-4'>
            <summary className='cursor-pointer text-sm font-medium'>
              Other servers ({otherKeys.length})
            </summary>
            <ul className='space-y-3 mt-3'>
              {otherKeys.map(key => (
                <ServerRow
                  key={key}
                  server={SERVERS[key]!}
                  client={client}
                  onOpen={setModalServer}
                />
              ))}
            </ul>
          </details>
        )}
      </section>

      {modalServer && client && (
        <InstallModal server={modalServer} client={client} onClose={closeModal} />
      )}
    </div>
  )
}
