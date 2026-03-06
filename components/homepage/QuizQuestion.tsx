import type { QuizQuestion as QuizQuestionType, QuizOption } from '@/types/homepage'

interface QuizQuestionProps {
  question: QuizQuestionType
  totalQuestions: number
  onAnswer: (option: QuizOption) => void
}

export default function QuizQuestion({ question, totalQuestions, onAnswer }: QuizQuestionProps) {
  const progress = ((question.order - 1) / totalQuestions) * 100

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="mb-6" role="progressbar" aria-valuenow={question.order} aria-valuemin={1} aria-valuemax={totalQuestions}>
        <div className="flex justify-between mb-2">
          <span className="font-sans text-xs text-brand-bark/60 tracking-wide">
            Question {question.order} of {totalQuestions}
          </span>
        </div>
        <div className="h-1 bg-brand-cream rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gold rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question text */}
      <h3 className="font-serif text-2xl md:text-3xl text-brand-black mb-8 leading-snug">
        {question.questionText}
      </h3>

      {/* Answer options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option)}
            className="min-h-[44px] p-4 text-left
              border border-brand-cream bg-white
              font-sans text-sm text-brand-black
              transition-all duration-200
              hover:border-brand-gold hover:bg-brand-cream/30
              focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2
              active:scale-[0.98]"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
