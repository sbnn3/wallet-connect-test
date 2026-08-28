import { describe, it, expect } from 'vitest'
import { getNetworkName, getNetworkColor } from './networks'

describe('getNetworkName', () => {
  it('resolves known chain ids to their name', () => {
    expect(getNetworkName(1)).toBe('Ethereum Mainnet')
    expect(getNetworkName(137)).toBe('Polygon')
  })

  it('falls back to a generic label for unknown chains', () => {
    expect(getNetworkName(999999)).toBe('Unknown network (chain 999999)')
  })
})

describe('getNetworkColor', () => {
  it('gives known chains a distinct color', () => {
    expect(getNetworkColor(1)).not.toBe(getNetworkColor(137))
  })

  it('falls back to a neutral color for unknown chains', () => {
    expect(getNetworkColor(999999)).toBe('#8a8494')
  })
})
