'use client'

import { Suspense, useState } from 'react'
import { useProductFilters } from '@/hooks/useProductFilters'
import type { Product } from '@/types/products'
import ProductGrid from './ProductGrid'
import ProductListingSkeleton from './ProductListingSkeleton'
import SearchBar from './SearchBar'
import FilterPanel from './FilterPanel'
import SortDropdown from './SortDropdown'
import Pagination from './Pagination'

interface ProductListingClientProps {
  allProducts: Product[]
}

function ProductListingInner({ allProducts }: ProductListingClientProps) {
  const { filterState, result, setFamilies, setPrice, setQuery, setSort, setPage, clearFilters } =
    useProductFilters(allProducts)

  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  const hasActiveFilters =
    filterState.families.length > 0 ||
    filterState.minPrice !== null ||
    filterState.maxPrice !== null

  const handlePageChange = (page: number) => {
    setPage(page)
    // Smooth scroll to product grid anchor
    const grid = document.getElementById('product-grid')
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const productCount = result.total
  const productLabel = productCount === 1 ? 'product' : 'products'

  return (
    <div>
      {/* Top controls row */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search bar */}
        <div className="flex-1 max-w-sm">
          <SearchBar defaultValue={filterState.query} onSearch={setQuery} />
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            type="button"
            className="flex items-center gap-2 rounded border border-brand-bark/30 px-4 py-2 font-sans text-sm text-brand-bark min-h-[44px] hover:border-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold lg:hidden"
            onClick={() => setFilterPanelOpen((v) => !v)}
            aria-expanded={filterPanelOpen}
            aria-controls="filter-panel"
          >
            Filters
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-xs text-white font-bold">
                {filterState.families.length +
                  (filterState.minPrice !== null ? 1 : 0) +
                  (filterState.maxPrice !== null ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <SortDropdown value={filterState.sort} onSortChange={setSort} />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filter panel — sidebar on desktop, drawer on mobile */}
        <aside
          id="filter-panel"
          className={`
            ${filterPanelOpen ? 'block' : 'hidden'} lg:block
            w-full lg:w-56 shrink-0
          `}
        >
          <FilterPanel
            families={filterState.families}
            minPrice={filterState.minPrice}
            maxPrice={filterState.maxPrice}
            onFilterChange={(families, minPrice, maxPrice) => {
              setFamilies(families)
              setPrice(minPrice, maxPrice)
            }}
            onClearFilters={clearFilters}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Result count */}
          <p className="mb-4 font-sans text-sm text-brand-bark/70" aria-live="polite">
            {productCount} {productLabel}
          </p>

          {/* Product grid */}
          <ProductGrid
            products={result.products}
            query={filterState.query}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Wrap in Suspense because useSearchParams requires it in Next.js App Router
export default function ProductListingClient({ allProducts }: ProductListingClientProps) {
  return (
    <Suspense fallback={<ProductListingSkeleton />}>
      <ProductListingInner allProducts={allProducts} />
    </Suspense>
  )
}
