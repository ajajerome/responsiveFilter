import type { Level, Position, Question } from '@/types/content';
import { REGELFRAGOR } from '@/data/regler';
import { SPELFORSTAELSE } from '@/data/spelforstaelse';
import { FREEZE_QUESTIONS } from '@/data/freeze';
import { PASS_QUESTIONS } from '@/data/pass';
import { getRandomQuestion } from '@/engine/generator';
import { FORMATION_QUESTIONS } from '@/data/formation_quiz';

function pick<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  const out: T[] = [];
  while (out.length < n && a.length) {
    const i = Math.floor(Math.random() * a.length);
    out.push(a.splice(i, 1)[0]);
  }
  return out;
}

export async function fetchQuestions(level: Level, position?: Position, count = 5, excludeIds?: Set<string>): Promise<Question[]> {
  // Blanda riktiga dataset (regler/spelförståelse) med genererade
  const notSeen = (q: { id: string }) => !excludeIds || !excludeIds.has(q.id);
  const regler = REGELFRAGOR.filter(q => q.level === level).filter(notSeen);
  const spel = SPELFORSTAELSE.filter(q => q.level === level && (!position || q.position === position)).filter(notSeen);
  const freeze = FREEZE_QUESTIONS.filter(q => q.level === level).filter(notSeen);
  const pass = PASS_QUESTIONS.filter(q => q.level === level).filter(notSeen);
  const formation = FORMATION_QUESTIONS.filter(q => q.level === level).filter(notSeen);
  const base: Question[] = [
    ...pick(regler, Math.min(2, regler.length)),
    ...pick(spel, Math.min(2, spel.length)),
    ...pick(freeze, Math.min(1, freeze.length)),
    ...pick(pass, Math.min(1, pass.length)),
    ...pick(formation, Math.min(1, formation.length)),
  ];
  // Fyll upp från kvarvarande pooler (utan drag_drop) utan dubbletter
  const pool: Question[] = [
    ...regler,
    ...spel,
    ...freeze,
    ...pass,
    ...formation,
  ].filter((q) => !base.some((b) => b.id === q.id));
  while (base.length < count && pool.length) {
    const extra = pick(pool, 1);
    base.push(...extra);
  }
  // Sista utväg: generera
  while (base.length < count) base.push(getRandomQuestion(level, position));
  const result = base.slice(0, count);
  // Om vi av någon anledning filtrerat bort allt, försök utan excludeIds en gång
  if (result.length === 0 && excludeIds && excludeIds.size > 0) {
    return fetchQuestions(level, position, count, undefined);
  }
  return result;
}

