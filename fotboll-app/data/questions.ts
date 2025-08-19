import { Question } from '@/types/content';

export const QUESTIONS: Question[] = [
  {
    id: 'q1234',
    type: 'drag_drop',
    level: '7-manna',
    position: 'mittfält',
    question: 'Placera spelarna rätt i en 2-3-1 uppställning',
    targetRect: { x: 0.45, y: 0.5, width: 0.12, height: 0.12 },
    start: { x: 0.5, y: 0.85 },
    playerLabel: 'CM',
  },
  {
    id: 'q0001',
    type: 'quiz',
    level: '5-manna',
    position: 'back',
    question: 'Vad är viktigt vid uppspel från målvakt?',
    options: ['Breda ytterbackar', 'Alla i mitten'],
    correctIndex: 0,
  },
];

