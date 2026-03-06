'use client'

import { useState } from 'react'

const SCENT_FAMILIES = ['Floral', 'Woody', 'Oriental', 'Fresh', 'Gourmand', 'Green', 'Musky']

interface FilterPanelProps {
  families: string[]
  minPrice: number | null
  maxPrice: number | null
  onFilterChange: (families: string[], minPrice: number | null, maxPrice: number | null) => void
  onClearFilters: () => void
}

export default function FilterPanel({
  families,
  minPrice,
  maxPrice,
  onFilterChange,
  onClearFilters,
}: FilterPanelProps) {
  const [minInput, setMinInput] = useState(minPrice !== null ? String(minPrice) : '')
  const [maxInput, setMaxInput] = useState(maxPrice !== null ? String(maxPrice) : '')

  const activeCount =
    families.length + (minPrice !== null ? 1 : 0) + (maxPrice !== null ? 1 : 0)

  const toggleFamily = (family: string) => {
    const lower = family.toLowerCase()
    const next = families.includes(lower)
      ? families.filter((f) => f !== lower)
      : [...families, lower]
    onFilterChange(next, minPrice, maxPrice)
  }

  const applyPrice = () => {
    const min = minInput !== '' && !isNaN(Number(minInput)) ? Number(minInput) : null
    const max = maxInput !== '' && !isNaN(Number(maxInput)) ? Number(maxInput) : null
    onFilterChange(families, min, max)
  }

  const handleClear = () => {
    setMinInput('')
    setMaxInput('')
    onClearFilters()
  }

  return (
    <div className="space-y-6 rounded border border-brand-bark/20 bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-brand-black">
          Filters
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="font-sans text-xs text-brand-gold underline underline-offset-2 hover:text-brand-bark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            Clear All
            <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-white text-[10px] font-bold">
              {activeCount}
            </span>
          </button>
        )}
      </div>

      {/* Scent family checkboxes */}
      <fieldset>
        <legend className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-brand-bark/60">
          Scent Family
        </legend>
        <div className="space-y-2">
          {SCENT_FAMILIES.map((family) => {
            const lower = family.toLowerCase()
            const checked = families.includes(lower)
            return (
              <label
                key={family}
                className="flex cursor-pointer items-center gap-3 min-h-[44px]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFamily(family)}
                  className="h-4 w-4 rounded border-brand-bark/40 text-brand-gold focus:ring-brand-gold focus:ring-offset-0"
                  aria-label={`Filter by ${family}`}
                />
                <span className="font-sans text-sm text-brand-black">{family}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Price range inputs */}
      <fieldset>
        <legend className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-brand-bark/60">
          Price Range (PKR)
        </legend>
        <div className="space-y-3">
          <label className="block">
            <span className="sr-only">Minimum price</span>
            <input
              type="number"
              min={0}
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              onBlur={applyPrice}
              placeholder="Min"
              className="w-full rounded border border-brand-bark/30 px-3 py-2 font-sans text-sm text-brand-black placeholder-brand-bark/40 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold min-h-[44px]"
              aria-label="Minimum price"
            />
          </label>
          <label className="block">
            <span className="sr-only">Maximum price</span>
            <input
              type="number"
              min={0}
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              onBlur={applyPrice}
              placeholder="Max"
              className="w-full rounded border border-brand-bark/30 px-3 py-2 font-sans text-sm text-brand-black placeholder-brand-bark/40 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold min-h-[44px]"
              aria-label="Maximum price"
            />
          </label>
        </div>
      </fieldset>
    </div>
  )
}
