'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCheckoutContext } from '@/context/CheckoutContext'
import { validateCustomerInfo } from '@/lib/checkout'
import { PROVINCE_LABELS } from '@/types/checkout'
import type { CustomerInfo, ProvinceCode, ValidationErrors } from '@/types/checkout'

const PROVINCES = Object.entries(PROVINCE_LABELS) as [ProvinceCode, string][]

const inputClass =
  'w-full rounded border border-brand-bark/30 bg-white px-3 py-2.5 font-sans text-sm text-brand-black placeholder:text-brand-bark/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold'

const errorClass = 'mt-1 font-sans text-xs text-red-600'

export default function CustomerInfoForm() {
  const router = useRouter()
  const { customerInfo, setCustomerInfo } = useCheckoutContext()

  const [form, setForm] = useState<Partial<CustomerInfo>>(customerInfo ?? {})
  const [errors, setErrors] = useState<ValidationErrors>({})

  function handleChange(field: keyof CustomerInfo, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validation = validateCustomerInfo(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }
    setCustomerInfo(form as CustomerInfo)
    router.push('/checkout/review')
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="font-serif text-2xl text-brand-black sm:text-3xl">Shipping Information</h1>

      <div className="mt-6 space-y-5">
        {/* Full name */}
        <div>
          <label htmlFor="fullName" className="mb-1 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName ?? ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Rameen Ahmed"
            className={inputClass}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {errors.fullName && <p id="fullName-error" className={errorClass}>{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email ?? ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className={errorClass}>{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="mb-1 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone ?? ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="03001234567"
            className={inputClass}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && <p id="phone-error" className={errorClass}>{errors.phone}</p>}
        </div>

        {/* Street address */}
        <div>
          <label htmlFor="streetAddress" className="mb-1 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60">
            Street Address *
          </label>
          <input
            id="streetAddress"
            type="text"
            autoComplete="street-address"
            value={form.streetAddress ?? ''}
            onChange={(e) => handleChange('streetAddress', e.target.value)}
            placeholder="House 12, Street 5, F-7/3"
            className={inputClass}
            aria-describedby={errors.streetAddress ? 'streetAddress-error' : undefined}
          />
          {errors.streetAddress && <p id="streetAddress-error" className={errorClass}>{errors.streetAddress}</p>}
        </div>

        {/* City + Postal code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="mb-1 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60">
              City *
            </label>
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              value={form.city ?? ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Islamabad"
              className={inputClass}
              aria-describedby={errors.city ? 'city-error' : undefined}
            />
            {errors.city && <p id="city-error" className={errorClass}>{errors.city}</p>}
          </div>

          <div>
            <label htmlFor="postalCode" className="mb-1 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60">
              Postal Code *
            </label>
            <input
              id="postalCode"
              type="text"
              autoComplete="postal-code"
              value={form.postalCode ?? ''}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              placeholder="44000"
              className={inputClass}
              aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
            />
            {errors.postalCode && <p id="postalCode-error" className={errorClass}>{errors.postalCode}</p>}
          </div>
        </div>

        {/* Province */}
        <div>
          <label htmlFor="province" className="mb-1 block font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60">
            Province *
          </label>
          <select
            id="province"
            value={form.province ?? ''}
            onChange={(e) => handleChange('province', e.target.value)}
            className={inputClass}
            aria-describedby={errors.province ? 'province-error' : undefined}
          >
            <option value="" disabled>Select a province</option>
            {PROVINCES.map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
          {errors.province && <p id="province-error" className={errorClass}>{errors.province}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link
          href="/checkout/cart"
          className="flex min-h-[44px] items-center justify-center rounded border border-brand-bark/30 px-6 font-sans text-sm text-brand-bark hover:border-brand-gold hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        >
          ← Back to Cart
        </Link>
        <button
          type="submit"
          className="flex min-h-[44px] items-center justify-center rounded bg-brand-black px-8 font-sans text-sm uppercase tracking-widest text-brand-cream hover:bg-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          Continue to Review
        </button>
      </div>
    </form>
  )
}
