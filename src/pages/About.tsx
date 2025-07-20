import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, Linkedin, Mail, MapPin, Code2 } from 'lucide-react'
import SimpleWordCloud from '@/components/SimpleWordCloud'
import { useGitHubRepositories } from '@/hooks/useGitHubRepositories'

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
            Visweshwaran S
          </h1>
          <p className='text-xl text-muted-foreground mb-6'>
            Full Stack Developer | Open Source Enthusiast | Problem Solver
          </p>
          <div className='flex items-center justify-center gap-4 text-muted-foreground'>
            <div className='flex items-center gap-1'>
              <MapPin className='h-4 w-4' />
              <span>Toronto, Canada & India</span>
            </div>
          </div>
        </div>

        {/* About Me */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
            <CardDescription>Get to know more about my journey and passion</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              I&apos;m a passionate full-stack developer with a love for creating elegant solutions
              to complex problems. With experience in modern web technologies, I enjoy building
              applications that make a difference in people&apos;s lives.
            </p>
            <p className='text-muted-foreground leading-relaxed'>
              When I&apos;m not coding, you can find me exploring new technologies, contributing to
              open source projects, or sharing knowledge with the developer community. I believe in
              the power of collaboration and continuous learning.
            </p>
          </CardContent>
        </Card>

        {/* Skills Word Cloud */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Code2 className='h-5 w-5' />
              Skills & Technologies
            </CardTitle>
            <CardDescription>
              Dynamic visualization based on my GitHub repositories and their languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className='flex items-center justify-center h-64'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                <span className='ml-2 text-muted-foreground'>Loading repositories...</span>
              </div>
            )}

            {error && (
              <div className='text-center py-8'>
                <p className='text-red-500 mb-4'>Failed to load repository data</p>
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
                    Word cloud generated from {repositories.length} repositories
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Let&apos;s Connect</CardTitle>
            <CardDescription>
              Professional connections and project collaborations welcome
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button variant='outline' asChild>
                <a
                  href='https://github.com/vish288'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2'
                >
                  <Github className='h-4 w-4' />
                  GitHub
                </a>
              </Button>

              <Button variant='outline' disabled className='flex items-center gap-2'>
                <Linkedin className='h-4 w-4' />
                LinkedIn (Coming Soon)
              </Button>

              <Button variant='outline' disabled className='flex items-center gap-2'>
                <Mail className='h-4 w-4' />
                Contact (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <div className='mt-8 text-center'>
          <p className='text-sm text-muted-foreground'>
            This page will be enhanced with more details and projects in the coming days.
          </p>
        </div>
      </div>
    </div>
  )
}
