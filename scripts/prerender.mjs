// Prerender the three real routes to static HTML so GitHub Pages serves each
// with HTTP 200 and crawlers (which mostly don't run JS) get full content,
// per-route <head> metadata and JSON-LD. Also emits sitemap.xml and llms.txt.
//
// Runs after `vite build`: builds an SSR bundle of src/entry-server.tsx into
// dist-ssr, renders each route into dist/index.html's <div id="root">, writes
// repositories.html / mcp-install.html (GitHub Pages serves /foo from foo.html
// and keeps the query string), then removes dist-ssr.
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = resolve(ROOT, 'dist')
const SSR_DIR = resolve(ROOT, 'dist-ssr')
const ORIGIN = 'https://vish288.github.io'

// Written artifacts beyond the client build; removed on interrupt alongside dist-ssr.
const EXTRA_OUTPUTS = ['repositories.html', 'mcp-install.html', 'sitemap.xml', 'llms.txt']

// ── cleanup + signal handling ───────────────────────────────────────
let cleaning = false
async function removeTemp() {
  await rm(SSR_DIR, { recursive: true, force: true })
}
function handleSignal(name, code) {
  return async () => {
    if (cleaning) return
    cleaning = true
    console.error(`\nprerender: ${name} received; cleaning up`)
    await removeTemp()
    await Promise.all(EXTRA_OUTPUTS.map(f => rm(resolve(DIST, f), { force: true })))
    process.exit(code)
  }
}
process.on('SIGINT', handleSignal('SIGINT', 130))
process.on('SIGTERM', handleSignal('SIGTERM', 143))

// ── string helpers ──────────────────────────────────────────────────
const escAttr = s =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const escText = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Serialize JSON-LD and neutralize "</script>" / "<" so it can't break out of the data block.
const jsonLd = obj => JSON.stringify(obj).replace(/</g, '\\u003c')

function replaceMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
  return html.replace(re, (_m, p1, p2) => p1 + escAttr(value) + p2)
}

function applyMeta(template, { markup, title, description, canonical, ld }) {
  let html = template
  html = html.replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`)
  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escText(title)}</title>`)
  html = replaceMeta(html, 'name', 'description', description)
  html = replaceMeta(html, 'property', 'og:url', canonical)
  html = replaceMeta(html, 'property', 'og:title', title)
  html = replaceMeta(html, 'property', 'og:description', description)
  html = replaceMeta(html, 'property', 'twitter:url', canonical)
  html = replaceMeta(html, 'property', 'twitter:title', title)
  html = replaceMeta(html, 'property', 'twitter:description', description)
  const injected =
    `    <link rel="canonical" href="${escAttr(canonical)}" />\n` +
    `    <script type="application/ld+json">${ld}</script>\n`
  return html.replace('</head>', () => injected + '  </head>')
}

// ── JSON-LD graph (generated from shared data) ──────────────────────
// Every MCP repo was verified MIT (GitHub API license.spdx_id), so license is set for all.
const KNOWS_ABOUT = [
  'React', 'TypeScript', 'Next.js', 'Micro-frontends', 'Module federation', 'Kubernetes',
  'Argo CD', 'Cloud-native architecture', 'Identity and access management',
  'Multi-tenant architecture', 'LLM engineering', 'Model Context Protocol',
]
const PERSON_ID = `${ORIGIN}/#person`

