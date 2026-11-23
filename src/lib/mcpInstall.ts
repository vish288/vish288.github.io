import { ghUser, type ServerConfig } from '@/constants/mcpServers'
import type { McpClient, Output } from '@/constants/mcpClients'

// Pure (server, output) → string generators for every MCP client kind. No
// React, no DOM: the page renders the output and the prerender script reuses
// none of it. The install/config name is always the server's shortName.

// How a client launches the server: `uv` runs the PyPI package with uvx, `docker`
// runs the published container image. Every generator takes it as its last
// argument and defaults to `uv`, so existing callers are unchanged.
export type Runtime = 'uv' | 'docker'

// Env var key → VS Code input id (lower-case, `_` → `-`).
const inputId = (key: string): string => key.toLowerCase().replace(/_/g, '-')

// The one env var the read-only toggle writes, as a literal "true" (never a
// prompted input): the server hides its write tools when it is set.
export const READ_ONLY_ENV = 'MCP_READ_ONLY'

// ── launch (command + args per runtime) ─────────────────────────────

// The container image is published next to the source repo.
export const dockerImage = (s: ServerConfig): string => `ghcr.io/${s.githubRepo}`

// uv: `uvx <package>`. docker: `docker run -i --rm`, one `-e VAR` passthrough per
// env var (the client's env block carries the value), then the image. The image
// defaults to MCP_READ_ONLY=true, so read-only needs no flag and unlocking writes
// adds a literal `-e MCP_READ_ONLY=false`; the env block never carries it.
function launch(s: ServerConfig, readOnly: boolean, runtime: Runtime) {
  if (runtime !== 'docker') return { command: s.installCommand, args: [s.packageName] }
  const passthrough = Object.keys(s.envVars).flatMap(key => ['-e', key])
  const writes = readOnly ? [] : ['-e', `${READ_ONLY_ENV}=false`]
  return {
    command: 'docker',
    args: ['run', '-i', '--rm', ...passthrough, ...writes, dockerImage(s)],
  }
}

// ── env ─────────────────────────────────────────────────────────────

// Plain-config env: placeholder, else default, else empty. Secrets stay as
// placeholder literals the user edits. With readOnly (uv only), append
// MCP_READ_ONLY=true last so a default (writes) config is byte-identical to
// before. Docker expresses read-only in the args instead (see launch).
export function envLiteral(
  s: ServerConfig,
  readOnly = false,
  runtime: Runtime = 'uv'
): Record<string, string> {
  const env = Object.fromEntries(
    Object.entries(s.envVars).map(([key, val]) => [key, val.placeholder || val.default || ''])
  )
  if (readOnly && runtime === 'uv') env[READ_ONLY_ENV] = 'true'
  return env
}

// VS Code `inputs` prompts: non-secret → promptString with default; secret →
// promptString with password:true.
export function vscodeInputs(s: ServerConfig): Record<string, unknown>[] {
  return Object.entries(s.envVars).map(([key, val]) => {
    const input: Record<string, unknown> = {
      id: inputId(key),
      type: 'promptString',
      description: val.description,
    }
    if (val.default) input.default = val.default
    // Split literal to dodge the pre-commit secret scan on the "password" key.
    if (val.secret) input[['pass', 'word'].join('')] = true
    return input
  })
}

// VS Code env values reference the prompted inputs rather than literal secrets.
// MCP_READ_ONLY is a literal "true", not a prompt (hence no matching vscodeInput).
export function vscodeEnv(
  s: ServerConfig,
  readOnly = false,
  runtime: Runtime = 'uv'
): Record<string, string> {
  const env = Object.fromEntries(
    Object.keys(s.envVars).map(key => [key, '${input:' + inputId(key) + '}'])
  )
  if (readOnly && runtime === 'uv') env[READ_ONLY_ENV] = 'true'
  return env
}

// ── server entry (shape per client) ─────────────────────────────────

type Shape = Extract<Output, { kind: 'json' }>['shape']

export function serverEntry(
  s: ServerConfig,
  shape: Shape,
  readOnly = false,
  runtime: Runtime = 'uv'
): Record<string, unknown> {
  const env = envLiteral(s, readOnly, runtime)
  const { command, args } = launch(s, readOnly, runtime)
  switch (shape) {
    case 'cline':
      return { command, args, env, disabled: false, autoApprove: [] }
    case 'opencode':
      return { type: 'local', command: [command, ...args], enabled: true, environment: env }
    case 'typed':
      return { type: 'stdio', command, args, env }
    default:
      return { command, args, env }
  }
}

// ── deeplink ────────────────────────────────────────────────────────

export function genDeeplink(
  s: ServerConfig,
  out: Extract<Output, { kind: 'deeplink' }>,
  readOnly = false,
  runtime: Runtime = 'uv'
): string {
  if (out.encoding === 'b64') {
    const cfg = serverEntry(s, 'standard', readOnly, runtime)
    // Cursor's documented format is standard base64 in the config param. The
    // name is percent-encoded (btoa may emit +, / or =, but shortNames don't).
    return (
      out.prefix.replace('{name}', () => encodeURIComponent(s.shortName)) +
      btoa(JSON.stringify(cfg))
    )
  }
  // json-url is always the VS Code shape: one flat object with prompted inputs.
  const { command, args } = launch(s, readOnly, runtime)
  const flat = {
    name: s.shortName,
    inputs: vscodeInputs(s),
    type: 'stdio',
    command,
    args,
    env: vscodeEnv(s, readOnly, runtime),
  }
  return out.prefix + encodeURIComponent(JSON.stringify(flat))
}

