import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Github, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import Repositories from '@/pages/Repositories'
import About from '@/pages/About'
import Gratitude from '@/pages/Gratitude'
import GratitudeAdmin from '@/pages/GratitudeAdmin'
import AdminUserManagement from '@/pages/AdminUserManagement'
import UnauthorizedAccess from '@/pages/UnauthorizedAccess'
import OAuthCallback from '@/pages/OAuthCallback'
import AdminToast from '@/components/AdminToast'
import './index.css'

function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Repositories', icon: Github },
    { path: '/about', label: 'About', icon: User },
    { path: '/gratitude', label: 'Gratitude', icon: Heart },
  ]

  return (
    <nav className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-full bg-gradient-to-r from-primary to-emerald-600 flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>VS</span>
            </div>
            <span className='font-bold text-xl'>Visweshwaran S</span>
          </Link>

          {/* Navigation Links */}
          <div className='flex items-center space-x-1'>
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={location.pathname === path ? 'default' : 'ghost'}
                size='sm'
                asChild
              >
                <Link
                  to={path}
                  className={cn(
                    'flex items-center space-x-2',
                    location.pathname === path && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Icon className='h-4 w-4' />
                  <span className='hidden sm:inline'>{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className='border-t bg-background'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0'>
          <p className='text-xs text-muted-foreground'>© 2025 Visweshwaran S.</p>
          <a
            href='https://github.com/vish288'
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <Github className='h-4 w-4' />
          </a>
        </div>
      </div>
    </footer>
  )
}

function AppContent() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navigation />
      <AdminToast user={null} showToast={false} />

      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<Repositories />} />
          <Route path='/about' element={<About />} />
          <Route path='/gratitude' element={<Gratitude />} />
          <Route path='/admin/gratitude' element={<GratitudeAdmin />} />
          <Route path='/admin/users' element={<AdminUserManagement />} />
          <Route path='/admin/callback' element={<OAuthCallback />} />
          <Route path='/unauthorized' element={<UnauthorizedAccess />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
