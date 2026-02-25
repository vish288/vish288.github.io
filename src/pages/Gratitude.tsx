import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, CheckCircle, ArrowRight, MessageSquare, Shield, Lock } from 'lucide-react'
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
        setCaptchaValid(false)
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
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-lg mx-auto text-center'>
          <div className='mx-auto mb-6 h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center'>
            <CheckCircle className='h-8 w-8 text-green-500' />
          </div>
          <h2 className='text-2xl font-bold mb-3'>{APP_STRINGS.GRATITUDE_SUCCESS_TITLE}</h2>
          <p className='text-muted-foreground mb-8'>{APP_STRINGS.GRATITUDE_SUCCESS_MESSAGE}</p>
          <Button
            onClick={() => {
              setIsSubmitted(false)
            }}
            variant='outline'
            className='gap-2'
          >
            {APP_STRINGS.BTN_SEND_ANOTHER}
            <ArrowRight className='h-3.5 w-3.5' />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl'>
      {/* Hero */}
      <section className='mb-10'>
        <div className='flex justify-center mb-4'>
          <SentimentRoller className='text-4xl font-bold' interval={2500} />
        </div>
        <h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-center mb-3'>
          {APP_STRINGS.GRATITUDE_PAGE_TITLE}
        </h1>
        <p className='text-lg text-muted-foreground text-center max-w-2xl mx-auto'>
          {APP_STRINGS.GRATITUDE_PAGE_DESCRIPTION}
        </p>
      </section>

      <div className='grid md:grid-cols-5 gap-10 items-start max-w-4xl mx-auto'>
        {/* Left: Form (3/5) */}
        <div className='md:col-span-3'>
          <div className='rounded-xl border bg-background p-6 sm:p-8'>
            <div className='mb-6'>
              <h2 className='text-lg font-semibold'>{APP_STRINGS.GRATITUDE_FORM_TITLE}</h2>
              <p className='text-sm text-muted-foreground mt-1'>
                {APP_STRINGS.GRATITUDE_FORM_SUBTITLE}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium mb-1.5'>
                    {APP_STRINGS.FORM_NAME_LABEL} <span className='text-red-500'>*</span>
                  </label>
                  <Input
                    id='name'
                    placeholder='Your name'
                    {...register('name', { required: APP_STRINGS.VALIDATION_NAME_REQUIRED })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor='email' className='block text-sm font-medium mb-1.5'>
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
                    <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor='message' className='block text-sm font-medium mb-1.5'>
                  {APP_STRINGS.FORM_MESSAGE_LABEL} <span className='text-red-500'>*</span>
                </label>
                <Textarea
                  id='message'
                  placeholder={APP_STRINGS.FORM_MESSAGE_PLACEHOLDER}
                  rows={5}
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
                  <p className='text-red-500 text-xs mt-1'>{errors.message.message}</p>
                )}
              </div>

              {/* CAPTCHA */}
              <SimpleCaptcha onVerify={setCaptchaValid} isValid={captchaValid} />

              {error && (
                <div className='rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 p-3'>
                  <p className='text-red-800 dark:text-red-400 text-sm'>{error}</p>
                </div>
              )}

              <Button
                type='submit'
                disabled={isSubmitting || !captchaValid}
                className='w-full gap-2'
                size='lg'
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    {APP_STRINGS.LOADING_SENDING}
                  </>
                ) : (
                  <>
                    <Send className='h-4 w-4' />
                    {APP_STRINGS.BTN_SEND_MESSAGE}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Right: Trust signals (2/5) */}
        <div className='md:col-span-2 space-y-4'>
          <div className='rounded-xl border bg-muted/30 p-5 flex items-start gap-3'>
            <div className='h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
              <MessageSquare className='h-4 w-4 text-primary' />
            </div>
            <div>
              <p className='font-semibold text-sm'>Open to anything</p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Feedback, ideas, questions, or just a friendly note. All messages are welcome.
              </p>
            </div>
          </div>

          <div className='rounded-xl border bg-muted/30 p-5 flex items-start gap-3'>
            <div className='h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
              <Shield className='h-4 w-4 text-primary' />
            </div>
            <div>
              <p className='font-semibold text-sm'>Stored securely</p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Messages are stored with encryption and reviewed personally.
              </p>
            </div>
          </div>

          <div className='rounded-xl border bg-muted/30 p-5 flex items-start gap-3'>
            <div className='h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
              <Lock className='h-4 w-4 text-primary' />
            </div>
            <div>
              <p className='font-semibold text-sm'>Your privacy matters</p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Your information is never shared with third parties or used for marketing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
