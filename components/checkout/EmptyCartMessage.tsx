import Link from 'next/link'

export default function EmptyCartMessage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="font-serif text-2xl text-brand-black">Your cart is empty</h2>
      <p className="mt-3 font-sans text-sm text-brand-bark/60">
        Discover our collection of handcrafted fragrances.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded border border-brand-gold px-6 py-3 font-sans text-sm uppercase tracking-widest text-brand-gold hover:bg-brand-gold hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      >
        Browse All Fragrances
      </Link>
    </div>
  )
}
