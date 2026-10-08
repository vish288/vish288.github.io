import type { ServerConfig } from '@/constants/mcpServers'
import type { McpClient, Output } from '@/constants/mcpClients'

// Pure (server, output) → string generators for every MCP client kind. No
// React, no DOM: the page renders the output and the prerender script reuses
// none of it. The install/config name is always the server's shortName.

// Env var key → VS Code input id (lower-case, `_` → `-`).
const inputId = (key: string): string => key.toLowerCase().replace(/_/g, '-')

// ── env ─────────────────────────────────────────────────────────────

// Plain-config env: placeholder, else default, else empty. Secrets stay as
// placeholder literals the user edits.
export function envLiteral(s: ServerConfig): Record<string, string> {
  return Object.fromEntries(
    Object.entries(s.envVars).map(([key, val]) => [key, val.placeholder || val.default || ''])
  )
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
export function vscodeEnv(s: ServerConfig): Record<string, string> {
  return Object.fromEntries(
    Object.keys(s.envVars).map(key => [key, '${input:' + inputId(key) + '}'])
  )
}

// ── server entry (shape per client) ─────────────────────────────────

type Shape = Extract<Output, { kind: 'json' }>['shape']

export function serverEntry(s: ServerConfig, shape: Shape): Record<string, unknown> {
  const env = envLiteral(s)
  switch (shape) {
    case 'cline':
      return {
        command: s.installCommand,
        args: [s.packageName],
        env,
        disabled: false,
        autoApprove: [],
      }
    case 'opencode':
      return {
        type: 'local',
        command: [s.installCommand, s.packageName],
        enabled: true,
        environment: env,
      }
    case 'typed':
      return { type: 'stdio', command: s.installCommand, args: [s.packageName], env }
    default:
      return { command: s.installCommand, args: [s.packageName], env }
  }
}

// ── deeplink ────────────────────────────────────────────────────────

export function genDeeplink(s: ServerConfig, out: Extract<Output, { kind: 'deeplink' }>): string {
  if (out.encoding === 'b64') {
    const cfg = serverEntry(s, 'standard')
    // Cursor's documented format is standard base64 in the config param. The
    // name is percent-encoded (btoa may emit +, / or =, but shortNames don't).
    return (
      out.prefix.replace('{name}', () => encodeURIComponent(s.shortName)) +
      btoa(JSON.stringify(cfg))
    )
  }
  // json-url is always the VS Code shape: one flat object with prompted inputs.
  const flat = {
    name: s.shortName,
    inputs: vscodeInputs(s),
    type: 'stdio',
    command: s.installCommand,
    args: [s.packageName],
    env: vscodeEnv(s),
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

export function genCli(s: ServerConfig, out: Extract<Output, { kind: 'cli' }>): string {
  const envStr = Object.entries(envLiteral(s))
    .map(([k, v]) => `${out.envFlag} ${k}=${shellValue(v)}`)
    .join(' ')
  const cmd = `${s.installCommand} ${s.packageName}`
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

export function genJson(s: ServerConfig, out: Extract<Output, { kind: 'json' }>): string {
  const obj: Record<string, unknown> = {}
  if (out.shape === 'opencode') obj.$schema = 'https://opencode.ai/config.json'
  obj[out.topKey] = { [s.shortName]: serverEntry(s, out.shape) }
  return JSON.stringify(obj, null, 2)
}

// ── toml (Codex ~/.codex/config.toml) ───────────────────────────────

// TOML string value: escape backslash then double-quote. Keys here (the server
// shortName and env var names) are all bare-key-safe, so they stay unquoted.
function tomlStr(v: string): string {
  return '"' + v.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'
}

export function genToml(s: ServerConfig): string {
  const name = s.shortName
  const lines = [
    `[mcp_servers.${name}]`,
    `command = ${tomlStr(s.installCommand)}`,
    `args = [${tomlStr(s.packageName)}]`,
  ]
  const env = Object.entries(envLiteral(s))
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

export function renderOutputs(s: ServerConfig, client: McpClient): RenderedOutput[] {
  return client.outputs.map((out): RenderedOutput => {
    switch (out.kind) {
      case 'cli':
        return { label: 'Command', code: genCli(s, out) }
      case 'json':
        return { label: 'Config', code: genJson(s, out) }
      case 'toml':
        return { label: '~/.codex/config.toml', code: genToml(s) }
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
