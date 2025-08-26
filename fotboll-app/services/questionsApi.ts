import type { Level, Position, Question, QuizQuestion, MatchFreezeQuestion } from '@/types/content';
import { useAppStore } from '@/store/useAppStore';
import { REGELFRAGOR } from '@/data/regler';
import { SPELFORSTAELSE } from '@/data/spelforstaelse';
import { FREEZE_QUESTIONS } from '@/data/freeze';
import { getRandomQuestion, generateTimeline, generateDragDrop, generateGoalKickPress, generateDefendingCross, generateCornerDefense } from '@/engine/generator';
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

const SUPPORTED_TYPES = new Set(['quiz', 'one_x_two', 'drag_drop', 'matchscenario', 'timeline']);
function isValidQuestion(q: any): q is Question {
  return !!q && typeof q === 'object' && SUPPORTED_TYPES.has(q.type) && typeof q.question === 'string' && q.question.trim().length > 0;
}

export async function fetchQuestions(level: Level, position?: Position, count = 5, excludeIds?: Set<string>, category?: string): Promise<Question[]> {
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
  const notSeen = (q: { id: string }) => !excludeIds || !excludeIds.has(q.id);
  const cat = (q: any) => !category || q.category === category;
  // Keep only non-positioning static pools
  const regler = REGELFRAGOR.filter(q => q.level === level).filter(cat).filter(notSeen).filter(isValidQuestion);
  const spel = SPELFORSTAELSE.filter(q => q.level === level && (!position || q.position === position)).filter(cat).filter(notSeen).filter(isValidQuestion);
  const freeze: any[] = []; // disable old positioning pool
  const formation: any[] = []; // disable formation quiz pool for now
  const attackDrag = ATTACK_DRAG_QUESTIONS.filter(q => q.level === level).filter(cat).filter(notSeen).filter(isValidQuestion);

  const prioritized: Question[] = [];
  if (category === 'fasta') {
    const q = generateCornerDefense(level, Math.random() > 0.5 ? 'left' : 'right');
    if (isValidQuestion(q)) prioritized.push(q);
  } else if (category === 'forsvar') {
    const q = generateDefendingCross(level);
    if (isValidQuestion(q)) prioritized.push(q);
  } else if (category === 'anfall') {
    const q = generateGoalKickPress(level);
    if (isValidQuestion(q)) prioritized.push(q);
    prioritized.push(...pick(attackDrag.filter(q => q.category === 'anfall'), Math.min(1, attackDrag.length)));
  } else if (category === 'spelforstaelse') {
    prioritized.push(...pick(spel, Math.min(3, spel.length)));
  } else if (category === 'spelregler') {
    prioritized.push(...pick(regler, Math.min(3, regler.length)));
  }
  let base: Question[] = [
    ...prioritized,
    ...pick(regler, Math.min(2, regler.length)),
    ...pick(spel, Math.min(2, spel.length)),
    ...pick(attackDrag, Math.min(1, attackDrag.length)),
  ].filter(isValidQuestion);
  if (level === '7-manna' && category === 'anfall') {
    const tl = generateTimeline(level, undefined, 'anfall');
    if (isValidQuestion(tl)) base = [tl, ...base.filter(q => q.id !== tl.id)];
  }
  if (level === '7-manna' && category === 'forsvar') {
    const defPlayer = generateDragDrop(level, undefined, 'forsvar');
    if (isValidQuestion(defPlayer)) base = [defPlayer, ...base];
  }
  const pool: Question[] = [
    ...regler,
    ...spel,
    ...attackDrag,
  ].filter((q) => !base.some((b) => b.id === q.id)).filter(isValidQuestion);
  while (base.length < count && pool.length) {
    const extra = pick(pool, 1);
    base.push(...extra);
  }
  while (base.length < count) {
    const g = getRandomQuestion(level, position, category);
    if (isValidQuestion(g)) base.push(g);
  }
  const result = base.slice(0, count).filter(isValidQuestion);
  if (result.length < count && excludeIds && excludeIds.size > 0) {
    return fetchQuestions(level, position, count, undefined, category);
  }
  return result;
}

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
      { q: 'När är det offside?', options: ['När anfallare är framför sista back vid passning', 'När anfallare tar emot inkast'], correctIndex: 0, explanation: 'Offside bedöms vid passningsögonblicket, inte på inkast.' },
      { q: 'Hur många spelare får vara på planen i 7‑manna?', options: ['7 + målvakt', '6 + målvakt'], correctIndex: 0, explanation: 'Sju utespelare inklusive målvakt i 7‑manna.' },
      { q: 'Varför blåser domaren för indirekt frispark?', options: ['Farligt spel utan kroppskontakt', 'Glidtackling från sidan'], correctIndex: 0, explanation: 'Indirekt frispark ges bl.a. vid farligt spel utan kontakt.' },
    ],
    spelforstaelse: [
      { q: 'När ska du passa?', options: ['När medspelare är spelbar', 'När motståndaren pressar hårt'], correctIndex: 0, explanation: 'Passa en spelbar medspelare i rätt läge.' },
      { q: 'Vad gör du efter att ha passat bollen?', options: ['Stannar kvar', 'Tar ny yta för att bli spelbar'], correctIndex: 1, explanation: 'Rör dig för att skapa nytt passningsalternativ.' },
      { q: 'Hur skapar du bredd i anfall?', options: ['Stannar centralt', 'Håller dig nära sidlinjen'], correctIndex: 1, explanation: 'Bredd skapas genom att nyttja planens ytterkanter.' },
      { q: 'Vad menas med att “vända spelet”?', options: ['Passa hemåt till målvakt', 'Byta kant för att hitta fri yta'], correctIndex: 1, explanation: 'Spelvändning skapar ny yta och bryter press.' },
      { q: 'Hur agerar du om laget tappar boll?', options: ['Står kvar', 'Återerövrar snabbt eller faller hem'], correctIndex: 1, explanation: 'Snabb återerövring eller kompakt försvar beroende på läge.' },
    ],
    anfall: [
      { q: 'Vilket val skapar målchans?', options: ['Väggspel', 'Tillbaka till målvakt'], correctIndex: 0, explanation: 'Väggspel bryter linjer.' },
      { q: 'När ska du slå inlägg?', options: ['När medspelare löper i boxen', 'När ingen är i boxen'], correctIndex: 0, explanation: 'Slå inlägg när medspelare är spelbara i ytorna.' },
      { q: 'Hur hotar du bakom backlinjen?', options: ['Stannar framför backlinjen', 'Löpning i djupled i rätt timing'], correctIndex: 1, explanation: 'Tajmad djupledslöp ger frilägeshot.' },
      { q: 'Vilket är bäst i trångt läge?', options: ['Väggspel', 'Skott från långt håll'], correctIndex: 0, explanation: 'Väggspel öppnar upp i trånga ytor.' },
      { q: 'Hur skapar du överlapp?', options: ['Springer bakom bollhållaren', 'Springer framför bollhållaren'], correctIndex: 0, explanation: 'Överlapp sker bakom bollhållaren för att skapa 2‑mot‑1.' },
    ],
    forsvar: [
      { q: 'Hur styr du i 1v1?', options: ['Stå upp och vinkla', 'Glidtackla direkt'], correctIndex: 0, explanation: 'Stå upp och styr bortåt.' },
      { q: 'Vad är förstaprioritet i boxen vid inlägg?', options: ['Markera yta centralt', 'Markera kantspelare'], correctIndex: 0, explanation: 'Säkra yta mellan stolpe och straffpunkt först.' },
      { q: 'Hur agerar understöd?', options: ['Går på samma spelare', 'Täcker ytan bakom pressande lagkamrat'], correctIndex: 1, explanation: 'Understöd säkrar bakom press.' },
      { q: 'När droppar du i djupled?', options: ['När forward löper bakom', 'När boll är på egen planhalva'], correctIndex: 0, explanation: 'Droppa i tid när hot i djupled finns.' },
      { q: 'Hur flyttar laget vid spelvändning?', options: ['Följer bollens sida snabbt', 'Stannar kvar på sin sida'], correctIndex: 0, explanation: 'Hela laget förflyttas mot bollsida för kompakthet.' },
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
    question: 'Vart ska du stå i detta läge? (Back)',
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

