'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

export default function CartBadge() {
  const { totalItems } = useCart()

  return (
    <Link
      href="/products"
      aria-label={totalItems > 0 ? `Cart — ${totalItems} item${totalItems === 1 ? '' : 's'}` : 'Cart'}
      className="relative flex items-center justify-center font-sans text-sm text-brand-bark hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {totalItems > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold font-sans text-[10px] font-semibold text-white"
        >
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Link>
  )
}
