import { describe, it, expect } from 'vitest'
import { validateEmail, buildSubscriberPayload } from '@/lib/newsletter'

describe('validateEmail', () => {
  it('accepts a valid email address', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  it('accepts email with subdomain', () => {
    expect(validateEmail('user@mail.example.co.uk')).toBe(true)
  })

  it('rejects an email without @', () => {
    expect(validateEmail('notanemail')).toBe(false)
  })

  it('rejects an email without domain', () => {
    expect(validateEmail('user@')).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(validateEmail('')).toBe(false)
  })

  it('rejects an email that is too long', () => {
    expect(validateEmail('a'.repeat(255) + '@example.com')).toBe(false)
  })
})

describe('buildSubscriberPayload', () => {
  it('lowercases and trims the email', () => {
    const payload = buildSubscriberPayload('  USER@Example.COM  ', true)
    expect(payload.email).toBe('user@example.com')
  })

  it('sets consentGiven correctly', () => {
    const payload = buildSubscriberPayload('user@example.com', true)
    expect(payload.consentGiven).toBe(true)
  })
})
