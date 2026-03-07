'use client'

import Link from 'next/link'
import { useCheckoutContext } from '@/context/CheckoutContext'
import { PROVINCE_LABELS } from '@/types/checkout'

const fmt = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
})

export default function OrderConfirmation() {
  const { completedOrder } = useCheckoutContext()

  if (!completedOrder) return null

  const { orderNumber, customerInfo, lineItems, grandTotal } = completedOrder

  return (
    <div className="text-center">
      {/* Success icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-gold text-brand-gold">
        <span className="font-sans text-2xl">✓</span>
      </div>

      <h1 className="mt-4 font-serif text-3xl text-brand-black">Order Confirmed!</h1>
      <p className="mt-2 font-sans text-sm text-brand-bark/60">
        Thank you for your order. We&rsquo;ll be in touch soon.
      </p>

      {/* Order number */}
      <div className="mt-6 rounded border border-brand-gold/30 bg-white px-6 py-4">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/50">
          Order Reference
        </p>
        <p className="mt-1 font-serif text-3xl text-brand-gold">{orderNumber}</p>
      </div>

      {/* Items summary */}
      <section aria-labelledby="confirm-items-heading" className="mt-6 text-left">
        <h2 id="confirm-items-heading" className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60">
          Items Ordered
        </h2>
        <div className="divide-y divide-brand-bark/10 rounded border border-brand-bark/10 bg-white px-5">
          {lineItems.map((item) => (
            <div key={item.productId} className="flex items-center justify-between py-3">
              <div>
                <p className="font-serif text-sm text-brand-black">{item.name}</p>
                <p className="font-sans text-xs text-brand-bark/50">Qty: {item.quantity} × {fmt.format(item.unitPrice)}</p>
              </div>
              <p className="font-sans text-sm font-semibold text-brand-black">{fmt.format(item.lineSubtotal)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-baseline justify-end gap-3">
          <span className="font-sans text-xs text-brand-bark/60">Total Paid</span>
          <span className="font-serif text-xl text-brand-black">{fmt.format(grandTotal)}</span>
        </div>
      </section>

      {/* Delivery address */}
      <section aria-labelledby="confirm-delivery-heading" className="mt-6 text-left">
        <h2 id="confirm-delivery-heading" className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60">
          Delivering To
        </h2>
        <div className="rounded border border-brand-bark/10 bg-white px-5 py-4 space-y-0.5 font-sans text-sm text-brand-bark">
          <p className="font-semibold text-brand-black">{customerInfo.fullName}</p>
          <p>{customerInfo.streetAddress}</p>
          <p>{customerInfo.city}, {PROVINCE_LABELS[customerInfo.province]}, {customerInfo.postalCode}</p>
          <p className="text-brand-bark/60">{customerInfo.email} · {customerInfo.phone}</p>
        </div>
      </section>

      <Link
        href="/products"
        className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded border border-brand-gold px-8 font-sans text-sm uppercase tracking-widest text-brand-gold hover:bg-brand-gold hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
