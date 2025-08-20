import { View, Text, StyleSheet, Pressable, PanResponder, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { MatchFreezeQuestion } from '@/types/content';
import { useEffect, useMemo, useRef, useState } from 'react';
import { playLocal } from '@/utils/sound';
import MatchPitch from '@/features/pitch/MatchPitch';

type Props = { question: MatchFreezeQuestion; onAnswer: (isCorrect: boolean) => void };

export default function MatchFreeze({ question, onAnswer }: Props) {
	const w = 320, h = 220;
	useEffect(() => {
		playLocal(require('@/assets/sfx/whistle.mp3'));
	}, []);
	const check = (playerId?: string) => {
		if (question.correctPlayerIds && playerId) return onAnswer(question.correctPlayerIds.includes(playerId));
		onAnswer(false);
	};
	// Drag på boll
	const initialBall = useMemo(() => ({ x: question.ball.x * w, y: question.ball.y * h }), [question.ball.x, question.ball.y]);
	const ballPos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
	const [ballOffset, setBallOffset] = useState({ x: 0, y: 0 });
	const pan = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {
				ballPos.setOffset({ x: (ballPos as any).x._value, y: (ballPos as any).y._value });
				ballPos.setValue({ x: 0, y: 0 });
			},
			onPanResponderMove: Animated.event([null, { dx: ballPos.x, dy: ballPos.y }], { useNativeDriver: false }),
			onPanResponderRelease: () => {
				ballPos.flattenOffset();
				const current = { x: (ballPos as any).x._value, y: (ballPos as any).y._value };
				const cx = initialBall.x + current.x;
				const cy = initialBall.y + current.y;
				setBallOffset(current);
				// Rätt/fel: zon före spelare
				if (question.correctZones && question.correctZones.length > 0) {
					const ok = question.correctZones.some(z => (
						cx >= z.rect.x * w && cx <= (z.rect.x + z.rect.width) * w &&
						cy >= z.rect.y * h && cy <= (z.rect.y + z.rect.height) * h
					));
					if (ok) {
						// animera bollen mot första zonens center
						const z = question.correctZones[0];
						const zx = (z.rect.x + z.rect.width / 2) * w;
						const zy = (z.rect.y + z.rect.height / 2) * h;
						playLocal(require('@/assets/sfx/success.mp3'));
						Animated.timing(ballPos, { toValue: { x: zx - initialBall.x, y: zy - initialBall.y }, duration: 500, useNativeDriver: false }).start(() => onAnswer(true));
					} else {
						playLocal(require('@/assets/sfx/fail.mp3'));
						onAnswer(false);
					}
					return;
				}
				if (question.correctPlayerIds && question.correctPlayerIds.length > 0) {
					const hitPlayer = question.players.find(p => question.correctPlayerIds!.includes(p.id) && Math.hypot(cx - p.x * w, cy - p.y * h) < 28);
					if (hitPlayer) {
						playLocal(require('@/assets/sfx/success.mp3'));
						Animated.timing(ballPos, { toValue: { x: hitPlayer.x * w - initialBall.x, y: hitPlayer.y * h - initialBall.y }, duration: 500, useNativeDriver: false }).start(() => onAnswer(true));
					} else {
						playLocal(require('@/assets/sfx/fail.mp3'));
						onAnswer(false);
					}
					return;
				}
				onAnswer(false);
			},
		})
	).current;
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{question.question}</Text>
			<Text style={styles.expl}>
				Dra bollen till rätt yta eller tryck på rätt spelare. Tänk: mellan boll och mål, vinkel och täcka yta.
			</Text>
			<View style={{ width: w, height: h, position: 'relative' }}>
				<MatchPitch width={w} height={h} />
				<Svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
					<Circle cx={question.ball.x * w} cy={question.ball.y * h} r={5} fill="#ffd400" />
				</Svg>
				{question.players.map(p => (
					<Pressable
						key={p.id}
						onPress={() => check(p.id)}
						hitSlop={12}
						style={{ position: 'absolute', left: p.x * w - 18, top: p.y * h - 18, width: 36, height: 36, borderRadius: 18, backgroundColor: p.team === 'home' ? '#4da3ff' : '#ff3b30', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: p.team === 'home' ? '#e7ebf3' : '#111' }}
					/>
				))}
				<View style={{ position: 'absolute', right: 6, top: 6, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 }}>
					<Text style={{ color: 'white', fontWeight: '700' }}>Legend</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
						<View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#4da3ff' }} />
						<Text style={{ color: 'white' }}>Ditt lag</Text>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
						<View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#ff3b30' }} />
						<Text style={{ color: 'white' }}>Motståndare</Text>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
						<View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#ffd400' }} />
						<Text style={{ color: 'white' }}>Boll</Text>
					</View>
				</View>
				{/* Draggable ball overlay */}
				<Animated.View
					{...pan.panHandlers}
					style={{ position: 'absolute', left: initialBall.x - 8, top: initialBall.y - 8, transform: ballPos.getTranslateTransform(), width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff' }}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { gap: 12 },
	title: { fontSize: 18, fontWeight: '700' },
	expl: { color: '#bbb' },
});