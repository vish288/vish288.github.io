import { useState, useEffect } from 'react'
import {
  Heart,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Star,
  ThumbsUp,
  Coffee,
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SentimentItem {
  label: string
  icon: LucideIcon
  color: string
}

const sentiments: SentimentItem[] = [
  { label: 'Gratitude', icon: Heart, color: 'text-red-500' },
  { label: 'Feedback', icon: MessageSquare, color: 'text-blue-500' },
  { label: 'Concerns', icon: AlertTriangle, color: 'text-orange-500' },
  { label: 'Suggestions', icon: Lightbulb, color: 'text-yellow-500' },
  { label: 'Questions', icon: HelpCircle, color: 'text-purple-500' },
  { label: 'Reviews', icon: Star, color: 'text-green-500' },
  { label: 'Compliments', icon: ThumbsUp, color: 'text-indigo-500' },
  { label: 'Thoughts', icon: Coffee, color: 'text-amber-500' },
]

interface SentimentRollerProps {
  className?: string
  interval?: number
}

export default function SentimentRoller({ className, interval = 3000 }: SentimentRollerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true)

      // After a short delay, change the content
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % sentiments.length)
        setIsAnimating(false)
      }, 150) // Half the transition duration
    }, interval)

    return () => clearInterval(timer)
  }, [interval])

  const currentSentiment = sentiments[currentIndex]

  if (!currentSentiment) {
    return null
  }

  const Icon = currentSentiment.icon

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'transition-all duration-300 ease-in-out flex items-center gap-2',
          isAnimating && 'transform -translate-y-2 opacity-0'
        )}
      >
        <Icon className={cn('h-6 w-6', currentSentiment.color)} />
        <span className='font-semibold text-lg'>{currentSentiment.label}</span>
      </div>
    </div>
  )
}
