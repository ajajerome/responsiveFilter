import type { Level, Position, Question, OneXTwoQuestion, DragDropQuestion, QuizQuestion, TacticsQuestion, MatchFreezeQuestion, PassQuestion } from '@/types/content';
import { sample, uid } from '@/engine/random';

const LEVEL_FORMATIONS: Record<Level, Array<{ name: string; target: { x: number; y: number; width: number; height: number } }>> = {
  '5-manna': [
    { name: 'mittfält (centralt)', target: { x: 0.45, y: 0.45, width: 0.1, height: 0.1 } },
    { name: 'ytter (vänster)', target: { x: 0.2, y: 0.5, width: 0.12, height: 0.12 } },
    { name: 'ytter (höger)', target: { x: 0.68, y: 0.5, width: 0.12, height: 0.12 } },
  ],
  '7-manna': [
    { name: 'back (vänster)', target: { x: 0.25, y: 0.7, width: 0.12, height: 0.12 } },
    { name: 'back (höger)', target: { x: 0.63, y: 0.7, width: 0.12, height: 0.12 } },
    { name: 'mittfält (yta 8)', target: { x: 0.45, y: 0.55, width: 0.1, height: 0.1 } },
  ],
  '9-manna': [
    { name: 'tia (mellan linjerna)', target: { x: 0.48, y: 0.4, width: 0.12, height: 0.12 } },
    { name: 'ytterforwad (vänster)', target: { x: 0.22, y: 0.35, width: 0.12, height: 0.12 } },
    { name: 'ytterforwad (höger)', target: { x: 0.66, y: 0.35, width: 0.12, height: 0.12 } },
  ],
};

const ONE_X_TWO_TEMPLATES: Array<(level: Level, position?: Position) => OneXTwoQuestion> = [
  (level) => ({
    id: uid('oneXTwo'),
    type: 'one_x_two',
    level,
    question: 'Spelar du upp på fri ytter eller vänder hem under press?',
    correctIndex: 2,
    answers: [
      '1: Vända hem till back/målvakt',
      'X: Bedöma läge först',
      '2: Spela upp på fri ytter',
    ],
    explanation: 'Vid press kan snabb spelvändning ut mot fri ytter ge yta och tid.',
  }),
  (level) => ({
    id: uid('oneXTwo'),
    type: 'one_x_two',
    level,
    question: 'Motståndaren pressar högt. Ska målvakten spela kort (1), bedöma läge (X) eller slå långt (2)?',
    correctIndex: 1,
    answers: [
      '1: Spela kort från målvakt',
      'X: Lägesbedömning (kort om möjligt, annars långt)',
      '2: Slå långt direkt',
    ],
    explanation: 'Bedöm läget: kort om spelbart, annars långt – därför X.',
  }),
];

const QUIZ_TEMPLATES: Array<(level: Level, position?: Position) => QuizQuestion> = [
  (level) => ({
    id: uid('quiz'),
    type: 'quiz',
    level,
    question: 'Vem täcker ytan bakom ytterback vid offensiv löpning?',
    options: ['Mittfältare', 'Mittback'],
    correctIndex: 0,
    explanation: 'Mittfältaren faller ned och täcker bakom ytterbacken vid överlapp eller offensiv löpning.'
  }),
];

export function generateOneXTwo(level: Level, position?: Position): OneXTwoQuestion {
  const q = sample(ONE_X_TWO_TEMPLATES)(level, position);
  if (level === '5-manna') {
    q.explanation ||= 'I 5-manna betonas enkel uppspelspunkt ut mot kanter.';
  } else if (level === '7-manna') {
    q.explanation ||= 'I 7-manna börjar rollerna tydliggöras – värdera bredd och spelbarhet.';
  } else {
    q.explanation ||= 'I 9-manna krävs mer positionsspel och snabbare beslutsfattande.';
  }
  return q;
}

export function generateDragDrop(level: Level, position?: Position, category?: string): DragDropQuestion {
  const f = sample(LEVEL_FORMATIONS[level]);
  const base: DragDropQuestion = {
    id: uid('dragDrop'),
    type: 'drag_drop',
    level,
    category,
    position,
    question: category === 'forsvar' || category === 'fasta'
      ? `Flytta spelaren så den täcker rätt yta (${f.name}). Motståndare hotar i närheten.`
      : `Dra spelaren till rätt yta: ${f.name}`,
    targetRect: f.target,
    start: { x: 0.5, y: 0.85 },
    playerLabel: 'P',
  };
  if (category === 'forsvar') {
    base.opponents = [ { x: f.target.x + f.target.width + 0.08, y: f.target.y + 0.02 } ];
  }
  if (category === 'fasta') {
    base.opponents = [ { x: 0.92, y: 0.22 } ];
  }
  return base;
}

