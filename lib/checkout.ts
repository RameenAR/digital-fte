import type { CustomerInfo, ValidationErrors, ProvinceCode } from '@/types/checkout'

const VALID_PROVINCES: ProvinceCode[] = [
  'punjab',
  'sindh',
  'kpk',
  'balochistan',
  'ict',
  'ajk',
  'gilgit-baltistan',
]

// ─── Pure validation function — exported for unit testing ─────────────────────

export function validateCustomerInfo(info: Partial<CustomerInfo>): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!info.fullName || info.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.'
  }

  if (!info.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  const digits = (info.phone ?? '').replace(/\D/g, '')
  if (!/^(92)?0?3[0-9]{9}$/.test(digits)) {
    errors.phone = 'Please enter a valid phone number (min 10 digits).'
  }

  if (!info.streetAddress || info.streetAddress.trim().length === 0) {
    errors.streetAddress = 'Please enter your street address.'
  }

  if (!info.city || info.city.trim().length === 0) {
    errors.city = 'Please enter your city.'
  }

  if (!info.province || !VALID_PROVINCES.includes(info.province)) {
    errors.province = 'Please select a province.'
  }

  if (!info.postalCode || info.postalCode.trim().length === 0) {
    errors.postalCode = 'Please enter your postal code.'
  }

  return errors
}

// ─── Order number generation — exported for unit testing ──────────────────────

export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const suffix = String(Date.now() % 99999).padStart(5, '0')
  return `LP-${year}-${suffix}`
}
