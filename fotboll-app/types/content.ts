export type Level = '5-manna' | '7-manna' | '9-manna';
export type Position = 'målvakt' | 'back' | 'mittfält' | 'anfallare';

export type QuestionType =
  | 'quiz'
  | 'one_x_two'
  | 'drag_drop'
  | 'matchscenario'
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

export interface OneXTwoQuestion extends BaseQuestion {
  type: 'one_x_two';
  // 0 -> '1', 1 -> 'X', 2 -> '2'
  correctIndex: 0 | 1 | 2;
  explanation?: string;
}

export type Question = QuizQuestion | DragDropQuestion | OneXTwoQuestion;

