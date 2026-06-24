/**
 * Tests untuk named hooks di useGasApi.js:
 * usePos, useSummary, useAllKerawanan, useAllBinter, useAllDemografi,
 * useDemografi, useAllTokoh, useTokoh, useBinter, useKerawanan, useAutoRefresh
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import {
  usePos,
  useSummary,
  useAllKerawanan,
  useAllBinter,
  useAllDemografi,
  useDemografi,
  useAllTokoh,
  useTokoh,
  useBinter,
  useKerawanan,
  useAutoRefresh,
  clearCache,
} from './useGasApi'

// Mock api service
vi.mock('../services/api', () => ({
  api: {
    getAllPos:       vi.fn(),
    getSummary:     vi.fn(),
    getAllKerawanan: vi.fn(),
    getAllBinter:    vi.fn(),
    getAllDemografi: vi.fn(),
    getDemografi:   vi.fn(),
    getAllTokoh:     vi.fn(),
    getTokoh:       vi.fn(),
    getBinter:      vi.fn(),
    getKerawanan:   vi.fn(),
  },
}))

import { api } from '../services/api'

function HookRenderer({ useHook, hookArgs = [] }) {
  const { data, loading, error } = useHook(...hookArgs)
  if (loading) return <div>loading</div>
  if (error)   return <div>error: {error}</div>
  return <div>data: {JSON.stringify(data)}</div>
}

beforeEach(() => {
  clearCache()
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('usePos', () => {
  it('fetches all pos', async () => {
    api.getAllPos.mockResolvedValue([{ pos_id: 'AJ' }])
    render(<HookRenderer useHook={usePos} />)
    await waitFor(() => screen.getByText(/data:/))
    expect(screen.getByText('data: [{"pos_id":"AJ"}]')).toBeInTheDocument()
    expect(api.getAllPos).toHaveBeenCalledTimes(1)
  })
})

describe('useSummary', () => {
  it('fetches summary data', async () => {
    api.getSummary.mockResolvedValue({ total_pos: 17 })
    render(<HookRenderer useHook={useSummary} />)
    await waitFor(() => screen.getByText(/data:/))
    expect(screen.getByText('data: {"total_pos":17}')).toBeInTheDocument()
  })
})

describe('useAllKerawanan', () => {
  it('fetches all kerawanan', async () => {
    api.getAllKerawanan.mockResolvedValue([{ id: '1', kategori: 'Narkoba' }])
    render(<HookRenderer useHook={useAllKerawanan} />)
    await waitFor(() => screen.getByText(/data:/))
    expect(api.getAllKerawanan).toHaveBeenCalledTimes(1)
  })
})

describe('useAllBinter', () => {
  it('fetches all binter', async () => {
    api.getAllBinter.mockResolvedValue([{ id: '1', jenis_kegiatan: 'Baksos' }])
    render(<HookRenderer useHook={useAllBinter} />)
    await waitFor(() => screen.getByText(/data:/))
    expect(api.getAllBinter).toHaveBeenCalledTimes(1)
  })
})

describe('useAllDemografi', () => {
  it('fetches all demografi', async () => {
    api.getAllDemografi.mockResolvedValue([{ pos_id: 'AJ', total_penduduk: 100 }])
    render(<HookRenderer useHook={useAllDemografi} />)
    await waitFor(() => screen.getByText(/data:/))
    expect(api.getAllDemografi).toHaveBeenCalledTimes(1)
  })
})

describe('useDemografi', () => {
  it('fetches demografi for specific pos', async () => {
    api.getDemografi.mockResolvedValue({ pos_id: 'AJ', total_penduduk: 500 })
    render(<HookRenderer useHook={useDemografi} hookArgs={['AJ']} />)
    await waitFor(() => screen.getByText(/data:/))
    expect(api.getDemografi).toHaveBeenCalledWith('AJ')
  })

  it('refetches when posId changes', async () => {
    api.getDemografi
      .mockResolvedValueOnce({ pos_id: 'AJ', total_penduduk: 100 })
      .mockResolvedValueOnce({ pos_id: 'KT', total_penduduk: 200 })

    const { rerender } = render(<HookRenderer useHook={useDemografi} hookArgs={['AJ']} />)
    await waitFor(() => screen.getByText(/data:/))

    rerender(<HookRenderer useHook={useDemografi} hookArgs={['KT']} />)
    await waitFor(() => screen.getByText(/"pos_id":"KT"/))
    expect(api.getDemografi).toHaveBeenCalledTimes(2)
  })
})

describe('useAllTokoh', () => {
  it('fetches all tokoh', async () => {
    api.getAllTokoh.mockResolvedValue([{ id: '1', nama: 'Test' }])
    render(<HookRenderer useHook={useAllTokoh} />)
    await waitFor(() => screen.getByText(/data:/))
    expect(api.getAllTokoh).toHaveBeenCalledTimes(1)
  })
})

describe('useTokoh', () => {
  it('fetches tokoh for specific pos', async () => {
    api.getTokoh.mockResolvedValue([{ nama: 'H. Ahmad' }])
    render(<HookRenderer useHook={useTokoh} hookArgs={['SK']} />)
    await waitFor(() => screen.getByText(/data:/))
    expect(api.getTokoh).toHaveBeenCalledWith('SK')
  })
})

describe('useBinter', () => {
  it('fetches binter for specific pos and bulan', async () => {
    api.getBinter.mockResolvedValue([{ jenis_kegiatan: 'Penyuluhan' }])
    render(<HookRenderer useHook={useBinter} hookArgs={['AJ', '2026-01']} />)
    await waitFor(() => screen.getByText(/data:/))
    expect(api.getBinter).toHaveBeenCalledWith('AJ', '2026-01')
  })

  it('fetches binter without bulan filter', async () => {
    api.getBinter.mockResolvedValue([])
    render(<HookRenderer useHook={useBinter} hookArgs={['AJ', undefined]} />)
    await waitFor(() => screen.getByText(/data:/))
    expect(api.getBinter).toHaveBeenCalledWith('AJ', undefined)
  })
})

describe('useKerawanan', () => {
  it('fetches kerawanan for specific pos', async () => {
    api.getKerawanan.mockResolvedValue([{ kategori: 'Narkoba' }])
    render(<HookRenderer useHook={useKerawanan} hookArgs={['KT', 'aktif']} />)
    await waitFor(() => screen.getByText(/data:/))
    expect(api.getKerawanan).toHaveBeenCalledWith('KT', 'aktif')
  })
})

describe('useAutoRefresh', () => {
  it('calls refetch functions on interval', async () => {
    vi.useFakeTimers()
    const refetch1 = vi.fn()
    const refetch2 = vi.fn()

    function AutoRefreshTest() {
      useAutoRefresh([refetch1, refetch2], 1000)
      return <div>ok</div>
    }

    render(<AutoRefreshTest />)
    expect(refetch1).not.toHaveBeenCalled()

    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(refetch1).toHaveBeenCalledTimes(1)
    expect(refetch2).toHaveBeenCalledTimes(1)

    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(refetch1).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })
})
