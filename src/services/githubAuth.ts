// GitHub authentication service for admin access
const ALLOWED_USERS = ['vish288'] // Configure allowed GitHub usernames

export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
}

class GitHubAuthService {
  private static readonly STORAGE_KEY = 'github_auth_token'

  // Initiate GitHub login (redirect to GitHub)
  initiateGitHubLogin(): void {
    // Since we can't do full OAuth without a backend, we'll guide users to create a token
    // and provide an easy way to authenticate with it
    const authUrl =
      'https://github.com/settings/tokens/new?description=Gratitude%20Dashboard&scopes=repo,read:user'
    window.open(authUrl, '_blank')
  }

  // Check if current user is authenticated and authorized
  async getCurrentUser(): Promise<GitHubUser | null> {
    const token = this.getStoredToken()
    if (!token) return null

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })

      if (!response.ok) {
        this.clearToken()
        return null
      }

      const user: GitHubUser = await response.json()

      // Check if user is in allowed list
      if (!ALLOWED_USERS.includes(user.login)) {
        throw new Error(`User ${user.login} is not authorized to access this dashboard`)
      }

      return user
    } catch (error) {
      console.error('Failed to get current user:', error)
      this.clearToken()
      return null
    }
  }

  // Store token
  setToken(token: string): void {
    localStorage.setItem(GitHubAuthService.STORAGE_KEY, token)
  }

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem(GitHubAuthService.STORAGE_KEY)
  }

  // Clear authentication
  clearToken(): void {
    localStorage.removeItem(GitHubAuthService.STORAGE_KEY)
  }

  // Sign out
  signOut(): void {
    this.clearToken()
    window.location.reload()
  }

  // Manual token authentication (fallback)
  async authenticateWithToken(token: string): Promise<GitHubUser | null> {
    this.setToken(token)
    return await this.getCurrentUser()
  }
}

export const githubAuth = new GitHubAuthService()
export { ALLOWED_USERS }
