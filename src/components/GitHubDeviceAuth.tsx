import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Github, Shield, ExternalLink, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'
import { githubDeviceFlow } from '@/services/githubDeviceFlow'

interface GitHubDeviceAuthProps {
  onAuthenticated: (user: any) => void
}

export default function GitHubDeviceAuth({ onAuthenticated }: GitHubDeviceAuthProps) {
  const [deviceFlow, setDeviceFlow] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'waiting' | 'success'>('idle')

  const startDeviceFlow = async () => {
    setLoading(true)
    setError(null)

    try {
      const deviceCode = await githubDeviceFlow.initiateDeviceFlow()
      if (deviceCode) {
        setDeviceFlow(deviceCode)
        setStatus('waiting')

        // Start polling for token
        const user = await githubDeviceFlow.pollForToken(
          deviceCode.device_code,
          deviceCode.interval
        )
        if (user) {
          setStatus('success')
          onAuthenticated(user)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setStatus('idle')
    } finally {
      setLoading(false)
    }
  }

  const cancelAuth = () => {
    githubDeviceFlow.clearPolling()
    setDeviceFlow(null)
    setStatus('idle')
    setLoading(false)
  }

  if (status === 'waiting' && deviceFlow) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-md mx-auto'>
          <Card>
            <CardHeader className='text-center'>
              <div className='flex justify-center mb-4'>
                <Github className='h-12 w-12 text-primary' />
              </div>
              <CardTitle>Complete Authentication</CardTitle>
              <CardDescription>Follow these steps to sign in with GitHub</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='bg-primary/10 border border-primary/20 rounded-lg p-4'>
                <div className='text-center space-y-3'>
                  <p className='font-semibold'>Step 1: Copy this code</p>
                  <div className='bg-background border rounded p-3'>
                    <code className='text-2xl font-mono font-bold tracking-wider text-primary'>
                      {deviceFlow.user_code}
                    </code>
                  </div>

                  <p className='font-semibold'>Step 2: Open GitHub</p>
                  <Button variant='outline' size='sm' asChild className='w-full'>
                    <a href={deviceFlow.verification_uri} target='_blank' rel='noopener noreferrer'>
                      <ExternalLink className='h-4 w-4 mr-2' />
                      Open GitHub Device Activation
                    </a>
                  </Button>

                  <p className='text-sm text-muted-foreground'>
                    Paste the code above and authorize the app
                  </p>
                </div>
              </div>

              <div className='text-center space-y-3'>
                <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                  <RefreshCw className='h-4 w-4 animate-spin' />
                  <span>Waiting for authorization...</span>
                </div>

                <Button variant='outline' onClick={cancelAuth}>
                  Cancel
                </Button>
              </div>
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
            <CardContent className='text-center py-8'>
              <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4' />
              <h2 className='text-2xl font-bold mb-2'>Successfully Authenticated!</h2>
              <p className='text-muted-foreground'>Redirecting to admin dashboard...</p>
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
          <CardHeader className='text-center'>
            <div className='flex justify-center mb-4'>
              <Shield className='h-12 w-12 text-primary' />
            </div>
            <CardTitle className='text-xl'>Admin Access Required</CardTitle>
            <CardDescription>
              Authenticate with your GitHub account to access the admin dashboard
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
              onClick={startDeviceFlow}
              disabled={loading}
              className='w-full bg-gray-900 hover:bg-gray-800 text-white'
              size='lg'
            >
              <Github className='h-5 w-5 mr-3' />
              {loading ? 'Starting...' : 'Sign in with GitHub'}
            </Button>

            <div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
              <h3 className='font-medium text-blue-800 mb-2'>Secure Device Flow:</h3>
              <ul className='text-blue-700 text-sm space-y-1'>
                <li>• No client secrets in browser</li>
                <li>• GitHub verifies your identity</li>
                <li>• Copy/paste code to authorize</li>
                <li>• Automatic return to dashboard</li>
                <li>• Uses your actual GitHub account</li>
              </ul>
            </div>

            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>
                Only authorized GitHub users can access this dashboard.
                <br />
                Authentication is handled securely by GitHub.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
