export type TeamSide = 'home' | 'away';
export type Role = 'GK' | 'LB' | 'CB' | 'RB' | 'LM' | 'CM' | 'RM' | 'LW' | 'RW' | 'ST' | 'AM' | 'DM';

export interface Vector2 {
	x: number; // 0..100 normalized pitch coordinates
	y: number; // 0..100 normalized pitch coordinates
}

export interface PlayerEntity {
	id: string;
	name?: string;
	role: Role;
	team: TeamSide;
	pos: Vector2;
}

export interface BallEntity {
	pos: Vector2;
	velocity?: Vector2;
}

export interface Scenario {
	level: '5-manna' | '7-manna' | '9-manna';
	attacking: TeamSide; // which team attacks left->right
	possession: TeamSide; // who has the ball
	players: PlayerEntity[];
	ball: BallEntity;
	keyActors?: { ballCarrierId?: string; focusLane?: 'left' | 'center' | 'right' };
}

export interface ActionEvent {
	kind: 'move' | 'pass' | 'dribble' | 'shoot' | 'defend';
	from?: Vector2;
	to?: Vector2;
	actorId?: string;
	targetId?: string;
}

export interface ScenarioValidation {
	valid: boolean;
	message?: string;
	xpDelta?: number;
}

export interface ScenarioStep {
	// Expected action kind for this step and optional hints
	expected: 'pass' | 'dribble' | 'shoot' | 'defend';
	hint?: string;
	// Optional: constrain target to same-team or specific player ids
	allowedTargetIds?: string[];
	// Optional extra scoring/bonus for this step
	xpBonus?: number;
}

export interface ScenarioSequence {
	steps: ScenarioStep[];
}
