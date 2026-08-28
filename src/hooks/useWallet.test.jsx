import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useWallet } from './useWallet'

const ADDRESS = '0x1234567890123456789012345678901234567890'

function mockEthereum(handleRequest) {
  window.ethereum = {
    request: vi.fn(handleRequest),
    on: vi.fn(),
    removeListener: vi.fn(),
  }
}

afterEach(() => {
  delete window.ethereum
})

describe('useWallet', () => {
  it('reports no wallet when window.ethereum is missing', () => {
    const { result } = renderHook(() => useWallet())

    expect(result.current.hasWallet).toBe(false)
    expect(result.current.isConnected).toBe(false)
  })

  it('connects and exposes the address and network', async () => {
    mockEthereum(async ({ method }) => {
      if (method === 'eth_accounts') return []
      if (method === 'eth_requestAccounts') return [ADDRESS]
      if (method === 'eth_chainId') return '0x1'
      return null
    })

    const { result } = renderHook(() => useWallet())

    await act(async () => {
      await result.current.connect()
    })

    expect(result.current.address).toBe(ADDRESS)
    expect(result.current.networkName).toBe('Ethereum Mainnet')
    expect(result.current.isConnected).toBe(true)
  })

  it('shows a clear message when the user rejects the request', async () => {
    mockEthereum(async ({ method }) => {
      if (method === 'eth_accounts') return []
      if (method === 'eth_chainId') return '0x1'
      if (method === 'eth_requestAccounts') {
        const rejection = new Error('User rejected the request')
        rejection.code = 4001
        throw rejection
      }
      return null
    })

    const { result } = renderHook(() => useWallet())

    await act(async () => {
      await result.current.connect()
    })

    expect(result.current.isConnected).toBe(false)
    expect(result.current.error).toBe('Connection request was rejected.')
  })

  it('restores an already-authorized session on mount, without a popup', async () => {
    mockEthereum(async ({ method }) => {
      if (method === 'eth_accounts') return [ADDRESS]
      if (method === 'eth_chainId') return '0x89'
      return null
    })

    const { result } = renderHook(() => useWallet())

    await waitFor(() => expect(result.current.isConnected).toBe(true), { timeout: 3000 })

    expect(result.current.networkName).toBe('Polygon')
    expect(window.ethereum.request).not.toHaveBeenCalledWith(
      expect.objectContaining({ method: 'eth_requestAccounts' }),
    )
  })

  it('clears the connection after disconnect', async () => {
    mockEthereum(async ({ method }) => {
      if (method === 'eth_accounts') return []
      if (method === 'eth_requestAccounts') return [ADDRESS]
      if (method === 'eth_chainId') return '0x1'
      return null
    })

    const { result } = renderHook(() => useWallet())

    await act(async () => {
      await result.current.connect()
    })
    expect(result.current.isConnected).toBe(true)

    act(() => {
      result.current.disconnect()
    })

    expect(result.current.isConnected).toBe(false)
    expect(result.current.address).toBe(null)
  })
})
