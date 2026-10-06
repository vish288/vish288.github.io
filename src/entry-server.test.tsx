import { describe, it, expect } from 'vitest'
import { render } from './entry-server'

describe('entry-server SSR render', () => {
  it('renders the home route with the h1 and the Experience heading', () => {
    const html = render('/')
    expect(html).toContain('Visweshwaran S') // hero h1
    expect(html).toContain('Career') // Experience section heading
  })

  it('renders the mcp-install route with all four server names', () => {
    const html = render('/mcp-install')
    for (const name of [
      'GitLab MCP Server',
      'Atlassian Extended MCP Server',
      'Coda MCP Server',
      'Argo CD MCP Server',
    ]) {
      expect(html).toContain(name)
    }
  })
})
