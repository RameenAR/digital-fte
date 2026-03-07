import type { Product } from '@/types/products'
import { FEATURED_PRODUCTS_SEED } from '@/data/featured-products-seed'

/**
 * Returns all active products sorted by displayOrder (ascending).
 * In production this would query PostgreSQL via Prisma.
 * For v1, reads from seed data to avoid requiring a running DB.
 */
export async function getAllProducts(): Promise<Product[]> {
  // TODO (v2): Replace with Prisma query:
  // return prisma.product.findMany({
  //   where: { isActive: true },
  //   orderBy: { displayOrder: 'asc' },
  // })
  return FEATURED_PRODUCTS_SEED.filter((p) => p.isActive).sort(
    (a, b) => a.displayOrder - b.displayOrder
  )
}

/**
 * Returns a single active product by slug, or null if not found / inactive.
 * In production this would query PostgreSQL via Prisma.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  // TODO (v2): Replace with Prisma query:
  // return prisma.product.findFirst({ where: { slug, isActive: true } })
  return FEATURED_PRODUCTS_SEED.find((p) => p.slug === slug && p.isActive) ?? null
}
