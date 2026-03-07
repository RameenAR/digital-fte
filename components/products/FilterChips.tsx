'use client'

import { CONCENTRATION_LABELS, GENDER_LABELS } from '@/types/products'
import type { FilterState } from '@/types/products'

interface FilterChipsProps {
  filterState: FilterState
  catalogMin: number
  catalogMax: number
  onRemoveQuery: () => void
  onRemoveFamily: (family: string) => void
  onRemoveConcentration: (concentration: string) => void
  onRemoveGender: (gender: string) => void
  onRemovePrice: () => void
  onClearAll: () => void
}

interface Chip {
  key: string
  label: string
  onRemove: () => void
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-brand-bark/30 bg-white px-3 py-1 font-sans text-xs text-brand-black">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-brand-bark/60 hover:bg-brand-bark/10 hover:text-brand-black focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      >
        ×
      </button>
    </span>
  )
}

export default function FilterChips({
  filterState,
  catalogMin,
  catalogMax,
  onRemoveQuery,
  onRemoveFamily,
  onRemoveConcentration,
  onRemoveGender,
  onRemovePrice,
  onClearAll,
}: FilterChipsProps) {
  const chips: Chip[] = []

  if (filterState.query) {
    chips.push({
      key: 'query',
      label: `Search: "${filterState.query}"`,
      onRemove: onRemoveQuery,
    })
  }

  for (const c of filterState.concentrations) {
    chips.push({
      key: `concentration-${c}`,
      label: CONCENTRATION_LABELS[c as keyof typeof CONCENTRATION_LABELS] ?? c,
      onRemove: () => onRemoveConcentration(c),
    })
  }

  for (const g of filterState.genders) {
    chips.push({
      key: `gender-${g}`,
      label: GENDER_LABELS[g as keyof typeof GENDER_LABELS] ?? g,
      onRemove: () => onRemoveGender(g),
    })
  }

  for (const f of filterState.families) {
    chips.push({
      key: `family-${f}`,
      label: f.charAt(0).toUpperCase() + f.slice(1),
      onRemove: () => onRemoveFamily(f),
    })
  }

  const priceNarrowed =
    filterState.minPrice !== null && filterState.minPrice !== catalogMin ||
    filterState.maxPrice !== null && filterState.maxPrice !== catalogMax
  if (
    filterState.minPrice !== null ||
    filterState.maxPrice !== null
  ) {
    const lo = filterState.minPrice ?? catalogMin
    const hi = filterState.maxPrice ?? catalogMax
    chips.push({
      key: 'price',
      label: `PKR ${lo.toLocaleString()} – ${hi.toLocaleString()}`,
      onRemove: onRemovePrice,
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Chip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="font-sans text-xs text-brand-gold underline underline-offset-2 hover:text-brand-bark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      >
        Clear All
      </button>
    </div>
  )
}
