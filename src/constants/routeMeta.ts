import { APP_STRINGS } from './appStrings'

// Single source for per-route <title> and meta description. The client app
// (App.tsx) reads the titles on navigation; the prerender script reads both to
// write static, crawlable <head> metadata into each route's HTML file.

export interface RouteMeta {
  title: string
  description: string
}

const HOME_TITLE = `${APP_STRINGS.FULL_NAME} — ${APP_STRINGS.ROLE}`
const HOME_DESCRIPTION =
  'Senior Staff Engineer and architect in Toronto. Frontend platforms, cloud-native systems and LLM engineering tooling for enterprise health and commerce.'

export const ROUTE_META: Record<string, RouteMeta> = {
  '/': {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  '/repositories': {
    title: `Repositories — ${APP_STRINGS.FULL_NAME}`,
    description:
      'Open-source projects by Visweshwaran S, including MCP servers for GitLab, Atlassian, Coda and Argo CD.',
  },
  '/mcp-install': {
    title: `MCP Install — ${APP_STRINGS.FULL_NAME}`,
    description:
      'Install MCP servers for GitLab, Atlassian, Coda and Argo CD in VS Code, Cursor, Claude Code, Claude Desktop, Windsurf, IntelliJ and Gemini CLI.',
  },
}

export const DEFAULT_TITLE = HOME_TITLE
