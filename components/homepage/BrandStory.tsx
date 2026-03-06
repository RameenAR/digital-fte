import Image from 'next/image'
import Link from 'next/link'

export default function BrandStory() {
  return (
    <section
      className="py-20 px-6 bg-brand-cream"
      aria-labelledby="brand-story-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/brand-story.jpg"
              alt="Perfumer carefully crafting a fragrance blend in a sunlit atelier"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-brand-gold mb-4">
              Our Story
            </p>
            <h2
              id="brand-story-heading"
              className="font-serif text-4xl md:text-5xl text-brand-black leading-tight mb-6"
            >
              Crafted in the
              <span className="block italic">Heart of Grasse</span>
            </h2>
            <div className="space-y-4 font-sans text-base leading-relaxed text-brand-bark">
              <p>
                Every bottle of Essence begins as a journey — through sun-drenched
                rose fields in Grasse, ancient oud forests in the Middle East, and
                misty citrus groves along the Amalfi Coast. We source only the
                finest raw ingredients, building relationships with growers who
                share our obsession with quality.
              </p>
              <p>
                Our master perfumer, with over two decades of experience, blends
                each fragrance by hand in small batches. No shortcuts, no synthetic
                shortcuts masquerading as naturals. Every Essence fragrance is a
                composition — a story told through scent, from the first bright top
                note to the lingering warmth of the base.
              </p>
              <p>
                We believe that luxury is not about price — it is about intention.
                About choosing something made with care, for someone who notices
                the difference. That someone is you.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 mt-8
                font-sans text-sm tracking-widest uppercase text-brand-black
                border-b border-brand-black pb-1
                hover:text-brand-gold hover:border-brand-gold
                transition-colors duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