export function generateTactics(level: Level, position?: Position, category?: string): TacticsQuestion {
  return {
    id: uid('tactics'),
    type: 'drag_drop',
    level,
    position,
    category,
    question: 'Dra spelare till sina zoner och rita en offensiv löpväg (pil) längs vänsterkanten',
    players: [
      { id: 'p1', label: 'LW', start: { x: 0.2, y: 0.7 }, targetId: 'z1' },
      { id: 'p2', label: 'CM', start: { x: 0.45, y: 0.6 }, targetId: 'z2' },
    ],
    targets: [
      { id: 'z1', rect: { x: 0.15, y: 0.5, width: 0.15, height: 0.12 } },
      { id: 'z2', rect: { x: 0.4, y: 0.45, width: 0.12, height: 0.12 } },
    ],
    expectedVectors: [
      {
        from: { x: 0.2, y: 0.7 },
        to: { x: 0.25, y: 0.4 },
        kind: 'attack',
        angleToleranceDeg: 25,
        minLength: 0.2,
      },
    ],
    explanation: 'Yttern ska hota framåt i djupled längs kanten, mittfältare säkrar ytan bakom.',
  };
}

export function generateQuiz(level: Level, position?: Position, category?: string): QuizQuestion {
  const q = sample(QUIZ_TEMPLATES)(level, position);
  (q as any).category = category;
  return q;
}

export function getRandomQuestion(level: Level, position?: Position, category?: string): Question {
  const pick = sample(['drag_drop', 'quiz', 'tactics', 'freeze', 'pass', 'one_x_two'] as const);
  if (pick === 'one_x_two') return generateOneXTwo(level, position);
  if (pick === 'drag_drop') return generateDragDrop(level, position, category);
  if (pick === 'tactics') return generateTactics(level, position, category);
  if (pick === 'freeze') return generateMatchFreeze(level, position, category);
  if (pick === 'pass') return generatePass(level, position, category);
  return generateQuiz(level, position, category);
}

export function generateMatchFreeze(level: Level, position?: Position, category?: string): MatchFreezeQuestion {
  const players = level === '5-manna'
    ? [
        { id: 'a1', x: 0.3, y: 0.6, team: 'home' as const },
        { id: 'a2', x: 0.55, y: 0.5, team: 'home' as const },
        { id: 'b1', x: 0.5, y: 0.6, team: 'away' as const },
      ]
    : level === '7-manna'
    ? [
        { id: 'a1', x: 0.28, y: 0.65, team: 'home' as const },
        { id: 'a2', x: 0.52, y: 0.52, team: 'home' as const },
        { id: 'a3', x: 0.7, y: 0.4, team: 'home' as const },
        { id: 'b1', x: 0.5, y: 0.6, team: 'away' as const },
        { id: 'b2', x: 0.62, y: 0.45, team: 'away' as const },
      ]
    : [
        { id: 'a1', x: 0.25, y: 0.68, team: 'home' as const },
        { id: 'a2', x: 0.45, y: 0.58, team: 'home' as const },
        { id: 'a3', x: 0.62, y: 0.42, team: 'home' as const },
        { id: 'a4', x: 0.4, y: 0.4, team: 'home' as const },
        { id: 'b1', x: 0.5, y: 0.6, team: 'away' as const },
        { id: 'b2', x: 0.68, y: 0.48, team: 'away' as const },
      ];
  return {
    id: uid('freeze'),
    type: 'matchscenario',
    level,
    position,
    category,
    question: 'Vem borde få bollen här?',
    players,
    ball: { x: 0.48, y: 0.62 },
    correctPlayerIds: ['a3'],
    explanation: 'Spelare a3 har bäst vinkel och yta för att hota framåt.',
  };
}

export function generatePass(level: Level, position?: Position, category?: string): PassQuestion {
  return {
    id: uid('pass'),
    type: 'matchscenario',
    level,
    position,
    category,
    question: 'Välj rätt passning genom att dra från bollhållaren till medspelare',
    players: [
      { id: 'p1', x: 0.45, y: 0.6, team: 'home' },
      { id: 'p2', x: 0.7, y: 0.45, team: 'home' },
      { id: 'd1', x: 0.58, y: 0.55, team: 'away' },
    ],
    ballHolderId: 'p1',
    correctTargetId: 'p2',
    explanation: 'Passa spelbar medspelare i vinkel bort från press.',
  };
}