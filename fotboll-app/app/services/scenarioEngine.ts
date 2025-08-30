import type { Scenario, ActionEvent, ScenarioValidation } from '@/types/scenario';
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
			if (d > 40) {
				return { valid: false, message: 'Passningen är för lång för denna nivå.' };
			}
			return { valid: true, xpDelta: 10, message: 'Bra passning! Fortsätt framåt.' };
		}
		case 'dribble': {
			if (action.actorId !== s.keyActors?.ballCarrierId || !action.from || !action.to) {
				return { valid: false, message: 'Dribbling måste göras av bollhållaren.' };
			}
			if (!isAttackingForward(s, action.from.x, action.to.x)) {
				return { valid: false, message: 'Dribbling ska ta laget framåt.' };
			}
			const step = distance(action.from, action.to);
			if (step < 5) return { valid: false, message: 'För kort dribblingsteg.' };
			if (step > 25) return { valid: false, message: 'För långt steg för kontrollerad dribbling.' };
			return { valid: true, xpDelta: 8, message: 'Fin dribbling!' };
		}
		case 'shoot': {
			if (action.actorId !== s.keyActors?.ballCarrierId) {
				return { valid: false, message: 'Endast bollhållaren kan skjuta.' };
			}
			const shooter = s.players.find((p) => p.id === action.actorId);
			if (!shooter) return { valid: false, message: 'Skytt saknas.' };
			const closeToGoal = s.attacking === 'home' ? shooter.pos.x >= 75 : shooter.pos.x <= 25;
			if (!closeToGoal) return { valid: false, message: 'Avslutet tas för långt ifrån.' };
			return { valid: true, xpDelta: 15, message: 'Bra avslutsläge!' };
		}
		case 'defend': {
			if (s.possession === 'home' && s.attacking === 'home') {
				return { valid: false, message: 'Försvar saknar relevans när vi har bollen.' };
			}
			if (!action.from || !action.to) return { valid: false, message: 'Ange rörelse för försvar.' };
			const towardsBall = distance(action.to, s.ball.pos) < distance(action.from, s.ball.pos);
			if (!towardsBall) return { valid: false, message: 'Pressa närmare bollhållaren.' };
			return { valid: true, xpDelta: 8, message: 'Bra press!' };
		}
		default:
			return { valid: false, message: 'Okänd åtgärd.' };
	}
}

