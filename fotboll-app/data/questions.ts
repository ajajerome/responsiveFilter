import { Question } from '@/types/content';

export const QUESTIONS: Question[] = [
  {
    id: 'q1234',
    type: 'drag_drop',
    level: '7-manna',
    position: 'mittfält',
    question: 'Placera spelarna rätt i en 2-3-1 uppställning',
    correct_answer: ['player1:mid_left', 'player2:mid_right'],
    variants: [{ side: 'left' }, { side: 'right' }],
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

