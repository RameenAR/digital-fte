import type { Metadata } from 'next'
import WishlistPage from '@/components/wishlist/WishlistPage'

export const metadata: Metadata = {
  title: 'Wishlist | Lumière Parfums',
  description: 'Your saved fragrances — review your wishlist and move items to cart.',
}

export default function WishlistRoute() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <WishlistPage />
      </div>
    </main>
  )
}
