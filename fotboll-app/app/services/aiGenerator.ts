import type { Level, Question } from '@/types/content';
import type { Scenario } from '@/types/scenario';

export type PedagogyTag = 'beslut' | 'rörelse' | 'samarbete' | 'strategi' | 'positionering';

export interface AIGeneratedExerciseMeta {
  tags: PedagogyTag[];
  season: number;
  rationale?: string;
}

export interface GeneratedScenarioPayload {
  question: Question;
  meta: AIGeneratedExerciseMeta;
}

export async function generateScenarioFor(level: Level, age: number, season: number): Promise<GeneratedScenarioPayload> {
  // Placeholder: deterministic stub to unblock UX. Replace with API call.
  const lane: Scenario['keyActors']['focusLane'] = age <= 9 ? 'right' : age <= 11 ? 'center' : 'left';
  const s: Scenario = {
    level,
    attacking: 'home',
    possession: 'home',
    players: [
      { id: 'h-gk', role: 'GK', team: 'home', pos: { x: 8, y: 50 } },
      { id: 'h-lm', role: 'LM', team: 'home', pos: { x: 42, y: 28 } },
      { id: 'h-cm', role: 'CM', team: 'home', pos: { x: 50, y: 50 } },
      { id: 'h-rm', role: 'RM', team: 'home', pos: { x: 42, y: 72 } },
      { id: 'h-st', role: 'ST', team: 'home', pos: { x: 72, y: 50 } },
      { id: 'a-gk', role: 'GK', team: 'away', pos: { x: 92, y: 50 } },
      { id: 'a-cb', role: 'CB', team: 'away', pos: { x: 80, y: 50 } },
    ],
    ball: { pos: { x: 42, y: 72 } },
    keyActors: { ballCarrierId: 'h-rm', focusLane: lane },
  } as Scenario;
  const q: Question = {
    id: `ai-${level}-${season}-${age}`,
    type: 'matchscenario',
    level,
    position: 'mittfält',
    question: 'AI-scenario: Välj rätt beslut i anfallet',
    scenario: s,
    allowedActions: ['pass', 'shoot'],
    sequence: { steps: [
      { expected: 'pass', hint: 'Spela inåt till spelbar yta', xpBonus: 2 },
      { expected: 'shoot', hint: 'Avsluta när läget uppstår', xpBonus: 3 },
    ] },
  } as any;
  return {
    question: q,
    meta: {
      tags: ['beslut', 'samarbete'],
      season,
      rationale: 'Stegvis progression enligt UEFA: passningsbeslut före avslut',
    },
  };
}

export async function generateQuizFor(level: Level, age: number, season: number): Promise<{ question: Question; meta: AIGeneratedExerciseMeta }>{
  const q: Question = {
    id: `aiq-${level}-${season}-${age}`,
    type: 'quiz',
    level,
    position: 'mittfält',
    question: 'Vad tränar du när du breddar i uppspel?',
    options: ['Samarbete och ytskapa', 'Skjuta från långt håll'],
    correctIndex: 0,
  } as any;
  return { question: q, meta: { tags: ['samarbete', 'positionering'], season, rationale: 'Bredd skapar passningsvinklar (UEFA riktlinjer)' } };
}

