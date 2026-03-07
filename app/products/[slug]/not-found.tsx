import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-4 text-center">
      <h1 className="font-serif text-4xl text-brand-black">Product Not Found</h1>
      <p className="mt-4 font-sans text-base text-brand-bark/70">
        We couldn&rsquo;t find the fragrance you&rsquo;re looking for. It may have been removed or the link may be incorrect.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded border border-brand-gold px-6 py-3 font-sans text-sm uppercase tracking-widest text-brand-gold hover:bg-brand-gold hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      >
        Browse All Fragrances
      </Link>
    </main>
  )
}
