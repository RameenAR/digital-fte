'use client'

import { useWishlist } from '@/hooks/useWishlist'

interface WishlistToggleProps {
  product: {
    productId: string
    slug: string
    name: string
    imageUrl: string
    price: number
  }
  className?: string
}

export default function WishlistToggle({ product, className = '' }: WishlistToggleProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const saved = isInWishlist(product.productId)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className={`flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full transition-colors
        ${saved ? 'text-brand-gold' : 'text-brand-bark/60 hover:text-brand-gold'}
        ${className}`}
    >
      {saved ? (
        // Filled heart
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ) : (
        // Outline heart
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
      )}
    </button>
  )
}
