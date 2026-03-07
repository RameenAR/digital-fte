'use client'

import { useState } from 'react'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  disabled?: boolean
}

function formatPKR(value: number): string {
  return value.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
}

export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  disabled = false,
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value)

  // Keep local value in sync when external value changes (e.g. Clear All)
  const currentMin = disabled ? min : localValue[0]
  const currentMax = disabled ? max : localValue[1]

  const range = max - min || 1
  const minPct = ((currentMin - min) / range) * 100
  const maxPct = ((max - currentMax) / range) * 100

  if (disabled) {
    return (
      <div className="space-y-2">
        <div className="h-1 rounded bg-brand-bark/20" />
        <p className="font-sans text-xs text-brand-bark/50">
          {formatPKR(min)}
        </p>
      </div>
    )
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.min(Number(e.target.value), currentMax - 1)
    setLocalValue([next, currentMax])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.max(Number(e.target.value), currentMin + 1)
    setLocalValue([currentMin, next])
  }

  const commit = () => {
    onChange(localValue)
  }

  return (
    <div className="space-y-3">
      {/* Dual-handle slider */}
      <div className="relative h-5 flex items-center">
        {/* Track */}
        <div
          className="absolute h-1 rounded w-full bg-brand-bark/20"
          style={{
            background: `linear-gradient(
              to right,
              #d4c5b0 ${minPct}%,
              #b8924a ${minPct}%,
              #b8924a ${100 - maxPct}%,
              #d4c5b0 ${100 - maxPct}%
            )`,
          }}
        />
        {/* Min handle */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={currentMin}
          onChange={handleMinChange}
          onPointerUp={commit}
          onTouchEnd={commit}
          aria-label="Minimum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentMin}
          className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-gold [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-1"
        />
        {/* Max handle */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={currentMax}
          onChange={handleMaxChange}
          onPointerUp={commit}
          onTouchEnd={commit}
          aria-label="Maximum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentMax}
          className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-gold [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-1"
        />
      </div>

      {/* Price labels */}
      <div className="flex justify-between">
        <span className="font-sans text-xs text-brand-bark/70">{formatPKR(currentMin)}</span>
        <span className="font-sans text-xs text-brand-bark/70">{formatPKR(currentMax)}</span>
      </div>
    </div>
  )
}
