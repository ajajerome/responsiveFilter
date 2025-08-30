import type { Scenario, ActionEvent, ScenarioValidation, ScenarioSequence } from '@/types/scenario';
import type { ActionType } from '@/types/content';

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	return Math.hypot(dx, dy);
}

function isSameTeam(s: Scenario, actorId?: string, targetId?: string): boolean {
	const a = s.players.find((p) => p.id === actorId);
	const t = s.players.find((p) => p.id === targetId);
	if (!a || !t) return false;
	return a.team === t.team;
}

function isAttackingForward(s: Scenario, fromX: number, toX: number): boolean {
	// home attacks left->right; away attacks right->left
	if (s.attacking === 'home') return toX > fromX;
	return toX < fromX;
}

export function validateAction(
	s: Scenario,
	action: ActionEvent,
	options?: { allowedActions?: ActionType[]; focusLane?: 'left' | 'center' | 'right' }
): ScenarioValidation {
	const allowed = options?.allowedActions;
	if (allowed && !allowed.includes(action.kind as ActionType)) {
		return { valid: false, message: 'Åtgärden är inte tillåten i detta scenario.' };
	}

	const RULES = {
		'5-manna': { maxPass: 40, minDribble: 5, maxDribble: 25, shootX: 75, xp: { pass: 8, dribble: 6, shoot: 12, defend: 6 } },
		'7-manna': { maxPass: 50, minDribble: 5, maxDribble: 30, shootX: 80, xp: { pass: 10, dribble: 8, shoot: 14, defend: 7 } },
		'9-manna': { maxPass: 60, minDribble: 5, maxDribble: 35, shootX: 85, xp: { pass: 12, dribble: 9, shoot: 16, defend: 8 } },
	} as const;
	const R = RULES[s.level];

	function forwardThreshold(shootX: number) {
		return s.attacking === 'home' ? (x: number) => x >= shootX : (x: number) => x <= 100 - shootX;
	}

	function inFocusLane(y: number) {
		if (!options?.focusLane) return true;
		// left: 0..33, center: 33..66, right: 66..100 (approx)
		if (options.focusLane === 'left') return y <= 33;
		if (options.focusLane === 'center') return y > 33 && y < 66;
		return y >= 66;
	}

	switch (action.kind) {
		case 'pass': {
			if (action.actorId !== s.keyActors?.ballCarrierId) {
				return { valid: false, message: 'Passning: endast bollhållaren kan passa.' };
			}
			if (!isSameTeam(s, action.actorId, action.targetId)) {
				return { valid: false, message: 'Passning till motståndare är ogiltig.' };
			}
			const from = s.players.find((p) => p.id === action.actorId);
			const to = s.players.find((p) => p.id === action.targetId);
			if (!from || !to) return { valid: false, message: 'Passning saknar aktör eller mål.' };
			const d = distance(from.pos, to.pos);
			if (!isAttackingForward(s, from.pos.x, to.pos.x)) {
				return { valid: false, message: 'Passningen går inte framåt i anfall riktning.' };
			}
			if (d > R.maxPass) {
				return { valid: false, message: 'Passningen är för lång för denna nivå.' };
			}
			if (!inFocusLane(to.pos.y)) {
				return { valid: false, message: 'Passningen lämnar rekommenderad spel-lane.' };
			}
			return { valid: true, xpDelta: R.xp.pass, message: 'Bra passning! Fortsätt framåt.' };
		}
		case 'dribble': {
			if (action.actorId !== s.keyActors?.ballCarrierId || !action.from || !action.to) {
				return { valid: false, message: 'Dribbling måste göras av bollhållaren.' };
			}
			if (!isAttackingForward(s, action.from.x, action.to.x)) {
				return { valid: false, message: 'Dribbling ska ta laget framåt.' };
			}
			const step = distance(action.from, action.to);
			if (step < R.minDribble) return { valid: false, message: 'För kort dribblingsteg.' };
			if (step > R.maxDribble) return { valid: false, message: 'För långt steg för kontrollerad dribbling.' };
			if (!inFocusLane(action.to.y)) return { valid: false, message: 'Håll dig i aktuell spel-lane.' };
			return { valid: true, xpDelta: R.xp.dribble, message: 'Fin dribbling!' };
		}
		case 'shoot': {
			if (action.actorId !== s.keyActors?.ballCarrierId) {
				return { valid: false, message: 'Endast bollhållaren kan skjuta.' };
			}
			const shooter = s.players.find((p) => p.id === action.actorId);
			if (!shooter) return { valid: false, message: 'Skytt saknas.' };
			const closeToGoal = forwardThreshold(R.shootX)(shooter.pos.x);
			if (!closeToGoal) return { valid: false, message: 'Avslutet tas för långt ifrån.' };
			return { valid: true, xpDelta: R.xp.shoot, message: 'Bra avslutsläge!' };
		}
		case 'defend': {
			if (s.possession === 'home' && s.attacking === 'home') {
				return { valid: false, message: 'Försvar saknar relevans när vi har bollen.' };
			}
			if (!action.from || !action.to) return { valid: false, message: 'Ange rörelse för försvar.' };
			const towardsBall = distance(action.to, s.ball.pos) < distance(action.from, s.ball.pos);
			if (!towardsBall) return { valid: false, message: 'Pressa närmare bollhållaren.' };
			return { valid: true, xpDelta: R.xp.defend, message: 'Bra press!' };
		}
		default:
			return { valid: false, message: 'Okänd åtgärd.' };
	}
}

export function getAllowedPassTargets(
	s: Scenario,
	actorId: string | undefined,
	options?: { focusLane?: 'left' | 'center' | 'right' }
): string[] {
	if (!actorId) return [];
	const RULES = {
		'5-manna': { maxPass: 40 },
		'7-manna': { maxPass: 50 },
		'9-manna': { maxPass: 60 },
	} as const;
	const R = RULES[s.level];
	const from = s.players.find((p) => p.id === actorId);
	if (!from) return [];
	function inFocusLane(y: number) {
		if (!options?.focusLane) return true;
		if (options.focusLane === 'left') return y <= 33;
		if (options.focusLane === 'center') return y > 33 && y < 66;
		return y >= 66;
	}
	return s.players
		.filter((p) => p.team === from.team && p.id !== from.id)
		.filter((p) => isAttackingForward(s, from.pos.x, p.pos.x))
		.filter((p) => distance(from.pos, p.pos) <= R.maxPass)
		.filter((p) => inFocusLane(p.pos.y))
		.map((p) => p.id);
}

export function scoreSequenceStep(
	s: Scenario,
	sequence: ScenarioSequence,
	stepIndex: number,
	action: ActionEvent,
	options?: { allowedActions?: import('@/types/content').ActionType[]; focusLane?: 'left' | 'center' | 'right' }
): ScenarioValidation {
	const step = sequence.steps[stepIndex];
	if (!step) return { valid: false, message: 'Ingen stegdata.' };
	if (step.expected !== action.kind) return { valid: false, message: 'Fel åtgärd för detta steg.' };
	// Delegate to base validation
	const base = validateAction(s, action, options);
	if (!base.valid) return base;
	return { valid: true, message: base.message, xpDelta: (base.xpDelta ?? 0) + (step.xpBonus ?? 0) };
}

