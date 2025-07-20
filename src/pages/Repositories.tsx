import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
} from 'lucide-react'

interface Repository {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  updated_at: string
  created_at: string
  fork: boolean
  pushed_at: string
}

type SortOption = 'name' | 'stars' | 'forks' | 'updated' | 'created'
type SortDirection = 'asc' | 'desc'
type FilterOption = 'all' | 'original' | 'forked'

export default function Repositories() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('updated')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [filter, setFilter] = useState<FilterOption>('all')

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/users/vish288/repos?sort=updated&per_page=100'
        )
        if (!response.ok) {
          throw new Error('Failed to fetch repositories')
        }
        const data = await response.json()
        setRepos(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchRepositories()
  }, [])

  const filteredAndSortedRepos = useMemo(() => {
    // Filter repositories
    let filtered = repos
    if (filter === 'original') {
      filtered = repos.filter(repo => !repo.fork)
    } else if (filter === 'forked') {
      filtered = repos.filter(repo => repo.fork)
    }

    // Sort repositories
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'stars':
          aValue = a.stargazers_count
          bValue = b.stargazers_count
          break
        case 'forks':
          aValue = a.forks_count
          bValue = b.forks_count
          break
        case 'created':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        case 'updated':
        default:
          aValue = new Date(a.updated_at).getTime()
          bValue = new Date(b.updated_at).getTime()
          break
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return sorted
  }, [repos, filter, sortBy, sortDirection])

  const originalRepos = repos.filter(repo => !repo.fork)
  const forkedRepos = repos.filter(repo => repo.fork)

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(option)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) return null
    return sortDirection === 'asc' ? (
      <SortAsc className='h-3 w-3 ml-1' />
    ) : (
      <SortDesc className='h-3 w-3 ml-1' />
    )
  }

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Loading repositories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <p className='text-destructive'>Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-4'>My Repositories</h1>
        <p className='text-muted-foreground text-lg mb-6'>
          Here are my open source projects and contributions on GitHub.
        </p>

        {/* Statistics */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <Card className='p-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>{repos.length}</div>
              <div className='text-sm text-muted-foreground'>Total Repos</div>
            </div>
          </Card>
          <Card className='p-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>{originalRepos.length}</div>
              <div className='text-sm text-muted-foreground'>Original</div>
            </div>
          </Card>
          <Card className='p-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>{forkedRepos.length}</div>
              <div className='text-sm text-muted-foreground'>Forked</div>
            </div>
          </Card>
          <Card className='p-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>
                {repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
              </div>
              <div className='text-sm text-muted-foreground'>Total Stars</div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className='flex flex-col sm:flex-row gap-4 mb-6'>
          {/* Filter Controls */}
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4' />
            <span className='text-sm font-medium'>Filter:</span>
            <div className='flex gap-1'>
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setFilter('all')}
              >
                All ({repos.length})
              </Button>
              <Button
                variant={filter === 'original' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setFilter('original')}
              >
                Original ({originalRepos.length})
              </Button>
              <Button
                variant={filter === 'forked' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setFilter('forked')}
              >
                Forked ({forkedRepos.length})
              </Button>
            </div>
          </div>

          {/* Sort Controls */}
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Sort by:</span>
            <div className='flex gap-1 flex-wrap'>
              <Button
                variant={sortBy === 'updated' ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleSort('updated')}
                className='flex items-center'
              >
                Updated
                {getSortIcon('updated')}
              </Button>
              <Button
                variant={sortBy === 'created' ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleSort('created')}
                className='flex items-center'
              >
                Created
                {getSortIcon('created')}
              </Button>
              <Button
                variant={sortBy === 'stars' ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleSort('stars')}
                className='flex items-center'
              >
                Stars
                {getSortIcon('stars')}
              </Button>
              <Button
                variant={sortBy === 'forks' ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleSort('forks')}
                className='flex items-center'
              >
                Forks
                {getSortIcon('forks')}
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleSort('name')}
                className='flex items-center'
              >
                Name
                {getSortIcon('name')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Repository Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredAndSortedRepos.map(repo => (
          <Card key={repo.id} className='h-full flex flex-col hover:shadow-lg transition-shadow'>
            <CardHeader className='flex-1'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <CardTitle className='text-lg leading-tight'>
                      <a
                        href={repo.html_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-primary transition-colors'
                      >
                        {repo.name}
                      </a>
                    </CardTitle>
                    {repo.fork && (
                      <Badge variant='outline' className='text-xs'>
                        <GitFork className='h-3 w-3 mr-1' />
                        Fork
                      </Badge>
                    )}
                  </div>
                  <CardDescription className='text-sm'>
                    {repo.description || 'No description available'}
                  </CardDescription>
                </div>
                <Github className='h-5 w-5 text-muted-foreground flex-shrink-0 ml-2' />
              </div>
            </CardHeader>

            <CardContent className='pt-0'>
              <div className='flex flex-wrap gap-2 mb-4'>
                {repo.language && <Badge variant='secondary'>{repo.language}</Badge>}
                {repo.topics.slice(0, 3).map(topic => (
                  <Badge key={topic} variant='outline'>
                    {topic}
                  </Badge>
                ))}
              </div>

              <div className='grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4'>
                <div className='flex items-center gap-1'>
                  <Star className='h-3 w-3' />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <GitFork className='h-3 w-3' />
                  <span>{repo.forks_count}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
                <div className='text-xs opacity-75'>
                  Created {new Date(repo.created_at).toLocaleDateString()}
                </div>
              </div>

              <Button asChild className='w-full'>
                <a
                  href={repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-center gap-2'
                >
                  View Repository
                  <ExternalLink className='h-4 w-4' />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedRepos.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>No repositories found with the current filter.</p>
        </div>
      )}
    </div>
  )
}
