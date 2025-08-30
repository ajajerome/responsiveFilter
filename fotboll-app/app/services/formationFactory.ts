import type { Scenario, PlayerEntity } from '@/types/scenario';

type Preset = Record<'5-manna' | '7-manna' | '9-manna', PlayerEntity[]>;

const HOME_PRESETS: Preset = {
	'5-manna': [
		{ id: 'h-gk', role: 'GK', team: 'home', pos: { x: 10, y: 50 } },
		{ id: 'h-lb', role: 'LB', team: 'home', pos: { x: 25, y: 30 } },
		{ id: 'h-rb', role: 'RB', team: 'home', pos: { x: 25, y: 70 } },
		{ id: 'h-lw', role: 'LW', team: 'home', pos: { x: 50, y: 25 } },
		{ id: 'h-st', role: 'ST', team: 'home', pos: { x: 70, y: 50 } },
		{ id: 'h-rw', role: 'RW', team: 'home', pos: { x: 50, y: 75 } },
	],
	'7-manna': [
		{ id: 'h-gk', role: 'GK', team: 'home', pos: { x: 8, y: 50 } },
		{ id: 'h-lb', role: 'LB', team: 'home', pos: { x: 22, y: 30 } },
		{ id: 'h-cb', role: 'CB', team: 'home', pos: { x: 20, y: 50 } },
		{ id: 'h-rb', role: 'RB', team: 'home', pos: { x: 22, y: 70 } },
		{ id: 'h-lm', role: 'LM', team: 'home', pos: { x: 45, y: 28 } },
		{ id: 'h-rm', role: 'RM', team: 'home', pos: { x: 45, y: 72 } },
		{ id: 'h-st', role: 'ST', team: 'home', pos: { x: 70, y: 50 } },
	],
	'9-manna': [
		{ id: 'h-gk', role: 'GK', team: 'home', pos: { x: 6, y: 50 } },
		{ id: 'h-lb', role: 'LB', team: 'home', pos: { x: 20, y: 30 } },
		{ id: 'h-cb1', role: 'CB', team: 'home', pos: { x: 18, y: 45 } },
		{ id: 'h-cb2', role: 'CB', team: 'home', pos: { x: 18, y: 55 } },
		{ id: 'h-rb', role: 'RB', team: 'home', pos: { x: 20, y: 70 } },
		{ id: 'h-lm', role: 'LM', team: 'home', pos: { x: 40, y: 30 } },
		{ id: 'h-cm', role: 'CM', team: 'home', pos: { x: 45, y: 50 } },
		{ id: 'h-rm', role: 'RM', team: 'home', pos: { x: 40, y: 70 } },
		{ id: 'h-st', role: 'ST', team: 'home', pos: { x: 70, y: 50 } },
	],
};

const AWAY_PRESETS: Preset = {
	'5-manna': [
		{ id: 'a-gk', role: 'GK', team: 'away', pos: { x: 90, y: 50 } },
		{ id: 'a-d1', role: 'CB', team: 'away', pos: { x: 75, y: 40 } },
		{ id: 'a-d2', role: 'CB', team: 'away', pos: { x: 75, y: 60 } },
	],
	'7-manna': [
		{ id: 'a-gk', role: 'GK', team: 'away', pos: { x: 92, y: 50 } },
		{ id: 'a-lb', role: 'LB', team: 'away', pos: { x: 78, y: 30 } },
		{ id: 'a-cb', role: 'CB', team: 'away', pos: { x: 80, y: 50 } },
		{ id: 'a-rb', role: 'RB', team: 'away', pos: { x: 78, y: 70 } },
		{ id: 'a-lm', role: 'LM', team: 'away', pos: { x: 55, y: 28 } },
		{ id: 'a-rm', role: 'RM', team: 'away', pos: { x: 55, y: 72 } },
		{ id: 'a-st', role: 'ST', team: 'away', pos: { x: 30, y: 50 } },
	],
	'9-manna': [
		{ id: 'a-gk', role: 'GK', team: 'away', pos: { x: 94, y: 50 } },
		{ id: 'a-lb', role: 'LB', team: 'away', pos: { x: 82, y: 30 } },
		{ id: 'a-cb1', role: 'CB', team: 'away', pos: { x: 84, y: 45 } },
		{ id: 'a-cb2', role: 'CB', team: 'away', pos: { x: 84, y: 55 } },
		{ id: 'a-rb', role: 'RB', team: 'away', pos: { x: 82, y: 70 } },
		{ id: 'a-lm', role: 'LM', team: 'away', pos: { x: 60, y: 30 } },
		{ id: 'a-cm', role: 'CM', team: 'away', pos: { x: 55, y: 50 } },
		{ id: 'a-rm', role: 'RM', team: 'away', pos: { x: 60, y: 70 } },
		{ id: 'a-st', role: 'ST', team: 'away', pos: { x: 30, y: 50 } },
	],
};

export function createScenario(level: '5-manna' | '7-manna' | '9-manna', lane: 'left' | 'center' | 'right'): Scenario {
	const players = [...HOME_PRESETS[level], ...AWAY_PRESETS[level]];
	const carrier = players.find((p) => p.team === 'home' && (p.role === 'RW' || p.role === 'LW'));
	const ballPos = carrier ? carrier.pos : { x: 50, y: lane === 'left' ? 25 : lane === 'right' ? 75 : 50 };
	return {
		level,
		attacking: 'home',
		possession: 'home',
		players,
		ball: { pos: ballPos },
		keyActors: { ballCarrierId: carrier?.id, focusLane: lane },
	};
}

