import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function UnauthorizedAccess() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader className='text-center'>
            <div className='flex justify-center mb-4'>
              <AlertTriangle className='h-12 w-12 text-amber-500' />
            </div>
            <CardTitle className='text-xl'>Access Restricted</CardTitle>
            <CardDescription>
              Sorry, you don't have permission to access this admin area
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='bg-amber-50 border border-amber-200 rounded-md p-4'>
              <h3 className='font-medium text-amber-800 mb-2'>Need Access?</h3>
              <p className='text-sm text-amber-700'>
                If you believe you should have access to this admin dashboard, please reach out
                politely and explain why you need access. Access is restricted to authorized users
                only.
              </p>
            </div>

            <div className='space-y-3'>
              <Button asChild className='w-full'>
                <Link to='/gratitude'>
                  <Mail className='h-4 w-4 mr-2' />
                  Send a Message
                </Link>
              </Button>

              <Button variant='outline' asChild className='w-full'>
                <Link to='/'>
                  <Home className='h-4 w-4 mr-2' />
                  Go to Homepage
                </Link>
              </Button>
            </div>

            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>
                This area is monitored. Unauthorized access attempts are logged.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
