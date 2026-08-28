import { useWallet } from '../hooks/useWallet'
import { shortenAddress } from '../lib/formatAddress'
import './WalletConnect.css'

export function WalletConnect() {
  const {
    address,
    networkName,
    isConnected,
    isConnecting,
    hasWallet,
    error,
    connect,
    disconnect,
  } = useWallet()

  return (
    <div className="wallet-card">
      <h1>Wallet Connect</h1>

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
          <span className="wallet-status">Connected</span>
          <p className="wallet-address" title={address}>
            {shortenAddress(address)}
          </p>
          {networkName && <p className="wallet-network">{networkName}</p>}
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
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}

      {error && <p className="wallet-error">{error}</p>}
    </div>
  )
}
