'use client'

interface StarRatingProps {
  value: number
  onChange?: (n: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md'
}

export default function StarRating({ value, onChange, readOnly = false, size = 'md' }: StarRatingProps) {
  const dim = size === 'sm' ? 16 : 22
  const btnClass = readOnly
    ? 'cursor-default'
    : 'min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform'

  return (
    <div className="flex items-center gap-0.5" role={readOnly ? undefined : 'group'} aria-label={readOnly ? undefined : 'Star rating'}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value
        return readOnly ? (
          <svg
            key={star}
            width={dim}
            height={dim}
            viewBox="0 0 24 24"
            fill={filled ? '#B8973A' : 'none'}
            stroke={filled ? '#B8973A' : '#9CA3AF'}
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ) : (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange?.(star)}
            className={btnClass}
          >
            <svg
              width={dim}
              height={dim}
              viewBox="0 0 24 24"
              fill={filled ? '#B8973A' : 'none'}
              stroke={filled ? '#B8973A' : '#9CA3AF'}
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
