export type Level = '5-manna' | '7-manna' | '9-manna';
export type Position = 'målvakt' | 'back' | 'mittfält' | 'anfallare';

export type QuestionType =
  | 'quiz'
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
  correct_answer: string[];
  variants?: Array<Record<string, unknown>>;
}

export type Question = QuizQuestion | DragDropQuestion; 

