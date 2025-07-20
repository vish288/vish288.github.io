import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import SimpleCaptcha from '@/components/SimpleCaptcha'
import SentimentRoller from '@/components/SentimentRoller'
import { gratitudeService } from '@/services/gratitudeService'
import type { GratitudeMessage } from '@/services/gratitudeService'
import { APP_STRINGS } from '@/constants/appStrings'

type GratitudeForm = GratitudeMessage

export default function Gratitude() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaValid, setCaptchaValid] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GratitudeForm>()

  const onSubmit = async (data: GratitudeForm) => {
    if (!captchaValid) {
      setError(APP_STRINGS.CAPTCHA_REQUIRED_ERROR)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await gratitudeService.submitMessage(data)

      if (result.success) {
        setIsSubmitted(true)
        reset()
        setCaptchaValid(false) // Reset captcha for next submission
      } else {
        setError(result.error || APP_STRINGS.ERROR_SUBMISSION_FAILED)
      }
    } catch (err) {
      setError(APP_STRINGS.ERROR_SUBMISSION_FAILED)
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
              <h2 className='text-2xl font-bold mb-2'>{APP_STRINGS.GRATITUDE_SUCCESS_TITLE}</h2>
              <p className='text-muted-foreground mb-6'>{APP_STRINGS.GRATITUDE_SUCCESS_MESSAGE}</p>

              <Button
                onClick={() => {
                  setIsSubmitted(false)
                }}
              >
                {APP_STRINGS.BTN_SEND_ANOTHER}
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
          <div className='flex justify-center mb-6'>
            <SentimentRoller className='text-4xl font-bold' interval={2500} />
          </div>
          <h1 className='text-3xl font-bold mb-4'>{APP_STRINGS.GRATITUDE_PAGE_TITLE}</h1>
          <p className='text-muted-foreground text-lg'>{APP_STRINGS.GRATITUDE_PAGE_DESCRIPTION}</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{APP_STRINGS.GRATITUDE_FORM_TITLE}</CardTitle>
            <CardDescription>{APP_STRINGS.GRATITUDE_FORM_SUBTITLE}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium mb-2'>
                    {APP_STRINGS.FORM_NAME_LABEL} <span className='text-red-500'>*</span>
                  </label>
                  <Input
                    id='name'
                    placeholder='Your name'
                    {...register('name', { required: APP_STRINGS.VALIDATION_NAME_REQUIRED })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor='email' className='block text-sm font-medium mb-2'>
                    {APP_STRINGS.FORM_EMAIL_LABEL} <span className='text-red-500'>*</span>
                  </label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='your.email@example.com'
                    {...register('email', {
                      required: APP_STRINGS.VALIDATION_EMAIL_REQUIRED,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: APP_STRINGS.VALIDATION_EMAIL_INVALID,
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
                  {APP_STRINGS.FORM_MESSAGE_LABEL} <span className='text-red-500'>*</span>
                </label>
                <Textarea
                  id='message'
                  placeholder={APP_STRINGS.FORM_MESSAGE_PLACEHOLDER}
                  rows={6}
                  {...register('message', {
                    required: APP_STRINGS.VALIDATION_MESSAGE_REQUIRED,
                    minLength: {
                      value: 10,
                      message: APP_STRINGS.VALIDATION_MESSAGE_MIN_LENGTH,
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
                    {APP_STRINGS.LOADING_SENDING}
                  </>
                ) : (
                  <>
                    <Send className='h-4 w-4 mr-2' />
                    {APP_STRINGS.BTN_SEND_MESSAGE}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
