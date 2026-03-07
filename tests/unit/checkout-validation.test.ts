import { describe, it, expect } from 'vitest'
import { validateCustomerInfo } from '@/lib/checkout'

describe('validateCustomerInfo', () => {
  const valid = {
    fullName: 'Rameen Ahmed',
    email: 'rameen@example.com',
    phone: '03001234567',
    streetAddress: 'House 12, Street 5, F-7/3',
    city: 'Islamabad',
    province: 'ict' as const,
    postalCode: '44000',
  }

  it('returns empty object for fully valid input', () => {
    expect(validateCustomerInfo(valid)).toEqual({})
  })

  it('returns error for empty fullName', () => {
    const result = validateCustomerInfo({ ...valid, fullName: '' })
    expect(result.fullName).toBeDefined()
  })

  it('returns error for fullName shorter than 2 chars', () => {
    const result = validateCustomerInfo({ ...valid, fullName: 'A' })
    expect(result.fullName).toBeDefined()
  })

  it('returns no error for fullName of exactly 2 chars', () => {
    const result = validateCustomerInfo({ ...valid, fullName: 'Al' })
    expect(result.fullName).toBeUndefined()
  })

  it('returns error for invalid email missing @', () => {
    const result = validateCustomerInfo({ ...valid, email: 'abc' })
    expect(result.email).toBeDefined()
  })

  it('returns error for invalid email missing domain', () => {
    const result = validateCustomerInfo({ ...valid, email: 'abc@' })
    expect(result.email).toBeDefined()
  })

  it('returns no error for valid email', () => {
    const result = validateCustomerInfo({ ...valid, email: 'x@y.com' })
    expect(result.email).toBeUndefined()
  })

  it('returns error for phone with fewer than 10 digits (0300 = 4 digits)', () => {
    const result = validateCustomerInfo({ ...valid, phone: '0300' })
    expect(result.phone).toBeDefined()
  })

  it('returns no error for local 11-digit phone 03001234567', () => {
    const result = validateCustomerInfo({ ...valid, phone: '03001234567' })
    expect(result.phone).toBeUndefined()
  })

  it('returns no error for international phone +923001234567', () => {
    const result = validateCustomerInfo({ ...valid, phone: '+923001234567' })
    expect(result.phone).toBeUndefined()
  })

  it('returns error for empty streetAddress', () => {
    const result = validateCustomerInfo({ ...valid, streetAddress: '' })
    expect(result.streetAddress).toBeDefined()
  })

  it('returns error for empty city', () => {
    const result = validateCustomerInfo({ ...valid, city: '' })
    expect(result.city).toBeDefined()
  })

  it('returns error for invalid province', () => {
    const result = validateCustomerInfo({ ...valid, province: 'xyz' as never })
    expect(result.province).toBeDefined()
  })

  it('returns no error for valid province "punjab"', () => {
    const result = validateCustomerInfo({ ...valid, province: 'punjab' })
    expect(result.province).toBeUndefined()
  })

  it('returns error for empty postalCode', () => {
    const result = validateCustomerInfo({ ...valid, postalCode: '' })
    expect(result.postalCode).toBeDefined()
  })

  it('returns multiple errors when several fields invalid', () => {
    const result = validateCustomerInfo({ ...valid, fullName: '', email: 'bad' })
    expect(result.fullName).toBeDefined()
    expect(result.email).toBeDefined()
  })
})
