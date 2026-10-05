# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring managers and recruiters checking Vish's credibility, usually after a LinkedIn profile, resume or referral. They scan quickly, often on a phone, and want to know what he builds, at what level, and how to reach him.

Secondary: developers sent to `/mcp-install` from a README or PyPI page who want a working client config for one of his MCP servers.

## Product Purpose

Personal site for Visweshwaran S ("Vish"). It proves engineering depth with work a visitor can verify (public repos, shipped MCP servers) and routes the visitor to GitHub or LinkedIn. Success: a hiring reviewer leaves able to say what Vish does and has a reason to reach out.

## Positioning

Two claims, both backed by public work:

1. Senior frontend / platform engineer: React, TypeScript, performance, infrastructure.
2. Builder of developer tooling: the GitLab, Atlassian Extended and Coda MCP servers, published on PyPI and installable from this site.

The MCP servers are the evidence that sets this site apart from a generic "full stack developer" portfolio.

## Operating Context

- Static SPA on GitHub Pages at `vish288.github.io`; `404.html` redirects deep links back into the app.
- Routes: `/` About, `/repositories` live repo list, `/mcp-install` install gateway (`?server=` deep links, per-client config generation, copy to clipboard).
- Repo data comes from the unauthenticated GitHub REST API at runtime, so rate limits and failures are normal and the UI must handle them.
- Light, dark and system themes.

## Capabilities and Constraints

- Binding stack: React 19, TypeScript, Vite, Tailwind CSS 4, shadcn/ui + Radix, Vitest, pnpm. Static output only.
- Strict meta CSP in `index.html`; any new external origin (fonts, images, APIs) needs a CSP edit.
- No server and currently no auth token (the token-backed gratitude form and admin view were removed in 2.8.x). Not a binding commitment, but any change needs a deliberate decision.
- Existing bio, tagline and highlight copy are placeholders and may be rewritten, with Vish's approval of the new wording.

## Brand Commitments

- Name: "Vish" for display, "Visweshwaran S" in full. Monogram "VS".
- Location as stated: Toronto, Canada & India.
- Links: github.com/vish288, LinkedIn `suryanarayananvisweshwaran`.

## Evidence on Hand

- Public GitHub repositories and star counts (live via API).
- Three MCP servers with PyPI packages: `mcp-gitlab`, `mcp-atlassian-extended`, `mcp-coda`.
- Open Graph image: `public/vis-creates.png`.
- Not on hand, so never fabricate: employers, job titles, years of experience, testimonials, metrics, client names. Ask before adding any.

## Product Principles

1. Show, don't claim. Every positioning statement points at something a visitor can open.
2. A recruiter on a phone gets name, role and contact in the first viewport.
3. The MCP gateway is a working tool first and a portfolio piece second: correct configs beat decoration.
4. Degrade quietly. A GitHub API failure still leaves a complete, credible page.

## Accessibility & Inclusion

WCAG 2.2 AA is the floor across all routes and both themes.
