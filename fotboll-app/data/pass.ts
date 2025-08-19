import type { PassQuestion } from '@/types/content';

export const PASS_QUESTIONS: PassQuestion[] = [
  {
    id: 'ps-7-1',
    type: 'matchscenario',
    level: '7-manna',
    question: 'Dra en passning till spelbar medspelare',
    players: [
      { id: 'p1', team: 'home', x: 0.45, y: 0.6 },
      { id: 'p2', team: 'home', x: 0.7, y: 0.45 },
      { id: 'd1', team: 'away', x: 0.58, y: 0.55 },
    ],
    ballHolderId: 'p1',
    correctTargetId: 'p2',
    explanation: 'Fri medspelare i vinkel bort från press.'
  }
];

