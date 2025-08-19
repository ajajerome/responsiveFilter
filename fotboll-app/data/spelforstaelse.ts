import type { QuizQuestion, Position, Level } from '@/types/content';

export const SPELFORSTAELSE: QuizQuestion[] = [
  {
    id: 'sf-mv-langt-skott',
    type: 'quiz',
    level: '7-manna',
    position: 'målvakt',
    question: 'Du är målvakt och motståndaren skjuter långt. Vad gör du?',
    options: ['Står kvar på linjen', 'Kliver ut och fångar/boxar'],
    correctIndex: 1,
    explanation: 'Att kliva ut och agera ger bättre vinkel och kontroll på returer.'
  },
  {
    id: 'sf-mf-pass',
    type: 'quiz',
    level: '7-manna',
    position: 'mittfält',
    question: 'Som mittfältare, vem bör du passa?',
    options: ['Markerad forward', 'Fri ytter i fart'],
    correctIndex: 1,
    explanation: 'Fri ytter i fart skapar spelbarhet och hotar yta.'
  },
  {
    id: 'sf-back-djup',
    type: 'quiz',
    level: '9-manna',
    position: 'back',
    question: 'Motståndaren löper i djupled – vad gör du?',
    options: ['Kliver upp', 'Faller och täcker ytan'],
    correctIndex: 1,
    explanation: 'Att falla ger tid och förhindrar boll bakom backlinjen.'
  }
];

