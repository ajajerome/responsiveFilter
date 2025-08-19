import type { MatchFreezeQuestion } from '@/types/content';

export const FREEZE_QUESTIONS: MatchFreezeQuestion[] = [
  {
    id: 'fz-5-1',
    type: 'matchscenario',
    level: '5-manna',
    question: 'Vem borde få bollen här?',
    players: [
      { id: 'a1', team: 'home', x: 0.28, y: 0.62 },
      { id: 'a2', team: 'home', x: 0.55, y: 0.5 },
      { id: 'a3', team: 'home', x: 0.72, y: 0.42 },
      { id: 'b1', team: 'away', x: 0.5, y: 0.6 },
    ],
    ball: { x: 0.48, y: 0.62 },
    correctPlayerIds: ['a3'],
    explanation: 'Fri ytter i fart på högerkanten.'
  },
  {
    id: 'fz-7-1',
    type: 'matchscenario',
    level: '7-manna',
    question: 'Vem borde få bollen här?',
    players: [
      { id: 'a1', team: 'home', x: 0.25, y: 0.68 },
      { id: 'a2', team: 'home', x: 0.45, y: 0.58 },
      { id: 'a3', team: 'home', x: 0.62, y: 0.42 },
      { id: 'b1', team: 'away', x: 0.5, y: 0.6 },
      { id: 'b2', team: 'away', x: 0.68, y: 0.48 },
    ],
    ball: { x: 0.42, y: 0.63 },
    correctPlayerIds: ['a3'],
    explanation: 'Vinkel och yta att hota framåt på kanten.'
  }
];

