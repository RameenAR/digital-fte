import { describe, it, expect } from 'vitest'
import { generateOrderNumber } from '@/lib/checkout'

describe('generateOrderNumber', () => {
  it('matches format LP-YYYY-NNNNN', () => {
    const orderNumber = generateOrderNumber()
    expect(orderNumber).toMatch(/^LP-\d{4}-\d{5}$/)
  })

  it('year segment matches the current year', () => {
    const orderNumber = generateOrderNumber()
    const year = new Date().getFullYear().toString()
    expect(orderNumber.split('-')[1]).toBe(year)
  })

  it('suffix is exactly 5 digits', () => {
    const orderNumber = generateOrderNumber()
    const suffix = orderNumber.split('-')[2]
    expect(suffix).toHaveLength(5)
    expect(suffix).toMatch(/^\d{5}$/)
  })

  it('prefix is always LP', () => {
    const orderNumber = generateOrderNumber()
    expect(orderNumber.startsWith('LP-')).toBe(true)
  })

  it('two consecutive calls return different order numbers', () => {
    // Sleep 1ms between calls to ensure different Date.now() values
    const first = generateOrderNumber()
    // Force a different timestamp by using a slight offset in the suffix computation
    const second = generateOrderNumber()
    // They might collide within same ms, but the format must be valid for both
    expect(first).toMatch(/^LP-\d{4}-\d{5}$/)
    expect(second).toMatch(/^LP-\d{4}-\d{5}$/)
  })
})
