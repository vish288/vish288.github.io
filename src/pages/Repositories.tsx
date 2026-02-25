import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ExternalLink,
  Star,
  GitFork,
  SortAsc,
  SortDesc,
  Blocks,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import GitHubIcon from '@/components/icons/GitHubIcon'
import { APP_STRINGS } from '@/constants/appStrings'

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

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Vue: '#41b883',
  Svelte: '#ff3e00',
}

const PAGE_SIZE = 10

export default function Repositories() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('updated')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [filter, setFilter] = useState<FilterOption>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const ghUser = APP_STRINGS.GITHUB_URL.split('/').pop()
        const response = await fetch(
          `https://api.github.com/users/${ghUser}/repos?sort=updated&per_page=100`
        )
        if (!response.ok) throw new Error('Failed to fetch repositories')
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
    let filtered = repos
    if (filter === 'original') filtered = repos.filter(repo => !repo.fork)
    else if (filter === 'forked') filtered = repos.filter(repo => repo.fork)

    return [...filtered].sort((a, b) => {
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
      if (sortDirection === 'asc') return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    })
  }, [repos, filter, sortBy, sortDirection])

  // Reset visible count when filter/sort changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filter, sortBy, sortDirection])

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredAndSortedRepos.length))
  }, [filteredAndSortedRepos.length])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  const visibleRepos = filteredAndSortedRepos.slice(0, visibleCount)
  const hasMore = visibleCount < filteredAndSortedRepos.length

  const originalRepos = repos.filter(repo => !repo.fork)
  const forkedRepos = repos.filter(repo => repo.fork)
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)

  const handleSort = (option: SortOption) => {
    if (sortBy === option) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    else {
      setSortBy(option)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ option }: { option: SortOption }) => {
    if (sortBy !== option) return null
    return sortDirection === 'asc' ? (
      <SortAsc className='h-3 w-3' />
    ) : (
      <SortDesc className='h-3 w-3' />
    )
  }

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-20'>
        <div className='flex items-center justify-center gap-3'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <span className='text-muted-foreground'>Loading repositories...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-20 text-center'>
        <p className='text-destructive'>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl'>
      {/* Hero */}
      <section className='mb-10'>
        <p className='text-xs font-semibold uppercase tracking-widest text-primary mb-2'>
          Open Source
        </p>
        <h1 className='text-3xl sm:text-4xl font-bold tracking-tight mb-3'>Repositories</h1>
        <p className='text-lg text-muted-foreground mb-6 max-w-2xl'>
          Open source projects and contributions on GitHub.
        </p>

        {/* Inline stats */}
        <div className='flex flex-wrap gap-6 text-sm'>
          <div className='flex items-center gap-1.5'>
            <GitHubIcon className='h-4 w-4 text-muted-foreground' />
            <span className='font-semibold'>{repos.length}</span>
            <span className='text-muted-foreground'>repos</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Star className='h-4 w-4 text-muted-foreground' />
            <span className='font-semibold'>{totalStars}</span>
            <span className='text-muted-foreground'>stars</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='font-semibold'>{originalRepos.length}</span>
            <span className='text-muted-foreground'>original</span>
            <span className='text-muted-foreground/50'>·</span>
            <span className='font-semibold'>{forkedRepos.length}</span>
            <span className='text-muted-foreground'>forked</span>
          </div>
        </div>
      </section>

      {/* MCP featured banner */}
      <section className='mb-8 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex items-start gap-3'>
          <div className='h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
            <Blocks className='h-4 w-4 text-primary' />
          </div>
          <div>
            <p className='font-semibold text-sm'>MCP Installation Gateway</p>
            <p className='text-xs text-muted-foreground'>
              One-click install for GitLab, Atlassian, and Coda MCP servers.
            </p>
          </div>
        </div>
        <Button asChild size='sm' variant='outline' className='flex-shrink-0'>
          <Link to='/mcp-install' className='flex items-center gap-1.5'>
            Open <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </Button>
      </section>

      {/* Controls row — segmented pill style */}
      <section className='mb-6 pb-6 border-b'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
          {/* Filter — segmented control */}
          <div className='inline-flex rounded-lg border bg-muted/30 p-0.5'>
            {(
              [
                ['all', 'All', repos.length],
                ['original', 'Original', originalRepos.length],
                ['forked', 'Forked', forkedRepos.length],
              ] as const
            ).map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer
                  ${
                    filter === key
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {label}
                <span className='ml-1 text-muted-foreground/70'>{count}</span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className='flex items-center gap-1.5'>
            <span className='text-xs text-muted-foreground mr-1'>Sort</span>
            {(
              [
                ['updated', 'Updated'],
                ['created', 'Created'],
                ['stars', 'Stars'],
                ['name', 'Name'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={`
                  px-2.5 py-1 text-xs rounded-md transition-all flex items-center gap-1 cursor-pointer
                  ${
                    sortBy === key
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                {label}
                <SortIcon option={key} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Repository list */}
      <section className='space-y-1'>
        {visibleRepos.map(repo => (
          <a
            key={repo.id}
            href={repo.html_url}
            target='_blank'
            rel='noopener noreferrer'
            className='group flex items-start gap-4 py-4 px-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors'
          >
            {/* Language dot */}
            <div className='mt-1.5 flex-shrink-0'>
              {repo.language ? (
                <span
                  className='block w-3 h-3 rounded-full'
                  style={{
                    backgroundColor: LANGUAGE_COLORS[repo.language] || '#6b7280',
                  }}
                  title={repo.language}
                />
              ) : (
                <span className='block w-3 h-3 rounded-full bg-muted-foreground/20' />
              )}
            </div>

            {/* Content */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='font-semibold text-sm group-hover:text-primary transition-colors truncate'>
                  {repo.name}
                </span>
                {repo.fork && (
                  <Badge variant='outline' className='text-[10px] px-1.5 py-0'>
                    <GitFork className='h-2.5 w-2.5 mr-0.5' />
                    Fork
                  </Badge>
                )}
                <ExternalLink className='h-3 w-3 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-colors flex-shrink-0' />
              </div>
              {repo.description && (
                <p className='text-xs text-muted-foreground line-clamp-1 mb-1.5'>
                  {repo.description}
                </p>
              )}
              <div className='flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
                {repo.language && <span>{repo.language}</span>}
                {repo.stargazers_count > 0 && (
                  <span className='flex items-center gap-0.5'>
                    <Star className='h-3 w-3' /> {repo.stargazers_count}
                  </span>
                )}
                {repo.forks_count > 0 && (
                  <span className='flex items-center gap-0.5'>
                    <GitFork className='h-3 w-3' /> {repo.forks_count}
                  </span>
                )}
                <span className='text-muted-foreground/50'>
                  Updated {new Date(repo.updated_at).toLocaleDateString()}
                </span>
                {repo.topics.length > 0 && (
                  <span className='hidden sm:flex gap-1'>
                    {repo.topics.slice(0, 3).map(topic => (
                      <Badge key={topic} variant='outline' className='text-[10px] px-1.5 py-0'>
                        {topic}
                      </Badge>
                    ))}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* Load more sentinel for infinite scroll */}
      {hasMore && (
        <div ref={sentinelRef} className='flex justify-center py-8'>
          <button
            onClick={loadMore}
            className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none'
          >
            <ChevronDown className='h-4 w-4' />
            Show more ({filteredAndSortedRepos.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {filteredAndSortedRepos.length === 0 && (
        <div className='text-center py-16'>
          <p className='text-muted-foreground'>No repositories found with the current filter.</p>
        </div>
      )}
    </div>
  )
}
