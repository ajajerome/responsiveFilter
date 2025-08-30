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

// Scenario-based question payload
export type ActionType = 'pass' | 'dribble' | 'shoot' | 'defend';

export interface MatchScenarioQuestion extends BaseQuestion {
  type: 'matchscenario';
  scenario: import('./scenario').Scenario;
  allowedActions: ActionType[];
  explanation?: string;
  sequence?: import('./scenario').ScenarioSequence;
}

export type Question = QuizQuestion | DragDropQuestion | MatchScenarioQuestion; 

