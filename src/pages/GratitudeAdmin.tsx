import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Github, Calendar, ExternalLink, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { gratitudeService } from '@/services/gratitudeService'
import { githubWebAuth, type GitHubUser } from '@/services/githubWebAuth'
import AdminNavigation from '@/components/AdminNavigation'
import AdminToast from '@/components/AdminToast'
import GitHubWebAuth from '@/components/GitHubWebAuth'
import { useNavigate } from 'react-router-dom'

interface GratitudeMessage {
  id: number
  title: string
  body: string | null | undefined
  createdAt: string
  url: string
  labels: string[]
}

export default function GratitudeAdmin() {
  const [allMessages, setAllMessages] = useState<GratitudeMessage[]>([])
  const [filteredMessages, setFilteredMessages] = useState<GratitudeMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showMessages, setShowMessages] = useState(false)
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [excludeAdminRequests, setExcludeAdminRequests] = useState(true)
  const navigate = useNavigate()

  const checkAuth = useCallback(async () => {
    setAuthLoading(true)
    try {
      const currentUser = await githubWebAuth.getCurrentUser()
      if (currentUser && !githubWebAuth.isUserAuthorized(currentUser.login)) {
        // User is authenticated but not authorized
        navigate('/unauthorized')
        return
      }
      setUser(currentUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }, [navigate])

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleAdminSignOut = () => {
    githubWebAuth.signOut()
    setUser(null)
  }

  const loadMessages = useCallback(async () => {
    if (!gratitudeService.isConfigured()) {
      setError('GitHub API not configured. Please check environment variables.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await gratitudeService.getAllIssues(50)
      setAllMessages(data)
      applyFilters(data, selectedLabels, excludeAdminRequests)
    } catch (err) {
      setError('Failed to load messages')
      console.error('Error loading messages:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedLabels, excludeAdminRequests])

  useEffect(() => {
    if (user) {
      loadMessages()
    }
  }, [user, loadMessages])

  const applyFilters = (messages: GratitudeMessage[], labels: string[], excludeAdmin: boolean) => {
    let filtered = [...messages]

    // Filter out admin requests if enabled
    if (excludeAdmin) {
      filtered = filtered.filter(
        msg => !msg.labels.includes('admin-request') && !msg.labels.includes('admin-access-request')
      )
    }

    // Filter by selected labels if any
    if (labels.length > 0) {
      filtered = filtered.filter(msg => labels.some(label => msg.labels.includes(label)))
    }

    setFilteredMessages(filtered)
  }

  const getAllLabels = () => {
    const labelSet = new Set<string>()
    allMessages.forEach(msg => {
      msg.labels.forEach(label => labelSet.add(label))
    })
    return Array.from(labelSet).sort()
  }

  const toggleLabel = (label: string) => {
    const newLabels = selectedLabels.includes(label)
      ? selectedLabels.filter(l => l !== label)
      : [...selectedLabels, label]
    setSelectedLabels(newLabels)
    applyFilters(allMessages, newLabels, excludeAdminRequests)
  }

  const toggleExcludeAdmin = () => {
    const newExclude = !excludeAdminRequests
    setExcludeAdminRequests(newExclude)
    applyFilters(allMessages, selectedLabels, newExclude)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const extractEmailFromBody = (body: string | null | undefined): string => {
    if (!body) return 'N/A'
    const emailMatch = body.match(/\*\*Email:\*\* (.+?)(?:\s|\n)/)
    return emailMatch?.[1] ?? 'N/A'
  }

  const extractMessageFromBody = (body: string | null | undefined): string => {
    if (!body) return 'N/A'
    const messageMatch = body.match(/### Message\n\n([\s\S]*?)(?:\n\n---|$)/)
    return messageMatch?.[1]?.trim() ?? 'N/A'
  }

  const extractLocationFromBody = (body: string | null | undefined): string => {
    if (!body) return 'N/A'

    const locationMatches = body.match(/\*\*(?:IP Address|Country|City):\*\* (.+?)(?:\n|$)/g)
    if (!locationMatches) return 'N/A'

    const parts: string[] = []
    const ipMatch = body.match(/\*\*IP Address:\*\* (.+?)(?:\n|$)/)
    const countryMatch = body.match(/\*\*Country:\*\* (.+?)(?:\n|$)/)
    const cityMatch = body.match(/\*\*City:\*\* (.+?)(?:\n|$)/)

    if (cityMatch?.[1]) parts.push(cityMatch[1])
    if (countryMatch?.[1]) parts.push(countryMatch[1])
    if (ipMatch?.[1]) parts.push(`(${ipMatch[1]})`)

    return parts.length > 0 ? parts.join(', ') : 'N/A'
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
        <div className='max-w-4xl mx-auto'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold flex items-center gap-2'>
                <Github className='h-8 w-8' />
                Gratitude Messages
              </h1>
              <p className='text-muted-foreground'>
                Monitor and manage gratitude messages from your website
              </p>
              <div className='flex items-center gap-2 mt-2 text-sm text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <span>Welcome, {user.name || user.login}</span>
                </div>
              </div>
            </div>

            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={() => setShowMessages(!showMessages)}
                className='flex items-center gap-2'
              >
                {showMessages ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                {showMessages ? 'Hide' : 'Show'} Messages
              </Button>
              <Button onClick={loadMessages} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-6'>
              <p className='text-red-800'>{error}</p>
            </div>
          )}

          <div className='grid gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-primary'>{allMessages.length}</div>
                    <div className='text-sm text-muted-foreground'>Total Issues</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {filteredMessages.length}
                    </div>
                    <div className='text-sm text-muted-foreground'>Filtered</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-green-600'>
                      {
                        filteredMessages.filter(
                          m =>
                            new Date(m.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length
                      }
                    </div>
                    <div className='text-sm text-muted-foreground'>This Week</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-purple-600'>
                      <a
                        href={`https://github.com/${import.meta.env.VITE_GITHUB_OWNER || 'vish288'}/${import.meta.env.VITE_GITHUB_REPO || 'gratitude-messages'}/issues`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:underline flex items-center justify-center gap-1'
                      >
                        <ExternalLink className='h-4 w-4' />
                        GitHub
                      </a>
                    </div>
                    <div className='text-sm text-muted-foreground'>View All</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filter Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='exclude-admin'
                    checked={excludeAdminRequests}
                    onChange={toggleExcludeAdmin}
                    className='rounded'
                  />
                  <label htmlFor='exclude-admin' className='text-sm'>
                    Exclude admin requests
                  </label>
                </div>

                <div>
                  <p className='text-sm font-medium mb-2'>Filter by labels:</p>
                  <div className='flex flex-wrap gap-2'>
                    {getAllLabels().map(label => (
                      <Badge
                        key={label}
                        variant={selectedLabels.includes(label) ? 'default' : 'outline'}
                        className='cursor-pointer'
                        onClick={() => toggleLabel(label)}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {showMessages && (
              <div className='space-y-4'>
                {loading && (
                  <div className='text-center py-8'>
                    <RefreshCw className='h-8 w-8 animate-spin mx-auto mb-2' />
                    <p className='text-muted-foreground'>Loading messages...</p>
                  </div>
                )}

                {!loading && filteredMessages.length === 0 && (
                  <Card>
                    <CardContent className='text-center py-8'>
                      <p className='text-muted-foreground'>
                        No messages found with current filters
                      </p>
                    </CardContent>
                  </Card>
                )}

                {!loading &&
                  filteredMessages.map(message => (
                    <Card key={message.id}>
                      <CardHeader>
                        <div className='flex items-start justify-between'>
                          <div>
                            <CardTitle className='text-lg'>{message.title}</CardTitle>
                            <div className='flex items-center gap-4 mt-2'>
                              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                                <Calendar className='h-4 w-4' />
                                {formatDate(message.createdAt)}
                              </div>
                              <Badge variant='outline'>#{message.id}</Badge>
                              <div className='flex gap-1'>
                                {message.labels.map(label => (
                                  <Badge key={label} variant='secondary' className='text-xs'>
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button variant='outline' size='sm' asChild>
                            <a href={message.url} target='_blank' rel='noopener noreferrer'>
                              <ExternalLink className='h-4 w-4' />
                            </a>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-3'>
                          <div>
                            <p className='text-sm font-medium text-muted-foreground'>Email:</p>
                            <p className='text-sm'>{extractEmailFromBody(message.body)}</p>
                          </div>
                          <div>
                            <p className='text-sm font-medium text-muted-foreground'>Location:</p>
                            <p className='text-sm'>{extractLocationFromBody(message.body)}</p>
                          </div>
                          <div>
                            <p className='text-sm font-medium text-muted-foreground'>Message:</p>
                            <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                              {extractMessageFromBody(message.body)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
