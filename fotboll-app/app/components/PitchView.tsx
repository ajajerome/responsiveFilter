import { memo, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Circle, Path } from 'react-native-svg';
import type { Scenario, Vector2 } from '@/types/scenario';

type Props = {
	scenario: Scenario;
	width?: number;
	height?: number;
	selectable?: boolean;
	onSelectPlayer?: (playerId: string, pos: Vector2) => void;
	onSelectPoint?: (pos: Vector2) => void;
	highlightPlayerIds?: string[];
	selectedPoint?: Vector2;
	ghostPath?: { from: Vector2; to: Vector2 };
};

function normalize(x: number, y: number, w: number, h: number) {
	return { cx: (x / 100) * w, cy: (y / 100) * h };
}

function formationZones(level: Scenario['level']) {
	// Simple lane/zone guides per level (could be data-driven later)
	switch (level) {
		case '5-manna':
			return [0.33, 0.66];
		case '7-manna':
			return [0.33, 0.66];
		case '9-manna':
			return [0.25, 0.5, 0.75];
	}
}

export const PitchView = memo(function PitchView({ scenario, width = 340, height = 220, selectable, onSelectPlayer, onSelectPoint, highlightPlayerIds, selectedPoint, ghostPath }: Props) {
	const zones = useMemo(() => formationZones(scenario.level), [scenario.level]);

	const handlePitchPress = useCallback((e: any) => {
		if (!selectable || !onSelectPoint) return;
		const lx = e?.nativeEvent?.locationX ?? 0;
		const ly = e?.nativeEvent?.locationY ?? 0;
		const nx = Math.max(0, Math.min(100, (lx / width) * 100));
		const ny = Math.max(0, Math.min(100, (ly / height) * 100));
		onSelectPoint({ x: nx, y: ny });
	}, [selectable, onSelectPoint, width, height]);
	return (
		<View style={styles.wrapper}>
			<Svg width={width} height={height}>
				<Rect x={0} y={0} width={width} height={height} rx={10} ry={10} fill="#0c7a43" />
				<Rect x={6} y={6} width={width - 12} height={height - 12} stroke="#ffffff" strokeWidth={2} fill="transparent" onPress={handlePitchPress} />
				{/* Mid line */}
				<Line x1={width / 2} y1={6} x2={width / 2} y2={height - 6} stroke="#ffffff" strokeWidth={2} />
				{/* Simple penalty boxes */}
				<Rect x={6} y={height * 0.3} width={width * 0.15} height={height * 0.4} stroke="#ffffff" strokeWidth={2} fill="transparent" />
				<Rect x={width - width * 0.15 - 6} y={height * 0.3} width={width * 0.15} height={height * 0.4} stroke="#ffffff" strokeWidth={2} fill="transparent" />
				{/* Lanes */}
				{zones.map((z, i) => (
					<Line key={i} x1={width * z} y1={6} x2={width * z} y2={height - 6} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
				))}

				{/* Players */}
				{scenario.players.map((p) => {
					const { cx, cy } = normalize(p.pos.x, p.pos.y, width, height);
					const isCarrier = scenario.keyActors?.ballCarrierId === p.id;
					const color = p.team === 'home' ? '#3a86ff' : '#ff006e';
					const highlighted = highlightPlayerIds?.includes(p.id);
					return (
						<Circle
							key={p.id}
							cx={cx}
							cy={cy}
							r={12}
							fill={color}
							stroke={isCarrier ? '#ffd60a' : highlighted ? '#00f0ff' : '#ffffff'}
							strokeWidth={isCarrier || highlighted ? 3 : 1.5}
							onPress={() => {
								if (selectable && onSelectPlayer) onSelectPlayer(p.id, p.pos);
							}}
						/>
					);
				})}

				{/* Ball */}
				{(() => {
					const { cx, cy } = normalize(scenario.ball.pos.x, scenario.ball.pos.y, width, height);
					return <Circle cx={cx} cy={cy} r={4} fill="#ffffff" stroke="#000" strokeWidth={1} />;
				})()}

				{/* Selected target point overlay */}
				{selectedPoint && (
					(() => {
						const { cx, cy } = normalize(selectedPoint.x, selectedPoint.y, width, height);
						return <Circle cx={cx} cy={cy} r={6} fill="rgba(0,240,255,0.9)" stroke="#0a0a0f" strokeWidth={1.5} />;
					})()
				)}

				{/* Ghost path for passes/dribbles */}
				{ghostPath && (
					(() => {
						const s = normalize(ghostPath.from.x, ghostPath.from.y, width, height);
						const t = normalize(ghostPath.to.x, ghostPath.to.y, width, height);
						return (
							<Path
								d={`M ${s.cx} ${s.cy} L ${t.cx} ${t.cy}`}
								stroke="rgba(0,240,255,0.8)"
								strokeDasharray="6 6"
								strokeWidth={3}
							/>
						);
					})()
				)}
			</Svg>
			<View style={styles.legend}>
				<Text style={styles.legendText}>Blå: Hemmalag • Röd: Bortalag • Gul ring: Bollhållare</Text>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	wrapper: { alignSelf: 'center' },
	legend: { marginTop: 8, alignItems: 'center' },
	legendText: { color: '#666' },
});

export default PitchView;

