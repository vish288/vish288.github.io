import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import GitHubIcon from '@/components/icons/GitHubIcon'
import LinkedInIcon from '@/components/icons/LinkedInIcon'
import SectionRule from '@/components/SectionRule'
import CodeSurface from '@/components/CodeSurface'
import { APP_STRINGS } from '@/constants/appStrings'
import snapshot from '@/generated/pypi-stats.json'
import { formatDownloads, type PypiStats } from '@/lib/pypiStats'

const BUILDS = ['mcp-gitlab', 'mcp-atlassian-extended', 'mcp-coda', 'mcp-argocd']

// Live 15-day PyPI total from the build-time snapshot (src/generated/pypi-stats.json,
// written by scripts/pypi-stats.mjs). When the snapshot is empty/zero we never
// invent a number: the strip falls back to the honest "4 MCP servers" count.
const stats = snapshot as PypiStats
const hasDownloads = stats.lastFifteenDays > 0

// Proof strip under the manifest hero (C's ruled form, D's 64px numerals).
// Cells 1–3 link to the Career entry that evidences them (#digital-health);
// cell 4 is the live downloads figure linking to the gateway. Every number
// traces to APP_STRINGS or the measured PyPI snapshot — no invented claims.
const PROOF = [
  ...APP_STRINGS.PROOF.map(cell => ({ ...cell, internal: false })),
  hasDownloads
    ? {
        value: formatDownloads(stats.lastFifteenDays),
        label: `${APP_STRINGS.PROOF_DOWNLOADS_LABEL}, last 15 days`,
        href: '/mcp-install',
        internal: true,
      }
    : {
        value: APP_STRINGS.PROOF_DOWNLOADS_FALLBACK_VALUE,
        label: APP_STRINGS.PROOF_DOWNLOADS_FALLBACK_LABEL,
        href: '/mcp-install',
        internal: true,
      },
]

// aria-hidden manifest punctuation, so screen readers hear the values, not the
// quote marks and brackets.
function Punc({ children }: { children: string }) {
  return (
    <span aria-hidden className='text-code-muted'>
      {children}
    </span>
  )
}

// builds/contact links: underlined (not colour alone — WCAG 1.4.1) in the
// lavender code-link token (8.67 on the code surface).
const CODE_LINK =
  'text-code-link underline decoration-code-muted/70 underline-offset-4 hover:decoration-code-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-code-link rounded-sm'

function ProofCell({
  value,
  label,
  href,
  internal,
}: {
  value: string
  label: string
  href: string
  internal: boolean
}) {
  // flex-col-reverse: label (dt) before value (dd) in the DOM so a screen
  // reader hears "PyPI downloads … 23.6k", while sighted users see the big
  // numeral on top. No sr-only duplicate (fixes the double-announce).
  const numeral = (
    <span className='font-mono text-5xl sm:text-6xl font-semibold tabular-nums leading-none text-primary group-hover:underline underline-offset-8 decoration-2'>
      {value}
    </span>
  )
  return (
    // justify-end pins the group to the top of the (stretched) grid cell, so the
    // numerals align across cells even when a label wraps to a different line
    // count (e.g. the −40% label at 1440).
    <div className='flex h-full flex-col-reverse justify-end'>
      <dt className='mt-2 text-xs sm:text-sm text-muted-foreground'>{label}</dt>
      <dd>
        {internal ? (
          <Link
            to={href}
            className='group inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            {numeral}
          </Link>
        ) : (
          <a
            href={href}
            className='group inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            {numeral}
          </a>
        )}
      </dd>
    </div>
  )
}

