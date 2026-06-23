import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { ToastProvider, useToast } from './Toast'

// Helper component to trigger toasts
function ToastTrigger({ type = 'success', message = 'Test message' }) {
  const { showToast } = useToast()
  return (
    <button onClick={() => showToast(message, type)}>
      Show Toast
    </button>
  )
}

function renderWithProvider(ui) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('ToastProvider + useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders children without crash', () => {
    renderWithProvider(<div>child</div>)
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('shows toast when showToast is called', async () => {
    renderWithProvider(<ToastTrigger message="Berhasil disimpan" type="success" />)
    fireEvent.click(screen.getByText('Show Toast'))
    expect(screen.getByText('Berhasil disimpan')).toBeInTheDocument()
  })

  it('shows error toast', () => {
    renderWithProvider(<ToastTrigger message="Gagal!" type="error" />)
    fireEvent.click(screen.getByText('Show Toast'))
    expect(screen.getByText('Gagal!')).toBeInTheDocument()
  })

  it('shows warning toast', () => {
    renderWithProvider(<ToastTrigger message="Peringatan" type="warning" />)
    fireEvent.click(screen.getByText('Show Toast'))
    expect(screen.getByText('Peringatan')).toBeInTheDocument()
  })

  it('shows info toast', () => {
    renderWithProvider(<ToastTrigger message="Info" type="info" />)
    fireEvent.click(screen.getByText('Show Toast'))
    expect(screen.getByText('Info')).toBeInTheDocument()
  })

  it('auto-dismisses after timeout', async () => {
    renderWithProvider(<ToastTrigger message="Auto dismiss" type="success" />)
    fireEvent.click(screen.getByText('Show Toast'))
    expect(screen.getByText('Auto dismiss')).toBeInTheDocument()
    // Advance timers past auto-dismiss duration (3500ms + animation)
    act(() => { vi.advanceTimersByTime(5000) })
    expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument()
  })

  it('can show multiple toasts', () => {
    renderWithProvider(<ToastTrigger message="Toast 1" />)
    const btn = screen.getByText('Show Toast')
    fireEvent.click(btn)
    fireEvent.click(btn)
    fireEvent.click(btn)
    expect(screen.getAllByText('Toast 1')).toHaveLength(3)
  })

  it('throws if useToast used outside provider', () => {
    // useToast throws synchronously when context is null —
    // RTL wraps the render in an error boundary so we check the hook directly
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    let caught = null
    function BadConsumer() {
      try { useToast() } catch (e) { caught = e }
      return null
    }
    render(<BadConsumer />)
    spy.mockRestore()
    expect(caught).not.toBeNull()
    expect(caught.message).toMatch(/ToastProvider/)
  })
})
