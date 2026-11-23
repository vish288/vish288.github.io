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
import {
  genDeeplink,
  genCli,
  genToml,
  renderOutputs,
  pluginCommands,
  pluginBlurb,
  attestCommand,
  type Runtime,
} from './mcpInstall'

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

// Decode a (server, client) pair to the plain text(s) a user ends up pasting —
// deeplinks decoded back to JSON — so the read-only contract can assert on the
// literal env the client will receive, across all four servers and every client.
function renderedTexts(
  server: ServerConfig,
  client: McpClient,
  readOnly: boolean,
  runtime: Runtime = 'uv'
): string[] {
  const first = client.outputs[0]
  if (first.kind === 'deeplink') {
    const code = genDeeplink(server, first, readOnly, runtime)
    if (first.encoding === 'json-url') {
      return [decodeURIComponent(code.slice(first.prefix.length))]
    }
    const b64 = new URLSearchParams(code.split('?')[1]).get('config')!
    return [atob(b64)]
  }
  return renderOutputs(server, client, readOnly, runtime).map(b => b.code)
}

describe('read-only toggle writes MCP_READ_ONLY=true everywhere, only when on', () => {
  for (const server of Object.values(SERVERS)) {
    for (const client of CLIENTS) {
      it(`${server.packageName} → ${client.id}`, () => {
        // Off (default): no generated output mentions the var at all.
        for (const text of renderedTexts(server, client, false)) {
          expect(text).not.toContain('MCP_READ_ONLY')
        }
        // On: every generated output carries MCP_READ_ONLY set to true.
        for (const text of renderedTexts(server, client, true)) {
          expect(text).toContain('MCP_READ_ONLY')
          expect(text).toMatch(/MCP_READ_ONLY["\s]*[:=]\s*"?true"?/)
        }
      })
    }
  }

  it('VS Code deeplink carries MCP_READ_ONLY as a literal, not a prompted input', () => {
    const out = deeplinkOut(byId('vscode'))
    const url = genDeeplink(gitlab, out, true)
    const payload = JSON.parse(decodeURIComponent(url.slice(out.prefix.length)))
    expect(payload.env.MCP_READ_ONLY).toBe('true')
    // It must not become a promptString the user has to answer.
    expect(payload.inputs.some((i: { id: string }) => i.id === 'mcp-read-only')).toBe(false)
  })

  it('Claude Code command appends -e MCP_READ_ONLY=true when on', () => {
    expect(genCli(gitlab, cliOut(byId('claude-code')), true)).toContain('-e MCP_READ_ONLY=true')
  })
})

describe('docker runtime', () => {
  const coda = SERVERS['mcp-coda']
  const image = 'ghcr.io/vish288/mcp-coda'
  const dockerArgs = (readOnly: boolean) => [
    'run',
    '-i',
    '--rm',
    '-e',
    'CODA_API_TOKEN',
    ...(readOnly ? [] : ['-e', 'MCP_READ_ONLY=false']),
    image,
  ]
  const env = { CODA_API_TOKEN: 'your_coda_api_token' }

  it('uv mode is the default and unchanged', () => {
    expect(renderOutputs(coda, byId('zed'))).toEqual(renderOutputs(coda, byId('zed'), false, 'uv'))
    expect(genCli(coda, cliOut(byId('claude-code')), true, 'uv')).toBe(
      'claude mcp add coda --scope user -e CODA_API_TOKEN=your_coda_api_token -e MCP_READ_ONLY=true -- uvx mcp-coda'
    )
  })

  it('Claude Code command passes each var through and reads from the image', () => {
    expect(genCli(coda, cliOut(byId('claude-code')), true, 'docker')).toBe(
      `claude mcp add coda --scope user -e CODA_API_TOKEN=your_coda_api_token -- docker run -i --rm -e CODA_API_TOKEN ${image}`
    )
  })

  it('Codex command uses --env and ends with docker run', () => {
    expect(genCli(coda, cliOut(byId('codex')), false, 'docker')).toBe(
      `codex mcp add coda --env CODA_API_TOKEN=your_coda_api_token -- docker run -i --rm -e CODA_API_TOKEN -e MCP_READ_ONLY=false ${image}`
    )
  })

  it('Gemini CLI puts docker args after -- so its own -e does not take them', () => {
    expect(genCli(coda, cliOut(byId('gemini-cli')), true, 'docker')).toBe(
      `gemini mcp add -s user -e CODA_API_TOKEN=your_coda_api_token coda docker -- run -i --rm -e CODA_API_TOKEN ${image}`
    )
  })

  it('every client kind launches docker with matching args and env', () => {
    for (const readOnly of [true, false]) {
      const args = dockerArgs(readOnly)
      const entry = (id: string, key: string) =>
        JSON.parse(renderOutputs(coda, byId(id), readOnly, 'docker')[0].code)[key].coda
      expect(entry('claude-desktop', 'mcpServers')).toEqual({ command: 'docker', args, env })
      expect(entry('zed', 'context_servers')).toEqual({ command: 'docker', args, env })
      expect(entry('visualstudio', 'servers')).toEqual({
        type: 'stdio',
        command: 'docker',
        args,
        env,
      })
      expect(entry('cline', 'mcpServers')).toEqual({
        command: 'docker',
        args,
        env,
        disabled: false,
        autoApprove: [],
      })
      expect(entry('opencode', 'mcp')).toEqual({
        type: 'local',
        command: ['docker', ...args],
        enabled: true,
        environment: env,
      })
    }
  })

  it('Codex TOML lists every docker arg and keeps the env table', () => {
    expect(genToml(coda, true, 'docker')).toBe(
      [
        '[mcp_servers.coda]',
        'command = "docker"',
        `args = ["run", "-i", "--rm", "-e", "CODA_API_TOKEN", "${image}"]`,
        '',
        '[mcp_servers.coda.env]',
        'CODA_API_TOKEN = "your_coda_api_token"',
      ].join('\n')
    )
    expect(genToml(coda, false, 'docker')).toContain('"-e", "MCP_READ_ONLY=false", "' + image)
  })

  it('both deeplink kinds launch docker; VS Code keeps its prompted inputs', () => {
    for (const readOnly of [true, false]) {
      const cursor = deeplinkOut(byId('cursor'))
      const b64 = new URLSearchParams(
        genDeeplink(coda, cursor, readOnly, 'docker').split('?')[1]
      ).get('config')!
      expect(JSON.parse(atob(b64))).toEqual({ command: 'docker', args: dockerArgs(readOnly), env })

      const vs = deeplinkOut(byId('vscode'))
      const payload = JSON.parse(
        decodeURIComponent(genDeeplink(coda, vs, readOnly, 'docker').slice(vs.prefix.length))
      )
      expect(payload.command).toBe('docker')
      expect(payload.args).toEqual(dockerArgs(readOnly))
      expect(payload.env).toEqual({ CODA_API_TOKEN: '${input:coda-api-token}' })
      expect(payload.inputs).toHaveLength(1)
    }
  })

  it('read-only on adds nothing; off unlocks writes with a literal flag', () => {
    const on = renderOutputs(coda, byId('claude-desktop'), true, 'docker')[0].code
    const off = renderOutputs(coda, byId('claude-desktop'), false, 'docker')[0].code
    expect(on).not.toContain('MCP_READ_ONLY')
    expect(off).toContain('"MCP_READ_ONLY=false"')
  })

  it('passes one -e per var for a multi-var server (atlassian)', () => {
    const atl = SERVERS['mcp-atlassian-extended']
    const cmd = genCli(atl, cliOut(byId('claude-code')), true, 'docker')
    const tail = cmd.split(' -- ')[1]
    expect(tail).toBe(
      'docker run -i --rm -e JIRA_URL -e JIRA_USERNAME -e JIRA_API_TOKEN -e CONFLUENCE_URL -e CONFLUENCE_USERNAME -e CONFLUENCE_API_TOKEN ghcr.io/vish288/mcp-atlassian-extended'
    )
  })

  it('every server × client yields docker output with its image', () => {
    for (const server of Object.values(SERVERS)) {
      for (const client of CLIENTS) {
        const text = renderedTexts(server, client, false, 'docker').join('\n')
        expect(text).toContain(`ghcr.io/vish288/${server.packageName}`)
        expect(text).not.toContain('uvx')
      }
    }
  })

  it('attestation command verifies the image against its repo and the org signer', () => {
    expect(attestCommand(coda)).toBe(
      'gh attestation verify oci://ghcr.io/vish288/mcp-coda:latest -R vish288/mcp-coda --signer-repo vish288/.github'
    )
  })
})

describe('Claude Code plugin', () => {
  it('commands add the marketplace and install the package from it', () => {
    expect(pluginCommands(SERVERS['mcp-coda'])).toBe(
      'claude plugin marketplace add vish288/.github\nclaude plugin install mcp-coda@vish288-mcp'
    )
  })

  it('names the single secret', () => {
    expect(pluginBlurb(SERVERS['mcp-coda'])).toBe(
      'Claude Code asks for CODA_API_TOKEN and keeps it in its credential store, never in a config file. The server stays updated. No uv needed.'
    )
  })

  it('names every secret for atlassian and pluralises', () => {
    expect(pluginBlurb(SERVERS['mcp-atlassian-extended'])).toBe(
      'Claude Code asks for JIRA_API_TOKEN and CONFLUENCE_API_TOKEN, and keeps them in its credential store, never in a config file. The server stays updated. No uv needed.'
    )
  })

  it('drops the secrets clause when a server has none', () => {
    expect(pluginBlurb({ ...gitlab, envVars: {} })).toBe('The server stays updated. No uv needed.')
  })
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
