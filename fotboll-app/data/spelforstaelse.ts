import type { QuizQuestion, Position, Level } from '@/types/content';

export const SPELFORSTAELSE: QuizQuestion[] = [
  {
    id: 'sf-mv-langt-skott',
    type: 'quiz',
    level: '7-manna',
    category: 'spelforstaelse',
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
    category: 'spelforstaelse',
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
    category: 'spelforstaelse',
    position: 'back',
    question: 'Motståndaren löper i djupled – vad gör du?',
    options: ['Kliver upp', 'Faller och täcker ytan'],
    correctIndex: 1,
    explanation: 'Att falla ger tid och förhindrar boll bakom backlinjen.'
  },
  {
    id: 'sf-anfall-yta',
    type: 'quiz',
    level: '9-manna',
    category: 'spelforstaelse',
    position: 'anfallare',
    question: 'Som anfallare, hur skapar du yta för medspelare?',
    options: ['Stå still i mitten', 'Dra isär backlinjen med löpning'],
    correctIndex: 1,
    explanation: 'Genom att dra isär backlinjen öppnar du passningsytor.'
  },
  {
    id: 'sf-anfall-yta-2',
    type: 'quiz',
    level: '9-manna',
    category: 'spelforstaelse',
    position: 'anfallare',
    question: 'Som anfallare, hur skapar du yta för medspelare?',
    options: ['Stå still i mitten', 'Dra isär backlinjen med löpning'],
    correctIndex: 1,
    explanation: 'Genom att dra isär backlinjen öppnar du passningsytor.'
  }
];