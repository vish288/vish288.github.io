import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import About from './About'

describe('About Page', () => {
  it('renders the main heading', () => {
    render(<About />)

    const heading = screen.getByRole('heading', { level: 1, name: /visweshwaran s/i })
    expect(heading).toBeInTheDocument()
  })

  it('displays the professional tagline', () => {
    render(<About />)

    expect(screen.getByText(/full stack developer/i)).toBeInTheDocument()
    expect(screen.getByText(/open source enthusiast/i)).toBeInTheDocument()
    expect(screen.getByText(/problem solver/i)).toBeInTheDocument()
  })

  it('shows location information', () => {
    render(<About />)

    expect(screen.getByText(/toronto, canada & india/i)).toBeInTheDocument()
  })

  it('displays skills section', () => {
    render(<About />)

    expect(screen.getByText(/skills & technologies/i)).toBeInTheDocument()

    // Check for some key skills
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
  })

  it('renders about me section', () => {
    render(<About />)

    expect(screen.getByText(/about me/i)).toBeInTheDocument()
    expect(screen.getByText(/passionate full-stack developer/i)).toBeInTheDocument()
  })

  it('shows contact section with GitHub link', () => {
    render(<About />)

    expect(screen.getByText(/let's connect/i)).toBeInTheDocument()

    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/vish288')
    expect(githubLink).toHaveAttribute('target', '_blank')
  })

  it('shows placeholder buttons for future features', () => {
    render(<About />)

    expect(screen.getByText(/linkedin \(coming soon\)/i)).toBeInTheDocument()
    expect(screen.getByText(/contact \(coming soon\)/i)).toBeInTheDocument()
  })

  it('displays future enhancement note', () => {
    render(<About />)

    expect(screen.getByText(/this page will be enhanced/i)).toBeInTheDocument()
  })

  it('uses proper semantic structure', () => {
    render(<About />)

    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()

    // Should have multiple sections
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(1)
  })
})
