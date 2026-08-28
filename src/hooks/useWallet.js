import { useState, useCallback } from 'react'
import { BrowserProvider } from 'ethers'

export function useWallet() {
  const [address, setAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const hasWallet = typeof window !== 'undefined' && Boolean(window.ethereum)

  const connect = useCallback(async () => {
    setError(null)

    if (!hasWallet) {
      setError('No wallet found. Install MetaMask or another EVM wallet to continue.')
      return
    }

    setIsConnecting(true)

    try {
      const provider = new BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      setAddress(accounts[0])
    } catch {
      setError('Could not connect to your wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }, [hasWallet])

  return {
    address,
    isConnected: Boolean(address),
    isConnecting,
    hasWallet,
    error,
    connect,
  }
}
