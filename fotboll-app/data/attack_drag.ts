import type { DragDropQuestion } from '@/types/content';

// 15 drag & drop anfallsfrågor (7-manna), kategori: anfall
export const ATTACK_DRAG_QUESTIONS: DragDropQuestion[] = [
  {
    id: 'atk-1-bortre-stolpe',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Vem passar du för att skapa målchans? (Löpning mot bortre stolpen)',
    targetRect: { x: 0.72, y: 0.30, width: 0.12, height: 0.15 },
    start: { x: 0.50, y: 0.85 },
    playerLabel: 'A'
  },
  {
    id: 'atk-2-forsta-stolpe',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid inlägg? (Position vid första stolpen)',
    targetRect: { x: 0.30, y: 0.32, width: 0.12, height: 0.15 },
    start: { x: 0.52, y: 0.84 },
    playerLabel: 'A'
  },
  {
    id: 'atk-3-djupled-tajm',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid djupledslöpning? (Tajmad löpning bakom backlinje)',
    targetRect: { x: 0.56, y: 0.38, width: 0.16, height: 0.12 },
    start: { x: 0.50, y: 0.82 },
    playerLabel: 'F'
  },
  {
    id: 'atk-4-spelvandning-kant',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid spelvändning? (Kantspelare löper mot fri yta)',
    targetRect: { x: 0.80, y: 0.50, width: 0.15, height: 0.18 },
    start: { x: 0.35, y: 0.75 },
    playerLabel: 'Y'
  },
  {
    id: 'atk-5-inspel-mellan-linjer',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid inspel? (Passning mellan lagdelar)',
    targetRect: { x: 0.48, y: 0.48, width: 0.18, height: 0.12 },
    start: { x: 0.40, y: 0.80 },
    playerLabel: 'MF'
  },
  {
    id: 'atk-6-frispark-retur',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid frispark nära mål? (Position för returer)',
    targetRect: { x: 0.52, y: 0.36, width: 0.12, height: 0.12 },
    start: { x: 0.50, y: 0.78 },
    playerLabel: 'A'
  },
  {
    id: 'atk-7-horna-mot-boll',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid hörna? (Mittback löper mot boll)',
    targetRect: { x: 0.42, y: 0.34, width: 0.16, height: 0.12 },
    start: { x: 0.50, y: 0.76 },
    playerLabel: 'MB'
  },
  {
    id: 'atk-8-omställning-löp',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid omställning? (Forward löper direkt i djupled)',
    targetRect: { x: 0.64, y: 0.42, width: 0.18, height: 0.12 },
    start: { x: 0.52, y: 0.82 },
    playerLabel: 'F'
  },
  {
    id: 'atk-9-trangt-lage-vagg',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid trångt läge? (Väggspel med medspelare)',
    targetRect: { x: 0.48, y: 0.52, width: 0.16, height: 0.12 },
    start: { x: 0.42, y: 0.78 },
    playerLabel: 'MF'
  },
  {
    id: 'atk-10-lagt-forsvar-rorelse',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du mot lågt försvar? (Rörelse mellan backar)',
    targetRect: { x: 0.56, y: 0.46, width: 0.16, height: 0.10 },
    start: { x: 0.50, y: 0.80 },
    playerLabel: 'A'
  },
  {
    id: 'atk-11-inspel-bortre-pos',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid inspel från kanten? (Position vid bortre)',
    targetRect: { x: 0.72, y: 0.34, width: 0.12, height: 0.14 },
    start: { x: 0.52, y: 0.82 },
    playerLabel: 'A'
  },
  {
    id: 'atk-12-mottag-venta-upp',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid bollmottagning? (Vända upp snabbt)',
    targetRect: { x: 0.52, y: 0.56, width: 0.14, height: 0.12 },
    start: { x: 0.48, y: 0.84 },
    playerLabel: 'F'
  },
  {
    id: 'atk-13-trianglar-snabbt-spel',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid spel i trianglar? (Snabbt passningsspel)',
    targetRect: { x: 0.46, y: 0.52, width: 0.20, height: 0.14 },
    start: { x: 0.40, y: 0.80 },
    playerLabel: 'MF'
  },
  {
    id: 'atk-14-spelvandning-ytter-bredd',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid spelvändning? (Ytter löper mot fri yta, skapa bredd)',
    targetRect: { x: 0.16, y: 0.52, width: 0.16, height: 0.18 },
    start: { x: 0.38, y: 0.75 },
    playerLabel: 'Y'
  },
  {
    id: 'atk-15-inspel-centralt-mellan',
    type: 'drag_drop',
    level: '7-manna',
    category: 'anfall',
    question: 'Hur agerar du vid inspel centralt? (Position mellan försvarare)',
    targetRect: { x: 0.52, y: 0.44, width: 0.16, height: 0.12 },
    start: { x: 0.52, y: 0.82 },
    playerLabel: 'A'
  }
];

