import ProductCard from '@/components/homepage/ProductCard'
import ProductListingSkeleton from './ProductListingSkeleton'
import type { Product } from '@/types/products'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  query?: string
  hasActiveFilters?: boolean
  onClearFilters?: () => void
}

export default function ProductGrid({
  products,
  isLoading = false,
  query,
  hasActiveFilters = false,
  onClearFilters,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductListingSkeleton />
  }

  if (products.length === 0) {
    // Search-specific empty state
    if (query && query.trim().length > 0) {
      return (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          role="status"
          aria-live="polite"
        >
          <p className="font-serif text-xl text-brand-black">
            No results for &ldquo;{query}&rdquo;.
          </p>
          <p className="mt-2 font-sans text-sm text-brand-bark/70">
            Try a different search term.
          </p>
        </div>
      )
    }

    // Filter-specific empty state
    if (hasActiveFilters) {
      return (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          role="status"
          aria-live="polite"
        >
          <p className="font-serif text-xl text-brand-black">
            No products match your filters.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="mt-4 font-sans text-sm text-brand-gold underline underline-offset-4 hover:text-brand-bark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              Clear Filters
            </button>
          )}
        </div>
      )
    }

    // Generic empty state
    return (
      <div
        className="flex flex-col items-center justify-center py-24 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="font-serif text-xl text-brand-black">No products available yet.</p>
      </div>
    )
  }

  return (
    <div
      id="product-grid"
      className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
      aria-label="Product grid"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
