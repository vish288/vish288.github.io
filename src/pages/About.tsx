import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, MapPin, Code2, ArrowRight, Globe, Users, Star, Briefcase } from 'lucide-react'
import GitHubIcon from '@/components/icons/GitHubIcon'
import LinkedInIcon from '@/components/icons/LinkedInIcon'
import SimpleWordCloud from '@/components/SimpleWordCloud'
import { useGitHubRepositories } from '@/hooks/useGitHubRepositories'
import { APP_STRINGS } from '@/constants/appStrings'

export default function About() {
  const { repositories, loading, error } = useGitHubRepositories()

  const skills = [
    'React',
    'TypeScript',
    'Node.js',
    'Python',
    'JavaScript',
    'Next.js',
    'Express.js',
    'MongoDB',
    'PostgreSQL',
    'AWS',
    'Docker',
    'Git',
    'REST APIs',
    'GraphQL',
    'Tailwind CSS',
  ]

  const totalStars = repositories.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)

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
            <div className='mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20'>
              <span className='text-2xl font-bold text-white tracking-tight'>VS</span>
            </div>

            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent'>
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
              <Button variant='ghost' asChild size='lg'>
                <a href='/gratitude' className='flex items-center gap-2'>
                  <Mail className='h-4 w-4' />
                  {APP_STRINGS.BTN_SEND_MESSAGE}
                  <ArrowRight className='h-3.5 w-3.5' />
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
                  Building software that solves real problems
                </h2>
              </div>
              <p className='text-muted-foreground leading-relaxed'>
                {APP_STRINGS.ABOUT_DESCRIPTION_1}
              </p>
              <p className='text-muted-foreground leading-relaxed'>
                {APP_STRINGS.ABOUT_DESCRIPTION_2}
              </p>
            </div>

            {/* Right: highlights (2/5) */}
            <div className='md:col-span-2 grid grid-cols-2 gap-4'>
              <div className='rounded-xl border bg-muted/30 p-4 flex flex-col items-center text-center gap-2'>
                <div className='h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <Globe className='h-5 w-5 text-primary' />
                </div>
                <p className='font-semibold text-sm'>Open Source</p>
                <p className='text-xs text-muted-foreground'>
                  {repositories.length > 0 ? `${repositories.length} repos` : 'Contributor'}
                </p>
              </div>

              <div className='rounded-xl border bg-muted/30 p-4 flex flex-col items-center text-center gap-2'>
                <div className='h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <Briefcase className='h-5 w-5 text-primary' />
                </div>
                <p className='font-semibold text-sm'>Full Stack</p>
                <p className='text-xs text-muted-foreground'>Frontend to infra</p>
              </div>

              <div className='rounded-xl border bg-muted/30 p-4 flex flex-col items-center text-center gap-2'>
                <div className='h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                  <Users className='h-5 w-5 text-primary' />
                </div>
                <p className='font-semibold text-sm'>Community</p>
                <p className='text-xs text-muted-foreground'>Knowledge sharing</p>
              </div>

              {totalStars > 0 && (
                <div className='rounded-xl border bg-muted/30 p-4 flex flex-col items-center text-center gap-2'>
                  <div className='h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                    <Star className='h-5 w-5 text-primary' />
                  </div>
                  <p className='font-semibold text-sm'>{totalStars} Stars</p>
                  <p className='text-xs text-muted-foreground'>Open source</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Skills Word Cloud */}
        <section className='mb-12'>
          <Card>
            <CardHeader>
              <CardTitle
                className='flex items-center gap-2'
                title='Technologies and programming languages I use'
              >
                <Code2 className='h-5 w-5' />
                {APP_STRINGS.SKILLS_TITLE}
              </CardTitle>
              <CardDescription title='Visual representation of my technical expertise'>
                {APP_STRINGS.SKILLS_SUBTITLE}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className='flex items-center justify-center h-64'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                  <span className='ml-2 text-muted-foreground'>
                    {APP_STRINGS.LOADING_REPOSITORIES}
                  </span>
                </div>
              )}

              {error && (
                <div className='text-center py-8'>
                  <p className='text-red-500 mb-4'>{APP_STRINGS.ERROR_REPOSITORY_LOAD}</p>
                  <div className='flex flex-wrap gap-2 justify-center'>
                    {skills.map(skill => (
                      <Badge key={skill} variant='secondary' className='text-sm'>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {!loading && !error && repositories.length > 0 && (
                <div className='space-y-4'>
                  <SimpleWordCloud repositories={repositories} />
                  <div className='text-center'>
                    <p className='text-sm text-muted-foreground'>
                      {APP_STRINGS.REPOSITORY_COUNT_MESSAGE.replace(
                        '{count}',
                        repositories.length.toString()
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
