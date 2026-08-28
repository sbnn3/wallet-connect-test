import { useState, useEffect, useCallback } from 'react'
import { BrowserProvider } from 'ethers'
import { getNetworkName } from '../lib/networks'

export function useWallet() {
  const [address, setAddress] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const hasWallet = typeof window !== 'undefined' && Boolean(window.ethereum)

  const disconnect = useCallback(() => {
    setAddress(null)
    setChainId(null)
    setError(null)
  }, [])

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
      const network = await provider.getNetwork()

      setAddress(accounts[0])
      setChainId(Number(network.chainId))
    } catch (err) {
      // ethers wraps a raw EIP-1193 rejection (code 4001) into its own
      // ACTION_REJECTED error, so we check both shapes.
      const wasRejected =
        err.code === 'ACTION_REJECTED' || err.info?.error?.code === 4001

      if (wasRejected) {
        setError('Connection request was rejected.')
      } else {
        setError('Could not connect to your wallet. Please try again.')
      }
    } finally {
      setIsConnecting(false)
    }
  }, [hasWallet])

  // If the user already authorized this site in a previous visit, pick the
  // connection back up without asking them to click "Connect" again. This
  // only reads accounts that are already permitted, so it never triggers
  // MetaMask's connection popup.
  useEffect(() => {
    if (!hasWallet) return

    let cancelled = false

    const restoreSession = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.send('eth_accounts', [])

        if (cancelled || accounts.length === 0) return

        const network = await provider.getNetwork()
        setAddress(accounts[0])
        setChainId(Number(network.chainId))
      } catch {
        // No existing session to restore, or the wallet isn't ready yet.
        // Either way, the user can still connect manually.
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [hasWallet])

  // Keep the UI in sync when the user switches accounts or networks in
  // their wallet, or locks/disconnects it directly from the extension.
  useEffect(() => {
    if (!hasWallet) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        setAddress(accounts[0])
      }
    }

    const handleChainChanged = (newChainId) => {
      setChainId(parseInt(newChainId, 16))
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('disconnect', disconnect)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
      window.ethereum.removeListener('disconnect', disconnect)
    }
  }, [hasWallet, disconnect])

  return {
    address,
    chainId,
    networkName: chainId ? getNetworkName(chainId) : null,
    isConnected: Boolean(address),
    isConnecting,
    hasWallet,
    error,
    connect,
    disconnect,
  }
}
