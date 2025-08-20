export type Level = '5-manna' | '7-manna' | '9-manna';
export type Position = 'målvakt' | 'back' | 'mittfält' | 'anfallare';

export type QuestionType =
  | 'quiz'
  | 'one_x_two'
  | 'drag_drop'
  | 'matchscenario'
  | 'formation_quiz'
  | 'bild'
  | 'taktikpussel'
  | 'fast_situation';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  level: Level;
  position?: Position;
  question: string;
  imageUrl?: string;
  category?: string;
  explanation?: string;
}

export interface QuizQuestion extends BaseQuestion {
  type: 'quiz';
  options: string[];
  correctIndex: number;
}

export interface DragDropQuestion extends BaseQuestion {
  type: 'drag_drop';
  // Normalized (0..1) rectangle for correct drop zone relative to pitch view
  targetRect: { x: number; y: number; width: number; height: number };
  // Initial normalized position of the draggable marker
  start: { x: number; y: number };
  // Optional label for the draggable player marker
  playerLabel?: string;
}

export interface VectorSpec {
  from: { x: number; y: number };
  to: { x: number; y: number };
  kind: 'attack' | 'defense';
  angleToleranceDeg?: number;
  minLength?: number;
  maxLength?: number;
}

export interface TacticsQuestion extends BaseQuestion {
  type: 'drag_drop';
  // Full plan: flera spelare, flera målzoner och förväntade pilar
  players: Array<{ id: string; label: string; start: { x: number; y: number }; targetId?: string }>;
  targets?: Array<{ id: string; rect: { x: number; y: number; width: number; height: number } }>;
  expectedVectors?: VectorSpec[];
}

export interface MatchFreezeQuestion extends BaseQuestion {
  type: 'matchscenario';
  players: Array<{ id: string; label?: string; x: number; y: number; team: 'home' | 'away' }>;
  ball: { x: number; y: number };
  correctPlayerIds?: string[];
  correctZones?: Array<{ id: string; rect: { x: number; y: number; width: number; height: number } }>;
}

export interface PassQuestion extends BaseQuestion {
  type: 'matchscenario';
  players: Array<{ id: string; label?: string; x: number; y: number; team: 'home' | 'away' }>;
  ballHolderId: string;
  correctTargetId: string;
}

export interface FormationQuizQuestion extends BaseQuestion {
  type: 'formation_quiz';
  // Normalized player positions to render the shown formation
  players: Array<{ x: number; y: number }>;
  options: string[];
  correctIndex: number;
}

export interface OneXTwoQuestion extends BaseQuestion {
  type: 'one_x_two';
  // 0 -> '1', 1 -> 'X', 2 -> '2'
  correctIndex: 0 | 1 | 2;
  // Descriptive texts for 1, X, 2 in that order
  answers: [string, string, string];
  explanation?: string;
}

export type Question = QuizQuestion | DragDropQuestion | OneXTwoQuestion | TacticsQuestion | MatchFreezeQuestion | PassQuestion | FormationQuizQuestion;

