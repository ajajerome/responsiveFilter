import { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Circle } from 'react-native-svg';
import type { Scenario } from '@/types/scenario';

type Props = {
	scenario: Scenario;
	width?: number;
	height?: number;
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

export const PitchView = memo(function PitchView({ scenario, width = 340, height = 220 }: Props) {
	const zones = useMemo(() => formationZones(scenario.level), [scenario.level]);
	return (
		<View style={styles.wrapper}>
			<Svg width={width} height={height}>
				<Rect x={0} y={0} width={width} height={height} rx={10} ry={10} fill="#0c7a43" />
				<Rect x={6} y={6} width={width - 12} height={height - 12} stroke="#ffffff" strokeWidth={2} fill="transparent" />
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
					return (
						<>
							<Circle key={p.id} cx={cx} cy={cy} r={10} fill={color} stroke={isCarrier ? '#ffd60a' : '#ffffff'} strokeWidth={isCarrier ? 3 : 1.5} />
						</>
					);
				})}

				{/* Ball */}
				{(() => {
					const { cx, cy } = normalize(scenario.ball.pos.x, scenario.ball.pos.y, width, height);
					return <Circle cx={cx} cy={cy} r={4} fill="#ffffff" stroke="#000" strokeWidth={1} />;
				})()}
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

