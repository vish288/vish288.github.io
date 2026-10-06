import { APP_STRINGS } from './appStrings'

// Single source of truth for the MCP server catalogue. Consumed by the
// McpInstall page (config generation) and by the prerender script (JSON-LD,
// llms.txt), so it lives here free of any React/UI imports.

export interface EnvVar {
  description: string
  default: string
  secret: boolean
  placeholder: string
}

export interface ServerConfig {
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

export const SERVERS: Record<string, ServerConfig> = {
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
  'mcp-argocd': {
    displayName: 'Argo CD',
    fullName: 'Argo CD MCP Server',
    packageName: 'mcp-argocd',
    shortName: 'argocd',
    description:
      'Supports application status, sync, rollback, drift detection, logs, and ApplicationSets',
    githubRepo: `${ghUser()}/mcp-argocd`,
    pypiPackage: 'mcp-argocd',
    installCommand: 'uvx',
    // Required vars only, matching the siblings; server.json also exposes the
    // optional ARGOCD_READ_ONLY, which the generated configs omit.
    envVars: {
      ARGOCD_URL: {
        description: 'Argo CD URL',
        default: 'https://argocd.example.com',
        secret: false,
        placeholder: 'https://argocd.example.com',
      },
      ARGOCD_TOKEN: {
        description: 'Argo CD API Token',
        default: '',
        secret: true,
        placeholder: 'your_argocd_token',
      },
    },
  },
}
