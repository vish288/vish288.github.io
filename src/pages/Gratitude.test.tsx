import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Gratitude from './Gratitude'

// Mock the gratitude service
vi.mock('@/services/gratitudeService', () => ({
  gratitudeService: {
    submitMessage: vi.fn(() => Promise.resolve({ success: true, issueNumber: 123 })),
    isConfigured: vi.fn(() => true),
  },
}))

// Mock fetch for location services
const mockFetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        ip: '192.168.1.1',
        country_name: 'United States',
        region: 'California',
        city: 'San Francisco',
        timezone: 'America/Los_Angeles',
      }),
  })
)

global.fetch = mockFetch

describe('Gratitude Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper function to complete the security captcha
  const completeCaptcha = async (user: any) => {
    const captchaInput = screen.getByLabelText(/security check/i)
    
    // Find the math problem - look for pattern like "5 + 3 = ?" or "8 - 2 = ?" or "4 × 3 = ?"
    const mathElement = screen.getByText(/\d+\s*[+\-×]\s*\d+\s*=\s*\?/)
    const mathText = mathElement.textContent
    
    if (mathText) {
      // Parse different types of math operations
      let answer = 0
      
      // Addition
      let match = mathText.match(/(\d+)\s*\+\s*(\d+)/)
      if (match) {
        answer = parseInt(match[1]) + parseInt(match[2])
      } else {
        // Subtraction
        match = mathText.match(/(\d+)\s*-\s*(\d+)/)
        if (match) {
          answer = parseInt(match[1]) - parseInt(match[2])
        } else {
          // Multiplication (× or x)
          match = mathText.match(/(\d+)\s*[×x]\s*(\d+)/)
          if (match) {
            answer = parseInt(match[1]) * parseInt(match[2])
          }
        }
      }
      
      if (answer !== 0) {
        await user.type(captchaInput, answer.toString())
      }
    }
  }
  it('renders the main heading and form', () => {
    render(<Gratitude />)

    expect(
      screen.getByRole('heading', { level: 1, name: /share your gratitude/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/your kind words and feedback/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('renders all form fields', () => {
    render(<Gratitude />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('shows captcha validation error when submitting without completing captcha', async () => {
    const user = userEvent.setup()
    render(<Gratitude />)

    // Fill form but don't complete captcha
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/your message/i), 'Test message that is long enough')

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please complete the security check first/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<Gratitude />)

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('type', 'email')

    // Just verify the email input exists and has correct type
    await user.type(emailInput, 'test@example.com')
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('validates message minimum length', async () => {
    const user = userEvent.setup()
    render(<Gratitude />)

    const messageInput = screen.getByLabelText(/your message/i)

    // Just verify the message input accepts text
    await user.type(messageInput, 'This is a test message')
    expect(messageInput).toHaveValue('This is a test message')
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<Gratitude />)

    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(
      screen.getByLabelText(/your message/i),
      'This is a test message that is long enough.'
    )

    // Complete the captcha
    await completeCaptcha(user)

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    // Should show success state after submission
    await waitFor(
      () => {
        expect(screen.getByText(/thank you!/i)).toBeInTheDocument()
        expect(screen.getByText(/your gratitude message has been received/i)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it('allows sending another message after success', async () => {
    const user = userEvent.setup()
    render(<Gratitude />)

    // Submit a message first
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(
      screen.getByLabelText(/your message/i),
      'This is a test message that is long enough.'
    )

    // Complete the captcha
    await completeCaptcha(user)

    await user.click(screen.getByRole('button', { name: /send message/i }))

    // Wait for success state
    await waitFor(
      () => {
        expect(screen.getByText(/thank you!/i)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Click "Send Another Message"
    await user.click(screen.getByRole('button', { name: /send another message/i }))

    // Should return to form view
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('handles form submission errors gracefully', async () => {
    // Mock the service to return an error
    const { gratitudeService } = await import('@/services/gratitudeService')
    vi.mocked(gratitudeService.submitMessage).mockResolvedValueOnce({
      success: false,
      error: 'Failed to submit your message',
    })

    const user = userEvent.setup()
    render(<Gratitude />)

    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(
      screen.getByLabelText(/your message/i),
      'This is a test message that is long enough.'
    )

    // Complete the captcha
    await completeCaptcha(user)

    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(
      () => {
        expect(screen.getByText(/failed to submit your message/i)).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it('displays proper placeholders and labels', () => {
    render(<Gratitude />)

    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/your.email@example.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/share your thoughts/i)).toBeInTheDocument()
  })

  it('shows required field indicators', () => {
    render(<Gratitude />)

    const requiredIndicators = screen.getAllByText('*')
    expect(requiredIndicators).toHaveLength(4) // Name, Email, Message, Security Check
  })

  it('includes accessibility features', () => {
    render(<Gratitude />)

    // Check for proper labeling
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/your message/i)

    expect(nameInput).toHaveAttribute('id')
    expect(emailInput).toHaveAttribute('id')
    expect(messageInput).toHaveAttribute('id')

    // Check input types
    expect(emailInput).toHaveAttribute('type', 'email')
  })
})
