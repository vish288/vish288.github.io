import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Code2, Star, Blocks, FolderGit2, Loader2 } from 'lucide-react'
import GitHubIcon from '@/components/icons/GitHubIcon'
import LinkedInIcon from '@/components/icons/LinkedInIcon'
import SimpleWordCloud from '@/components/SimpleWordCloud'
import { useGitHubRepositories } from '@/hooks/useGitHubRepositories'
import { APP_STRINGS } from '@/constants/appStrings'

// Evidenced by PRODUCT.md positioning and this repo's own stack; no unverified claims.
const FALLBACK_SKILLS = ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python']

const HIGHLIGHT_TILE =
  'rounded-xl border bg-muted/30 p-4 flex flex-col items-center text-center gap-2 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

function FallbackSkills() {
  return (
    <div className='flex flex-wrap gap-2 justify-center'>
      {FALLBACK_SKILLS.map(skill => (
        <Badge key={skill} variant='secondary' className='text-sm'>
          {skill}
        </Badge>
      ))}
    </div>
  )
}

export default function About() {
  const { repositories, loading, error } = useGitHubRepositories()

  const owned = repositories.filter(r => !r.fork)
  const totalStars = owned.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-5xl mx-auto'>
        {/* Hero Section */}
        <section className='relative py-12 md:py-20 mb-16'>
          <div
            className='absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-[0.07] blur-3xl pointer-events-none'
            style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }}
          />

          <div className='relative text-center'>
            <div className='mx-auto mb-6 h-20 w-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20'>
              <span className='text-2xl font-bold text-primary-foreground tracking-tight'>VS</span>
            </div>

            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-3 text-foreground'>
              {APP_STRINGS.FULL_NAME}
            </h1>

            <p className='text-lg sm:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto'>
              {APP_STRINGS.TAGLINE}
            </p>

            <div className='flex items-center justify-center gap-1.5 text-sm text-muted-foreground mb-8'>
              <MapPin className='h-3.5 w-3.5' />
              <span>{APP_STRINGS.LOCATION}</span>
            </div>

            <div className='flex flex-wrap items-center justify-center gap-3'>
              <Button asChild size='lg'>
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
              <Button variant='outline' asChild size='lg'>
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
            </div>
          </div>
        </section>

        {/* About — editorial layout */}
        <section className='mb-16'>
          <div className='grid md:grid-cols-5 gap-10 items-start'>
            {/* Left: narrative (3/5) */}
            <div className='md:col-span-3 space-y-5'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-widest text-primary mb-2'>
                  About
                </p>
                <h2 className='text-2xl sm:text-3xl font-bold mb-4'>
                  Frontend engineering and the developer tools behind it
                </h2>
              </div>
              <p className='text-muted-foreground leading-relaxed'>
                {APP_STRINGS.ABOUT_DESCRIPTION_1}
              </p>
              <p className='text-muted-foreground leading-relaxed'>
                {APP_STRINGS.ABOUT_DESCRIPTION_2}
              </p>
            </div>

            {/* Right: highlights — each points at something verifiable */}
            <div className='md:col-span-2 grid grid-cols-2 gap-4'>
              <Link to='/mcp-install' className={HIGHLIGHT_TILE}>
                <div className='h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <Blocks className='h-5 w-5 text-primary' />
                </div>
                <p className='font-semibold text-sm'>3 MCP servers</p>
                <p className='text-xs text-muted-foreground'>GitLab · Atlassian · Coda</p>
              </Link>

              <Link to='/repositories' className={HIGHLIGHT_TILE}>
                <div className='h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <FolderGit2 className='h-5 w-5 text-primary' />
                </div>
                <p className='font-semibold text-sm'>
                  {owned.length > 0 ? `${owned.length} repos` : 'Public repos'}
                </p>
                <p className='text-xs text-muted-foreground'>Open source on GitHub</p>
              </Link>

              <a
                href={APP_STRINGS.GITHUB_URL}
                target='_blank'
                rel='noopener noreferrer'
                className={HIGHLIGHT_TILE}
              >
                <div className='h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <GitHubIcon className='h-5 w-5 text-primary' />
                </div>
                <p className='font-semibold text-sm'>GitHub</p>
                <p className='text-xs text-muted-foreground'>@vish288</p>
              </a>

              {totalStars > 0 && (
                <div className='rounded-xl border bg-muted/30 p-4 flex flex-col items-center text-center gap-2'>
                  <div className='h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                    <Star className='h-5 w-5 text-primary' />
                  </div>
                  <p className='font-semibold text-sm'>{totalStars} stars</p>
                  <p className='text-xs text-muted-foreground'>Across public repos</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Skills Word Cloud */}
        <section className='mb-12'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Code2 className='h-5 w-5' />
                {APP_STRINGS.SKILLS_TITLE}
              </CardTitle>
              <CardDescription>{APP_STRINGS.SKILLS_SUBTITLE}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div role='status' className='flex items-center justify-center h-64'>
                  <Loader2
                    className='h-8 w-8 text-primary motion-safe:animate-spin'
                    aria-hidden='true'
                  />
                  <span className='ml-2 text-muted-foreground'>
                    {APP_STRINGS.LOADING_REPOSITORIES}
                  </span>
                </div>
              )}

              {/* API failure degrades quietly to an evidenced fallback — no alarm copy. */}
              {!loading && error && <FallbackSkills />}

              {!loading && !error && owned.length > 0 && (
                <div className='space-y-4'>
                  <SimpleWordCloud repositories={owned} />
                  <p className='text-sm text-muted-foreground'>
                    {APP_STRINGS.REPOSITORY_COUNT_MESSAGE.replace(
                      '{count}',
                      owned.length.toString()
                    )}
                  </p>
                </div>
              )}

              {!loading && !error && owned.length === 0 && <FallbackSkills />}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
