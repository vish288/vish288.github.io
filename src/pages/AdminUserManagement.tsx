import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, Plus, X, Search, RefreshCw, AlertTriangle } from 'lucide-react'
import { githubWebAuth, type GitHubUser, ALLOWED_USERS } from '@/services/githubWebAuth'
import AdminNavigation from '@/components/AdminNavigation'
import AdminToast, { toast } from '@/components/AdminToast'
import GitHubWebAuth from '@/components/GitHubWebAuth'
import { useNavigate } from 'react-router-dom'

interface GitHubUserInfo {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
}

export default function AdminUserManagement() {
  const [allowedUsers, setAllowedUsers] = useState<string[]>([...ALLOWED_USERS])
  const [newUsername, setNewUsername] = useState('')
  const [searchResults, setSearchResults] = useState<GitHubUserInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const navigate = useNavigate()

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setAuthLoading(true)
    try {
      const currentUser = await githubWebAuth.getCurrentUser()
      if (currentUser && !ALLOWED_USERS.includes(currentUser.login)) {
        // User is authenticated but not authorized
        navigate('/unauthorized')
        return
      }
      setUser(currentUser)
    } catch {
      setError('Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleAdminSignOut = () => {
    githubWebAuth.signOut()
    setUser(null)
  }

  const searchGitHubUser = async (username: string) => {
    if (!username.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://api.github.com/users/${username.trim()}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('User not found on GitHub')
        } else {
          setError('Failed to fetch user information')
        }
        setSearchResults([])
        return
      }

      const userInfo: GitHubUserInfo = await response.json()
      setSearchResults([userInfo])
    } catch (err) {
      setError('Failed to search GitHub user')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const addUser = (username: string) => {
    if (allowedUsers.includes(username)) {
      toast.error(`${username} is already in the allowed users list`)
      return
    }

    const newUsers = [...allowedUsers, username]
    setAllowedUsers(newUsers)
    setNewUsername('')
    setSearchResults([])
    toast.success(`Added ${username} to allowed users`)

    // In a real implementation, you'd update the backend/config here
    console.log('Updated allowed users:', newUsers)
  }

  const removeUser = (username: string) => {
    if (username === 'vish288') {
      toast.error('Cannot remove the primary admin user')
      return
    }

    const newUsers = allowedUsers.filter(user => user !== username)
    setAllowedUsers(newUsers)
    toast.success(`Removed ${username} from allowed users`)

    // In a real implementation, you'd update the backend/config here
    console.log('Updated allowed users:', newUsers)
  }

  const handleSearch = (e: any) => {
    e.preventDefault()
    searchGitHubUser(newUsername)
  }

  if (authLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-md mx-auto'>
          <Card>
            <CardContent className='text-center py-8'>
              <RefreshCw className='h-8 w-8 animate-spin mx-auto mb-2' />
              <p className='text-muted-foreground'>Checking authentication...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!user) {
    return <GitHubWebAuth />
  }

  return (
    <>
      <AdminNavigation user={user} onSignOut={handleAdminSignOut} />
      <AdminToast user={user} showToast={true} />

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto space-y-6'>
          <div>
            <h1 className='text-3xl font-bold flex items-center gap-2'>
              <Users className='h-8 w-8' />
              User Management
            </h1>
            <p className='text-muted-foreground'>Manage who can access the admin dashboard</p>
          </div>

          {/* Current Allowed Users */}
          <Card>
            <CardHeader>
              <CardTitle>Allowed Users</CardTitle>
              <CardDescription>
                Users who currently have access to the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {allowedUsers.map(username => (
                  <div
                    key={username}
                    className='flex items-center justify-between p-3 border rounded-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={`https://github.com/${username}.png`} />
                        <AvatarFallback>{username[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='font-medium'>{username}</div>
                        {username === 'vish288' && (
                          <Badge variant='secondary' className='text-xs'>
                            Primary Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => removeUser(username)}
                      disabled={username === 'vish288'}
                      className='text-red-600 hover:text-red-700'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add New User */}
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>Search for GitHub users and grant them admin access</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <form onSubmit={handleSearch} className='flex gap-2'>
                <Input
                  placeholder='Enter GitHub username'
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  className='flex-1'
                />
                <Button type='submit' disabled={loading || !newUsername.trim()}>
                  {loading ? (
                    <RefreshCw className='h-4 w-4 animate-spin' />
                  ) : (
                    <Search className='h-4 w-4' />
                  )}
                </Button>
              </form>

              {error && (
                <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                  <p className='text-red-800 text-sm'>{error}</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className='border rounded-lg p-4'>
                  {searchResults.map(user => (
                    <div key={user.login} className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>{user.login[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-medium'>{user.name || user.login}</div>
                          <div className='text-sm text-muted-foreground'>@{user.login}</div>
                          {user.bio && (
                            <div className='text-xs text-muted-foreground mt-1'>
                              {user.bio || ''}
                            </div>
                          )}
                          <div className='flex gap-4 text-xs text-muted-foreground mt-1'>
                            <span>{user.public_repos} repos</span>
                            <span>{user.followers} followers</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => addUser(user.login)}
                        disabled={allowedUsers.includes(user.login)}
                      >
                        <Plus className='h-4 w-4 mr-2' />
                        {allowedUsers.includes(user.login) ? 'Already Added' : 'Add User'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Warning */}
          <Card className='border-amber-200 bg-amber-50'>
            <CardContent className='pt-6'>
              <div className='flex items-start gap-3'>
                <AlertTriangle className='h-5 w-5 text-amber-600 mt-0.5' />
                <div className='text-sm'>
                  <p className='font-medium text-amber-800 mb-1'>Important Note</p>
                  <p className='text-amber-700'>
                    Changes made here are currently for demonstration purposes. In a production
                    environment, these changes would be persisted to your configuration system or
                    backend service. The current implementation only updates the local state.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
