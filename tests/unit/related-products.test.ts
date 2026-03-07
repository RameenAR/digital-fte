import { describe, it, expect } from 'vitest'
import { getRelatedProducts } from '@/lib/related-products'
import type { Product } from '@/types/products'

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'prod-test',
  name: 'Test',
  price: 4000,
  imageUrl: '/img/test.webp',
  slug: 'test',
  scentNotes: { top: [], heart: [], base: [] },
  scentTags: ['floral'],
  displayOrder: 1,
  isActive: true,
  category: 'Floral',
  createdAt: new Date('2026-01-01'),
  description: 'A test product.',
  ...overrides,
})

const PRODUCTS: Product[] = [
  makeProduct({ id: '1', slug: 'midnight-rose', scentTags: ['floral', 'oriental', 'woody', 'musky'], displayOrder: 1 }),
  makeProduct({ id: '2', slug: 'saffron-dusk', scentTags: ['oriental', 'woody', 'gourmand'], displayOrder: 2 }),
  makeProduct({ id: '3', slug: 'coastal-breeze', scentTags: ['fresh', 'citrus', 'musky', 'green'], displayOrder: 3 }),
  makeProduct({ id: '4', slug: 'cedar-solstice', scentTags: ['woody', 'green', 'fresh'], displayOrder: 4 }),
  makeProduct({ id: '5', slug: 'velvet-oud', scentTags: ['oriental', 'woody', 'gourmand', 'musky'], displayOrder: 5 }),
  makeProduct({ id: '6', slug: 'garden-at-dawn', scentTags: ['floral', 'green', 'fresh', 'musky'], displayOrder: 6 }),
]

describe('getRelatedProducts', () => {
  it('excludes the current product from results', () => {
    const current = PRODUCTS[0] // midnight-rose
    const result = getRelatedProducts(current, PRODUCTS)
    expect(result.find((p) => p.id === current.id)).toBeUndefined()
  })

  it('returns only products with at least one overlapping scent tag', () => {
    const current = makeProduct({ id: 'unique', scentTags: ['rare-tag'] })
    const result = getRelatedProducts(current, PRODUCTS)
    expect(result).toHaveLength(0)
  })

  it('limits results to 3 by default', () => {
    const current = PRODUCTS[0] // midnight-rose — has many overlapping tags
    const result = getRelatedProducts(current, PRODUCTS)
    expect(result.length).toBeLessThanOrEqual(3)
  })

  it('respects custom limit', () => {
    const current = PRODUCTS[0]
    const result = getRelatedProducts(current, PRODUCTS, 2)
    expect(result.length).toBeLessThanOrEqual(2)
  })

  it('ranks by tag overlap count descending', () => {
    // midnight-rose has: floral, oriental, woody, musky
    // velvet-oud has: oriental, woody, gourmand, musky → 3 overlaps
    // saffron-dusk has: oriental, woody, gourmand → 2 overlaps
    const current = PRODUCTS[0] // midnight-rose
    const result = getRelatedProducts(current, PRODUCTS, 5)
    const velvetOudIdx = result.findIndex((p) => p.slug === 'velvet-oud')
    const saffronDuskIdx = result.findIndex((p) => p.slug === 'saffron-dusk')
    expect(velvetOudIdx).toBeLessThan(saffronDuskIdx)
  })

  it('returns empty array when no products share any tag', () => {
    const current = makeProduct({ id: 'isolated', scentTags: ['nonexistent'] })
    const result = getRelatedProducts(current, PRODUCTS)
    expect(result).toHaveLength(0)
  })

  it('returns all matching products when fewer than limit exist', () => {
    // garden-at-dawn: floral, green, fresh, musky
    const current = PRODUCTS[5]
    const result = getRelatedProducts(current, PRODUCTS, 10)
    // All other 5 products share at least one tag
    expect(result.length).toBeLessThanOrEqual(5)
    expect(result.length).toBeGreaterThan(0)
  })
})
