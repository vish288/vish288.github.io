import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Github, Shield, AlertTriangle, ExternalLink } from 'lucide-react'
import { githubWebAuth } from '@/services/githubWebAuth'

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
      setError(err instanceof Error ? err.message : 'Failed to initiate GitHub authentication')
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
            <CardTitle className='text-xl'>Admin Access Required</CardTitle>
            <CardDescription>
              Sign in with your GitHub account to access the admin dashboard
            </CardDescription>
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
              <Github className='h-5 w-5 mr-3' />
              {isRedirecting ? (
                <>
                  <ExternalLink className='h-4 w-4 mr-2' />
                  Redirecting to GitHub...
                </>
              ) : (
                'Sign in with GitHub'
              )}
            </Button>

            <div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
              <h3 className='font-medium text-blue-800 mb-2'>Secure OAuth Flow:</h3>
              <ul className='text-blue-700 text-sm space-y-1'>
                <li>• Standard GitHub OAuth authorization</li>
                <li>• Redirect to GitHub for authentication</li>
                <li>• Authorize the &quot;Gratitude Dashboard&quot; app</li>
                <li>• Automatic return to your dashboard</li>
                <li>• Access granted to authorized users only</li>
              </ul>
            </div>

            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>
                Only authorized GitHub users can access this dashboard.
                <br />
                You&apos;ll be redirected to GitHub for secure authentication.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
