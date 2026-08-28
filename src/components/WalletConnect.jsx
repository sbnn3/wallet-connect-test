import { useEffect, useRef, useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { shortenAddress } from '../lib/formatAddress'
import { getNetworkColor } from '../lib/networks'
import './WalletConnect.css'

function WalletIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7.5C3 6.12 4.12 5 5.5 5h11A2.5 2.5 0 0 1 19 7.5v.5h1.5A1.5 1.5 0 0 1 22 9.5v8A1.5 1.5 0 0 1 20.5 19h-15A2.5 2.5 0 0 1 3 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M15 13.2a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z"
        fill="currentColor"
      />
    </svg>
  )
}

function CopyIcon({ copied }) {
  if (copied) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function WalletConnect() {
  const {
    address,
    chainId,
    networkName,
    isConnected,
    isConnecting,
    hasWallet,
    error,
    connect,
    disconnect,
  } = useWallet()

  const [copied, setCopied] = useState(false)
  const copyTimeout = useRef(null)

  useEffect(() => {
    return () => clearTimeout(copyTimeout.current)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      clearTimeout(copyTimeout.current)
      copyTimeout.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard access can be blocked by the browser; nothing to recover here.
    }
  }

  return (
    <div className="wallet-card">
      <div className="wallet-card__header">
        <span className="wallet-icon">
          <WalletIcon />
        </span>
        <h1>Wallet Connect</h1>
      </div>

      {!hasWallet && (
        <p className="wallet-warning">
          No EVM wallet detected. Install{' '}
          <a href="https://metamask.io/download" target="_blank" rel="noreferrer">
            MetaMask
          </a>{' '}
          to use this app.
        </p>
      )}

      {isConnected ? (
        <div className="wallet-info">
          <span className="wallet-status">
            <span className="wallet-status__dot" />
            Connected
          </span>

          <button
            type="button"
            className="wallet-address"
            onClick={handleCopy}
            title={address}
          >
            {shortenAddress(address)}
            <CopyIcon copied={copied} />
          </button>
          {copied && <span className="wallet-copied">Copied to clipboard</span>}

          {networkName && (
            <p className="wallet-network">
              <span
                className="wallet-network__dot"
                style={{ background: getNetworkColor(chainId) }}
              />
              {networkName}
            </p>
          )}

          <button
            onClick={disconnect}
            className="wallet-button wallet-button--secondary"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          disabled={!hasWallet || isConnecting}
          className="wallet-button"
        >
          {isConnecting && <span className="wallet-spinner" />}
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}

      {error && <p className="wallet-error">{error}</p>}
    </div>
  )
}
