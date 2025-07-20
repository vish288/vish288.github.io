import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle, ExternalLink } from 'lucide-react'
import GitHubIcon from '@/components/icons/GitHubIcon'
import { githubWebAuth } from '@/services/githubWebAuth'
import { APP_STRINGS } from '@/constants/appStrings'

export default function GitHubWebAuth() {
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleGitHubSignIn = async () => {
    setIsRedirecting(true)
    setError(null)

    try {
      githubWebAuth.initiateAuth()
      // This will redirect to GitHub, so we won't reach here
    } catch (err) {
      setError(err instanceof Error ? err.message : APP_STRINGS.ERROR_GITHUB_AUTH)
      setIsRedirecting(false)
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader className='text-center'>
            <div className='flex justify-center mb-4'>
              <Shield className='h-12 w-12 text-primary' />
            </div>
            <CardTitle className='text-xl'>{APP_STRINGS.ADMIN_ACCESS_TITLE}</CardTitle>
            <CardDescription>{APP_STRINGS.ADMIN_ACCESS_SUBTITLE}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {error && (
              <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                <div className='flex items-start gap-2'>
                  <AlertTriangle className='h-4 w-4 text-red-600 mt-0.5' />
                  <p className='text-red-800 text-sm'>{error}</p>
                </div>
              </div>
            )}

            <Button
              onClick={handleGitHubSignIn}
              disabled={isRedirecting}
              className='w-full bg-gray-900 hover:bg-gray-800 text-white'
              size='lg'
            >
              <GitHubIcon className='h-5 w-5 mr-3' />
              {isRedirecting ? (
                <>
                  <ExternalLink className='h-4 w-4 mr-2' />
                  {APP_STRINGS.LOADING_REDIRECTING}
                </>
              ) : (
                `Sign in with ${APP_STRINGS.BTN_GITHUB}`
              )}
            </Button>

            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>
                Only authorized users can access this dashboard.
                <br />
                You&apos;ll be redirected for secure authentication.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
