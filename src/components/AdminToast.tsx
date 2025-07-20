import { useState } from 'react'
import { Shield, Settings, ChevronUp, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface AdminToastProps {
  user: { login: string; name: string } | null
  showToast: boolean
}

export default function AdminToast({ user, showToast }: AdminToastProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  if (!showToast || !user || !isVisible) {
    return null
  }

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <Card className='w-80 shadow-lg border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800'>
        <CardContent className='p-0'>
          {/* Collapsed Header */}
          <div className='flex items-center justify-between p-3'>
            <div className='flex items-center gap-2'>
              <Shield className='h-4 w-4 text-orange-600 dark:text-orange-400' />
              <span className='text-sm font-medium text-orange-800 dark:text-orange-200'>
                Admin Mode
              </span>
            </div>

            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsExpanded(!isExpanded)}
                className='h-6 w-6 p-0 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200'
              >
                {isExpanded ? (
                  <ChevronDown className='h-3 w-3' />
                ) : (
                  <ChevronUp className='h-3 w-3' />
                )}
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsVisible(false)}
                className='h-6 w-6 p-0 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200'
              >
                <X className='h-3 w-3' />
              </Button>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className='border-t border-orange-200 dark:border-orange-800 p-3 pt-2'>
              <div className='flex items-start gap-3'>
                <div className='mt-0.5'>
                  <Shield className='h-5 w-5 text-orange-600 dark:text-orange-400' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='font-medium text-sm text-orange-800 dark:text-orange-200'>
                    Administrator Access
                  </div>
                  <div className='text-xs text-orange-700 dark:text-orange-300 mt-1'>
                    Signed in as <span className='font-medium'>{user.name || user.login}</span>
                  </div>
                  <div className='text-xs text-orange-600 dark:text-orange-400 mt-2'>
                    You have full access to admin features including user management and message
                    monitoring.
                  </div>
                </div>
                <Settings className='h-4 w-4 text-orange-500 dark:text-orange-400 mt-0.5' />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
