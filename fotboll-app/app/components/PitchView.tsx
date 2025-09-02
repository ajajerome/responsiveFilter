import { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
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
	if (!scenario || !Array.isArray(scenario.players) || !scenario.ball) {
		return (
			<View style={styles.wrapper}>
				<Text style={styles.legendText}>Ingen scenario-data</Text>
			</View>
		);
	}
	const zones = useMemo(() => formationZones(scenario.level) ?? [], [scenario.level]);

	const handlePitchPress = useCallback((e: any) => {
		if (!selectable || !onSelectPoint) return;
		const lx = e?.nativeEvent?.locationX ?? 0;
		const ly = e?.nativeEvent?.locationY ?? 0;
		const nx = Math.max(0, Math.min(100, (lx / width) * 100));
		const ny = Math.max(0, Math.min(100, (ly / height) * 100));
		onSelectPoint({ x: nx, y: ny });
	}, [selectable, onSelectPoint, width, height]);

	const panResponder = useMemo(() => PanResponder.create({
		onMoveShouldSetPanResponder: () => !!selectable,
		onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
			if (!selectable || !onSelectPoint) return;
			const lx = gestureState.moveX - (evt.nativeEvent.pageX - evt.nativeEvent.locationX);
			const ly = gestureState.moveY - (evt.nativeEvent.pageY - evt.nativeEvent.locationY);
			const nx = Math.max(0, Math.min(100, (lx / width) * 100));
			const ny = Math.max(0, Math.min(100, (ly / height) * 100));
			onSelectPoint({ x: nx, y: ny });
		},
	}), [selectable, onSelectPoint, width, height]);
	// Attempt to load react-native-svg at runtime; fall back if unavailable
	let SvgComp: any = null, RectComp: any = null, LineComp: any = null, CircleComp: any = null, PathComp: any = null;
	try {
		const rnsvg = require('react-native-svg');
		SvgComp = rnsvg.default;
		RectComp = rnsvg.Rect;
		LineComp = rnsvg.Line;
		CircleComp = rnsvg.Circle;
		PathComp = rnsvg.Path;
	} catch {}

	const hasSvg = !!SvgComp;

	return (
		<View style={styles.wrapper} {...(selectable ? panResponder.panHandlers : {})}>
			{hasSvg ? (
				<SvgComp width={width} height={height}>
					<RectComp x={0} y={0} width={width} height={height} rx={10} ry={10} fill="#0c7a43" />
					<RectComp x={6} y={6} width={width - 12} height={height - 12} stroke="#ffffff" strokeWidth={2} fill="transparent" onPress={handlePitchPress} />
					<LineComp x1={width / 2} y1={6} x2={width / 2} y2={height - 6} stroke="#ffffff" strokeWidth={2} />
					<RectComp x={6} y={height * 0.3} width={width * 0.15} height={height * 0.4} stroke="#ffffff" strokeWidth={2} fill="transparent" />
					<RectComp x={width - width * 0.15 - 6} y={height * 0.3} width={width * 0.15} height={height * 0.4} stroke="#ffffff" strokeWidth={2} fill="transparent" />
					{zones.map((z, i) => (
						<LineComp key={i} x1={width * z} y1={6} x2={width * z} y2={height - 6} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
					))}
					{scenario.players.map((p) => {
						const { cx, cy } = normalize(p.pos.x, p.pos.y, width, height);
						const isCarrier = scenario.keyActors?.ballCarrierId === p.id;
						const color = p.team === 'home' ? '#3a86ff' : '#ff006e';
						const highlighted = highlightPlayerIds?.includes(p.id);
						return (
							<CircleComp
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
					{(() => {
						const { cx, cy } = normalize(scenario.ball.pos.x, scenario.ball.pos.y, width, height);
						return <CircleComp cx={cx} cy={cy} r={4} fill="#ffffff" stroke="#000" strokeWidth={1} />;
					})()}
					{selectedPoint && (
						(() => {
							const { cx, cy } = normalize(selectedPoint.x, selectedPoint.y, width, height);
							return <CircleComp cx={cx} cy={cy} r={6} fill="rgba(0,240,255,0.9)" stroke="#0a0a0f" strokeWidth={1.5} />;
						})()
					)}
					{ghostPath && (
						(() => {
							const s = normalize(ghostPath.from.x, ghostPath.from.y, width, height);
							const t = normalize(ghostPath.to.x, ghostPath.to.y, width, height);
							return (
								<PathComp
									d={`M ${s.cx} ${s.cy} L ${t.cx} ${t.cy}`}
									stroke="rgba(0,240,255,0.8)"
									strokeDasharray="6 6"
									strokeWidth={3}
								/>
							);
						})()
					)}
				</SvgComp>
			) : (
				<View style={{ width, height, borderRadius: 10, backgroundColor: '#0c7a43', borderWidth: 2, borderColor: '#ffffff', overflow: 'hidden' }}>
					<View style={{ position: 'absolute', left: width / 2 - 1, top: 6, bottom: 6, width: 2, backgroundColor: '#ffffff' }} />
					{scenario.players.map((p) => {
						const { cx, cy } = normalize(p.pos.x, p.pos.y, width, height);
						const isCarrier = scenario.keyActors?.ballCarrierId === p.id;
						const color = p.team === 'home' ? '#3a86ff' : '#ff006e';
						const highlighted = highlightPlayerIds?.includes(p.id);
						return (
							<View key={p.id} style={{ position: 'absolute', left: cx - 12, top: cy - 12, width: 24, height: 24, borderRadius: 12, backgroundColor: color, borderWidth: isCarrier || highlighted ? 3 : 1.5, borderColor: isCarrier ? '#ffd60a' : highlighted ? '#00f0ff' : '#ffffff' }} />
						);
					})}
					{(() => {
						const { cx, cy } = normalize(scenario.ball.pos.x, scenario.ball.pos.y, width, height);
						return <View style={{ position: 'absolute', left: cx - 4, top: cy - 4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff', borderColor: '#000', borderWidth: 1 }} />;
					})()}
				</View>
			)}
			<View style={styles.legend}>
				<Text style={styles.legendText}>Blå: Hemmalag • Röd: Bortalag • Gul ring: Bollhållare</Text>
				<Text style={styles.legendText}>Drag för målpunkt • Streckad linje = planerad rörelse</Text>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	wrapper: { alignSelf: 'center', backgroundColor: '#0c7a43' },
	legend: { marginTop: 8, alignItems: 'center' },
	legendText: { color: '#666' },
});

export default PitchView;

