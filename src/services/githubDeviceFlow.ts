// GitHub Device Flow for proper OAuth without client secret exposure
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
const YOUR_GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN // Your token for API calls
const ALLOWED_USERS = ['vish288'] // Configure allowed GitHub usernames

export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  id: number
}

interface DeviceCodeResponse {
  device_code: string
  user_code: string
  verification_uri: string
  expires_in: number
  interval: number
}

interface AccessTokenResponse {
  access_token?: string
  token_type?: string
  scope?: string
  error?: string
  error_description?: string
}

class GitHubDeviceFlowService {
  private static readonly STORAGE_KEY = 'github_oauth_user'
  private static readonly TOKEN_KEY = 'github_oauth_token'
  private pollInterval: number | null = null

  // Initiate GitHub Device Flow
  async initiateDeviceFlow(): Promise<DeviceCodeResponse | null> {
    if (!GITHUB_CLIENT_ID) {
      throw new Error('GitHub Client ID not configured')
    }

    try {
      const response = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          scope: 'read:user',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to initiate device flow')
      }

      return await response.json()
    } catch (error) {
      console.error('Device flow initiation error:', error)
      throw error
    }
  }

  // Poll for access token
  async pollForToken(deviceCode: string, interval: number): Promise<GitHubUser | null> {
    return new Promise((resolve, reject) => {
      this.pollInterval = window.setInterval(async () => {
        try {
          const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              client_id: GITHUB_CLIENT_ID,
              device_code: deviceCode,
              grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
            }),
          })

          const data: AccessTokenResponse = await response.json()

          if (data.access_token) {
            // Successfully got access token
            this.clearPolling()
            const user = await this.getUserFromToken(data.access_token)
            if (user) {
              this.setToken(data.access_token)
              this.setUser(user)
              resolve(user)
            } else {
              reject(new Error('User not authorized'))
            }
          } else if (data.error === 'authorization_pending') {
            // Still waiting for user authorization - keep polling
          } else if (data.error === 'slow_down') {
            // Slow down polling
            this.clearPolling()
            this.pollInterval = window.setInterval(
              async () => {
                // Restart with slower interval
              },
              (interval + 5) * 1000
            )
          } else {
            // Error or expired
            this.clearPolling()
            reject(new Error(data.error_description || 'Authorization failed'))
          }
        } catch (error) {
          this.clearPolling()
          reject(error)
        }
      }, interval * 1000)
    })
  }

  // Get user info from access token
  private async getUserFromToken(accessToken: string): Promise<GitHubUser | null> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get user info')
      }

      const user: GitHubUser = await response.json()

      // Check if user is authorized
      if (!ALLOWED_USERS.includes(user.login)) {
        throw new Error(`User ${user.login} is not authorized to access this dashboard`)
      }

      return user
    } catch (error) {
      console.error('Error getting user from token:', error)
      throw error
    }
  }

  // Check if current user is authenticated and authorized
  async getCurrentUser(): Promise<GitHubUser | null> {
    const storedUser = this.getStoredUser()
    const storedToken = this.getStoredToken()

    if (!storedUser || !storedToken) return null

    try {
      // Verify token is still valid
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })

      if (!response.ok || !ALLOWED_USERS.includes(storedUser.login)) {
        this.clearAuth()
        return null
      }

      return storedUser
    } catch (error) {
      this.clearAuth()
      return null
    }
  }

  // Make API calls using YOUR token (for repo operations)
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

  // Clear polling
  clearPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
  }

  // Store user info
  setUser(user: GitHubUser): void {
    localStorage.setItem(GitHubDeviceFlowService.STORAGE_KEY, JSON.stringify(user))
  }

  // Store access token
  setToken(token: string): void {
    localStorage.setItem(GitHubDeviceFlowService.TOKEN_KEY, token)
  }

  // Get stored user
  getStoredUser(): GitHubUser | null {
    const stored = localStorage.getItem(GitHubDeviceFlowService.STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  }

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem(GitHubDeviceFlowService.TOKEN_KEY)
  }

  // Clear authentication
  clearAuth(): void {
    this.clearPolling()
    localStorage.removeItem(GitHubDeviceFlowService.STORAGE_KEY)
    localStorage.removeItem(GitHubDeviceFlowService.TOKEN_KEY)
  }

  // Sign out
  signOut(): void {
    this.clearAuth()
    window.location.href = '/'
  }
}

export const githubDeviceFlow = new GitHubDeviceFlowService()
export { ALLOWED_USERS }
