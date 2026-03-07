interface ProductDescriptionProps {
  description: string
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <section aria-labelledby="description-heading">
      <h2
        id="description-heading"
        className="mb-3 font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60"
      >
        About This Fragrance
      </h2>
      <p className="font-serif text-base leading-relaxed text-brand-bark">
        {description}
      </p>
    </section>
  )
}
