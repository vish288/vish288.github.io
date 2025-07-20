import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Heart, Send, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface GratitudeForm {
  name: string
  email: string
  message: string
}

export default function Gratitude() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GratitudeForm>()

  const onSubmit = async (data: GratitudeForm) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // TODO: Implement GitHub storage for gratitude messages
      // For now, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Gratitude message:', data)

      setIsSubmitted(true)
      reset()
    } catch {
      setError('Failed to submit your message. Please try again.')
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
              <p className='text-muted-foreground mb-6'>
                Your gratitude message has been received. It means a lot to me!
              </p>
              <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
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

              {error && (
                <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                  <p className='text-red-800 text-sm'>{error}</p>
                </div>
              )}

              <Button type='submit' disabled={isSubmitting} className='w-full' size='lg'>
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
        <div className='mt-8 text-center'>
          <p className='text-sm text-muted-foreground'>
            Your messages are stored securely and handled with care. Thank you for taking the time
            to share your thoughts!
          </p>
        </div>
      </div>
    </div>
  )
}
