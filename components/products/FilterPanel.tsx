'use client'

import { CONCENTRATION_LABELS, GENDER_LABELS } from '@/types/products'
import type { Concentration, Gender } from '@/types/products'
import PriceRangeSlider from './PriceRangeSlider'

const CONCENTRATIONS: { value: Concentration; label: string }[] = [
  { value: 'edp', label: CONCENTRATION_LABELS.edp },
  { value: 'edt', label: CONCENTRATION_LABELS.edt },
  { value: 'parfum', label: CONCENTRATION_LABELS.parfum },
]

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'women', label: GENDER_LABELS.women },
  { value: 'men', label: GENDER_LABELS.men },
  { value: 'unisex', label: GENDER_LABELS.unisex },
]

const SCENT_FAMILIES = ['Floral', 'Woody', 'Oriental', 'Fresh', 'Citrus', 'Gourmand', 'Green', 'Musky']

interface FilterPanelProps {
  families: string[]
  concentrations: string[]
  genders: string[]
  minPrice: number | null
  maxPrice: number | null
  catalogMin: number
  catalogMax: number
  onFilterChange: (families: string[], minPrice: number | null, maxPrice: number | null) => void
  onConcentrationChange: (concentrations: string[]) => void
  onGenderChange: (genders: string[]) => void
  onPriceChange: (min: number | null, max: number | null) => void
  onClearFilters: () => void
}

export default function FilterPanel({
  families,
  concentrations,
  genders,
  minPrice,
  maxPrice,
  catalogMin,
  catalogMax,
  onFilterChange,
  onConcentrationChange,
  onGenderChange,
  onPriceChange,
  onClearFilters,
}: FilterPanelProps) {
  const activeCount =
    families.length +
    concentrations.length +
    genders.length +
    (minPrice !== null ? 1 : 0) +
    (maxPrice !== null ? 1 : 0)

  const toggleFamily = (family: string) => {
    const lower = family.toLowerCase()
    const next = families.includes(lower)
      ? families.filter((f) => f !== lower)
      : [...families, lower]
    onFilterChange(next, minPrice, maxPrice)
  }

  const toggleConcentration = (value: string) => {
    const next = concentrations.includes(value)
      ? concentrations.filter((c) => c !== value)
      : [...concentrations, value]
    onConcentrationChange(next)
  }

  const toggleGender = (value: string) => {
    const next = genders.includes(value)
      ? genders.filter((g) => g !== value)
      : [...genders, value]
    onGenderChange(next)
  }

  const handlePriceChange = ([min, max]: [number, number]) => {
    onPriceChange(
      min === catalogMin ? null : min,
      max === catalogMax ? null : max
    )
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
            onClick={onClearFilters}
            className="font-sans text-xs text-brand-gold underline underline-offset-2 hover:text-brand-bark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            Clear All
            <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-white text-[10px] font-bold">
              {activeCount}
            </span>
          </button>
        )}
      </div>

      {/* Concentration checkboxes */}
      <fieldset>
        <legend className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-brand-bark/60">
          Category
        </legend>
        <div className="space-y-2">
          {CONCENTRATIONS.map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-3 min-h-[44px]">
              <input
                type="checkbox"
                checked={concentrations.includes(value)}
                onChange={() => toggleConcentration(value)}
                className="h-4 w-4 rounded border-brand-bark/40 text-brand-gold focus:ring-brand-gold focus:ring-offset-0"
                aria-label={`Filter by ${label}`}
              />
              <span className="font-sans text-sm text-brand-black">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Gender checkboxes */}
      <fieldset>
        <legend className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-brand-bark/60">
          Gender
        </legend>
        <div className="space-y-2">
          {GENDERS.map(({ value, label }) => (
            <label key={value} className="flex cursor-pointer items-center gap-3 min-h-[44px]">
              <input
                type="checkbox"
                checked={genders.includes(value)}
                onChange={() => toggleGender(value)}
                className="h-4 w-4 rounded border-brand-bark/40 text-brand-gold focus:ring-brand-gold focus:ring-offset-0"
                aria-label={`Filter by ${label}`}
              />
              <span className="font-sans text-sm text-brand-black">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Scent family checkboxes */}
      <fieldset>
        <legend className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-brand-bark/60">
          Fragrance Notes
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

      {/* Price range slider */}
      <fieldset>
        <legend className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-brand-bark/60">
          Price Range (PKR)
        </legend>
        <PriceRangeSlider
          min={catalogMin}
          max={catalogMax}
          value={[minPrice ?? catalogMin, maxPrice ?? catalogMax]}
          onChange={handlePriceChange}
          disabled={catalogMin === catalogMax}
        />
      </fieldset>
    </div>
  )
}
