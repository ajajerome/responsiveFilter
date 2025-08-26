import 'expo-router/entry';

// Startup data validation for question pools
import type { Question } from '@/types/content';
import { REGELFRAGOR } from '@/data/regler';
import { SPELFORSTAELSE } from '@/data/spelforstaelse';
import { FREEZE_QUESTIONS } from '@/data/freeze';
import { ATTACK_DRAG_QUESTIONS } from '@/data/attack_drag';
// formation/pass are deprecated for now – keep but exclude from serving
// import { FORMATION_QUESTIONS } from '@/data/formation_quiz';
// import { PASS_QUESTIONS } from '@/data/pass';

(function validateQuestionData() {
	try {
		const pools: Array<{ name: string; items: any[] }> = [
			{ name: 'REGELFRAGOR', items: REGELFRAGOR as any[] },
			{ name: 'SPELFORSTAELSE', items: SPELFORSTAELSE as any[] },
			{ name: 'FREEZE_QUESTIONS', items: FREEZE_QUESTIONS as any[] },
			{ name: 'ATTACK_DRAG_QUESTIONS', items: ATTACK_DRAG_QUESTIONS as any[] },
			// { name: 'FORMATION_QUESTIONS', items: FORMATION_QUESTIONS as any[] },
			// { name: 'PASS_QUESTIONS', items: PASS_QUESTIONS as any[] },
		];
		const ids = new Set<string>();
		for (const pool of pools) {
			for (const q of pool.items) {
				const missing: string[] = [];
				if (!q || typeof q !== 'object') { console.warn(`[QA] ${pool.name}: invalid entry`); continue; }
				if (!q.id || typeof q.id !== 'string') missing.push('id');
				if (!q.type || typeof q.type !== 'string') missing.push('type');
				if (!q.level || typeof q.level !== 'string') missing.push('level');
				if (!q.question || typeof q.question !== 'string' || !q.question.trim()) missing.push('question');
				if (missing.length) {
					console.warn(`[QA] ${pool.name}: question missing fields (${missing.join(', ')})`, q);
				}
				if (q.id && ids.has(q.id)) {
					console.warn(`[QA] Duplicate question id detected: ${q.id} in ${pool.name}`);
				} else if (q.id) {
					ids.add(q.id);
				}
			}
		}
	} catch (e) {
		console.warn('[QA] Validation failed:', e);
	}
})();
