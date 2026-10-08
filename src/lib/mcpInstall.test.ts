import { describe, it, expect } from 'vitest'
import { SERVERS, type ServerConfig } from '@/constants/mcpServers'
import {
  CLIENTS,
  resolveClient,
  SECTIONS,
  type McpClient,
  type Output,
} from '@/constants/mcpClients'
import { ROUTE_META } from '@/constants/routeMeta'
import { genDeeplink, genCli, genToml, renderOutputs } from './mcpInstall'

const gitlab = SERVERS['mcp-gitlab']
const byId = (id: string): McpClient => {
  const c = CLIENTS.find(x => x.id === id)
  if (!c) throw new Error(`no client ${id}`)
  return c
}
const deeplinkOut = (c: McpClient) => c.outputs[0] as Extract<Output, { kind: 'deeplink' }>
const cliOut = (c: McpClient) => c.outputs[0] as Extract<Output, { kind: 'cli' }>

describe('deeplink generators', () => {
  it('Cursor matches the golden string', () => {
    expect(genDeeplink(gitlab, deeplinkOut(byId('cursor')))).toBe(
      'cursor://anysphere.cursor-deeplink/mcp/install?name=gitlab&config=eyJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJtY3AtZ2l0bGFiIl0sImVudiI6eyJHSVRMQUJfVVJMIjoiaHR0cHM6Ly9naXRsYWIuZXhhbXBsZS5jb20iLCJHSVRMQUJfVE9LRU4iOiJnbHBhdC14eHh4eHh4eHh4eHh4eHh4eHh4eCJ9fQ=='
    )
  })

  it('VS Code matches the golden string and decodes to the golden payload', () => {
    const url = genDeeplink(gitlab, deeplinkOut(byId('vscode')))
    expect(url).toBe(
      'vscode:mcp/install?%7B%22name%22%3A%22gitlab%22%2C%22inputs%22%3A%5B%7B%22id%22%3A%22gitlab-url%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22GitLab%20URL%22%2C%22default%22%3A%22https%3A%2F%2Fgitlab.example.com%22%7D%2C%7B%22id%22%3A%22gitlab-token%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22GitLab%20Personal%20Access%20Token%22%2C%22password%22%3Atrue%7D%5D%2C%22type%22%3A%22stdio%22%2C%22command%22%3A%22uvx%22%2C%22args%22%3A%5B%22mcp-gitlab%22%5D%2C%22env%22%3A%7B%22GITLAB_URL%22%3A%22%24%7Binput%3Agitlab-url%7D%22%2C%22GITLAB_TOKEN%22%3A%22%24%7Binput%3Agitlab-token%7D%22%7D%7D'
    )
    const payload = JSON.parse(decodeURIComponent(url.slice('vscode:mcp/install?'.length)))
    expect(payload.name).toBe('gitlab')
    expect(payload.type).toBe('stdio')
    expect(payload.command).toBe('uvx')
    expect(payload.inputs[1].password).toBe(true)
    expect(payload.env.GITLAB_TOKEN).toBe('${input:gitlab-token}')
  })

  it('VS Code Insiders uses the same payload with the insiders scheme', () => {
    const url = genDeeplink(gitlab, deeplinkOut(byId('vscode-insiders')))
    expect(url.startsWith('vscode-insiders:mcp/install?')).toBe(true)
    const payload = JSON.parse(decodeURIComponent(url.slice('vscode-insiders:mcp/install?'.length)))
    const vscodePayload = JSON.parse(
      decodeURIComponent(
        genDeeplink(gitlab, deeplinkOut(byId('vscode'))).slice('vscode:mcp/install?'.length)
      )
    )
    expect(payload).toEqual(vscodePayload)
  })
})

