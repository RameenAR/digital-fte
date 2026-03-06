import { describe, it, expect } from 'vitest'
import {
  filterByFamily,
  filterByPrice,
  filterBySearch,
  sortProducts,
  paginate,
} from '@/hooks/useProductFilters'
import type { Product } from '@/types/products'

// ─── Test fixtures ────────────────────────────────────────────────────────────

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'prod-test',
  name: 'Test Fragrance',
  price: 5000,
  imageUrl: '/images/test.webp',
  slug: 'test-fragrance',
  scentNotes: { top: ['Bergamot'], heart: ['Rose'], base: ['Musk'] },
  scentTags: ['floral', 'musky'],
  displayOrder: 1,
  isActive: true,
  category: 'Floral',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
})

const PRODUCTS: Product[] = [
  makeProduct({ id: '1', name: 'Midnight Rose', price: 4500, scentTags: ['floral', 'musky'], displayOrder: 1, category: 'Floral', createdAt: new Date('2026-02-01') }),
  makeProduct({ id: '2', name: 'Saffron Dusk', price: 5200, scentTags: ['oriental', 'woody'], displayOrder: 2, category: 'Oriental', createdAt: new Date('2026-02-05') }),
  makeProduct({ id: '3', name: 'Coastal Breeze', price: 3800, scentTags: ['fresh', 'citrus'], displayOrder: 3, category: 'Fresh', createdAt: new Date('2026-02-10') }),
  makeProduct({ id: '4', name: 'Cedar Solstice', price: 4100, scentTags: ['woody', 'green'], displayOrder: 4, category: 'Woody', createdAt: new Date('2026-02-15') }),
  makeProduct({ id: '5', name: 'Velvet Oud', price: 6800, scentTags: ['oriental', 'woody', 'musky'], displayOrder: 5, category: 'Oriental', createdAt: new Date('2026-02-20') }),
  makeProduct({ id: '6', name: 'Garden at Dawn', price: 3500, scentTags: ['floral', 'green', 'fresh'], displayOrder: 6, category: 'Floral', createdAt: new Date('2026-02-25') }),
]

// ─── filterByFamily ───────────────────────────────────────────────────────────

describe('filterByFamily', () => {
  it('returns all products when families is empty', () => {
    expect(filterByFamily(PRODUCTS, [])).toHaveLength(6)
  })

  it('returns only floral products', () => {
    const result = filterByFamily(PRODUCTS, ['floral'])
    expect(result).toHaveLength(2)
    result.forEach((p) => expect(p.scentTags).toContain('floral'))
  })

  it('returns OR logic — floral OR woody', () => {
    const result = filterByFamily(PRODUCTS, ['floral', 'woody'])
    // Midnight Rose (floral), Saffron Dusk (woody), Cedar Solstice (woody), Velvet Oud (woody), Garden at Dawn (floral)
    expect(result.length).toBeGreaterThanOrEqual(4)
  })

  it('returns empty array when no products match', () => {
    expect(filterByFamily(PRODUCTS, ['gourmand'])).toHaveLength(0)
  })
})

// ─── filterByPrice ────────────────────────────────────────────────────────────

describe('filterByPrice', () => {
  it('returns all products when both bounds are null', () => {
    expect(filterByPrice(PRODUCTS, null, null)).toHaveLength(6)
  })

  it('filters by minPrice only', () => {
    const result = filterByPrice(PRODUCTS, 5000, null)
    result.forEach((p) => expect(p.price).toBeGreaterThanOrEqual(5000))
  })

  it('filters by maxPrice only', () => {
    const result = filterByPrice(PRODUCTS, null, 4000)
    result.forEach((p) => expect(p.price).toBeLessThanOrEqual(4000))
  })

  it('filters by both minPrice and maxPrice', () => {
    const result = filterByPrice(PRODUCTS, 4000, 5500)
    result.forEach((p) => {
      expect(p.price).toBeGreaterThanOrEqual(4000)
      expect(p.price).toBeLessThanOrEqual(5500)
    })
  })

  it('returns empty array when no products match price range', () => {
    expect(filterByPrice(PRODUCTS, 10000, 20000)).toHaveLength(0)
  })
})

