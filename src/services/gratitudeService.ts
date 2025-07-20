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
  private readonly octokit: Octokit | null = null

  constructor() {
    if (GITHUB_TOKEN) {
      this.octokit = new Octokit({
        auth: GITHUB_TOKEN,
      })
    }
  }

  // Categorize message content and return appropriate labels
  private categorizeMessage(message: string): string[] {
    const lowerMessage = message.toLowerCase()
    const labels = ['gratitude'] // Base label for all messages

    // Sentiment-based labels
    if (
      lowerMessage.includes('thank') ||
      lowerMessage.includes('grateful') ||
      lowerMessage.includes('appreciate')
    ) {
      labels.push('thankful')
    }

    if (
      lowerMessage.includes('love') ||
      lowerMessage.includes('amazing') ||
      lowerMessage.includes('awesome') ||
      lowerMessage.includes('great')
    ) {
      labels.push('positive')
    }

    if (
      lowerMessage.includes('help') ||
      lowerMessage.includes('support') ||
      lowerMessage.includes('assist')
    ) {
      labels.push('help-related')
    }

    // Content-based labels
    if (
      lowerMessage.includes('website') ||
      lowerMessage.includes('site') ||
      lowerMessage.includes('ui') ||
      lowerMessage.includes('design')
    ) {
      labels.push('website-feedback')
    }

    if (
      lowerMessage.includes('code') ||
      lowerMessage.includes('programming') ||
      lowerMessage.includes('development')
    ) {
      labels.push('code-related')
    }

    if (
      lowerMessage.includes('project') ||
      lowerMessage.includes('work') ||
      lowerMessage.includes('portfolio')
    ) {
      labels.push('project-feedback')
    }

    // Feedback type labels
    if (
      lowerMessage.includes('suggest') ||
      lowerMessage.includes('improve') ||
      lowerMessage.includes('feature')
    ) {
      labels.push('suggestion')
    }

    if (
      lowerMessage.includes('bug') ||
      lowerMessage.includes('issue') ||
      lowerMessage.includes('problem') ||
      lowerMessage.includes('error')
    ) {
      labels.push('bug-report')
    }

    if (
      lowerMessage.includes('question') ||
      lowerMessage.includes('how') ||
      lowerMessage.includes('?')
    ) {
      labels.push('question')
    }

    return labels
  }

  // Special categorization for admin access requests
  private categorizeAdminRequest(message: string): string[] {
    const lowerMessage = message.toLowerCase()
    const labels = ['admin-access-request'] // Special label for admin requests

    // Add reason-based labels
    if (
      lowerMessage.includes('work') ||
      lowerMessage.includes('collaborate') ||
      lowerMessage.includes('help')
    ) {
      labels.push('collaboration')
    }

    if (
      lowerMessage.includes('test') ||
      lowerMessage.includes('demo') ||
      lowerMessage.includes('review')
    ) {
      labels.push('testing')
    }

    if (
      lowerMessage.includes('urgent') ||
      lowerMessage.includes('asap') ||
      lowerMessage.includes('quickly')
    ) {
      labels.push('priority-request')
    }

    return labels
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
      // Categorize the message to generate appropriate labels
      const messageLabels = this.categorizeMessage(data.message)

      // Create GitHub issue with the gratitude message
      const response = await this.octokit.rest.issues.create({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        title: `Gratitude from ${data.name}`,
        body: this.formatIssueBody(data, locationInfo),
        labels: [...messageLabels, 'message'],
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

  // Submit admin access request with special labeling
  async submitAdminAccessRequest(data: GratitudeMessage): Promise<GratitudeSubmissionResult> {
    // Get location information
    const locationInfo = await this.getLocationInfo()

    if (!this.octokit) {
      // Fallback for development/demo without token
      console.log(
        'GitHub token not configured. Admin access request would be:',
        data,
        'Location:',
        locationInfo
      )
      return {
        success: true,
        issueNumber: Math.floor(Math.random() * 1000) + 1,
      }
    }

    try {
      // Categorize the admin request to generate appropriate labels
      const requestLabels = this.categorizeAdminRequest(data.message)

      // Create GitHub issue with the admin access request
      const response = await this.octokit.rest.issues.create({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        title: `🔐 Admin Access Request from ${data.name}`,
        body: this.formatAdminRequestBody(data, locationInfo),
        labels: [...requestLabels, 'admin-request'],
      })

      return {
        success: true,
        issueNumber: response.data.number,
      }
    } catch (error) {
      console.error('Failed to submit admin access request:', error)

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

  private formatAdminRequestBody(data: GratitudeMessage, locationInfo: LocationInfo): string {
    const timestamp = new Date().toISOString()

    return `## 🔐 Admin Access Request

**From:** ${data.name}  
**Email:** ${data.email}  
**Date:** ${timestamp}

---

### Request Reason

${data.message}

---

⚠️ **This is an admin access request submitted from the unauthorized access page.**

The user was likely trying to access admin functionality and was redirected to request access. Please review this request carefully and verify the user's identity and need for admin access before granting permissions.

### Actions Required
- [ ] Verify user identity
- [ ] Review request justification  
- [ ] Update \`VITE_GITHUB_ALLOWED_USERS\` environment variable if approved
- [ ] Close this issue after processing

### Submission Details
- **User Agent:** ${navigator.userAgent}
- **Timestamp:** ${timestamp}
- **Source:** Unauthorized Access Page
- **Request Type:** Admin Access Request

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
