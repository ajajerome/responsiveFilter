import type { QuizQuestion, Level } from '@/types/content';

export const REGELFRAGOR: QuizQuestion[] = [
  {
    id: 'r-5m-players',
    type: 'quiz',
    level: '5-manna',
    question: 'Hur många spelare får vara på planen i 5-manna?',
    options: ['5', '6', '7', '8'],
    correctIndex: 0,
    explanation: 'I 5-manna spelar varje lag med 5 spelare på planen inklusive målvakt.'
  },
  {
    id: 'r-5m-inspark',
    type: 'quiz',
    level: '5-manna',
    question: 'Vid inspark i 5-manna, var ska motståndarna stå?',
    options: ['Utanför straffområdet', 'Var som helst'],
    correctIndex: 0,
    explanation: 'Motståndarna ska vara utanför straffområdet tills bollen är i spel.'
  },
  {
    id: 'r-7m-inspark',
    type: 'quiz',
    level: '7-manna',
    question: 'Vid inspark i 7-manna, var ska bollen placeras?',
    options: ['På mållinjen', 'I målområdet', 'På straffpunkten'],
    correctIndex: 1,
    explanation: 'Inspark i 7‑manna slås inom målområdet.'
  },
  {
    id: 'r-bbackpass',
    type: 'quiz',
    level: '9-manna',
    question: 'Får målvakten ta upp bollen med händerna om den passas från en medspelare?',
    options: ['Ja', 'Nej'],
    correctIndex: 1,
    explanation: 'Tillbakapass-regeln gäller – målvakten får inte ta upp med händerna.'
  }
];

