import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Heart, User } from 'lucide-react'
import GitHubIcon from '@/components/icons/GitHubIcon'
import SentimentRoller from '@/components/SentimentRoller'
import { cn } from '@/lib/utils'
import Repositories from '@/pages/Repositories'
import About from '@/pages/About'
import Gratitude from '@/pages/Gratitude'
import GratitudeAdmin from '@/pages/GratitudeAdmin'
import AdminUserManagement from '@/pages/AdminUserManagement'
import UnauthorizedAccess from '@/pages/UnauthorizedAccess'
import OAuthCallback from '@/pages/OAuthCallback'
import AdminToast from '@/components/AdminToast'
import ThemeToggle from '@/components/ThemeToggle'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { APP_STRINGS } from '@/constants/appStrings'
import './index.css'

function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: APP_STRINGS.NAV_ABOUT, icon: User },
    { path: '/repositories', label: APP_STRINGS.NAV_REPOSITORIES, icon: GitHubIcon },
    { path: '/gratitude', label: APP_STRINGS.NAV_GRATITUDE, icon: Heart },
  ]

  return (
    <nav className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-full bg-gradient-to-r from-primary via-accent to-secondary flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>VS</span>
            </div>
            <span className='font-bold text-xl'>{APP_STRINGS.FULL_NAME}</span>
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
                  {path === '/gratitude' ? (
                    <SentimentRoller className='text-sm hidden sm:flex' interval={4000} />
                  ) : (
                    <>
                      <Icon className='h-4 w-4' />
                      <span className='hidden sm:inline'>{label}</span>
                    </>
                  )}
                  {path === '/gratitude' && <Heart className='h-4 w-4 sm:hidden' />}
                </Link>
              </Button>
            ))}
            <ThemeToggle />
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
          <p className='text-xs text-muted-foreground'>© 2025 {APP_STRINGS.FULL_NAME}.</p>
          <a
            href={APP_STRINGS.GITHUB_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <GitHubIcon className='h-4 w-4' />
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
          <Route path='/' element={<About />} />
          <Route path='/repositories' element={<Repositories />} />
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
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App
