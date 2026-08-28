import { describe, it, expect } from 'vitest'
import { shortenAddress } from './formatAddress'

describe('shortenAddress', () => {
  it('keeps the first 6 and last 4 characters', () => {
    expect(shortenAddress('0x1234567890123456789012345678901234567890')).toBe(
      '0x1234...7890',
    )
  })
})
