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

Two claims, both backed by work:

1. Senior Staff Engineer & Architect: platform architecture for large enterprises (multi-tenant AI agent platforms, frontend platforms, cloud-native delivery, identity, security and quality).
2. Builder of developer tooling: the GitLab, Atlassian Extended, Coda and Argo CD MCP servers, published on PyPI and installable from this site.

The MCP servers are the evidence that sets this site apart from a generic "full stack developer" portfolio.

## Operating Context

- Static SPA on GitHub Pages at `vish288.github.io`; each route is prerendered to its own static HTML, so deep links are served directly with HTTP 200. Unknown paths fall through to a static `404.html`.
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
- Public site names no employers or clients; scale figures allowed; percentage claims limited to the three currently published; career break not published.

## Evidence on Hand

- Public GitHub repositories and star counts (live via API).
- Four MCP servers with PyPI packages: `mcp-gitlab`, `mcp-atlassian-extended`, `mcp-coda`, `mcp-argocd`.
- Open Graph image: `public/vis-creates.png`.
- Private resume (Proton Drive, `Vetri Kodi/2026/next-reign/Resume/Visweshwaran_Senior_Staff_Software_Engineer_CapitalOne.docx`, 13 Sep 2026) is the source for experience copy.
- Anything not in the resume or public repos: never fabricate; ask first.

## Product Principles

1. Show, don't claim. Every positioning statement points at something a visitor can open.
2. A recruiter on a phone gets name, role and contact in the first viewport.
3. The MCP gateway is a working tool first and a portfolio piece second: correct configs beat decoration.
4. Degrade quietly. A GitHub API failure still leaves a complete, credible page.

## Accessibility & Inclusion

WCAG 2.2 AA is the floor across all routes and both themes.
