import { useState, useEffect, useCallback } from 'react'

export interface Repository {
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

interface GitHubApiResponse {
  repositories: Repository[]
  loading: boolean
  error: string | null
  retry: () => void
}

// One fetch serves every route that needs the repo list (About + Repositories).
// The result is cached at module scope; an in-flight request is shared so two
// mounts never fire two requests.
let cache: Repository[] | null = null
let inflight: Promise<Repository[]> | null = null

function load(username: string): Promise<Repository[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`
    )
      .then(res => {
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
        return res.json() as Promise<Repository[]>
      })
      .then(data => {
        cache = data
        return data
      })
      .catch(err => {
        inflight = null // allow a later retry
        throw err
      })
  }
  return inflight
}

/** Test seam: drop cached state between tests. */
export function resetGitHubCache(): void {
  cache = null
  inflight = null
}

export function useGitHubRepositories(username: string = 'vish288'): GitHubApiResponse {
  const [repositories, setRepositories] = useState<Repository[]>(cache ?? [])
  const [loading, setLoading] = useState(cache === null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    let active = true
    // No synchronous setState here — the effect only schedules async resolution.
    load(username)
      .then(data => {
        if (active) {
          setRepositories(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to fetch repositories')
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [username])

  useEffect(() => run(), [run])

  const retry = useCallback(() => {
    cache = null
    inflight = null
    setLoading(true)
    setError(null)
    run()
  }, [run])

  return { repositories, loading, error, retry }
}
