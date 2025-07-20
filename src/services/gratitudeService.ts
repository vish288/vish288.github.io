import { Octokit } from '@octokit/rest'

interface GratitudeMessage {
  name: string
  email: string
  message: string
}

interface LocationInfo {
  ip?: string
  country?: string
  region?: string
  city?: string
  timezone?: string
}

interface GratitudeSubmissionResult {
  success: boolean
  issueNumber?: number
  error?: string
}

// GitHub configuration
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'vish288'
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'gratitude-messages'
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN

class GratitudeService {
  private octokit: Octokit | null = null

  constructor() {
    if (GITHUB_TOKEN) {
      this.octokit = new Octokit({
        auth: GITHUB_TOKEN,
      })
    }
  }

  // Get location information from IP geolocation service
  private async getLocationInfo(): Promise<LocationInfo> {
    try {
      const response = await fetch('https://ipapi.co/json/')
      if (response.ok) {
        const data = await response.json()
        return {
          ip: data.ip,
          country: data.country_name,
          region: data.region,
          city: data.city,
          timezone: data.timezone,
        }
      }
    } catch (error) {
      console.warn('Failed to fetch location info:', error)
    }
    
    // Fallback: try to get just the IP from a simpler service
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      if (response.ok) {
        const data = await response.json()
        return { ip: data.ip }
      }
    } catch (error) {
      console.warn('Failed to fetch IP info:', error)
    }
    
    return {}
  }

  // Check if service is configured with your token
  isConfigured(): boolean {
    return this.octokit !== null
  }

  async submitMessage(data: GratitudeMessage): Promise<GratitudeSubmissionResult> {
    // Get location information
    const locationInfo = await this.getLocationInfo()
    
    if (!this.octokit) {
      // Fallback for development/demo without token
      console.log('GitHub token not configured. Message would be:', data, 'Location:', locationInfo)
      return {
        success: true,
        issueNumber: Math.floor(Math.random() * 1000) + 1,
      }
    }

    try {
      // Create GitHub issue with the gratitude message
      const response = await this.octokit.rest.issues.create({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        title: `Gratitude from ${data.name}`,
        body: this.formatIssueBody(data, locationInfo),
        labels: ['gratitude', 'message'],
      })

      return {
        success: true,
        issueNumber: response.data.number,
      }
    } catch (error) {
      console.error('Failed to submit gratitude message:', error)

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  private formatIssueBody(data: GratitudeMessage, locationInfo: LocationInfo): string {
    const timestamp = new Date().toISOString()

    return `## Gratitude Message

**From:** ${data.name}  
**Email:** ${data.email}  
**Date:** ${timestamp}

---

### Message

${data.message}

---

*This message was submitted through the gratitude form on [vish288.github.io](https://vish288.github.io/gratitude)*

### Submission Details
- **User Agent:** ${navigator.userAgent}
- **Timestamp:** ${timestamp}
- **Source:** Website Contact Form

### Location Information
${locationInfo.ip ? `- **IP Address:** ${locationInfo.ip}` : ''}
${locationInfo.country ? `- **Country:** ${locationInfo.country}` : ''}
${locationInfo.region ? `- **Region:** ${locationInfo.region}` : ''}
${locationInfo.city ? `- **City:** ${locationInfo.city}` : ''}
${locationInfo.timezone ? `- **Timezone:** ${locationInfo.timezone}` : ''}
${!locationInfo.ip ? '- **Location:** Unable to determine location information' : ''}`
  }

  async getMessages(limit: number = 10) {
    if (!this.octokit) {
      // Service not configured with admin token
      console.warn('GitHub API not configured. Please check environment variables.')
      return []
    }

    try {
      const response = await this.octokit.rest.issues.list({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        labels: 'gratitude',
        state: 'open',
        sort: 'created',
        direction: 'desc',
        per_page: limit,
      })

      return response.data.map(issue => ({
        id: issue.number,
        title: issue.title,
        body: issue.body,
        createdAt: issue.created_at,
        url: issue.html_url,
      }))
    } catch (error) {
      console.error('Failed to fetch gratitude messages:', error)
      return []
    }
  }
}

export const gratitudeService = new GratitudeService()
export type { GratitudeMessage, GratitudeSubmissionResult, LocationInfo }
