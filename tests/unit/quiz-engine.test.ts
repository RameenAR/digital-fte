import { describe, it, expect } from 'vitest'
import { getRecommendations } from '@/lib/quiz-engine'
import { FEATURED_PRODUCTS_SEED } from '@/data/featured-products-seed'
import type { QuizAnswer } from '@/types/homepage'

describe('getRecommendations', () => {
  it('returns top 2–3 products matching the collected tags', () => {
    const answers: QuizAnswer[] = [
      { questionId: 'q1', selectedTags: ['floral', 'musky'] },
      { questionId: 'q2', selectedTags: ['floral'] },
      { questionId: 'q3', selectedTags: ['floral'] },
      { questionId: 'q4', selectedTags: ['musky'] },
    ]
    const result = getRecommendations(answers, FEATURED_PRODUCTS_SEED)
    expect(result.products.length).toBeGreaterThanOrEqual(2)
    expect(result.products.length).toBeLessThanOrEqual(3)
    expect(result.fallback).toBe(false)
    // Products with floral/musky tags should score highest
    const names = result.products.map((p) => p.name)
    expect(names).toContain('Midnight Rose')
  })

  it('returns fallback bestsellers when no tags match', () => {
    const answers: QuizAnswer[] = [
      { questionId: 'q1', selectedTags: ['nonexistent-tag'] },
      { questionId: 'q2', selectedTags: ['another-fake-tag'] },
      { questionId: 'q3', selectedTags: ['fake'] },
      { questionId: 'q4', selectedTags: ['nope'] },
    ]
    const result = getRecommendations(answers, FEATURED_PRODUCTS_SEED)
    expect(result.products.length).toBeGreaterThanOrEqual(2)
    expect(result.fallback).toBe(true)
    // Fallback = top 3 by displayOrder
    expect(result.products[0].displayOrder).toBe(1)
  })

  it('only includes active products', () => {
    const inactiveProducts = FEATURED_PRODUCTS_SEED.map((p) => ({ ...p, isActive: false }))
    const answers: QuizAnswer[] = [
      { questionId: 'q1', selectedTags: ['floral'] },
      { questionId: 'q2', selectedTags: ['floral'] },
      { questionId: 'q3', selectedTags: ['floral'] },
      { questionId: 'q4', selectedTags: ['floral'] },
    ]
    const result = getRecommendations(answers, inactiveProducts)
    expect(result.products.length).toBe(0)
  })

  it('returns at most 3 recommendations', () => {
    const answers: QuizAnswer[] = [
      { questionId: 'q1', selectedTags: ['musky'] },
      { questionId: 'q2', selectedTags: ['musky'] },
      { questionId: 'q3', selectedTags: ['musky'] },
      { questionId: 'q4', selectedTags: ['musky'] },
    ]
    const result = getRecommendations(answers, FEATURED_PRODUCTS_SEED)
    expect(result.products.length).toBeLessThanOrEqual(3)
  })
})
