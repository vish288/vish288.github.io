import { useState, useEffect } from 'react'

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

interface GitHubApiResponse {
  repositories: Repository[]
  loading: boolean
  error: string | null
}

export function useGitHubRepositories(username: string = 'vish288'): GitHubApiResponse {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRepositories() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`
        )

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }

        const data: Repository[] = await response.json()

        // Filter out forks and include only repositories with meaningful content
        const filteredRepos = data.filter(
          repo => !repo.fork && repo.language && repo.stargazers_count >= 0 // Include all repos, even with 0 stars
        )

        setRepositories(filteredRepos)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repositories')
        console.error('Error fetching repositories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRepositories()
  }, [username])

  return { repositories, loading, error }
}
