import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className='h-4 w-4' />
    }
    return actualTheme === 'dark' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />
  }

  const getTitle = () => {
    if (theme === 'system') {
      return `System theme (currently ${actualTheme})`
    }
    return `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
  }

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={toggleTheme}
      title={getTitle()}
      className='h-8 w-8 p-0'
    >
      {getIcon()}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
