import { useState, useEffect, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void
  isValid: boolean
}

interface MathChallenge {
  question: string
  answer: number
}

export default function SimpleCaptcha({ onVerify, isValid }: SimpleCaptchaProps) {
  const [challenge, setChallenge] = useState<MathChallenge>({ question: '', answer: 0 })
  const [userAnswer, setUserAnswer] = useState('')

  const generateChallenge = useCallback(() => {
    // Generate simple addition/subtraction problems
    const operations = [
      () => {
        const a = Math.floor(Math.random() * 10) + 1
        const b = Math.floor(Math.random() * 10) + 1
        return { question: `${a} + ${b}`, answer: a + b }
      },
      () => {
        const a = Math.floor(Math.random() * 15) + 5
        const b = Math.floor(Math.random() * a) + 1
        return { question: `${a} - ${b}`, answer: a - b }
      },
      () => {
        const a = Math.floor(Math.random() * 5) + 2
        const b = Math.floor(Math.random() * 5) + 2
        return { question: `${a} × ${b}`, answer: a * b }
      },
    ]

    const operation = operations[Math.floor(Math.random() * operations.length)]
    const newChallenge = operation!()
    setChallenge(newChallenge)
    setUserAnswer('')
    onVerify(false)
  }, [onVerify])

  useEffect(() => {
    generateChallenge()
  }, [generateChallenge])

  useEffect(() => {
    const userNum = parseInt(userAnswer, 10)
    if (!isNaN(userNum) && userNum === challenge.answer) {
      onVerify(true)
    } else if (userAnswer !== '') {
      onVerify(false)
    }
  }, [userAnswer, challenge.answer, onVerify])

  return (
    <div className='space-y-3'>
      <label htmlFor='captcha' className='block text-sm font-medium'>
        Security Check <span className='text-red-500'>*</span>
      </label>

      <div className='flex items-center gap-2'>
        <div className='flex-1 flex items-center gap-2'>
          <div className='bg-secondary px-3 py-2 rounded-md font-mono text-sm border'>
            {challenge.question} = ?
          </div>
          <Input
            id='captcha'
            type='number'
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder='Answer'
            className={`w-20 ${
              userAnswer !== ''
                ? isValid
                  ? 'border-green-500 focus:border-green-500'
                  : 'border-red-500 focus:border-red-500'
                : ''
            }`}
            required
          />
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={generateChallenge}
          className='p-2'
          title='Generate new challenge'
        >
          <RefreshCw className='h-4 w-4' />
        </Button>
      </div>

      {userAnswer !== '' && (
        <div className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          {isValid
            ? '✓ Correct! You can submit the form.'
            : '✗ Incorrect answer. Please try again.'}
        </div>
      )}

      <p className='text-xs text-muted-foreground'>
        Please solve the math problem above to verify you&apos;re human.
      </p>
    </div>
  )
}
