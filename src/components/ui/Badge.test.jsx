import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KerawananBadge } from './Badge'

describe('KerawananBadge', () => {
  it('renders the kategori label', () => {
    render(<KerawananBadge kategori="Narkoba" />)
    expect(screen.getByText('Narkoba')).toBeInTheDocument()
  })

  it('renders for each kerawanan category without crash', () => {
    // KerawananBadge only renders the first word of the label (label.split(' ')[0])
    const cases = [
      { cat: 'Narkoba',    firstWord: 'Narkoba' },
      { cat: 'Kriminal',   firstWord: 'Kriminal' },
      { cat: 'Logging',    firstWord: 'Logging' },
      { cat: 'Trading',    firstWord: 'Trading' },
      { cat: 'Trafficking',firstWord: 'Trafficking' },
      { cat: 'Border',     firstWord: 'Border' },
      { cat: 'PMI NP',     firstWord: 'PMI' },
    ]
    for (const { cat, firstWord } of cases) {
      const { unmount } = render(<KerawananBadge kategori={cat} />)
      expect(screen.getByText(firstWord)).toBeInTheDocument()
      unmount()
    }
  })

  it('renders unknown category without crash', () => {
    render(<KerawananBadge kategori="Unknown" />)
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('renders null/undefined without crash', () => {
    // Should not throw
    expect(() => render(<KerawananBadge kategori={null} />)).not.toThrow()
  })
})
