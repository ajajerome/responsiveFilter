import type { Level, Question } from '@/types/content';
import type { Scenario } from '@/types/scenario';

export type PedagogyTag = 'beslut' | 'rörelse' | 'samarbete' | 'strategi' | 'positionering';

// Canonical sources to constrain AI question generation
export type SourceKey =
  | 'UEFA'
  | 'SvFF'
  | 'TheFA'
  | 'USSF'
  | 'FIFA'
  | 'DFB'
  | 'KNVB'
  | 'DBU'
  | 'NFF'
  | 'Coerver';

export const SOURCES: Record<SourceKey, { name: string; url: string; notes?: string }> = {
  UEFA: { name: 'UEFA Grassroots / Learning', url: 'https://www.uefa.com/insideuefa/football-development/grassroots/' },
  SvFF: { name: 'SvFF Spelarutbildning', url: 'https://www.svenskfotboll.se/utbildning/spelarutbildning/' },
  TheFA: { name: 'The FA – The Boot Room', url: 'https://thebootroom.thefa.com/resources/coaching' },
  USSF: { name: 'US Soccer Grassroots', url: 'https://learning.ussoccer.com/coach/courses/available/grassroots' },
  FIFA: { name: 'FIFA Training Centre', url: 'https://www.fifatrainingcentre.com' },
  DFB: { name: 'DFB Kinderfußball', url: 'https://www.dfb.de/kinderfussball/' },
  KNVB: { name: 'KNVB Rinus', url: 'https://rinus.knvb.nl' },
  DBU: { name: 'DBU Børnefodbold', url: 'https://www.dbu.dk/klubservice/boernefodbold/' },
  NFF: { name: 'NFF Barn og ungdom', url: 'https://www.fotball.no/barn-og-ungdom/' },
  Coerver: { name: 'Coerver Coaching', url: 'https://www.coerver.com' },
};

export interface AIGeneratedExerciseMeta {
  tags: PedagogyTag[];
  season: number;
  rationale?: string;
  sources: SourceKey[]; // authoritative references used for generation
}

export interface GeneratedScenarioPayload {
  question: Question;
  meta: AIGeneratedExerciseMeta;
}

export function adjustToneByAge(text: string, age: number): string {
  if (!text) return text;
  if (age <= 9) {
    return text
      .replace(/prioritera/gi, 'välj')
      .replace(/kombinationsspel/gi, 'spela tillsammans')
      .replace(/positionering/gi, 'plats på planen')
      .replace(/spelvändning/gi, 'byta sida');
  }
  if (age <= 11) {
    return text
      .replace(/kombinationsspel/gi, 'väggspel och passningar')
      .replace(/positionering/gi, 'din plats och yta');
  }
  return text;
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
      sources: ['UEFA', 'SvFF'],
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
  return { question: q, meta: { tags: ['samarbete', 'positionering'], season, rationale: 'Bredd skapar passningsvinklar (UEFA/SvFF riktlinjer)', sources: ['UEFA', 'SvFF'] } };
}