export default function About() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-5xl mx-auto'>
        {/* Hero — package manifest */}
        <section className='py-8 md:py-12 mb-14'>
          <CodeSurface className='text-sm sm:text-base leading-7'>
            <p aria-hidden className='text-code-muted mb-2'>
              # {APP_STRINGS.HANDLE}
            </p>
            <dl className='grid grid-cols-[5rem_1fr] sm:grid-cols-[6rem_1fr] gap-x-4 gap-y-1'>
              <dt className='text-code-muted'>name</dt>
              <dd className='whitespace-nowrap'>
                <Punc>= &quot;</Punc>
                <h1 className='inline font-mono text-xl sm:text-3xl font-semibold text-code-foreground'>
                  {APP_STRINGS.FULL_NAME}
                </h1>
                <Punc>&quot;</Punc>
              </dd>

              <dt className='text-code-muted'>role</dt>
              <dd className='text-code-foreground'>
                <Punc>= &quot;</Punc>
                {APP_STRINGS.ROLE}
                <Punc>&quot;</Punc>
              </dd>

              <dt className='text-code-muted'>location</dt>
              <dd className='text-code-foreground'>
                <Punc>= &quot;</Punc>
                {APP_STRINGS.LOCATION}
                <Punc>&quot;</Punc>
              </dd>

              <dt className='text-code-muted'>builds</dt>
              <dd className='text-code-foreground'>
                <Punc>= [</Punc>
                <span className='flex flex-col sm:inline'>
                  {BUILDS.map((pkg, i) => (
                    <span key={pkg} className='whitespace-nowrap'>
                      <Punc>&quot;</Punc>
                      <Link to={`/mcp-install?server=${pkg}`} className={CODE_LINK}>
                        {pkg}
                      </Link>
                      <Punc>&quot;</Punc>
                      {i < BUILDS.length - 1 && <Punc>, </Punc>}
                    </span>
                  ))}
                </span>
                <Punc>]</Punc>
              </dd>

              {/* contact row — puts a reachable action into the first phone
                  viewport without a separate block (critique P1, copy H6). */}
              <dt className='text-code-muted'>contact</dt>
              <dd className='text-code-foreground'>
                <Punc>= [</Punc>
                <Punc>&quot;</Punc>
                <a
                  href={APP_STRINGS.LINKEDIN_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={CODE_LINK}
                >
                  linkedin
                </a>
                <Punc>&quot;, &quot;</Punc>
                <a
                  href={APP_STRINGS.GITHUB_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={CODE_LINK}
                >
                  github
                </a>
                <Punc>&quot;</Punc>
                <Punc>]</Punc>
              </dd>
            </dl>
            {/* Green = "published", and only inside the code surface. */}
            <p className='mt-3 text-code-accent'>
              <span aria-hidden>● </span>
              {APP_STRINGS.MANIFEST_LIVE}
            </p>
          </CodeSurface>

          {/* Proof strip — ruled, 64px tabular mono numerals in #847492. */}
          <h2 id='proof-heading' className='sr-only'>
            {APP_STRINGS.PROOF_HEADING}
          </h2>
          <dl
            aria-labelledby='proof-heading'
            className='mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 border-y-2 border-foreground py-6'
          >
            {PROOF.map(cell => (
              <ProofCell key={cell.label} {...cell} />
            ))}
          </dl>
          {hasDownloads && (
            <p className='mt-3 text-xs text-link'>
              Downloads from pypistats.org, without mirrors, as of {stats.windowEnd}.
            </p>
          )}

          <p className='mt-6 text-lg text-foreground max-w-2xl leading-relaxed'>
            {APP_STRINGS.TAGLINE}
          </p>

          {/* A recruiter's next step is a message: LinkedIn primary, GitHub outline. */}
          <div className='mt-6 flex flex-wrap items-center gap-3'>
            <Button asChild size='lg'>
              <a
                href={APP_STRINGS.LINKEDIN_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2'
              >
                <LinkedInIcon className='h-4 w-4' />
                LinkedIn
              </a>
            </Button>
            <Button variant='outline' asChild size='lg'>
              <a
                href={APP_STRINGS.GITHUB_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2'
              >
                <GitHubIcon className='h-4 w-4' />
                GitHub
              </a>
            </Button>
          </div>
        </section>

        {/* 01 — What I do */}
        <section className='mb-16'>
          <SectionRule index='01' className='mb-6'>
            {APP_STRINGS.ABOUT_HEADING}
          </SectionRule>
          <p className='max-w-3xl text-foreground leading-relaxed'>{APP_STRINGS.ABOUT_BODY}</p>
        </section>

        {/* 02 — What I build */}
        <section className='mb-16'>
          <SectionRule index='02' className='mb-6'>
            {APP_STRINGS.CAPABILITIES_HEADING}
          </SectionRule>
          <dl className='grid gap-4 sm:grid-cols-2'>
            {APP_STRINGS.CAPABILITIES.map(cap => (
              <div key={cap.title} className='rounded border bg-muted/30 p-5'>
                <dt className='font-semibold text-foreground'>{cap.title}</dt>
                <dd className='mt-1.5 text-sm text-muted-foreground leading-relaxed'>{cap.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 03 — Career */}
        <section className='mb-16'>
          <SectionRule index='03' className='mb-8'>
            {APP_STRINGS.EXPERIENCE_HEADING}
          </SectionRule>

          <ol className='space-y-0'>
            {APP_STRINGS.EXPERIENCE.map(entry => (
              <li
                key={entry.id}
                id={entry.id}
                className='scroll-mt-20 grid gap-2 border-t border-border/60 py-8 first:border-t-0 first:pt-0 md:grid-cols-[8rem_1fr] md:gap-8'
              >
                <p className='text-sm font-medium text-muted-foreground tabular-nums md:text-right'>
                  {entry.period}
                </p>
                <div className='space-y-3'>
                  {/* One title per h3 (the first role); later titles for the same
                      entry are a plain paragraph, not more level-3 headings. */}
                  <h3 className='font-semibold text-foreground'>{entry.roles[0]}</h3>
                  {entry.roles.length > 1 && (
                    <p className='text-sm font-normal text-muted-foreground'>
                      {entry.roles.slice(1).join(' · ')}
                    </p>
                  )}
                  <p className='text-sm text-muted-foreground'>{entry.context}</p>
                  <ul className='list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-primary/60'>
                    {entry.bullets.slice(0, 2).map(bullet => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  {entry.bullets.length > 2 && (
                    // Native <details>: no JS, and SSR prerenders every bullet
                    // closed so crawlers and llms.txt keep the full text.
                    <details className='text-sm'>
                      <summary className='touch-target inline-flex cursor-pointer items-center font-medium text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md'>
                        {APP_STRINGS.EXPERIENCE_MORE.replace(
                          '{count}',
                          String(entry.bullets.length - 2)
                        )}
                      </summary>
                      <ul className='mt-2 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground marker:text-primary/60'>
                        {entry.bullets.slice(2).map(bullet => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className='mt-8 flex flex-col gap-1 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between'>
            <span>{APP_STRINGS.EXPERIENCE_EDUCATION}</span>
            <a
              href={APP_STRINGS.LINKEDIN_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='font-medium text-link underline underline-offset-4 decoration-link/40 hover:decoration-link'
            >
              {APP_STRINGS.EXPERIENCE_LINK}
            </a>
          </div>
        </section>

        {/* 04 — Get in touch */}
        <section className='mb-12'>
          <SectionRule index='04' className='mb-6'>
            {APP_STRINGS.CONTACT_HEADING}
          </SectionRule>
          <p className='max-w-2xl text-foreground leading-relaxed'>{APP_STRINGS.CONTACT_BODY}</p>
          <div className='mt-5 flex flex-wrap items-center gap-3'>
            <Button asChild>
              <a
                href={APP_STRINGS.LINKEDIN_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2'
              >
                <LinkedInIcon className='h-4 w-4' />
                Message me on LinkedIn
              </a>
            </Button>
            <Button variant='outline' asChild>
              <a
                href={APP_STRINGS.GITHUB_URL}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2'
              >
                <GitHubIcon className='h-4 w-4' />
                Code on GitHub
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
