import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { MatchFreezeQuestion } from '@/types/content';
import { useEffect } from 'react';
import { playLocal } from '@/utils/sound';
import MatchPitch from '@/features/pitch/MatchPitch';
import { useAppStore } from '@/store/useAppStore';
import JerseyIcon from '@/components/common/JerseyIcon';

type Props = { question: MatchFreezeQuestion; onAnswer: (isCorrect: boolean) => void };

export default function MatchFreeze({ question, onAnswer }: Props) {
	const w = 320, h = 220;
	const teamColor = useAppStore((s) => s.profile.avatar?.shirtColor) || '#4da3ff';
	const jersey = useAppStore((s) => s.profile.avatar?.jerseyNumber) || '10';
	useEffect(() => {
		playLocal(require('@/assets/sfx/whistle.mp3'));
	}, []);
	const check = (playerId?: string) => {
		if (question.correctPlayerIds && playerId) return onAnswer(question.correctPlayerIds.includes(playerId));
		onAnswer(false);
	};
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{question.question}</Text>
			<Text style={styles.expl}>
				Tryck på rätt spelare eller rätt yta. Tänk: mellan boll och mål, vinkel och täcka yta.
				{question.explanation ? `\n${question.explanation}` : ''}
			</Text>
			<View style={{ width: w, height: h, position: 'relative' }}>
				<MatchPitch width={w} height={h} />
				{/* Goalkeepers to indicate direction */}
				<View style={{ position: 'absolute', left: w * 0.48, top: 4 }}>
					<JerseyIcon color="#ff3b30" size={22} borderColor="#111" />
				</View>
				<View style={{ position: 'absolute', left: w * 0.48, bottom: 4 }}>
					<JerseyIcon color={teamColor} size={22} />
				</View>
				<Svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
					<Circle cx={question.ball.x * w} cy={question.ball.y * h} r={5} fill="#ffffff" />
				</Svg>
				{question.players.map(p => {
					const showNumber = p.team === 'home' && p.id === 'you';
					return (
						<Pressable
							key={p.id}
							onPress={() => check(p.id)}
							hitSlop={12}
							style={{ position: 'absolute', left: p.x * w - 14, top: p.y * h - 14 }}
						>
							<JerseyIcon color={p.team === 'home' ? teamColor : '#ff3b30'} number={showNumber ? jersey : undefined} size={26} borderColor={p.team === 'home' ? '#e7ebf3' : '#111'} />
						</Pressable>
					);
				})}
				{question.correctZones?.map(z => (
					<Pressable
						key={z.id}
						onPress={() => onAnswer(true)}
						style={{ position: 'absolute', left: z.rect.x * w, top: z.rect.y * h, width: z.rect.width * w, height: z.rect.height * h, backgroundColor: 'rgba(52,199,89,0.12)', borderColor: '#34c759', borderWidth: 2 }}
					/>
				))}
				<View style={{ position: 'absolute', right: 6, top: 6, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 }}>
					<Text style={{ color: 'white', fontWeight: '700' }}>Legend</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
						<JerseyIcon color={teamColor} size={16} />
						<Text style={{ color: 'white' }}>Ditt lag</Text>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
						<JerseyIcon color="#ff3b30" size={16} borderColor="#111" />
						<Text style={{ color: 'white' }}>Motståndare</Text>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
						<View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#ffd400' }} />
						<Text style={{ color: 'white' }}>Boll</Text>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { gap: 12 },
	title: { fontSize: 18, fontWeight: '700', color: '#e7ebf3' },
	expl: { color: '#e7ebf3', backgroundColor: 'rgba(0,0,0,0.25)', padding: 8, borderRadius: 8 },
});