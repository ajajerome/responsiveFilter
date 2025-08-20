import type { Level, Position, Question, QuizQuestion, MatchFreezeQuestion } from '@/types/content';
import { useAppStore } from '@/store/useAppStore';
import { REGELFRAGOR } from '@/data/regler';
import { SPELFORSTAELSE } from '@/data/spelforstaelse';
import { FREEZE_QUESTIONS } from '@/data/freeze';
import { PASS_QUESTIONS } from '@/data/pass';
import { getRandomQuestion } from '@/engine/generator';
import { FORMATION_QUESTIONS } from '@/data/formation_quiz';
import { ATTACK_DRAG_QUESTIONS } from '@/data/attack_drag';

function pick<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  const out: T[] = [];
  while (out.length < n && a.length) {
    const i = Math.floor(Math.random() * a.length);
    out.push(a.splice(i, 1)[0]);
  }
  return out;
}

export async function fetchQuestions(level: Level, position?: Position, count = 5, excludeIds?: Set<string>, category?: string): Promise<Question[]> {
  // Tvinga bort 5-manna — endast 7- och 9-manna används
  if (level === '5-manna') {
    level = '7-manna';
  }
  try {
    const age = (useAppStore.getState()?.profile?.age as number) || undefined;
    if (age) {
      if (age >= 12) level = '9-manna';
      else level = '7-manna';
    }
  } catch {}
  // Blanda riktiga dataset (regler/spelförståelse) med genererade
  const notSeen = (q: { id: string }) => !excludeIds || !excludeIds.has(q.id);
  const cat = (q: any) => !category || q.category === category;
  const regler = REGELFRAGOR.filter(q => q.level === level).filter(cat).filter(notSeen);
  const spel = SPELFORSTAELSE.filter(q => q.level === level && (!position || q.position === position)).filter(cat).filter(notSeen);
  const freeze = FREEZE_QUESTIONS.filter(q => q.level === level).filter(cat).filter(notSeen);
  const pass = PASS_QUESTIONS.filter(q => q.level === level).filter(cat).filter(notSeen);
  const formation = FORMATION_QUESTIONS.filter(q => q.level === level).filter(cat).filter(notSeen);
  const attackDrag = ATTACK_DRAG_QUESTIONS.filter(q => q.level === level).filter(cat).filter(notSeen);

  // Kategorispecifik vikting: säkerställ att underkategorin prioriteras
  const prioritized: Question[] = [];
  if (category === 'fasta') {
    // Fasta situationer: favorera freeze/pass med fasta-taggar om tillgängligt
    const fz = freeze.filter(q => q.category === 'fasta');
    const ps = pass.filter(q => q.category === 'fasta');
    if (fz.length + ps.length === 0) {
      // fallback: skapa prototyp-fråga för fasta: "Motståndaren har hörna, du är back – var ställer du dig?"
      const templ: MatchFreezeQuestion = {
        id: `fz-fasta-${Date.now()}`,
        type: 'matchscenario',
        level,
        category: 'fasta',
        question: 'Motståndarna har hörna. Du är back – var ställer du dig? Dra bollen till rätt zon.',
        players: [ { id: 'oppC', team: 'away', x: 0.95, y: 0.20 } ],
        ball: { x: 0.95, y: 0.20 },
        correctZones: [ { id: 'z', rect: { x: 0.55, y: 0.35, width: 0.10, height: 0.20 } } ],
        explanation: 'Markeringsyta i boxen nära första ytan.'
      };
      prioritized.push(templ);
    } else {
      prioritized.push(
        ...pick(fz, Math.min(2, fz.length)),
        ...pick(ps, Math.min(2, ps.length)),
      );
    }
  } else if (category === 'forsvar') {
    prioritized.push(
      ...pick(freeze.filter(q => q.category === 'forsvar'), Math.min(3, freeze.length)),
    );
  } else if (category === 'anfall') {
    prioritized.push(
      ...pick(pass.filter(q => q.category === 'anfall'), Math.min(2, pass.length)),
      ...pick(attackDrag.filter(q => q.category === 'anfall'), Math.min(2, attackDrag.length)),
    );
  } else if (category === 'spelforstaelse') {
    prioritized.push(...pick(spel, Math.min(3, spel.length)));
  } else if (category === 'spelregler') {
    prioritized.push(...pick(regler, Math.min(3, regler.length)));
  }
  let base: Question[] = [
    ...prioritized,
    ...pick(regler, Math.min(2, regler.length)),
    ...pick(spel, Math.min(2, spel.length)),
    ...pick(freeze, Math.min(1, freeze.length)),
    ...pick(pass, Math.min(1, pass.length)),
    ...pick(formation, Math.min(1, formation.length)),
    ...pick(attackDrag, Math.min(2, attackDrag.length)),
  ];
  // Force a specific first test question for 7-manna anfall: timeline goal-kick press
  if (level === '7-manna' && category === 'anfall') {
    const tl = (await import('@/engine/generator')).generateTimeline(level, undefined, 'anfall');
    base = [tl, ...base.filter(q => q.id !== tl.id)];
  }
  // Fyll upp från kvarvarande pooler (utan drag_drop) utan dubbletter
  const pool: Question[] = [
    ...regler,
    ...spel,
    ...freeze,
    ...pass,
    ...formation,
    ...attackDrag,
  ].filter((q) => !base.some((b) => b.id === q.id));
  while (base.length < count && pool.length) {
    const extra = pick(pool, 1);
    base.push(...extra);
  }
  // Sista utväg: generera
  while (base.length < count) base.push(getRandomQuestion(level === '5-manna' ? '7-manna' : level, position, category));
  const result = base.slice(0, count);
  // Om vi av någon anledning filtrerat bort allt, försök utan excludeIds en gång
  if (result.length === 0 && excludeIds && excludeIds.size > 0) {
    return fetchQuestions(level, position, count, undefined);
  }
  return result;
}

