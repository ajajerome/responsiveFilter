import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { QUESTIONS } from '@/data/questions';
import type { Level, Question } from '@/types/content';

type AgeTier = 'U7' | 'U9' | 'U11' | 'U13+';

function deriveLevelFromAge(age: number): Level {
	if (age <= 8) return '5-manna';
	if (age <= 11) return '7-manna';
	return '9-manna';
}

function deriveAgeTier(age: number): AgeTier {
	if (age <= 7) return 'U7';
	if (age <= 9) return 'U9';
	if (age <= 11) return 'U11';
	return 'U13+';
}

const FORMATIONS: Record<Level, number[]> = {
	'5-manna': [2, 2, 1],
	'7-manna': [3, 2, 1, 1],
	'9-manna': [4, 3, 1, 1],
};

function TeamView({ level, color, label }: { level: Level; color: string; label: string }) {
	const rows = FORMATIONS[level];
	return (
		<View style={styles.teamContainer}>
			<Text style={styles.teamLabel}>{label}</Text>
			{rows.map((count, rowIdx) => (
				<View key={rowIdx} style={styles.row}>
					{Array.from({ length: count }).map((_, i) => (
						<View key={i} style={[styles.playerDot, { backgroundColor: color }]} />
					))}
				</View>
			))}
		</View>
	);
}

export default function InteractionScreen() {
	const [age, setAge] = useState<number>(10);
	const level = useMemo(() => deriveLevelFromAge(age), [age]);
	const ageTier = useMemo(() => deriveAgeTier(age), [age]);

	const relevantQuestions: Question[] = useMemo(() => {
		return QUESTIONS.filter((q) => q.level === level);
	}, [level]);

	const [qIndex, setQIndex] = useState(0);
	const question = relevantQuestions[qIndex % Math.max(1, relevantQuestions.length)];

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Matchscenario – Interaktivt läge</Text>
			<Text style={styles.subtitle}>Ålder: {age} ({ageTier}) • Nivå: {level}</Text>
			<View style={styles.ageControls}>
				{[7, 8, 9, 10, 11, 12, 13].map((a) => (
					<Pressable key={a} style={[styles.ageButton, age === a && styles.ageButtonActive]} onPress={() => setAge(a)}>
						<Text style={[styles.ageButtonText, age === a && styles.ageButtonTextActive]}>{a}</Text>
					</Pressable>
				))}
			</View>

			<View style={styles.teamsWrapper}>
				<TeamView level={level} color="#1e90ff" label="Lag Blå" />
				<TeamView level={level} color="#ff3b30" label="Lag Röd" />
			</View>

			<View style={styles.questionBox}>
				<Text style={styles.questionTitle}>{question?.question ?? 'Inga frågor tillgängliga för denna nivå ännu.'}</Text>
				{(question as any)?.options && (
					<View style={styles.options}>
						{(question as any).options.map((opt: string, i: number) => (
							<Pressable key={i} style={styles.option} onPress={() => setQIndex(qIndex + 1)}>
								<Text>{opt}</Text>
							</Pressable>
						))}
					</View>
				)}
				{!question && (
					<Text style={styles.noQuestions}>Lägg till frågor i data/questions.ts för nivån {level}.</Text>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16, gap: 16 },
	title: { fontSize: 20, fontWeight: '700' },
	subtitle: { color: '#666' },
	ageControls: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
	ageButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
	ageButtonActive: { backgroundColor: '#1e90ff' },
	ageButtonText: { color: '#333', fontWeight: '600' },
	ageButtonTextActive: { color: 'white' },
	teamsWrapper: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
	teamContainer: { flex: 1, backgroundColor: '#f8f9fb', borderRadius: 12, padding: 12, gap: 8 },
	teamLabel: { fontWeight: '700', marginBottom: 4 },
	row: { flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 6 },
	playerDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#1e90ff' },
	questionBox: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#eee' },
	questionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
	options: { gap: 8 },
	option: { backgroundColor: '#f2f2f7', padding: 12, borderRadius: 8 },
	noQuestions: { color: '#999' },
});

