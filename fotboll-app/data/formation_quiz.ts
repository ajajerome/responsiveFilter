import type { FormationQuizQuestion } from '@/types/content';

export const FORMATION_QUESTIONS: FormationQuizQuestion[] = [
  {
    id: 'fq-5-231',
    type: 'formation_quiz',
    level: '5-manna',
    question: 'Vilken formation visas?',
    players: [
      { x: 0.5, y: 0.85 }, // MV
      { x: 0.3, y: 0.6 }, { x: 0.7, y: 0.6 }, // 2 backar
      { x: 0.4, y: 0.4 }, { x: 0.6, y: 0.4 }, { x: 0.5, y: 0.5 }, // 3 mittfält (triangel)
      { x: 0.5, y: 0.25 }, // 1 forward
    ],
    options: ['2-3-1', '3-2-1', '1-3-1'],
    correctIndex: 0,
    explanation: 'Två backar, tre mittfältare, en forward.'
  },
  {
    id: 'fq-7-321',
    type: 'formation_quiz',
    level: '7-manna',
    question: 'Vilken formation visas?',
    players: [
      { x: 0.5, y: 0.9 },
      { x: 0.3, y: 0.7 }, { x: 0.5, y: 0.7 }, { x: 0.7, y: 0.7 },
      { x: 0.4, y: 0.5 }, { x: 0.6, y: 0.5 },
      { x: 0.5, y: 0.3 },
    ],
    options: ['3-2-1', '2-3-1', '2-2-2'],
    correctIndex: 0,
    explanation: 'Tre backar, två mittfältare, en forward.'
  }
];

