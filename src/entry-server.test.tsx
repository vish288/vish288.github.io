import { describe, it, expect } from 'vitest'
import { render } from './entry-server'

describe('entry-server SSR render', () => {
  it('renders the home route with the h1 and the Experience heading', () => {
    const html = render('/')
    expect(html).toContain('Visweshwaran S') // hero h1
    expect(html).toContain('Career') // Experience section heading
  })

  it('prerenders career bullets inside collapsed <details> and no "Consultant" title', () => {
    const html = render('/')
    // Native <details> ships every bullet in the static HTML, closed by default,
    // so crawlers and llms.txt keep the full text (spec drift item 4).
    expect(html).toContain('<details')
    // D1: the current role is "Engineer & Architect", never "Consultant".
    expect(html).not.toContain('Senior Staff Consultant')
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

  it('renders the mcp-install picker open with no stored client in SSR', () => {
    const html = render('/mcp-install')
    expect(html).toContain('Which client do you use?')
    expect(html).not.toContain('Client: ')
    expect(html).not.toContain('checked=""')
  })
})
