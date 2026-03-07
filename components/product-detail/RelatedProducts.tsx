import type { Product } from '@/types/products'
import ProductCard from '@/components/homepage/ProductCard'

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section aria-labelledby="related-heading" className="mt-16 border-t border-brand-bark/10 pt-12">
      <h2
        id="related-heading"
        className="mb-8 font-serif text-2xl text-brand-black sm:text-3xl"
      >
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
