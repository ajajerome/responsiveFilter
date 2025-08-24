import type { Level, Position, Question, OneXTwoQuestion, DragDropQuestion, QuizQuestion, TacticsQuestion, MatchFreezeQuestion, PassQuestion, TimelineQuestion } from '@/types/content';
import { sample, uid } from '@/engine/random';
import { getZones } from '@/features/pitch/zones';

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
    const z = getZones(level);
    base.targetRect = z.boxDef; // cover central box in defense
    const cell = z.grid.centerOf(z.grid.indexOf(2, Math.ceil(z.grid.cols/2)));
    base.opponents = [ { x: cell.x, y: cell.y } ];
  }
  if (category === 'fasta') {
    const z = getZones(level);
    base.targetRect = z.boxDef;
    const cornerIdx = z.grid.indexOf(1, z.grid.cols); // top-right cell
    const cornerPt = z.grid.centerOf(cornerIdx);
    base.opponents = [ { x: cornerPt.x, y: cornerPt.y } ];
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

// Full-squad helpers using grid (approximate 2-3-1 for 7-manna, 3-3-2 for 9-manna)
function makeFullSquads(level: Level) {
  const z = getZones(level);
  const g = z.grid;
  const midCol = Math.ceil(g.cols / 2);
  const leftCol = 2;
  const rightCol = g.cols - 1;
  // Our team (home) bottom half
  const home: Array<{ id: string; x: number; y: number; team: 'home' }> = [];
  // GK
  const gk = g.centerOf(g.indexOf(g.rows, midCol));
  home.push({ id: 'h_gk', x: gk.x, y: gk.y, team: 'home' });
  if (level === '7-manna') {
    // 2-3-1
    const lb = g.centerOf(g.indexOf(g.rows - 1, leftCol));
    const rb = g.centerOf(g.indexOf(g.rows - 1, rightCol));
    const cm = g.centerOf(g.indexOf(g.rows - 2, midCol));
    const lm = g.centerOf(g.indexOf(g.rows - 2, leftCol));
    const rm = g.centerOf(g.indexOf(g.rows - 2, rightCol));
    const fw = g.centerOf(g.indexOf(g.rows - 4, midCol));
    home.push(
      { id: 'h_lb', x: lb.x, y: lb.y, team: 'home' },
      { id: 'h_rb', x: rb.x, y: rb.y, team: 'home' },
      { id: 'h_cm', x: cm.x, y: cm.y, team: 'home' },
      { id: 'h_lm', x: lm.x, y: lm.y, team: 'home' },
      { id: 'h_rm', x: rm.x, y: rm.y, team: 'home' },
      { id: 'h_fw', x: fw.x, y: fw.y, team: 'home' },
    );
  } else {
    // 3-3-2
    const lcb = g.centerOf(g.indexOf(g.rows - 1, leftCol));
    const cb = g.centerOf(g.indexOf(g.rows - 1, midCol));
    const rcb = g.centerOf(g.indexOf(g.rows - 1, rightCol));
    const lm = g.centerOf(g.indexOf(g.rows - 3, leftCol));
    const cm = g.centerOf(g.indexOf(g.rows - 3, midCol));
    const rm = g.centerOf(g.indexOf(g.rows - 3, rightCol));
    const lf = g.centerOf(g.indexOf(g.rows - 5, leftCol));
    const rf = g.centerOf(g.indexOf(g.rows - 5, rightCol));
    home.push(
      { id: 'h_lcb', x: lcb.x, y: lcb.y, team: 'home' },
      { id: 'h_cb', x: cb.x, y: cb.y, team: 'home' },
      { id: 'h_rcb', x: rcb.x, y: rcb.y, team: 'home' },
      { id: 'h_lm', x: lm.x, y: lm.y, team: 'home' },
      { id: 'h_cm', x: cm.x, y: cm.y, team: 'home' },
      { id: 'h_rm', x: rm.x, y: rm.y, team: 'home' },
      { id: 'h_lf', x: lf.x, y: lf.y, team: 'home' },
      { id: 'h_rf', x: rf.x, y: rf.y, team: 'home' },
    );
  }
  // Opponents (away) top half: mirror-ish positions
  const away: Array<{ id: string; x: number; y: number; team: 'away' }> = [];
  const agk = g.centerOf(g.indexOf(1, midCol));
  away.push({ id: 'a_gk', x: agk.x, y: agk.y, team: 'away' });
  if (level === '7-manna') {
    const lb = g.centerOf(g.indexOf(2, leftCol));
    const rb = g.centerOf(g.indexOf(2, rightCol));
    const cm = g.centerOf(g.indexOf(3, midCol));
    const lm = g.centerOf(g.indexOf(3, leftCol));
    const rm = g.centerOf(g.indexOf(3, rightCol));
    const fw = g.centerOf(g.indexOf(5, midCol));
    away.push(
      { id: 'a_lb', x: lb.x, y: lb.y, team: 'away' },
      { id: 'a_rb', x: rb.x, y: rb.y, team: 'away' },
      { id: 'a_cm', x: cm.x, y: cm.y, team: 'away' },
      { id: 'a_lm', x: lm.x, y: lm.y, team: 'away' },
      { id: 'a_rm', x: rm.x, y: rm.y, team: 'away' },
      { id: 'a_fw', x: fw.x, y: fw.y, team: 'away' },
    );
  } else {
    const lcb = g.centerOf(g.indexOf(2, leftCol));
    const cb = g.centerOf(g.indexOf(2, midCol));
    const rcb = g.centerOf(g.indexOf(2, rightCol));
    const lm = g.centerOf(g.indexOf(4, leftCol));
    const cm = g.centerOf(g.indexOf(4, midCol));
    const rm = g.centerOf(g.indexOf(4, rightCol));
    const lf = g.centerOf(g.indexOf(6, leftCol));
    const rf = g.centerOf(g.indexOf(6, rightCol));
    away.push(
      { id: 'a_lcb', x: lcb.x, y: lcb.y, team: 'away' },
      { id: 'a_cb', x: cb.x, y: cb.y, team: 'away' },
      { id: 'a_rcb', x: rcb.x, y: rcb.y, team: 'away' },
      { id: 'a_lm', x: lm.x, y: lm.y, team: 'away' },
      { id: 'a_cm', x: cm.x, y: cm.y, team: 'away' },
      { id: 'a_rm', x: rm.x, y: rm.y, team: 'away' },
      { id: 'a_lf', x: lf.x, y: lf.y, team: 'away' },
      { id: 'a_rf', x: rf.x, y: rf.y, team: 'away' },
    );
  }
  return { home, away };
}

export function generateGoalKickPress(level: Level): MatchFreezeQuestion {
  const z = getZones(level);
  const { home, away } = makeFullSquads(level);
  // Ball at away GK (top center). Correct zone is pressing lane towards CB.
  const cbCell = z.grid.centerOf(z.grid.indexOf(2, Math.ceil(z.grid.cols/2)));
  const pressRect = { x: cbCell.x - 0.08, y: cbCell.y - 0.06, width: 0.16, height: 0.12 };
  return {
    id: uid('tpl_press_gk'),
    type: 'matchscenario',
    level,
    category: 'anfall',
    question: 'Målutspark för motståndarna. Var startar pressen? Tryck på rätt yta.',
    players: [...home, ...away],
    ball: { x: z.centerX, y: z.oppGoalY + 0.02 },
    correctZones: [ { id: 'press', rect: pressRect } ],
    explanation: 'Styr pressen mot mittbacken/utsparkens första pass. Stäng spelvändning och täck mitten.',
  };
}

export function generateDefendingCross(level: Level): MatchFreezeQuestion {
  const z = getZones(level);
  const { home, away } = makeFullSquads(level);
  // Ball at wide right attacking third for away; correct zone central box area
  const wide = { x: z.rightX - 0.02, y: z.attThirdY + 0.04 };
  const def = z.boxDef;
  return {
    id: uid('tpl_def_cross'),
    type: 'matchscenario',
    level,
    category: 'forsvar',
    question: 'Motståndarna kommer till inlägg från höger. Var ska du stå? Tryck på rätt yta i boxen.',
    players: [...home, ...away],
    ball: wide,
    correctZones: [ { id: 'box_central', rect: { x: def.x + def.width * 0.2, y: def.y + def.height * 0.15, width: def.width * 0.6, height: def.height * 0.5 } } ],
    explanation: 'Täck centralt i boxen: markera zon/man, vinn första ytan och var redo för andra bollen.',
  };
}

export function getRandomQuestion(level: Level, position?: Position, category?: string): Question {
  const pick = sample(['drag_drop', 'quiz', 'tactics', 'freeze', 'timeline', 'one_x_two'] as const);
  if (pick === 'one_x_two') return generateOneXTwo(level, position);
  if (pick === 'drag_drop') return generateDragDrop(level, position, category);
  if (pick === 'tactics') return generateTactics(level, position, category);
  if (pick === 'freeze') return generateMatchFreeze(level, position, category);
  if (pick === 'timeline') return generateTimeline(level, position, category);
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
    question: category === 'forsvar' ? 'Var ska du stå för att täcka rätt yta?' : 'Vem borde få bollen här?',
    players,
    ball: { x: getZones(level).rightX - 0.02, y: getZones(level).attThirdY },
    correctZones: category === 'forsvar' ? [ { id: 'def', rect: getZones(level).boxDef } ] : undefined,
    correctPlayerIds: category === 'forsvar' ? undefined : ['a3'],
    explanation: category === 'forsvar' ? 'Täck centralt mellan boll och mål i försvarszon.' : 'Spelare a3 har bäst vinkel och yta för att hota framåt.',
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

export function generateDefenseGrid(level: Level, position?: Position): MatchFreezeQuestion {
  const z = getZones(level);
  // Place ball on opponent right flank (attacking third), correct zone in our defensive box right side
  const ballCell = z.grid.centerOf(z.grid.indexOf(2, z.grid.cols));
  const defRect = z.boxDef;
  return {
    id: uid('defgrid'),
    type: 'matchscenario',
    level,
    category: 'forsvar',
    position,
    question: 'Motståndarna anfaller på högerkanten. Var ska du stå för att täcka rätt yta? (Ytterback)',
    players: [
      { id: 'oppW', x: ballCell.x, y: ballCell.y, team: 'away' },
    ],
    ball: { x: ballCell.x, y: ballCell.y },
    correctZones: [ { id: 'cover', rect: { x: defRect.x + defRect.width * 0.25, y: defRect.y + defRect.height * 0.1, width: defRect.width * 0.3, height: defRect.height * 0.35 } } ],
    explanation: 'Täck ytan mellan boll och mål på din kant, i höjd med boxen. Håll vinkel och var redo att kliva.'
  };
}

export function generateTimeline(level: Level, position?: Position, category?: string): TimelineQuestion {
  // Example: Opponent has goal kick; you are forward – press
  const z = getZones(level);
  return {
    id: uid('tl'),
    type: 'timeline',
    level,
    position,
    category,
    question: 'Motståndaren har inspark. Vad gör du som forward? Sekvensen pausas – gör ditt drag.',
    ball: { x: z.centerX, y: 0.08 },
    animTo: { x: z.centerX, y: z.halfY - 0.04, durationMs: 1000 },
    players: [
      { id: 'gk', x: z.centerX, y: 0.06, team: 'away' },
      { id: 'fw', x: z.centerX, y: 0.72, team: 'home' },
      { id: 'cb', x: z.centerX, y: 0.18, team: 'away' },
    ],
    options: ['Droppa ner och täck passningsväg', 'Sätta press på bollhållaren', 'Backa hem till mittlinjen'],
    correctIndex: 1,
  };
}