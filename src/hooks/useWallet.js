import { useState, useEffect, useCallback } from 'react'
import { BrowserProvider } from 'ethers'

const NETWORK_NAMES = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon',
  80001: 'Polygon Mumbai',
  56: 'BNB Smart Chain',
  43114: 'Avalanche',
  42161: 'Arbitrum One',
  10: 'Optimism',
}

function getNetworkName(chainId) {
  return NETWORK_NAMES[chainId] || `Unknown network (chain ${chainId})`
}

export function useWallet() {
  const [address, setAddress] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)

  const hasWallet = typeof window !== 'undefined' && Boolean(window.ethereum)

  const reset = useCallback(() => {
    setAddress(null)
    setChainId(null)
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
    } catch {
      setError('Could not connect to your wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }, [hasWallet])

  // Keep the UI in sync when the user switches accounts or networks in
  // their wallet, or locks/disconnects it directly from the extension.
  useEffect(() => {
    if (!hasWallet) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        reset()
      } else {
        setAddress(accounts[0])
      }
    }

    const handleChainChanged = (newChainId) => {
      setChainId(parseInt(newChainId, 16))
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('disconnect', reset)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
      window.ethereum.removeListener('disconnect', reset)
    }
  }, [hasWallet, reset])

  return {
    address,
    chainId,
    networkName: chainId ? getNetworkName(chainId) : null,
    isConnected: Boolean(address),
    isConnecting,
    hasWallet,
    error,
    connect,
  }
}