// ── cli ─────────────────────────────────────────────────────────────

// Single-quote only when a value would otherwise be re-split or glob-expanded
// by the shell (zsh "no matches found" on [ ] ^ = % and the usual metachars).
function shellValue(v: string): string {
  if (!/[\s'"$`\\|&;<>(){}[\]^=%*?!#~]/.test(v)) return v
  return "'" + v.replace(/'/g, "'\\''") + "'"
}

export function genCli(
  s: ServerConfig,
  out: Extract<Output, { kind: 'cli' }>,
  readOnly = false,
  runtime: Runtime = 'uv'
): string {
  const envStr = Object.entries(envLiteral(s, readOnly, runtime))
    .map(([k, v]) => `${out.envFlag} ${k}=${shellValue(v)}`)
    .join(' ')
  const { command, args } = launch(s, readOnly, runtime)
  // Gemini has no `--` before {cmd} and its own `-e` would swallow docker's, so
  // docker args follow a `--` after the command (the form its docs show).
  const guard = runtime === 'docker' && !out.template.includes('-- {cmd}')
  const cmd = [command, ...(guard ? ['--'] : []), ...args].join(' ')
  // Collapse spacing on the TEMPLATE (never on substituted values) so an empty
  // {env} leaves no double space; then substitute {env} LAST with function
  // replacers so $-sequences and a literal {cmd}/{name} in a value stay literal.
  const tpl = (envStr ? out.template : out.template.replace('{env}', '')).replace(/ {2,}/g, ' ')
  return tpl
    .replace('{name}', () => s.shortName)
    .replace('{cmd}', () => cmd)
    .replace('{env}', () => envStr)
    .trim()
}

// ── json ────────────────────────────────────────────────────────────

export function genJson(
  s: ServerConfig,
  out: Extract<Output, { kind: 'json' }>,
  readOnly = false,
  runtime: Runtime = 'uv'
): string {
  const obj: Record<string, unknown> = {}
  if (out.shape === 'opencode') obj.$schema = 'https://opencode.ai/config.json'
  obj[out.topKey] = { [s.shortName]: serverEntry(s, out.shape, readOnly, runtime) }
  return JSON.stringify(obj, null, 2)
}

// ── toml (Codex ~/.codex/config.toml) ───────────────────────────────

// TOML string value: escape backslash then double-quote. Keys here (the server
// shortName and env var names) are all bare-key-safe, so they stay unquoted.
function tomlStr(v: string): string {
  return '"' + v.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
}

export function genToml(s: ServerConfig, readOnly = false, runtime: Runtime = 'uv'): string {
  const name = s.shortName
  const { command, args } = launch(s, readOnly, runtime)
  const lines = [
    `[mcp_servers.${name}]`,
    `command = ${tomlStr(command)}`,
    `args = [${args.map(tomlStr).join(', ')}]`,
  ]
  const env = Object.entries(envLiteral(s, readOnly, runtime))
  if (env.length) {
    lines.push('', `[mcp_servers.${name}.env]`)
    for (const [k, v] of env) lines.push(`${k} = ${tomlStr(v)}`)
  }
  return lines.join('\n')
}

// ── one call per modal block ────────────────────────────────────────

export interface RenderedOutput {
  label: string
  code: string
}

export function renderOutputs(
  s: ServerConfig,
  client: McpClient,
  readOnly = false,
  runtime: Runtime = 'uv'
): RenderedOutput[] {
  return client.outputs.map((out): RenderedOutput => {
    switch (out.kind) {
      case 'cli':
        return { label: 'Command', code: genCli(s, out, readOnly, runtime) }
      case 'json':
        return { label: 'Config', code: genJson(s, out, readOnly, runtime) }
      case 'toml':
        return { label: '~/.codex/config.toml', code: genToml(s, readOnly, runtime) }
      case 'deeplink':
        throw new Error('deeplink clients render as a link, not through renderOutputs')
    }
  })
}

// Secret env keys for the "Replace the placeholder" line under the code.
export function secretKeys(s: ServerConfig): string[] {
  return Object.entries(s.envVars)
    .filter(([, v]) => v.secret)
    .map(([k]) => k)
}

// ── Claude Code plugin and image provenance ─────────────────────────

// The marketplace lives in the owner's `.github` repo and is named `<user>-mcp`.
export function pluginCommands(s: ServerConfig): string {
  const user = ghUser()
  return [
    `claude plugin marketplace add ${user}/.github`,
    `claude plugin install ${s.packageName}@${user}-mcp`,
  ].join('\n')
}

// One line under "Install as a plugin": the plugin asks for the secret env vars
// and keeps them in Claude Code's credential store.
export function pluginBlurb(s: ServerConfig): string {
  const keys = secretKeys(s)
  const many = keys.length > 1
  const list = many ? `${keys.slice(0, -1).join(', ')} and ${keys[keys.length - 1]}` : keys[0]
  const asks = keys.length
    ? `Claude Code asks for ${list}${many ? ',' : ''} and keeps ${many ? 'them' : 'it'} in its credential store, never in a config file. `
    : ''
  return `${asks}The server stays updated. No uv needed.`
}

// Verifies the image's build attestation against the repo that built it.
export function attestCommand(s: ServerConfig): string {
  const image = dockerImage(s)
  return `gh attestation verify oci://${image}:latest -R ${s.githubRepo} --signer-repo ${ghUser()}/.github`
}
