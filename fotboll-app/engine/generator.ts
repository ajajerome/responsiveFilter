import type { Level, Position, Question, OneXTwoQuestion, DragDropQuestion, QuizQuestion } from '@/types/content';
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
    // 0->1 (hem), 1->X (beror), 2->2 (upp)
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
  // Nivåanpassning: justera texter lite per nivå
  if (level === '5-manna') {
    q.explanation ||= 'I 5-manna betonas enkel uppspelspunkt ut mot kanter.';
  } else if (level === '7-manna') {
    q.explanation ||= 'I 7-manna börjar rollerna tydliggöras – värdera bredd och spelbarhet.';
  } else {
    q.explanation ||= 'I 9-manna krävs mer positionsspel och snabbare beslutsfattande.';
  }
  return q;
}

export function generateDragDrop(level: Level, position?: Position): DragDropQuestion {
  const f = sample(LEVEL_FORMATIONS[level]);
  return {
    id: uid('dragDrop'),
    type: 'drag_drop',
    level,
    position,
    question: `Dra spelaren till rätt yta: ${f.name}`,
    targetRect: f.target,
    start: { x: 0.5, y: 0.85 },
    playerLabel: 'P',
  };
}

export function generateQuiz(level: Level, position?: Position): QuizQuestion {
  return sample(QUIZ_TEMPLATES)(level, position);
}

export function getRandomQuestion(level: Level, position?: Position): Question {
  const pick = sample(['one_x_two', 'drag_drop', 'quiz'] as const);
  if (pick === 'one_x_two') return generateOneXTwo(level, position);
  if (pick === 'drag_drop') return generateDragDrop(level, position);
  return generateQuiz(level, position);
}

