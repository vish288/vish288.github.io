import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, Home, Mail, Send, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { APP_STRINGS } from '@/constants/appStrings'
import { gratitudeService } from '@/services/gratitudeService'
import type { GratitudeMessage } from '@/services/gratitudeService'

type AdminRequestForm = GratitudeMessage

export default function UnauthorizedAccess() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminRequestForm>()

  const onSubmit = async (data: AdminRequestForm) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await gratitudeService.submitAdminAccessRequest(data)

      if (result.success) {
        setIsSubmitted(true)
        reset()
      } else {
        setError(result.error || 'Failed to submit your admin access request. Please try again.')
      }
    } catch (err) {
      setError('Failed to submit your request. Please try again.')
      console.error('Admin request submission error:', err)
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
              <h2 className='text-2xl font-bold mb-2'>Request Submitted! 🎉</h2>
              <p className='text-muted-foreground mb-6'>
                Your admin access request has been submitted and I&apos;ll review it soon. Thanks
                for explaining why you need access!
              </p>

              <div className='space-y-3'>
                <Button
                  onClick={() => {
                    setIsSubmitted(false)
                    setShowRequestForm(false)
                  }}
                >
                  Submit Another Request
                </Button>
                <Button variant='outline' asChild>
                  <Link to='/'>Go Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showRequestForm) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle>🔐 Request Admin Access</CardTitle>
              <CardDescription>
                Fill out this form to request admin access. Be sure to explain why you need it!
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
                    Why do you need admin access? <span className='text-red-500'>*</span>
                  </label>
                  <Textarea
                    id='message'
                    placeholder="Explain why you need admin access. Be specific about what you plan to do and why it's necessary..."
                    rows={6}
                    {...register('message', {
                      required: 'Please explain why you need admin access',
                      minLength: {
                        value: 20,
                        message:
                          'Please provide a more detailed explanation (at least 20 characters)',
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

                <div className='flex gap-3'>
                  <Button type='submit' disabled={isSubmitting} className='flex-1'>
                    {isSubmitting ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className='h-4 w-4 mr-2' />
                        Submit Request
                      </>
                    )}
                  </Button>
                  <Button type='button' variant='outline' onClick={() => setShowRequestForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader className='text-center'>
            <div className='flex justify-center mb-4'>
              <AlertTriangle className='h-12 w-12 text-amber-500' />
            </div>
            <CardTitle className='text-xl'>{APP_STRINGS.ADMIN_UNAUTHORIZED_TITLE}</CardTitle>
            <CardDescription>{APP_STRINGS.ADMIN_UNAUTHORIZED_SUBTITLE}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='bg-amber-50 border border-amber-200 rounded-md p-4'>
              <h3 className='font-medium text-amber-800 mb-2'>
                {APP_STRINGS.ADMIN_NEED_ACCESS_TITLE}
              </h3>
              <p className='text-sm text-amber-700'>{APP_STRINGS.ADMIN_NEED_ACCESS_MESSAGE}</p>
            </div>

            <div className='space-y-3'>
              <Button onClick={() => setShowRequestForm(true)} className='w-full'>
                <Mail className='h-4 w-4 mr-2' />
                Request Admin Access
              </Button>

              <Button variant='outline' asChild className='w-full'>
                <Link to='/gratitude'>
                  <Mail className='h-4 w-4 mr-2' />
                  Send Regular Message
                </Link>
              </Button>

              <Button variant='outline' asChild className='w-full'>
                <Link to='/'>
                  <Home className='h-4 w-4 mr-2' />
                  {APP_STRINGS.BTN_HOME}
                </Link>
              </Button>
            </div>

            <div className='text-center'>
              <p className='text-xs text-muted-foreground'>
                {APP_STRINGS.ADMIN_MONITORING_MESSAGE}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
