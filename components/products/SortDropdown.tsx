import type { SortOption } from '@/types/products'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'bestselling', label: 'Bestselling' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
]

interface SortDropdownProps {
  value: SortOption
  onSortChange: (sort: SortOption) => void
}

export default function SortDropdown({ value, onSortChange }: SortDropdownProps) {
  return (
    <div>
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        aria-label="Sort products"
        className="rounded border border-brand-bark/30 bg-white px-3 py-2 font-sans text-sm text-brand-black focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold min-h-[44px] cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
