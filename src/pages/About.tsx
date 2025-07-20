import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, MapPin, Code2 } from 'lucide-react'
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

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent'>
            {APP_STRINGS.FULL_NAME}
          </h1>
          <p className='text-xl text-muted-foreground mb-6'>{APP_STRINGS.TAGLINE}</p>
          <div className='flex items-center justify-center gap-4 text-muted-foreground'>
            <div className='flex items-center gap-1' title='Current location and availability'>
              <MapPin className='h-4 w-4' />
              <span>{APP_STRINGS.LOCATION}</span>
            </div>
          </div>
        </div>

        {/* About Me */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>{APP_STRINGS.ABOUT_TITLE}</CardTitle>
            <CardDescription title='Learn about my professional background and interests'>
              {APP_STRINGS.ABOUT_SUBTITLE}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              {APP_STRINGS.ABOUT_DESCRIPTION_1}
            </p>
            <p className='text-muted-foreground leading-relaxed'>
              {APP_STRINGS.ABOUT_DESCRIPTION_2}
            </p>
          </CardContent>
        </Card>

        {/* Skills Word Cloud */}
        <Card className='mb-8'>
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

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle title='Professional networking and collaboration opportunities'>
              {APP_STRINGS.CONNECT_TITLE}
            </CardTitle>
            <CardDescription title='Connect with me through these professional platforms'>
              {APP_STRINGS.CONNECT_SUBTITLE}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button
                variant='outline'
                asChild
                title='View my open source projects and contributions'
              >
                <a
                  href={APP_STRINGS.GITHUB_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2'
                >
                  <GitHubIcon className='h-4 w-4' />
                  {APP_STRINGS.BTN_GITHUB}
                </a>
              </Button>

              <Button
                variant='outline'
                asChild
                title='Connect with me on LinkedIn for professional networking'
              >
                <a
                  href={APP_STRINGS.LINKEDIN_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2'
                >
                  <LinkedInIcon className='h-4 w-4' />
                  {APP_STRINGS.BTN_LINKEDIN}
                </a>
              </Button>

              <Button variant='outline' asChild title='Send me a message through the contact form'>
                <a href='/gratitude' className='flex items-center gap-2'>
                  <Mail className='h-4 w-4' />
                  {APP_STRINGS.BTN_SEND_MESSAGE}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
