import type { Level, Position, Question } from '@/types/content';
import { REGELFRAGOR } from '@/data/regler';
import { SPELFORSTAELSE } from '@/data/spelforstaelse';
import { FREEZE_QUESTIONS } from '@/data/freeze';
import { PASS_QUESTIONS } from '@/data/pass';
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
  const freeze = FREEZE_QUESTIONS.filter(q => q.level === level);
  const pass = PASS_QUESTIONS.filter(q => q.level === level);
  const base: Question[] = [
    ...pick(regler, Math.min(2, regler.length)),
    ...pick(spel, Math.min(2, spel.length)),
    ...pick(freeze, Math.min(1, freeze.length)),
    ...pick(pass, Math.min(1, pass.length)),
  ];
  while (base.length < count) base.push(getRandomQuestion(level, position));
  return base.slice(0, count);
}

