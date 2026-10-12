import { APP_STRINGS } from './appStrings'

// Single source of truth for the MCP server catalogue. Consumed by the
// McpInstall page (config generation) and by the prerender script (JSON-LD,
// llms.txt), so it lives here free of any React/UI imports.

export interface EnvVar {
  description: string
  default: string
  secret: boolean
  placeholder: string
  tokenUrl?: string // where to create the token (secret vars only)
  tokenLabel?: string // link text for tokenUrl
  tokenHint?: string // scopes or caveats, one sentence
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
    description: 'Projects, MRs, pipelines, CI/CD variables, approvals, issues and code reviews',
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
        tokenUrl: 'https://gitlab.com/-/user_settings/personal_access_tokens',
        tokenLabel: 'your GitLab access tokens page',
        tokenHint:
          'Needs the `api` scope. On a self-hosted instance the page is under User settings, Access tokens.',
      },
    },
  },
  'mcp-atlassian-extended': {
    displayName: 'Atlassian Extended',
    fullName: 'Atlassian Extended MCP Server',
    packageName: 'mcp-atlassian-extended',
    shortName: 'atlassian-extended',
    description:
      'Jira custom fields, issue links, attachments, agile boards, sprints, backlog, users, Confluence calendars, time-off tracking and sprint capacity',
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
        tokenUrl: 'https://id.atlassian.com/manage-profile/security/api-tokens',
        tokenLabel: 'Atlassian API tokens',
        tokenHint: 'One token covers Jira and Confluence on the same account.',
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
        tokenUrl: 'https://id.atlassian.com/manage-profile/security/api-tokens',
        tokenLabel: 'Atlassian API tokens',
        tokenHint: 'Reuse the Jira token if both are on one account.',
      },
    },
  },
  'mcp-coda': {
    displayName: 'Coda',
    fullName: 'Coda MCP Server',
    packageName: 'mcp-coda',
    shortName: 'coda',
    description:
      'Docs, pages, tables, rows, formulas, controls, permissions, folders, publishing, automations and analytics',
    githubRepo: `${ghUser()}/mcp-coda`,
    pypiPackage: 'mcp-coda',
    installCommand: 'uvx',
    envVars: {
      CODA_API_TOKEN: {
        description: 'Coda API Token',
        default: '',
        secret: true,
        placeholder: 'your_coda_api_token',
        tokenUrl: 'https://coda.io/account#apiSettings',
        tokenLabel: 'Coda account settings',
        tokenHint: 'No scopes. The token sees every doc you can open.',
      },
    },
  },
  'mcp-argocd': {
    displayName: 'Argo CD',
    fullName: 'Argo CD MCP Server',
    packageName: 'mcp-argocd',
    shortName: 'argocd',
    description: 'Application status, sync, rollback, drift detection, logs and ApplicationSets',
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
        tokenUrl: 'https://github.com/vish288/mcp-argocd#getting-an-api-token',
        tokenLabel: 'the mcp-argocd README',
        tokenHint:
          'Run `argocd account generate-token` for an account with the `apiKey` capability. Read-only needs `applications, get` and `logs, get`.',
      },
    },
  },
}