describe('cli generators', () => {
  it('Claude Code', () => {
    expect(genCli(gitlab, cliOut(byId('claude-code')))).toBe(
      'claude mcp add gitlab --scope user -e GITLAB_URL=https://gitlab.example.com -e GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx -- uvx mcp-gitlab'
    )
  })
  it('Codex', () => {
    expect(genCli(gitlab, cliOut(byId('codex')))).toBe(
      'codex mcp add gitlab --env GITLAB_URL=https://gitlab.example.com --env GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx -- uvx mcp-gitlab'
    )
  })
  it('Gemini CLI', () => {
    expect(genCli(gitlab, cliOut(byId('gemini-cli')))).toBe(
      'gemini mcp add -s user -e GITLAB_URL=https://gitlab.example.com -e GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx gitlab uvx mcp-gitlab'
    )
  })
  it('GitHub Copilot CLI', () => {
    expect(genCli(gitlab, cliOut(byId('copilot-cli')))).toBe(
      'copilot mcp add gitlab --env GITLAB_URL=https://gitlab.example.com --env GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx -- uvx mcp-gitlab'
    )
  })

  it('single-quotes and escapes a value with spaces, $, quote and apostrophe', () => {
    const nasty: ServerConfig = {
      ...gitlab,
      shortName: 'nasty',
      packageName: 'pkg',
      installCommand: 'uvx',
      envVars: { K: { description: 'd', default: '', secret: false, placeholder: 'a b$\'"' } },
    }
    const q = "'a b$'\\''\"'" // shellValue('a b$\'"')
    expect(genCli(nasty, cliOut(byId('claude-code')))).toBe(
      `claude mcp add nasty --scope user -e K=${q} -- uvx pkg`
    )
  })

  it('leaves no double space when a server has no env vars', () => {
    const noEnv: ServerConfig = {
      ...gitlab,
      shortName: 'bare',
      packageName: 'pkg',
      installCommand: 'uvx',
      envVars: {},
    }
    expect(genCli(noEnv, cliOut(byId('claude-code')))).toBe(
      'claude mcp add bare --scope user -- uvx pkg'
    )
  })
})

describe('toml generator', () => {
  it('matches the golden Codex config.toml', () => {
    expect(genToml(gitlab)).toBe(
      [
        '[mcp_servers.gitlab]',
        'command = "uvx"',
        'args = ["mcp-gitlab"]',
        '',
        '[mcp_servers.gitlab.env]',
        'GITLAB_URL = "https://gitlab.example.com"',
        'GITLAB_TOKEN = "glpat-xxxxxxxxxxxxxxxxxxxx"',
      ].join('\n')
    )
  })

  it('escapes a backslash and a double quote in values', () => {
    const quirky: ServerConfig = {
      ...gitlab,
      shortName: 'quirky',
      packageName: 'pkg',
      envVars: { K: { description: 'd', default: '', secret: false, placeholder: 'a\\b"c' } },
    }
    // backslash → \\ , quote → \" , in that order.
    expect(genToml(quirky)).toContain('K = "a\\\\b\\"c"')
  })
})

describe('json generators', () => {
  const env = {
    GITLAB_URL: 'https://gitlab.example.com',
    GITLAB_TOKEN: 'glpat-xxxxxxxxxxxxxxxxxxxx',
  }

  it('Claude Desktop (standard) full object', () => {
    const json = JSON.parse(renderOutputs(gitlab, byId('claude-desktop'))[0].code)
    expect(json).toEqual({
      mcpServers: { gitlab: { command: 'uvx', args: ['mcp-gitlab'], env } },
    })
  })
  it('Zed (context_servers key) full object incl args and env', () => {
    const json = JSON.parse(renderOutputs(gitlab, byId('zed'))[0].code)
    expect(json).toEqual({
      context_servers: { gitlab: { command: 'uvx', args: ['mcp-gitlab'], env } },
    })
  })
  it('Cline (disabled + autoApprove) full object', () => {
    const json = JSON.parse(renderOutputs(gitlab, byId('cline'))[0].code)
    expect(json).toEqual({
      mcpServers: {
        gitlab: { command: 'uvx', args: ['mcp-gitlab'], env, disabled: false, autoApprove: [] },
      },
    })
  })
  it('opencode (command array, environment, $schema) full object', () => {
    const json = JSON.parse(renderOutputs(gitlab, byId('opencode'))[0].code)
    expect(json).toEqual({
      $schema: 'https://opencode.ai/config.json',
      mcp: {
        gitlab: { type: 'local', command: ['uvx', 'mcp-gitlab'], enabled: true, environment: env },
      },
    })
  })
  it('Visual Studio (servers key, type stdio) full object', () => {
    const json = JSON.parse(renderOutputs(gitlab, byId('visualstudio'))[0].code)
    expect(json).toEqual({
      servers: { gitlab: { type: 'stdio', command: 'uvx', args: ['mcp-gitlab'], env } },
    })
  })
})

