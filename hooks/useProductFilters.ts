'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FilterState, PaginatedResult, Product, SortOption } from '@/types/products'

// ─── Constants ────────────────────────────────────────────────────────────────

export const PAGE_SIZE = 12
const VALID_SORT_OPTIONS: SortOption[] = ['bestselling', 'price_asc', 'price_desc', 'newest']
const VALID_CONCENTRATIONS = ['edp', 'edt', 'parfum']
const VALID_GENDERS = ['men', 'women', 'unisex']

// ─── Pure filter pipeline functions ──────────────────────────────────────────

/**
 * Filter products by scent family using OR logic.
 * Empty families array → returns all products.
 */
export function filterByFamily(products: Product[], families: string[]): Product[] {
  if (families.length === 0) return products
  const lowerFamilies = families.map((f) => f.toLowerCase())
  return products.filter((p) =>
    p.scentTags.some((tag) => lowerFamilies.includes(tag.toLowerCase()))
  )
}

/**
 * Filter products by concentration using OR logic.
 * Empty concentrations array → returns all products.
 */
export function filterByConcentration(products: Product[], concentrations: string[]): Product[] {
  if (concentrations.length === 0) return products
  return products.filter((p) => concentrations.includes(p.concentration))
}

/**
 * Filter products by gender using OR logic.
 * Empty genders array → returns all products.
 */
export function filterByGender(products: Product[], genders: string[]): Product[] {
  if (genders.length === 0) return products
  return products.filter((p) => genders.includes(p.gender))
}

/**
 * Filter products by price range (inclusive).
 * Null bounds → no constraint on that side.
 */
export function filterByPrice(
  products: Product[],
  minPrice: number | null,
  maxPrice: number | null
): Product[] {
  return products.filter((p) => {
    if (minPrice !== null && p.price < minPrice) return false
    if (maxPrice !== null && p.price > maxPrice) return false
    return true
  })
}

/**
 * Filter products by search query (case-insensitive substring match).
 * Matches against: name, scentNotes.top/heart/base.
 * Empty query → returns all products.
 */
export function filterBySearch(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase()
  if (!q) return products
  return products.filter((p) => {
    if (p.name.toLowerCase().includes(q)) return true
    const allNotes = [
      ...p.scentNotes.top,
      ...p.scentNotes.heart,
      ...p.scentNotes.base,
    ]
    return allNotes.some((note) => note.toLowerCase().includes(q))
  })
}

/**
 * Sort products by the given SortOption.
 * Returns a new array (does not mutate input).
 */
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]
  switch (sort) {
    case 'bestselling':
      return sorted.sort((a, b) => a.displayOrder - b.displayOrder)
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}

/**
 * Paginate an array of products.
 * Page is 1-indexed. PAGE_SIZE = 12.
 * Clamps page to valid range (min 1, max totalPages).
 * Empty input → { products: [], total: 0, page: 1, totalPages: 0 }
 */
export function paginate(products: Product[], page: number): PaginatedResult {
  const total = products.length
  if (total === 0) {
    return { products: [], total: 0, page: 1, totalPages: 0 }
  }
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const safePage = Math.min(Math.max(1, page), totalPages)
  const offset = (safePage - 1) * PAGE_SIZE
  return {
    products: products.slice(offset, offset + PAGE_SIZE),
    total,
    page: safePage,
    totalPages,
  }
}

// ─── Default FilterState ──────────────────────────────────────────────────────

function defaultFilterState(): FilterState {
  return {
    families: [],
    concentrations: [],
    genders: [],
    minPrice: null,
    maxPrice: null,
    query: '',
    sort: 'bestselling',
    page: 1,
  }
}

/**
 * Parse FilterState from URL search params.
 * Invalid/missing values fall back to safe defaults.
 */
function parseSearchParams(params: URLSearchParams): FilterState {
  // families: ?family=floral,woody  (CSV)
  const familyParam = params.get('family')
  const families = familyParam
    ? familyParam
        .split(',')
        .map((f) => f.trim().toLowerCase())
        .filter(Boolean)
    : []

  // concentrations: ?concentration=edp,parfum  (CSV; validated)
  const concentrationParam = params.get('concentration')
  const concentrations = concentrationParam
    ? concentrationParam
        .split(',')
        .map((c) => c.trim().toLowerCase())
        .filter((c) => VALID_CONCENTRATIONS.includes(c))
    : []

  // genders: ?gender=men,women  (CSV; validated)
  const genderParam = params.get('gender')
  const genders = genderParam
    ? genderParam
        .split(',')
        .map((g) => g.trim().toLowerCase())
        .filter((g) => VALID_GENDERS.includes(g))
    : []

  // minPrice / maxPrice
  const minPriceRaw = params.get('minPrice')
  const maxPriceRaw = params.get('maxPrice')
  const minPrice =
    minPriceRaw !== null && !isNaN(Number(minPriceRaw)) && Number(minPriceRaw) >= 0
      ? Number(minPriceRaw)
      : null
  const maxPrice =
    maxPriceRaw !== null && !isNaN(Number(maxPriceRaw)) && Number(maxPriceRaw) >= 0
      ? Number(maxPriceRaw)
      : null

  // query
  const query = params.get('q') ?? ''

  // sort
  const sortRaw = params.get('sort') as SortOption | null
  const sort: SortOption =
    sortRaw && VALID_SORT_OPTIONS.includes(sortRaw) ? sortRaw : 'bestselling'

  // page
  const pageRaw = params.get('page')
  const page =
    pageRaw !== null && !isNaN(Number(pageRaw)) && Number(pageRaw) >= 1
      ? Math.floor(Number(pageRaw))
      : 1

  return { families, concentrations, genders, minPrice, maxPrice, query, sort, page }
}

