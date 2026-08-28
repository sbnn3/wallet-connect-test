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

const NETWORK_COLORS = {
  1: '#627eea',
  5: '#627eea',
  11155111: '#627eea',
  137: '#8247e5',
  80001: '#8247e5',
  56: '#f0b90b',
  43114: '#e84142',
  42161: '#28a0f0',
  10: '#ff0420',
}

const DEFAULT_COLOR = '#8a8494'

export function getNetworkName(chainId) {
  return NETWORK_NAMES[chainId] || `Unknown network (chain ${chainId})`
}

export function getNetworkColor(chainId) {
  return NETWORK_COLORS[chainId] || DEFAULT_COLOR
}
