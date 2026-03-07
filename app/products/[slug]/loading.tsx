export default function Loading() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2">
          <div className="h-4 w-12 animate-pulse rounded bg-brand-bark/20" />
          <div className="h-4 w-4 animate-pulse rounded bg-brand-bark/10" />
          <div className="h-4 w-24 animate-pulse rounded bg-brand-bark/20" />
          <div className="h-4 w-4 animate-pulse rounded bg-brand-bark/10" />
          <div className="h-4 w-32 animate-pulse rounded bg-brand-bark/20" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Hero image skeleton */}
          <div className="aspect-[3/4] w-full animate-pulse rounded bg-brand-bark/10" />

          {/* Info panel skeleton */}
          <div className="flex flex-col gap-8">
            {/* Name + price + badge */}
            <div className="space-y-3">
              <div className="h-10 w-3/4 animate-pulse rounded bg-brand-bark/20" />
              <div className="h-6 w-1/3 animate-pulse rounded bg-brand-bark/20" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-brand-bark/10" />
            </div>
            {/* Scent pyramid skeleton */}
            <div className="space-y-4">
              {['Top', 'Heart', 'Base'].map((tier) => (
                <div key={tier} className="space-y-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-brand-bark/20" />
                  <div className="h-4 w-48 animate-pulse rounded bg-brand-bark/10" />
                </div>
              ))}
            </div>
            {/* Description skeleton */}
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-brand-bark/10" />
              ))}
              <div className="h-4 w-2/3 animate-pulse rounded bg-brand-bark/10" />
            </div>
            {/* Add to cart skeleton */}
            <div className="flex gap-4">
              <div className="h-12 w-32 animate-pulse rounded bg-brand-bark/10" />
              <div className="h-12 w-40 animate-pulse rounded bg-brand-bark/20" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
