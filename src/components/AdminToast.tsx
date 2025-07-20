import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Shield, Settings } from 'lucide-react'

interface AdminToastProps {
  user: { login: string; name: string } | null
  showToast: boolean
}

export default function AdminToast({ user, showToast }: AdminToastProps) {
  useEffect(() => {
    if (showToast && user) {
      // Create persistent admin mode toast
      const toastId = toast(
        () => (
          <div className='flex items-center gap-3'>
            <Shield className='h-5 w-5 text-orange-500' />
            <div>
              <div className='font-medium text-sm'>Admin Mode Active</div>
              <div className='text-xs text-muted-foreground'>
                Signed in as {user.name || user.login}
              </div>
            </div>
            <Settings className='h-4 w-4 text-muted-foreground' />
          </div>
        ),
        {
          duration: Infinity, // Persistent
          position: 'top-right',
          style: {
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
          id: 'admin-mode',
        }
      )

      // Cleanup function
      return () => {
        toast.dismiss(toastId)
      }
    }

    return undefined
  }, [showToast, user])

  return <Toaster />
}

export { toast }
