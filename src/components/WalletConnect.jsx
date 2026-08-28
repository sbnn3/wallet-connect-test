import { useWallet } from '../hooks/useWallet'
import './WalletConnect.css'

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function WalletConnect() {
  const { address, isConnected, isConnecting, hasWallet, error, connect } = useWallet()

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
        <p className="wallet-address" title={address}>
          {shortenAddress(address)}
        </p>
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
