import Link from 'next/link'

interface BreadcrumbProps {
  productName: string
}

export default function Breadcrumb({ productName }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 font-sans text-sm text-brand-bark/60">
        <li>
          <Link
            href="/"
            className="hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            href="/products"
            className="hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
          >
            All Fragrances
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span className="text-brand-black" aria-current="page">
            {productName}
          </span>
        </li>
      </ol>
    </nav>
  )
}
