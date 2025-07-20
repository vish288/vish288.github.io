import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Github, RefreshCw, User } from 'lucide-react'
import { githubOAuth, type GitHubUser } from '@/services/githubOAuth'

interface AdminAuthProps {
  onAuthenticated: (user: GitHubUser) => void
}

export default function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUsernameAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      setError('Please enter your GitHub username')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const user = await githubOAuth.authenticateUser(username.trim())
      if (user) {
        onAuthenticated(user)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Github className='h-5 w-5' />
              Admin Access
            </CardTitle>
            <CardDescription>
              Enter your GitHub username to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUsernameAuth} className='space-y-4'>
              <div>
                <label htmlFor='username' className='block text-sm font-medium mb-2'>
                  GitHub Username
                </label>
                <Input
                  id='username'
                  type='text'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder='your-github-username'
                  className='w-full'
                  disabled={loading}
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  We'll verify you're in the authorized users list
                </p>
              </div>

              {error && (
                <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                  <p className='text-red-800 text-sm'>{error}</p>
                </div>
              )}

              <Button type='submit' disabled={loading || !username.trim()} className='w-full'>
                {loading ? (
                  <>
                    <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                    Verifying...
                  </>
                ) : (
                  <>
                    <User className='h-4 w-4 mr-2' />
                    Access Dashboard
                  </>
                )}
              </Button>
            </form>

            <div className='mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md'>
              <p className='text-blue-800 text-sm'>
                <strong>How it works:</strong>
                <br />
                • Enter your GitHub username
                <br />
                • We verify you're authorized
                <br />
                • No tokens or passwords needed
                <br />• Access granted instantly
              </p>
            </div>

            <div className='text-center mt-4'>
              <p className='text-xs text-muted-foreground'>
                Only authorized GitHub users can access this dashboard
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
