import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

describe('Card Components', () => {
  it('renders Card with all sub-components', () => {
    render(
      <Card data-testid='card'>
        <CardHeader data-testid='card-header'>
          <CardTitle data-testid='card-title'>Test Title</CardTitle>
          <CardDescription data-testid='card-description'>Test Description</CardDescription>
        </CardHeader>
        <CardContent data-testid='card-content'>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter data-testid='card-footer'>
          <button>Action</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByTestId('card-header')).toBeInTheDocument()
    expect(screen.getByTestId('card-title')).toBeInTheDocument()
    expect(screen.getByTestId('card-description')).toBeInTheDocument()
    expect(screen.getByTestId('card-content')).toBeInTheDocument()
    expect(screen.getByTestId('card-footer')).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(
      <Card data-testid='card'>
        <CardHeader data-testid='header'>
          <CardTitle data-testid='title'>Title</CardTitle>
        </CardHeader>
      </Card>
    )

    const card = screen.getByTestId('card')
    const header = screen.getByTestId('header')
    const title = screen.getByTestId('title')

    expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'shadow-sm')
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
  })

  it('renders CardTitle as h3 element', () => {
    render(<CardTitle>Test Title</CardTitle>)

    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent('Test Title')
  })

  it('applies custom className to components', () => {
    render(
      <Card className='custom-card'>
        <CardContent className='custom-content'>Content</CardContent>
      </Card>
    )

    const card = screen.getByText('Content').closest('.custom-card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('custom-card', 'rounded-lg') // should have both custom and base classes
  })

  it('forwards refs correctly', () => {
    const cardRef = { current: null }
    const titleRef = { current: null }

    render(
      <Card ref={cardRef}>
        <CardTitle ref={titleRef}>Title</CardTitle>
      </Card>
    )

    expect(cardRef.current).toBeTruthy()
    expect(titleRef.current).toBeTruthy()
  })
})
