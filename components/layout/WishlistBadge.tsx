'use client'

import Link from 'next/link'
import { useWishlist } from '@/hooks/useWishlist'

export default function WishlistBadge() {
  const { totalItems } = useWishlist()

  return (
    <Link
      href="/wishlist"
      aria-label={totalItems > 0 ? `Wishlist — ${totalItems} item${totalItems === 1 ? '' : 's'}` : 'Wishlist'}
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
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