// ─── filterBySearch ───────────────────────────────────────────────────────────

describe('filterBySearch', () => {
  it('returns all products when query is empty', () => {
    expect(filterBySearch(PRODUCTS, '')).toHaveLength(6)
  })

  it('matches by product name (case-insensitive)', () => {
    const result = filterBySearch(PRODUCTS, 'rose')
    const names = result.map((p) => p.name)
    expect(names).toContain('Midnight Rose')
  })

  it('matches by scent notes (top/heart/base)', () => {
    // Coastal Breeze has 'Bergamot' in top notes
    const result = filterBySearch(PRODUCTS, 'bergamot')
    expect(result.length).toBeGreaterThanOrEqual(1)
  })

  it('returns empty array when no products match', () => {
    expect(filterBySearch(PRODUCTS, 'xyzabc123')).toHaveLength(0)
  })

  it('search is case-insensitive', () => {
    expect(filterBySearch(PRODUCTS, 'ROSE')).toEqual(
      filterBySearch(PRODUCTS, 'rose')
    )
  })
})

// ─── sortProducts ─────────────────────────────────────────────────────────────

describe('sortProducts', () => {
  it('sorts by displayOrder ASC for bestselling', () => {
    const sorted = sortProducts([...PRODUCTS], 'bestselling')
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].displayOrder).toBeLessThanOrEqual(sorted[i + 1].displayOrder)
    }
  })

  it('sorts by price ASC for price_asc', () => {
    const sorted = sortProducts([...PRODUCTS], 'price_asc')
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].price).toBeLessThanOrEqual(sorted[i + 1].price)
    }
    expect(sorted[0].price).toBe(3500) // Garden at Dawn
  })

  it('sorts by price DESC for price_desc', () => {
    const sorted = sortProducts([...PRODUCTS], 'price_desc')
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i + 1].price)
    }
    expect(sorted[0].price).toBe(6800) // Velvet Oud
  })

  it('sorts by createdAt DESC for newest', () => {
    const sorted = sortProducts([...PRODUCTS], 'newest')
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].createdAt.getTime()).toBeGreaterThanOrEqual(
        sorted[i + 1].createdAt.getTime()
      )
    }
    // Garden at Dawn has newest createdAt (2026-02-25)
    expect(sorted[0].name).toBe('Garden at Dawn')
  })
})

// ─── paginate ─────────────────────────────────────────────────────────────────

describe('paginate', () => {
  const TWELVE_PRODUCTS = Array.from({ length: 13 }, (_, i) =>
    makeProduct({ id: `p${i}`, name: `Product ${i}`, displayOrder: i + 1 })
  )

  it('returns first 12 products on page 1', () => {
    const result = paginate(TWELVE_PRODUCTS, 1)
    expect(result.products).toHaveLength(12)
    expect(result.total).toBe(13)
    expect(result.page).toBe(1)
    expect(result.totalPages).toBe(2)
  })

  it('returns remaining products on page 2', () => {
    const result = paginate(TWELVE_PRODUCTS, 2)
    expect(result.products).toHaveLength(1)
    expect(result.page).toBe(2)
    expect(result.totalPages).toBe(2)
  })

  it('handles fewer than 12 products on page 1', () => {
    const result = paginate(PRODUCTS, 1)
    expect(result.products).toHaveLength(6)
    expect(result.total).toBe(6)
    expect(result.totalPages).toBe(1)
  })

  it('clamps page number to 1 if provided page exceeds totalPages', () => {
    const result = paginate(PRODUCTS, 99)
    expect(result.page).toBe(1)
  })

  it('returns empty products array for empty input', () => {
    const result = paginate([], 1)
    expect(result.products).toHaveLength(0)
    expect(result.total).toBe(0)
    expect(result.totalPages).toBe(0)
  })
})
