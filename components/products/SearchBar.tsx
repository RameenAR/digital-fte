'use client'

import { useEffect, useRef, useState } from 'react'

interface SearchBarProps {
  defaultValue?: string
  onSearch: (query: string) => void
}

export default function SearchBar({ defaultValue = '', onSearch }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync external defaultValue changes (e.g., URL param on page load)
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setValue(next)
    onSearch(next) // debounce handled in useProductFilters
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <label htmlFor="product-search" className="sr-only">
        Search fragrances
      </label>
      <input
        ref={inputRef}
        id="product-search"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search fragrances…"
        aria-label="Search fragrances"
        className="w-full rounded border border-brand-bark/30 bg-white py-2 pl-4 pr-10 font-sans text-sm text-brand-black placeholder-brand-bark/40 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold min-h-[44px]"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-bark/50 hover:text-brand-black focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        >
          ×
        </button>
      )}
    </div>
  )
}
