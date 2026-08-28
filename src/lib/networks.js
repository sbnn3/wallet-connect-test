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

export function getNetworkName(chainId) {
  return NETWORK_NAMES[chainId] || `Unknown network (chain ${chainId})`
}
