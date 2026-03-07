import type { ScentNotes } from '@/types/homepage'

interface ScentNotesPyramidProps {
  scentNotes: ScentNotes
}

const tiers: { label: string; key: keyof ScentNotes }[] = [
  { label: 'Top Notes', key: 'top' },
  { label: 'Heart Notes', key: 'heart' },
  { label: 'Base Notes', key: 'base' },
]

export default function ScentNotesPyramid({ scentNotes }: ScentNotesPyramidProps) {
  return (
    <section aria-labelledby="scent-notes-heading">
      <h2
        id="scent-notes-heading"
        className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-brand-bark/60"
      >
        Scent Notes
      </h2>
      <div className="space-y-4 rounded border border-brand-bark/10 bg-white p-5">
        {tiers.map(({ label, key }) => (
          <div key={key}>
            <p className="mb-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-brand-bark/50">
              {label}
            </p>
            <div className="flex flex-wrap gap-2">
              {scentNotes[key].map((note) => (
                <span
                  key={note}
                  className="rounded-full bg-brand-cream px-3 py-1 font-sans text-sm text-brand-black"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
