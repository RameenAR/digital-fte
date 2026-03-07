'use client'

import { Suspense, useState } from 'react'
import { useProductFilters } from '@/hooks/useProductFilters'
import type { Product } from '@/types/products'
import ProductGrid from './ProductGrid'
import ProductListingSkeleton from './ProductListingSkeleton'
import SearchBar from './SearchBar'
import FilterPanel from './FilterPanel'
import FilterChips from './FilterChips'
import SortDropdown from './SortDropdown'
import Pagination from './Pagination'

interface ProductListingClientProps {
  allProducts: Product[]
}

function ProductListingInner({ allProducts }: ProductListingClientProps) {
  const {
    filterState,
    result,
    catalogMin,
    catalogMax,
    setFamilies,
    setConcentrations,
    setGenders,
    setPrice,
    setQuery,
    setSort,
    setPage,
    clearFilters,
  } = useProductFilters(allProducts)

  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  const hasActiveFilters =
    filterState.families.length > 0 ||
    filterState.concentrations.length > 0 ||
    filterState.genders.length > 0 ||
    filterState.minPrice !== null ||
    filterState.maxPrice !== null ||
    !!filterState.query

  const activeFilterCount =
    filterState.families.length +
    filterState.concentrations.length +
    filterState.genders.length +
    (filterState.minPrice !== null ? 1 : 0) +
    (filterState.maxPrice !== null ? 1 : 0) +
    (filterState.query ? 1 : 0)

  const handlePageChange = (page: number) => {
    setPage(page)
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
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <SortDropdown value={filterState.sort} onSortChange={setSort} />
        </div>
      </div>

      {/* Active filter chips */}
      <FilterChips
        filterState={filterState}
        catalogMin={catalogMin}
        catalogMax={catalogMax}
        onRemoveQuery={() => setQuery('')}
        onRemoveFamily={(f) => setFamilies(filterState.families.filter((x) => x !== f))}
        onRemoveConcentration={(c) => setConcentrations(filterState.concentrations.filter((x) => x !== c))}
        onRemoveGender={(g) => setGenders(filterState.genders.filter((x) => x !== g))}
        onRemovePrice={() => setPrice(null, null)}
        onClearAll={clearFilters}
      />

      <div className="flex gap-8">
        {/* Filter panel — sidebar on desktop, drawer on mobile */}
        <aside
          id="filter-panel"
          className={`
            ${filterPanelOpen ? 'block' : 'hidden'} lg:block
            w-full lg:w-64 shrink-0
          `}
        >
          <FilterPanel
            families={filterState.families}
            concentrations={filterState.concentrations}
            genders={filterState.genders}
            minPrice={filterState.minPrice}
            maxPrice={filterState.maxPrice}
            catalogMin={catalogMin}
            catalogMax={catalogMax}
            onFilterChange={(families, minPrice, maxPrice) => {
              setFamilies(families)
              setPrice(minPrice, maxPrice)
            }}
            onConcentrationChange={setConcentrations}
            onGenderChange={setGenders}
            onPriceChange={setPrice}
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
