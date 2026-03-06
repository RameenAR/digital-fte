import ProductListingSkeleton from '@/components/products/ProductListingSkeleton'

export default function Loading() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="h-10 w-48 animate-pulse rounded bg-brand-bark/20" />
          <div className="mt-2 h-4 w-36 animate-pulse rounded bg-brand-bark/10" />
        </header>
        <ProductListingSkeleton />
      </div>
    </main>
  )
}