function graphFor(path, APP_STRINGS, SERVERS, CLIENTS) {
  const person = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: APP_STRINGS.FULL_NAME,
    alternateName: ['Vish', 'Visweshwaran Suryanarayanan'],
    jobTitle: 'Senior Staff Engineer & Architect',
    url: `${ORIGIN}/`,
    image: `${ORIGIN}/vis-creates.png`,
    sameAs: [APP_STRINGS.GITHUB_URL, APP_STRINGS.LINKEDIN_URL],
    address: { '@type': 'PostalAddress', addressLocality: 'Toronto', addressCountry: 'CA' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Anna University' },
    knowsAbout: KNOWS_ABOUT,
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${ORIGIN}/#website`,
    url: `${ORIGIN}/`,
    name: APP_STRINGS.FULL_NAME,
    publisher: { '@id': PERSON_ID },
  }
  const graph = [person, website]
  if (path === '/mcp-install') {
    graph.push({
      '@type': 'ItemList',
      name: 'MCP servers by Visweshwaran S',
      itemListElement: Object.values(SERVERS).map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'SoftwareSourceCode',
          name: s.fullName,
          description: s.description,
          codeRepository: `https://github.com/${s.githubRepo}`,
          url: `https://pypi.org/project/${s.pypiPackage}/`,
          programmingLanguage: 'Python',
          license: 'https://opensource.org/licenses/MIT',
          author: { '@id': PERSON_ID },
        },
      })),
    })
    // One HowTo for the whole page (not one per server): enough for AEO engines
    // to answer "how do I install X in Y", with every client as a HowToTool.
    graph.push({
      '@type': 'HowTo',
      name: 'Install an MCP server from this page',
      step: [
        { '@type': 'HowToStep', name: 'Choose a server', text: 'Pick the MCP server you want to install.' },
        { '@type': 'HowToStep', name: 'Choose your client', text: 'Pick your editor, CLI agent or desktop app.' },
        {
          '@type': 'HowToStep',
          name: 'Open the install link or copy the config',
          text: 'Use the one-click install link, or copy the generated config or command into your client.',
        },
      ],
      tool: CLIENTS.map(c => ({ '@type': 'HowToTool', name: c.name })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

// A client's config location for llms.txt: UI path, else first file path, else
// the deep-link scheme.
function clientTarget(c) {
  if (typeof c.paths === 'string') return c.paths
  if (c.paths && 'ui' in c.paths) return c.paths.ui
  if (c.paths) {
    const first = Object.values(c.paths)[0]
    if (first) return first
  }
  const out = c.outputs[0]
  if (out.kind === 'deeplink') return out.prefix
  return c.docs
}

// ── sitemap + llms.txt ──────────────────────────────────────────────
function buildSitemap() {
  const urls = [`${ORIGIN}/`, `${ORIGIN}/repositories`, `${ORIGIN}/mcp-install`]
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n') +
    '\n</urlset>\n'
  )
}

function buildLlmsTxt(APP_STRINGS, SERVERS, CLIENTS) {
  const S = APP_STRINGS
  const clientNames = CLIENTS.map(c => c.name).join(', ')
  const out = [`# ${S.FULL_NAME}`, '', `> ${S.ROLE}. ${S.TAGLINE}`, '', '## About', '']
  out.push(S.ABOUT_P1, '', S.ABOUT_P2, '', S.ABOUT_P3, '')
  out.push('## Capabilities', '')
  for (const c of S.CAPABILITIES) out.push(`- ${c.title}: ${c.body}`)
  out.push('', '## Experience', '')
  for (const e of S.EXPERIENCE) {
    out.push(`### ${e.period}`)
    for (const r of e.roles) out.push(`- ${r}`)
    out.push(e.context)
    for (const b of e.bullets) out.push(`  - ${b}`)
    out.push('')
  }
  out.push(`Education: ${S.EXPERIENCE_EDUCATION}`, '', '## Open-source MCP servers', '')
  for (const [key, s] of Object.entries(SERVERS)) {
    out.push(`### ${s.fullName}`)
    out.push(s.description)
    out.push(`- GitHub: https://github.com/${s.githubRepo}`)
    out.push(`- PyPI: https://pypi.org/project/${s.pypiPackage}/`)
    out.push(`- Install: ${ORIGIN}/mcp-install?server=${key}`)
    out.push(`- Clients: ${clientNames}`, '')
  }
  out.push('## MCP clients supported', '')
  out.push(
    `Each client installs the same server via ${ORIGIN}/mcp-install?server=<server-key>&install=<client-id>.`,
    ''
  )
  for (const c of CLIENTS) out.push(`- ${c.name}: ${clientTarget(c)}`)
  out.push('', '## Links', '')
  out.push(`- Website: ${ORIGIN}/`)
  out.push(`- GitHub: ${S.GITHUB_URL}`)
  out.push(`- LinkedIn: ${S.LINKEDIN_URL}`, '')
  return out.join('\n')
}

// ── main ────────────────────────────────────────────────────────────
// SSR needs markup, not styles. Stub CSS imports so the Tailwind/PostCSS
// pipeline never runs here (it requires the project vite/postcss config we
// deliberately skip with configFile:false).
const ignoreCss = {
  name: 'prerender-ignore-css',
  enforce: 'pre',
  resolveId(id) {
    if (id.endsWith('.css')) return '\0ignore-css:' + id
  },
  load(id) {
    if (id.startsWith('\0ignore-css:')) return ''
  },
}

async function main() {
  await build({
    configFile: false,
    logLevel: 'warn',
    plugins: [ignoreCss, react()],
    resolve: { alias: { '@': resolve(ROOT, 'src') } },
    build: {
      ssr: resolve(ROOT, 'src/entry-server.tsx'),
      outDir: SSR_DIR,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
    },
  })

  const { render, APP_STRINGS, SERVERS, CLIENTS, ROUTE_META } = await import(
    pathToFileURL(resolve(SSR_DIR, 'entry-server.mjs')).href
  )

  const routes = [
    { path: '/', file: 'index.html', h1: APP_STRINGS.FULL_NAME },
    { path: '/repositories', file: 'repositories.html', h1: 'Repositories' },
    { path: '/mcp-install', file: 'mcp-install.html', h1: 'MCP Installation Gateway' },
  ]

  const template = await readFile(resolve(DIST, 'index.html'), 'utf8')
  const failures = []

  for (const route of routes) {
    const meta = ROUTE_META[route.path]
    const canonical = route.path === '/' ? `${ORIGIN}/` : `${ORIGIN}${route.path}`
    const markup = render(route.path)
    const html = applyMeta(template, {
      markup,
      title: meta.title,
      description: meta.description,
      canonical,
      ld: jsonLd(graphFor(route.path, APP_STRINGS, SERVERS, CLIENTS)),
    })
    if (!html.includes(route.h1)) {
      failures.push(`${route.file}: rendered output is missing its h1 text "${route.h1}"`)
    }
    await writeFile(resolve(DIST, route.file), html, 'utf8')
  }

  await writeFile(resolve(DIST, 'sitemap.xml'), buildSitemap(), 'utf8')
  await writeFile(resolve(DIST, 'llms.txt'), buildLlmsTxt(APP_STRINGS, SERVERS, CLIENTS), 'utf8')

  await removeTemp()

  if (failures.length) {
    console.error('prerender failed:\n  ' + failures.join('\n  '))
    process.exit(1)
  }

  console.log(
    `prerender: wrote ${routes.map(r => r.file).join(', ')}, sitemap.xml, llms.txt`
  )
}

main().catch(async err => {
  console.error('prerender error:', err)
  await removeTemp()
  process.exit(1)
})
