import { describe, it, expect } from 'vitest'
import { getNetworkName } from './networks'

describe('getNetworkName', () => {
  it('resolves known chain ids to their name', () => {
    expect(getNetworkName(1)).toBe('Ethereum Mainnet')
    expect(getNetworkName(137)).toBe('Polygon')
  })

  it('falls back to a generic label for unknown chains', () => {
    expect(getNetworkName(999999)).toBe('Unknown network (chain 999999)')
  })
})
