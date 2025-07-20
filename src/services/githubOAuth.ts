// GitHub OAuth service for user authentication (no tokens needed from users)
// Uses your personal token for API calls, GitHub OAuth for user identification

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
const YOUR_GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN // Your token for API calls
const ALLOWED_USERS = ['vish288'] // Configure allowed GitHub usernames

export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
}

class GitHubOAuthService {
  private static readonly STORAGE_KEY = 'github_user_info'

  // Initiate GitHub OAuth flow
  initiateAuth(): void {
    if (!GITHUB_CLIENT_ID) {
      console.error('GitHub Client ID not configured')
      return
    }

    const redirectUri = `${window.location.origin}/admin/callback`
    const scope = 'read:user'
    const state = Math.random().toString(36).substring(7)

    // Store state for verification
    sessionStorage.setItem('oauth_state', state)

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`

    window.location.href = authUrl
  }

  // Handle OAuth callback (in real setup, this would need a backend)
  async handleCallback(code: string, state: string): Promise<GitHubUser | null> {
    // Verify state
    const storedState = sessionStorage.getItem('oauth_state')
    if (state !== storedState) {
      throw new Error('Invalid state parameter')
    }

    // In a real implementation, you'd exchange code for token on backend
    // For now, we'll simulate this by directly getting user info with your token
    console.log('OAuth code received:', code)

    // Simulate getting user from code (in real implementation, this would be done on backend)
    return null
  }

  // Manual authentication fallback - user provides their GitHub username
  async authenticateUser(username: string): Promise<GitHubUser | null> {
    try {
      // Use YOUR token to look up the user
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `Bearer ${YOUR_GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })

      if (!response.ok) {
        throw new Error('User not found')
      }

      const user: GitHubUser = await response.json()

      // Check if user is in allowed list
      if (!ALLOWED_USERS.includes(user.login)) {
        throw new Error(`User ${user.login} is not authorized to access this dashboard`)
      }

      // Store user info
      this.setUser(user)
      return user
    } catch (error) {
      console.error('Failed to authenticate user:', error)
      throw error
    }
  }

  // Check if current user is authenticated and authorized
  async getCurrentUser(): Promise<GitHubUser | null> {
    const storedUser = this.getStoredUser()
    if (!storedUser) return null

    // Verify user still exists and is authorized
    try {
      const response = await fetch(`https://api.github.com/users/${storedUser.login}`, {
        headers: {
          Authorization: `Bearer ${YOUR_GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })

      if (!response.ok || !ALLOWED_USERS.includes(storedUser.login)) {
        this.clearUser()
        return null
      }

      return storedUser
    } catch (error) {
      this.clearUser()
      return null
    }
  }

  // Make API calls using YOUR token (not user's token)
  async makeApiCall(endpoint: string, options: RequestInit = {}) {
    return fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${YOUR_GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        ...options.headers,
      },
    })
  }

  // Store user info
  setUser(user: GitHubUser): void {
    localStorage.setItem(GitHubOAuthService.STORAGE_KEY, JSON.stringify(user))
  }

  // Get stored user
  getStoredUser(): GitHubUser | null {
    const stored = localStorage.getItem(GitHubOAuthService.STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  }

  // Clear authentication
  clearUser(): void {
    localStorage.removeItem(GitHubOAuthService.STORAGE_KEY)
    sessionStorage.removeItem('oauth_state')
  }

  // Sign out
  signOut(): void {
    this.clearUser()
    window.location.href = '/'
  }
}

export const githubOAuth = new GitHubOAuthService()
export { ALLOWED_USERS }
