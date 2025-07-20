import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, AlertTriangle, Github } from 'lucide-react'
import { githubWebAuth, type GitHubUser } from '@/services/githubWebAuth'

export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<GitHubUser | null>(null)

  const handleOAuthCallback = useCallback(async () => {
    try {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const errorParam = searchParams.get('error')

      // Check for OAuth errors
      if (errorParam) {
        throw new Error(`OAuth error: ${errorParam}`)
      }

      if (!code || !state) {
        throw new Error('Missing OAuth parameters')
      }

      // Handle the OAuth callback
      const authenticatedUser = await githubWebAuth.handleCallback(code, state)

      if (authenticatedUser) {
        setUser(authenticatedUser)
        setStatus('success')

        // Redirect to admin dashboard after a brief delay
        setTimeout(() => {
          navigate('/admin/gratitude')
        }, 2000)
      } else {
        throw new Error('Authentication failed')
      }
    } catch (err) {
      console.error('OAuth callback error:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setStatus('error')
    }
  }, [searchParams, navigate])

  useEffect(() => {
    handleOAuthCallback()
  }, [handleOAuthCallback])

  const handleRetry = () => {
    navigate('/admin/gratitude')
  }

  if (status === 'processing') {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-md mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Github className='h-5 w-5' />
                Completing Sign In
              </CardTitle>
            </CardHeader>
            <CardContent className='text-center py-8'>
              <RefreshCw className='h-8 w-8 animate-spin mx-auto mb-4' />
              <p className='text-muted-foreground'>Processing your GitHub authentication...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-md mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <CheckCircle className='h-5 w-5 text-green-600' />
                Successfully Signed In
              </CardTitle>
            </CardHeader>
            <CardContent className='text-center py-8'>
              <div className='mb-4'>
                {user?.avatar_url && (
                  <img
                    src={user.avatar_url}
                    alt={user.name || user.login}
                    className='w-16 h-16 rounded-full mx-auto mb-3'
                  />
                )}
                <h3 className='font-semibold'>{user?.name || user?.login}</h3>
                <p className='text-sm text-muted-foreground'>@{user?.login}</p>
              </div>

              <p className='text-muted-foreground mb-4'>Redirecting to admin dashboard...</p>

              <Button onClick={() => navigate('/admin/gratitude')}>Go to Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
              Authentication Failed
            </CardTitle>
          </CardHeader>
          <CardContent className='text-center py-8'>
            <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-4'>
              <p className='text-red-800 text-sm'>{error}</p>
            </div>

            <div className='space-y-2'>
              <Button onClick={handleRetry} className='w-full'>
                Try Again
              </Button>
              <Button variant='outline' onClick={() => navigate('/')} className='w-full'>
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
