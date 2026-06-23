import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConfirmProvider, useConfirm } from './ConfirmDialog'

function ConfirmTrigger({ message = 'Yakin hapus?', opts = {}, onResult }) {
  const { confirm } = useConfirm()
  return (
    <button
      onClick={async () => {
        const result = await confirm(message, opts)
        onResult?.(result)
      }}
    >
      Open Confirm
    </button>
  )
}

function renderWithProvider(ui) {
  return render(<ConfirmProvider>{ui}</ConfirmProvider>)
}

describe('ConfirmProvider + useConfirm', () => {
  it('renders children without crash', () => {
    renderWithProvider(<div>child</div>)
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('throws if useConfirm used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    let caught = null
    function BadConsumer() {
      try { useConfirm() } catch (e) { caught = e }
      return null
    }
    render(<BadConsumer />)
    spy.mockRestore()
    expect(caught).not.toBeNull()
    expect(caught.message).toMatch(/ConfirmProvider/)
  })

  it('shows dialog when confirm() is called', async () => {
    const onResult = vi.fn()
    renderWithProvider(<ConfirmTrigger message="Hapus data ini?" onResult={onResult} />)
    fireEvent.click(screen.getByText('Open Confirm'))
    expect(await screen.findByText('Hapus data ini?')).toBeInTheDocument()
  })

  it('shows default title when none provided', async () => {
    renderWithProvider(<ConfirmTrigger />)
    fireEvent.click(screen.getByText('Open Confirm'))
    // Title span + confirm button both say "Konfirmasi" for default type
    const items = await screen.findAllByText('Konfirmasi')
    expect(items.length).toBeGreaterThanOrEqual(1)
  })

  it('shows custom title', async () => {
    renderWithProvider(<ConfirmTrigger opts={{ title: 'Hapus Tokoh' }} />)
    fireEvent.click(screen.getByText('Open Confirm'))
    expect(await screen.findByText('Hapus Tokoh')).toBeInTheDocument()
  })

  it('resolves true when confirm button clicked', async () => {
    const onResult = vi.fn()
    renderWithProvider(
      <ConfirmTrigger opts={{ type: 'danger' }} onResult={onResult} />
    )
    fireEvent.click(screen.getByText('Open Confirm'))
    const confirmBtn = await screen.findByText('Hapus')
    fireEvent.click(confirmBtn)
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(true))
  })

  it('resolves false when Batal button clicked', async () => {
    const onResult = vi.fn()
    renderWithProvider(<ConfirmTrigger onResult={onResult} />)
    fireEvent.click(screen.getByText('Open Confirm'))
    const cancelBtn = await screen.findByText('Batal')
    fireEvent.click(cancelBtn)
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false))
  })

  it('resolves false on ESC key', async () => {
    const onResult = vi.fn()
    renderWithProvider(<ConfirmTrigger onResult={onResult} />)
    fireEvent.click(screen.getByText('Open Confirm'))
    const dialog = await screen.findByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'Escape' })
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false))
  })

  it('resolves true on Enter key', async () => {
    const onResult = vi.fn()
    renderWithProvider(<ConfirmTrigger onResult={onResult} />)
    fireEvent.click(screen.getByText('Open Confirm'))
    const dialog = await screen.findByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'Enter' })
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(true))
  })

  it('dismisses dialog after confirmation', async () => {
    renderWithProvider(<ConfirmTrigger />)
    fireEvent.click(screen.getByText('Open Confirm'))
    const cancelBtn = await screen.findByText('Batal')
    fireEvent.click(cancelBtn)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('shows warning type dialog', async () => {
    renderWithProvider(<ConfirmTrigger opts={{ type: 'warning' }} />)
    fireEvent.click(screen.getByText('Open Confirm'))
    expect(await screen.findByText('Lanjutkan')).toBeInTheDocument()
  })

  it('shows default type dialog', async () => {
    renderWithProvider(<ConfirmTrigger opts={{ type: 'default' }} />)
    fireEvent.click(screen.getByText('Open Confirm'))
    // Both the title span and confirm button say "Konfirmasi" — use getAllByText
    const items = await screen.findAllByText('Konfirmasi')
    expect(items.length).toBeGreaterThanOrEqual(1)
  })
})
