import { Question } from '@/types/content';
import type { Scenario } from '@/types/scenario';

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
  {
    id: 's001',
    type: 'matchscenario',
    level: '5-manna',
    position: 'mittfält',
    question: 'Ytter tar emot bollen – bästa valet?',
    scenario: {
      level: '5-manna',
      attacking: 'home',
      possession: 'home',
      players: [
        { id: 'h-gk', role: 'GK', team: 'home', pos: { x: 10, y: 50 } },
        { id: 'h-lb', role: 'LB', team: 'home', pos: { x: 25, y: 30 } },
        { id: 'h-rb', role: 'RB', team: 'home', pos: { x: 25, y: 70 } },
        { id: 'h-lw', role: 'LW', team: 'home', pos: { x: 50, y: 25 } },
        { id: 'h-st', role: 'ST', team: 'home', pos: { x: 70, y: 50 } },
        { id: 'h-rw', role: 'RW', team: 'home', pos: { x: 50, y: 75 } },
        { id: 'a-gk', role: 'GK', team: 'away', pos: { x: 90, y: 50 } },
        { id: 'a-d1', role: 'CB', team: 'away', pos: { x: 75, y: 40 } },
        { id: 'a-d2', role: 'CB', team: 'away', pos: { x: 75, y: 60 } },
      ],
      ball: { pos: { x: 50, y: 75 } },
      keyActors: { ballCarrierId: 'h-rw', focusLane: 'right' },
    } as Scenario,
    allowedActions: ['pass', 'dribble', 'shoot'],
    explanation: 'I 5-manna med boll på kanten: sök trianglar och spelbarhet inåt.'
  }
  ,
  {
    id: 's002',
    type: 'matchscenario',
    level: '7-manna',
    position: 'mittfält',
    question: 'Bygg anfall: först pass inåt, sedan avslut.',
    scenario: {
      level: '7-manna',
      attacking: 'home',
      possession: 'home',
      players: [
        { id: 'h-gk', role: 'GK', team: 'home', pos: { x: 8, y: 50 } },
        { id: 'h-lb', role: 'LB', team: 'home', pos: { x: 22, y: 30 } },
        { id: 'h-cb', role: 'CB', team: 'home', pos: { x: 20, y: 50 } },
        { id: 'h-rb', role: 'RB', team: 'home', pos: { x: 22, y: 70 } },
        { id: 'h-lm', role: 'LM', team: 'home', pos: { x: 45, y: 28 } },
        { id: 'h-cm', role: 'CM', team: 'home', pos: { x: 50, y: 50 } },
        { id: 'h-rm', role: 'RM', team: 'home', pos: { x: 45, y: 72 } },
        { id: 'h-st', role: 'ST', team: 'home', pos: { x: 72, y: 50 } },
        { id: 'a-gk', role: 'GK', team: 'away', pos: { x: 92, y: 50 } },
        { id: 'a-lb', role: 'LB', team: 'away', pos: { x: 78, y: 30 } },
        { id: 'a-cb', role: 'CB', team: 'away', pos: { x: 80, y: 50 } },
        { id: 'a-rb', role: 'RB', team: 'away', pos: { x: 78, y: 70 } },
      ],
      ball: { pos: { x: 45, y: 72 } },
      keyActors: { ballCarrierId: 'h-rm', focusLane: 'right' }
    } as Scenario,
    allowedActions: ['pass', 'shoot'],
    explanation: 'Pass inåt till CM/ ST och sedan avslut.'
  }
];

