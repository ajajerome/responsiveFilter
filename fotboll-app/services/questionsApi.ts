import type { Level, Position, Question, QuizQuestion } from '@/types/content';
import { REGELFRAGOR } from '@/data/regler';
import { SPELFORSTAELSE } from '@/data/spelforstaelse';
import { getRandomQuestion } from '@/engine/generator';

function pick<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  const out: T[] = [];
  while (out.length < n && a.length) {
    const i = Math.floor(Math.random() * a.length);
    out.push(a.splice(i, 1)[0]);
  }
  return out;
}

export async function fetchQuestions(level: Level, position?: Position, count = 5): Promise<Question[]> {
  // Blanda riktiga dataset (regler/spelförståelse) med genererade
  const regler = REGELFRAGOR.filter(q => q.level === level);
  const spel = SPELFORSTAELSE.filter(q => q.level === level && (!position || q.position === position));
  const base: Question[] = [...pick(regler, Math.min(2, regler.length)), ...pick(spel, Math.min(2, spel.length))];
  while (base.length < count) base.push(getRandomQuestion(level, position));
  return base.slice(0, count);
}

