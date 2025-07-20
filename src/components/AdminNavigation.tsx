import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, Users, LogOut, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminNavigationProps {
  user: { login: string; name: string; avatar_url: string }
  onSignOut: () => void
}

export default function AdminNavigation({ user, onSignOut }: AdminNavigationProps) {
  const location = useLocation()

  const adminNavItems = [
    {
      path: '/admin/gratitude',
      label: 'Messages',
      icon: MessageSquare,
      description: 'View gratitude messages',
    },
    {
      path: '/admin/users',
      label: 'User Management',
      icon: Users,
      description: 'Manage admin access',
    },
  ]

  return (
    <div className='bg-muted/50 border-b'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between py-3'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Shield className='h-5 w-5 text-primary' />
              <span className='font-semibold text-sm'>Admin Panel</span>
            </div>

            <nav className='flex items-center gap-1'>
              {adminNavItems.map(({ path, label, icon: Icon, description }) => (
                <Button
                  key={path}
                  variant={location.pathname === path ? 'default' : 'ghost'}
                  size='sm'
                  asChild
                  className={cn(
                    'h-8 px-3 text-xs',
                    location.pathname === path && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Link to={path} title={description}>
                    <Icon className='h-3 w-3 mr-1.5' />
                    {label}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <Avatar className='h-6 w-6'>
                <AvatarImage src={user.avatar_url} alt={user.name || user.login} />
                <AvatarFallback className='text-xs'>
                  {(user.name || user.login)[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='text-xs font-medium'>{user.name || user.login}</span>
                <span className='text-xs text-muted-foreground'>@{user.login}</span>
              </div>
            </div>

            <Button variant='outline' size='sm' onClick={onSignOut} className='h-8 px-3 text-xs'>
              <LogOut className='h-3 w-3 mr-1.5' />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
