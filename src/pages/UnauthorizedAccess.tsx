import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_STRINGS } from '@/constants/appStrings'

export default function UnauthorizedAccess() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader className='text-center'>
            <div className='flex justify-center mb-4'>
              <AlertTriangle className='h-12 w-12 text-amber-500' />
            </div>
            <CardTitle className='text-xl'>{APP_STRINGS.ADMIN_UNAUTHORIZED_TITLE}</CardTitle>
            <CardDescription>{APP_STRINGS.ADMIN_UNAUTHORIZED_SUBTITLE}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='bg-amber-50 border border-amber-200 rounded-md p-4'>
              <h3 className='font-medium text-amber-800 mb-2'>
                {APP_STRINGS.ADMIN_NEED_ACCESS_TITLE}
              </h3>
              <p className='text-sm text-amber-700'>{APP_STRINGS.ADMIN_NEED_ACCESS_MESSAGE}</p>
            </div>

            <div className='space-y-3'>
              <Button asChild className='w-full'>
                <Link to='/gratitude'>
                  <Mail className='h-4 w-4 mr-2' />
                  {APP_STRINGS.BTN_SEND_MESSAGE}
                </Link>
              </Button>

              <Button variant='outline' asChild className='w-full'>
                <Link to='/'>
                  <Home className='h-4 w-4 mr-2' />
                  {APP_STRINGS.BTN_HOME}
                </Link>
              </Button>
            </div>

            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>
                {APP_STRINGS.ADMIN_MONITORING_MESSAGE}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