// Lokal generator (mock) — skapar frågor utan backend
export type GenerateOptions = {
  type: 'quiz' | 'freeze';
  level?: Level;
  category?: string;
  age?: number;
  count?: number;
};

function mapAgeToLevel(age?: number): Level {
  if (!age) return '7-manna';
  if (age >= 12) return '9-manna';
  if (age >= 10) return '7-manna';
  return '5-manna';
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function generateQuizOne(level: Level, category?: string): QuizQuestion {
  const baseByCat: Record<string, { q: string; options: string[]; correctIndex: number; explanation: string }[]> = {
    spelregler: [
      { q: 'Vad gäller vid inspark?', options: ['Bollen i målområdet', 'Var som helst'], correctIndex: 0, explanation: 'Inspark slås i mål-/straffområdet beroende på spelform.' },
      { q: 'Får målvakten ta upp tillbakapass?', options: ['Ja', 'Nej'], correctIndex: 1, explanation: 'Tillbakapass-regeln förbjuder det.' },
    ],
    spelforstaelse: [
      { q: 'När ska du passa?', options: ['När medspelare är spelbar', 'När motståndaren pressar hårt'], correctIndex: 0, explanation: 'Passa en spelbar medspelare i rätt läge.' },
    ],
    anfall: [
      { q: 'Vilket val skapar målchans?', options: ['Väggspel', 'Tillbaka till målvakt'], correctIndex: 0, explanation: 'Väggspel bryter linjer.' },
    ],
    forsvar: [
      { q: 'Hur styr du i 1v1?', options: ['Stå upp och vinkla', 'Glidtackla direkt'], correctIndex: 0, explanation: 'Stå upp och styr bortåt.' },
    ],
  };
  const pool = baseByCat[category || 'spelforstaelse'] || baseByCat.spelforstaelse;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: uid('qz'),
    type: 'quiz',
    level,
    category,
    question: pick.q,
    options: pick.options,
    correctIndex: pick.correctIndex,
    explanation: pick.explanation,
  };
}

function generateFreezeOne(level: Level, category?: string): MatchFreezeQuestion {
  // Enkel mall: boll på kanten, korrekt zon centralt mellan boll och mål
  const side = Math.random() > 0.5 ? 'right' : 'left';
  const ball = side === 'right' ? { x: 0.88, y: 0.46 } : { x: 0.12, y: 0.46 };
  const correctRect = side === 'right'
    ? { x: 0.58, y: 0.46, width: 0.14, height: 0.16 }
    : { x: 0.28, y: 0.46, width: 0.14, height: 0.16 };
  return {
    id: uid('fz'),
    type: 'matchscenario',
    level,
    category,
    question: 'Vart ska du stå i detta läge?',
    players: [
      { id: 'you', team: 'home', x: 0.48, y: 0.68 },
      { id: 'opp', team: 'away', x: ball.x, y: ball.y },
    ],
    ball,
    correctZones: [ { id: 'z', rect: correctRect } ],
    explanation: 'Mellan boll och mål med rätt vinkel – täck yta och var spelbar.'
  };
}

export async function generateQuestions(opts: GenerateOptions): Promise<Question[]> {
  let level = opts.level ?? mapAgeToLevel(opts.age);
  if (opts.age) level = mapAgeToLevel(opts.age);
  const count = opts.count ?? 5;
  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    if (opts.type === 'quiz') out.push(generateQuizOne(level, opts.category));
    else out.push(generateFreezeOne(level, opts.category));
  }
  return out;
}