describe('every server × every client', () => {
  for (const server of Object.values(SERVERS)) {
    for (const client of CLIENTS) {
      it(`${server.packageName} → ${client.id} produces valid output`, () => {
        // Deeplink clients render as an <a> via genDeeplink, never renderOutputs.
        const first = client.outputs[0]
        if (first.kind === 'deeplink') {
          const code = genDeeplink(server, first)
          expect(code).not.toContain('undefined')
          if (first.encoding === 'json-url') {
            const payload = JSON.parse(decodeURIComponent(code.slice(first.prefix.length)))
            expect(payload.command).toBe(server.installCommand)
          } else {
            const b64 = new URLSearchParams(code.split('?')[1]).get('config')!
            expect(() => JSON.parse(atob(b64))).not.toThrow()
          }
          return
        }
        const blocks = renderOutputs(server, client)
        expect(blocks.length).toBe(client.outputs.length)
        blocks.forEach((block, i) => {
          const out = client.outputs[i]
          expect(block.code.length).toBeGreaterThan(0)
          expect(block.code).not.toContain('undefined')
          expect(block.code).not.toContain('[object')
          if (out.kind === 'json') {
            expect(() => JSON.parse(block.code)).not.toThrow()
          }
          if (out.kind === 'cli') {
            expect(block.code.endsWith(`uvx ${server.packageName}`)).toBe(true)
          }
        })
      })
    }
  }
})

describe('aliases and sections', () => {
  it('every id and alias is unique and lower-case', () => {
    const all = CLIENTS.flatMap(c => [c.id, ...(c.aliases ?? [])])
    expect(new Set(all).size).toBe(all.length)
    for (const key of all) expect(key).toBe(key.toLowerCase())
  })

  it('all ten legacy install= aliases resolve to the expected client', () => {
    const legacy: Record<string, string> = {
      cursor: 'cursor',
      vscode: 'vscode',
      'vscode-insiders': 'vscode-insiders',
      claude: 'claude-code',
      'claude-code': 'claude-code',
      'claude-desktop': 'claude-desktop',
      windsurf: 'devin',
      intellij: 'jetbrains',
      gemini: 'gemini-cli',
      'gemini-cli': 'gemini-cli',
    }
    for (const [param, id] of Object.entries(legacy)) {
      expect(resolveClient(param)?.id).toBe(id)
    }
  })

  it('resolves case-insensitively and rejects unknowns', () => {
    expect(resolveClient('WindSurf')?.id).toBe('devin')
    expect(resolveClient('nope')).toBeNull()
  })

  it('has twenty clients across four non-empty sections', () => {
    expect(CLIENTS.length).toBe(20)
    for (const section of SECTIONS) {
      expect(CLIENTS.filter(c => c.section === section).length).toBeGreaterThan(0)
    }
  })
})

describe('route meta', () => {
  it('mcp-install description is under 160 chars and names every server', () => {
    const desc = ROUTE_META['/mcp-install'].description
    expect(desc.length).toBeLessThan(160)
    for (const s of Object.values(SERVERS)) expect(desc).toContain(s.displayName)
  })
})
