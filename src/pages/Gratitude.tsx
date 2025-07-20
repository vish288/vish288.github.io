import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Heart, Send, CheckCircle, Github } from 'lucide-react'
import { useForm } from 'react-hook-form'
import SimpleCaptcha from '@/components/SimpleCaptcha'
import { gratitudeService } from '@/services/gratitudeService'
import type { GratitudeMessage } from '@/services/gratitudeService'

type GratitudeForm = GratitudeMessage

export default function Gratitude() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaValid, setCaptchaValid] = useState(false)
  const [issueNumber, setIssueNumber] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GratitudeForm>()

  const onSubmit = async (data: GratitudeForm) => {
    if (!captchaValid) {
      setError('Please complete the security check first.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await gratitudeService.submitMessage(data)

      if (result.success) {
        setIssueNumber(result.issueNumber || null)
        setIsSubmitted(true)
        reset()
        setCaptchaValid(false) // Reset captcha for next submission
      } else {
        setError(result.error || 'Failed to submit your message. Please try again.')
      }
    } catch (err) {
      setError('Failed to submit your message. Please try again.')
      console.error('Submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Card className='text-center'>
            <CardContent className='pt-8 pb-8'>
              <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4' />
              <h2 className='text-2xl font-bold mb-2'>Thank You!</h2>
              <p className='text-muted-foreground mb-4'>
                Your gratitude message has been received and stored securely. It means a lot to me!
              </p>

              {issueNumber && (
                <div className='bg-secondary p-4 rounded-lg mb-6'>
                  <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2'>
                    <Github className='h-4 w-4' />
                    <span>Stored as GitHub Issue #{issueNumber}</span>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Your message is safely stored and I&apos;ll be notified immediately.
                  </p>
                </div>
              )}

              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setIssueNumber(null)
                }}
              >
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <Heart className='h-12 w-12 text-red-500' />
          </div>
          <h1 className='text-4xl font-bold mb-4'>Share Your Gratitude</h1>
          <p className='text-muted-foreground text-lg'>
            Your kind words and feedback help me grow and improve. Share what you&apos;re grateful
            for or any message you&apos;d like to send.
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>
              Your message will be stored securely and reviewed with appreciation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium mb-2'>
                    Name <span className='text-red-500'>*</span>
                  </label>
                  <Input
                    id='name'
                    placeholder='Your name'
                    {...register('name', { required: 'Name is required' })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor='email' className='block text-sm font-medium mb-2'>
                    Email <span className='text-red-500'>*</span>
                  </label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='your.email@example.com'
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor='message' className='block text-sm font-medium mb-2'>
                  Your Message <span className='text-red-500'>*</span>
                </label>
                <Textarea
                  id='message'
                  placeholder="Share your thoughts, gratitude, feedback, or any message you'd like to send..."
                  rows={6}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters long',
                    },
                  })}
                  className={errors.message ? 'border-red-500' : ''}
                />
                {errors.message && (
                  <p className='text-red-500 text-sm mt-1'>{errors.message.message}</p>
                )}
              </div>

              {/* CAPTCHA */}
              <SimpleCaptcha onVerify={setCaptchaValid} isValid={captchaValid} />

              {error && (
                <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                  <p className='text-red-800 text-sm'>{error}</p>
                </div>
              )}

              <Button
                type='submit'
                disabled={isSubmitting || !captchaValid}
                className='w-full'
                size='lg'
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className='h-4 w-4 mr-2' />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <div className='mt-8 text-center space-y-2'>
          <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            <Github className='h-4 w-4' />
            <span>Messages are stored securely using GitHub Issues</span>
          </div>
          <p className='text-xs text-muted-foreground'>
            Your message will be stored as a private GitHub issue, and I&apos;ll receive instant
            notifications. Location and IP information are captured for security purposes. All data
            is handled with care and respect for your privacy.
          </p>
        </div>
      </div>
    </div>
  )
}
