import { APP_STRINGS } from './appStrings'
import { SERVERS } from './mcpServers'
import { CLIENTS } from './mcpClients'

// Single source for per-route <title> and meta description. The client app
// (App.tsx) reads the titles on navigation; the prerender script reads both to
// write static, crawlable <head> metadata into each route's HTML file.

export interface RouteMeta {
  title: string
  description: string
}

const HOME_TITLE = `${APP_STRINGS.FULL_NAME} — ${APP_STRINGS.ROLE}, Toronto`
const HOME_DESCRIPTION =
  'Senior Staff Engineer and architect in Toronto. Multi-tenant AI agent platforms, unified identity, micro-frontends and cloud-native delivery for enterprises.'

// Built from the shared data so the gateway's description can never drift from
// the real server and client lists. Five recognizable clients are named to keep
// the string under the 160-char meta limit; the rest fold into "+N more".
function serverDisplayList(): string {
  const names = Object.values(SERVERS).map(s => s.displayName)
  return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]
}
const SAMPLE_CLIENT_IDS = ['vscode', 'cursor', 'claude-code', 'codex', 'gemini-cli']
// Curated ids, all known to exist in CLIENTS, so no filtering guard is needed.
const SAMPLE_CLIENTS = SAMPLE_CLIENT_IDS.map(id => CLIENTS.find(c => c.id === id)!.name)
const MCP_DESCRIPTION = `Install the ${serverDisplayList()} MCP servers in ${SAMPLE_CLIENTS.join(', ')} and ${CLIENTS.length - SAMPLE_CLIENTS.length} more clients.`

export const ROUTE_META: Record<string, RouteMeta> = {
  '/': {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  '/repositories': {
    title: `Repositories — ${APP_STRINGS.FULL_NAME}`,
    description:
      'Open-source projects by Visweshwaran S: Model Context Protocol (MCP) servers for GitLab, Atlassian, Coda and Argo CD, plus React and TypeScript tooling.',
  },
  '/mcp-install': {
    title: `MCP Install — ${APP_STRINGS.FULL_NAME}`,
    description: MCP_DESCRIPTION,
  },
}

export const DEFAULT_TITLE = HOME_TITLE
