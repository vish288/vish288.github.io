import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Github, Shield, AlertTriangle } from 'lucide-react'
import { githubOAuthProper } from '@/services/githubOAuthProper'

export default function GitHubOAuth() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      githubOAuthProper.initiateAuth()
      // This will redirect to GitHub, so we won't reach here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate GitHub authentication')
      setIsLoading(false)
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
              disabled={isLoading}
              className='w-full bg-gray-900 hover:bg-gray-800 text-white'
              size='lg'
            >
              <Github className='h-5 w-5 mr-3' />
              {isLoading ? 'Redirecting...' : 'Sign in with GitHub'}
            </Button>

            <div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
              <h3 className='font-medium text-blue-800 mb-2'>How it works:</h3>
              <ul className='text-blue-700 text-sm space-y-1'>
                <li>• Click &quot;Sign in with GitHub&quot;</li>
                <li>• You&apos;ll be redirected to GitHub</li>
                <li>• Authorize the application</li>
                <li>• Return here automatically</li>
                <li>• Access granted if you&apos;re authorized</li>
              </ul>
            </div>

            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>
                Only authorized GitHub users can access this dashboard.
                <br />
                All authentication is handled securely by GitHub.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
