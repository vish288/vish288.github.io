import type { ComponentType } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { User, Blocks } from 'lucide-react'
import GitHubIcon from '@/components/icons/GitHubIcon'
import { cn } from '@/lib/utils'
import Repositories from '@/pages/Repositories'
import About from '@/pages/About'
import McpInstall from '@/pages/McpInstall'
import ThemeToggle from '@/components/ThemeToggle'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { APP_STRINGS } from '@/constants/appStrings'
import './index.css'

function Navigation() {
  const location = useLocation()

  const navItems: {
    path: string
    label: string
    icon: ComponentType<{ className?: string }>
  }[] = [
    { path: '/', label: APP_STRINGS.NAV_ABOUT, icon: User },
    { path: '/repositories', label: APP_STRINGS.NAV_REPOSITORIES, icon: GitHubIcon },
    { path: '/mcp-install', label: 'MCP', icon: Blocks },
  ]

  return (
    <nav className='border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-full bg-gradient-to-r from-primary to-emerald-600 flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>VS</span>
            </div>
            <span className='font-bold text-xl'>{APP_STRINGS.DISPLAY_NAME}</span>
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
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className='border-t border-border/50 bg-background/80 backdrop-blur-sm'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0'>
          <p className='text-xs text-muted-foreground'>
            © {new Date().getFullYear()} {APP_STRINGS.DISPLAY_NAME}.
          </p>
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

      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<About />} />
          <Route path='/repositories' element={<Repositories />} />
          <Route path='/mcp-install' element={<McpInstall />} />
          <Route path='*' element={<Navigate to='/' replace />} />
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
