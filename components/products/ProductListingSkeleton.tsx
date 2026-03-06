// Grid of 12 animated skeleton cards matching ProductCard dimensions

export default function ProductListingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="overflow-hidden bg-white" aria-hidden="true">
          {/* Image placeholder — matches ProductCard aspect-[3/4] */}
          <div className="aspect-[3/4] animate-pulse bg-brand-bark/10" />
          {/* Info placeholder */}
          <div className="p-4 space-y-2">
            <div className="h-5 w-3/4 animate-pulse rounded bg-brand-bark/10" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-brand-bark/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
