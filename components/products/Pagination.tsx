interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Product pagination"
      className="flex items-center justify-center gap-4"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Go to previous page"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded border border-brand-bark/30 px-4 font-sans text-sm text-brand-black hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      >
        ← Previous
      </button>

      <span
        className="font-sans text-sm text-brand-bark"
        aria-live="polite"
        aria-atomic="true"
      >
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Go to next page"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded border border-brand-bark/30 px-4 font-sans text-sm text-brand-black hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      >
        Next →
      </button>
    </nav>
  )
}
