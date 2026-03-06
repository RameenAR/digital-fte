import type { QuizQuestion } from '@/types/homepage'

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    order: 1,
    questionText: 'What mood do you want your fragrance to evoke?',
    options: [
      { id: 'q1-a', label: 'Romantic & Mysterious', tags: ['oriental', 'floral', 'musky'] },
      { id: 'q1-b', label: 'Fresh & Energetic', tags: ['fresh', 'citrus', 'green'] },
      { id: 'q1-c', label: 'Warm & Cosy', tags: ['gourmand', 'woody', 'musky'] },
      { id: 'q1-d', label: 'Bold & Confident', tags: ['woody', 'oriental', 'citrus'] },
    ],
  },
  {
    id: 'q2',
    order: 2,
    questionText: 'When would you most likely wear this fragrance?',
    options: [
      { id: 'q2-a', label: 'Evening & Special Occasions', tags: ['oriental', 'floral', 'musky'] },
      { id: 'q2-b', label: 'Everyday & Office', tags: ['fresh', 'citrus', 'green'] },
      { id: 'q2-c', label: 'Weekend & Outdoors', tags: ['green', 'fresh', 'woody'] },
      { id: 'q2-d', label: 'Date Night', tags: ['floral', 'oriental', 'musky'] },
    ],
  },
  {
    id: 'q3',
    order: 3,
    questionText: 'Which scent family appeals to you most?',
    options: [
      { id: 'q3-a', label: 'Floral (Rose, Jasmine, Peony)', tags: ['floral'] },
      { id: 'q3-b', label: 'Woody (Oud, Sandalwood, Cedar)', tags: ['woody', 'oriental'] },
      { id: 'q3-c', label: 'Fresh (Citrus, Green, Aquatic)', tags: ['fresh', 'citrus', 'green'] },
      { id: 'q3-d', label: 'Warm (Vanilla, Amber, Musk)', tags: ['gourmand', 'musky', 'oriental'] },
    ],
  },
  {
    id: 'q4',
    order: 4,
    questionText: 'How would you describe your personal style?',
    options: [
      { id: 'q4-a', label: 'Classic & Elegant', tags: ['floral', 'musky'] },
      { id: 'q4-b', label: 'Modern & Minimalist', tags: ['fresh', 'green', 'woody'] },
      { id: 'q4-c', label: 'Luxurious & Opulent', tags: ['oriental', 'woody', 'gourmand'] },
      { id: 'q4-d', label: 'Adventurous & Unique', tags: ['citrus', 'green', 'oriental'] },
    ],
  },
]
