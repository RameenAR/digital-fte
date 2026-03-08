'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useWishlist } from '@/hooks/useWishlist'

export default function WishlistPage() {
  const { items, removeFromWishlist, moveToCart } = useWishlist()

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(price)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-bark/30 mb-6"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <h2 className="font-serif text-2xl text-brand-black mb-3">Your wishlist is empty</h2>
        <p className="font-sans text-sm text-brand-bark/70 mb-8">
          Save fragrances you love by clicking the heart icon on any product.
        </p>
        <Link
          href="/products"
          className="font-sans text-sm bg-brand-gold text-white px-6 py-3 hover:bg-brand-bark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-black mb-8">
        Wishlist <span className="text-brand-bark/50 text-xl">({items.length})</span>
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="bg-white border border-brand-bark/10 overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="relative aspect-[3/4] bg-brand-cream">
              <Image
                src={item.imageUrl}
                alt={`${item.name} perfume bottle`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-3 flex-1">
              <div>
                <h3 className="font-serif text-lg text-brand-black">{item.name}</h3>
                <p className="font-sans text-sm text-brand-bark/70">{formatPrice(item.price)}</p>
              </div>

              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={() => moveToCart(item)}
                  className="w-full font-sans text-sm bg-brand-gold text-white px-4 py-2 hover:bg-brand-bark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="w-full font-sans text-sm text-brand-bark/60 hover:text-brand-bark transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
