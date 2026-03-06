import type { FeaturedProduct } from '@/types/homepage'
import ProductCard from './ProductCard'

interface FeaturedCollectionsProps {
  products: FeaturedProduct[]
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-brand-cream/60" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-brand-cream/60 rounded w-3/4" />
        <div className="h-4 bg-brand-cream/40 rounded w-1/3" />
        <p className="text-brand-bark/50 font-sans text-sm">Coming Soon</p>
      </div>
    </div>
  )
}

export default function FeaturedCollections({ products }: FeaturedCollectionsProps) {
  return (
    <section className="py-20 px-6 bg-white" aria-labelledby="collections-heading">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-gold mb-3">
            Curated Selection
          </p>
          <h2
            id="collections-heading"
            className="font-serif text-4xl md:text-5xl text-brand-black"
          >
            Featured Collections
          </h2>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            // Empty state — 4 skeleton placeholders
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          )}
        </div>
      </div>
    </section>
  )
}