/**
 * Serialize FilterState to URL query string.
 * Omits default values to keep URL clean.
 */
function serializeToParams(state: FilterState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.families.length > 0) params.set('family', state.families.join(','))
  if (state.concentrations.length > 0) params.set('concentration', state.concentrations.join(','))
  if (state.genders.length > 0) params.set('gender', state.genders.join(','))
  if (state.minPrice !== null) params.set('minPrice', String(state.minPrice))
  if (state.maxPrice !== null) params.set('maxPrice', String(state.maxPrice))
  if (state.query) params.set('q', state.query)
  if (state.sort !== 'bestselling') params.set('sort', state.sort)
  if (state.page > 1) params.set('page', String(state.page))
  return params
}

// ─── Custom hook ──────────────────────────────────────────────────────────────

interface UseProductFiltersResult {
  filterState: FilterState
  result: PaginatedResult
  catalogMin: number
  catalogMax: number
  setFamilies: (families: string[]) => void
  setConcentrations: (concentrations: string[]) => void
  setGenders: (genders: string[]) => void
  setPrice: (min: number | null, max: number | null) => void
  setQuery: (query: string) => void
  setSort: (sort: SortOption) => void
  setPage: (page: number) => void
  clearFilters: () => void
}

export function useProductFilters(allProducts: Product[]): UseProductFiltersResult {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Catalog price bounds — derived once from allProducts
  const catalogMin = useMemo(
    () => (allProducts.length > 0 ? Math.min(...allProducts.map((p) => p.price)) : 0),
    [allProducts]
  )
  const catalogMax = useMemo(
    () => (allProducts.length > 0 ? Math.max(...allProducts.map((p) => p.price)) : 0),
    [allProducts]
  )

  // Initialise state from URL params on mount
  const [filterState, setFilterStateRaw] = useState<FilterState>(() =>
    parseSearchParams(searchParams)
  )

  // Debounce timer ref for search query
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Apply the full filter pipeline
  const result = useMemo<PaginatedResult>(() => {
    let products = filterBySearch(allProducts, filterState.query)
    products = filterByPrice(products, filterState.minPrice, filterState.maxPrice)
    products = filterByFamily(products, filterState.families)
    products = filterByConcentration(products, filterState.concentrations)
    products = filterByGender(products, filterState.genders)
    products = sortProducts(products, filterState.sort)
    return paginate(products, filterState.page)
  }, [allProducts, filterState])

  // Push state to URL whenever filterState changes
  useEffect(() => {
    const params = serializeToParams(filterState)
    const queryString = params.toString()
    const newPath = queryString ? `/products?${queryString}` : '/products'
    router.push(newPath, { scroll: false })
  }, [filterState, router])

  const setFilterState = useCallback((updater: (prev: FilterState) => FilterState) => {
    setFilterStateRaw((prev) => {
      const next = updater(prev)
      return next
    })
  }, [])

  const setFamilies = useCallback(
    (families: string[]) =>
      setFilterState((prev) => ({ ...prev, families, page: 1 })),
    [setFilterState]
  )

  const setConcentrations = useCallback(
    (concentrations: string[]) =>
      setFilterState((prev) => ({ ...prev, concentrations, page: 1 })),
    [setFilterState]
  )

  const setGenders = useCallback(
    (genders: string[]) =>
      setFilterState((prev) => ({ ...prev, genders, page: 1 })),
    [setFilterState]
  )

  const setPrice = useCallback(
    (minPrice: number | null, maxPrice: number | null) =>
      setFilterState((prev) => ({ ...prev, minPrice, maxPrice, page: 1 })),
    [setFilterState]
  )

  const setSort = useCallback(
    (sort: SortOption) =>
      setFilterState((prev) => ({ ...prev, sort, page: 1 })),
    [setFilterState]
  )

  const setPage = useCallback(
    (page: number) => setFilterState((prev) => ({ ...prev, page })),
    [setFilterState]
  )

  const clearFilters = useCallback(
    () => setFilterStateRaw(defaultFilterState()),
    []
  )

  // Debounced search setter
  const setQuery = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        setFilterState((prev) => ({ ...prev, query, page: 1 }))
      }, 300)
    },
    [setFilterState]
  )

  return {
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
  }
}
