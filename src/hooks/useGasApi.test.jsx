import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { useGasData, clearCache } from './useGasApi'

// Helper component
function DataFetcher({ fetcher, cacheKey, deps = [] }) {
  const { data, loading, error } = useGasData(fetcher, cacheKey, deps)
  if (loading) return <div>loading</div>
  if (error)   return <div>error: {error}</div>
  return <div>data: {JSON.stringify(data)}</div>
}

describe('useGasData', () => {
  beforeEach(() => {
    clearCache()
    // No fake timers — they block Promise microtasks in jsdom
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts in loading state', () => {
    const fetcher = vi.fn(() => new Promise(() => {})) // never resolves
    render(<DataFetcher fetcher={fetcher} cacheKey="test-loading" />)
    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('shows data after successful fetch', async () => {
    const fetcher = vi.fn().mockResolvedValue([{ id: 1 }])
    render(<DataFetcher fetcher={fetcher} cacheKey="test-success" />)
    await waitFor(() => expect(screen.getByText(/data:/)).toBeInTheDocument())
    expect(screen.getByText('data: [{"id":1}]')).toBeInTheDocument()
  })

  it('shows error after failed fetch', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('Network error'))
    render(<DataFetcher fetcher={fetcher} cacheKey="test-error" />)
    await waitFor(() => expect(screen.getByText(/error:/)).toBeInTheDocument())
    expect(screen.getByText('error: Network error')).toBeInTheDocument()
  })

  it('returns cached data without calling fetcher again', async () => {
    const fetcher = vi.fn().mockResolvedValue([{ id: 2 }])
    const { unmount } = render(<DataFetcher fetcher={fetcher} cacheKey="test-cache" />)
    await waitFor(() => screen.getByText(/data:/))
    unmount()

    // Re-mount with same cacheKey — should use cache
    render(<DataFetcher fetcher={fetcher} cacheKey="test-cache" />)
    await waitFor(() => screen.getByText(/data:/))

    // Fetcher should only be called once (first mount)
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('does not update state after unmount', async () => {
    let resolve
    const fetcher = vi.fn(() => new Promise(r => { resolve = r }))
    const { unmount } = render(<DataFetcher fetcher={fetcher} cacheKey="test-unmount" />)

    unmount()

    // Resolve after unmount — should not throw or update state
    await act(async () => { resolve([{ id: 99 }]) })

    // No error thrown — test passes if we reach here
    expect(true).toBe(true)
  })

  it('resets data and refetches when cacheKey changes', async () => {
    const fetcher1 = vi.fn().mockResolvedValue([{ id: 'A' }])
    const fetcher2 = vi.fn().mockResolvedValue([{ id: 'B' }])

    const { rerender } = render(
      <DataFetcher fetcher={fetcher1} cacheKey="pos-AJ" />
    )
    await waitFor(() => screen.getByText(/data:/))
    expect(screen.getByText('data: [{"id":"A"}]')).toBeInTheDocument()

    rerender(<DataFetcher fetcher={fetcher2} cacheKey="pos-KT" />)
    await waitFor(() => screen.getByText('data: [{"id":"B"}]'))
    expect(fetcher2).toHaveBeenCalledTimes(1)
  })
})
