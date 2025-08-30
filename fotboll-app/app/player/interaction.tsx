import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { QUESTIONS } from '@/data/questions';
import type { Level, Question, MatchScenarioQuestion } from '@/types/content';
import PitchView from '@/app/components/PitchView';
import ActionBar from '@/app/components/ActionBar';
import { FC25 } from '@/app/components/Theme';
import { validateAction, getAllowedPassTargets } from '@/app/services/scenarioEngine';
import type { ActionType } from '@/types/content';
import type { Vector2 } from '@/types/scenario';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';

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
    const { actions, progress } = useAppStore((s) => ({ actions: s.actions, progress: s.progress }));

	const relevantQuestions: Question[] = useMemo(() => {
		return QUESTIONS.filter((q) => q.level === level);
	}, [level]);

	const [qIndex, setQIndex] = useState(0);
	const question = relevantQuestions[qIndex % Math.max(1, relevantQuestions.length)];
	const [feedback, setFeedback] = useState<string>('');
	const [xp, setXp] = useState<number>(0);
	const currentLevelXp = progress[level]?.xp ?? 0;
	const [selectedAction, setSelectedAction] = useState<ActionType | undefined>();
	const [selectedTargetPlayerId, setSelectedTargetPlayerId] = useState<string | undefined>();
	const [selectedPoint, setSelectedPoint] = useState<Vector2 | undefined>();

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

			{question?.type === 'matchscenario' ? (
				<PitchView
					scenario={(question as MatchScenarioQuestion).scenario}
					selectable
					highlightPlayerIds={(() => {
						const scen = (question as MatchScenarioQuestion).scenario;
						if (selectedAction === 'pass') {
							return getAllowedPassTargets(scen, scen.keyActors?.ballCarrierId, { focusLane: scen.keyActors?.focusLane });
						}
						return selectedTargetPlayerId ? [selectedTargetPlayerId] : [];
					})()}
					selectedPoint={selectedPoint}
					ghostPath={selectedAction === 'dribble' && selectedPoint ? { from: (question as MatchScenarioQuestion).scenario.players.find(p => p.id === (question as MatchScenarioQuestion).scenario.keyActors?.ballCarrierId)!.pos, to: selectedPoint } : undefined}
					onSelectPlayer={(pid) => {
						if (!selectedAction) return;
						if (selectedAction === 'pass') {
							setSelectedTargetPlayerId(pid);
						}
					}}
					onSelectPoint={(pt) => {
						if (!selectedAction) return;
						if (selectedAction === 'dribble' || selectedAction === 'defend') setSelectedPoint(pt);
					}}
				/>
			) : (
				<View style={styles.teamsWrapper}>
					<TeamView level={level} color="#1e90ff" label="Lag Blå" />
					<TeamView level={level} color="#ff3b30" label="Lag Röd" />
				</View>
			)}

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

			{question?.type === 'matchscenario' && (
				<View style={styles.actionSection}>
					{/* HUD */}
					{(() => {
						const scen = (question as MatchScenarioQuestion).scenario;
						const actor = scen.players.find(p => p.id === scen.keyActors?.ballCarrierId);
						return (
							<View style={{ gap: 6 }}>
								<Text style={{ color: FC25.colors.text }}>Bollhållare: {actor?.role ?? 'okänd'} • Lane: {scen.keyActors?.focusLane ?? '-'}</Text>
							</View>
						);
					})()}

					<ActionBar
						allowed={(question as MatchScenarioQuestion).allowedActions}
						onSelect={(act: ActionType) => {
							setSelectedAction(act);
							setFeedback(
								act === 'pass'
									? 'Välj en medspelare att passa till'
								: act === 'dribble'
									? 'Tryck på planen dit du vill dribbla'
									: act === 'defend'
									? 'Välj en försvarare och tryck dit du vill pressa'
									: 'Försök avslut om du är nära mål'
							);
						}}
					/>
					<Pressable
						style={styles.nextBtn}
						onPress={() => {
							if (question?.type !== 'matchscenario' || !selectedAction) return;
							const scen = (question as MatchScenarioQuestion).scenario;
							const actorId = selectedAction === 'defend' ? undefined : scen.keyActors?.ballCarrierId;
							const result = validateAction(
								scen,
								selectedAction === 'pass'
									? { kind: 'pass', actorId, targetId: selectedTargetPlayerId }
									: selectedAction === 'dribble'
									? { kind: 'dribble', actorId, from: scen.players.find(p => p.id === actorId)?.pos, to: selectedPoint }
									: selectedAction === 'shoot'
									? { kind: 'shoot', actorId }
									: { kind: 'defend', from: selectedPoint, to: selectedPoint }
								,
								{ allowedActions: (question as MatchScenarioQuestion).allowedActions, focusLane: scen.keyActors?.focusLane }
							);
							setFeedback(result.message ?? (result.valid ? 'Rätt!' : 'Fel'));
							if (result.xpDelta) {
								// Persist XP to store for this level
								actions.addXp(level, result.xpDelta);
								setXp((v) => v + result.xpDelta!);
							}
							if (result.valid) {
								Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
							} else {
								Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
							}
						}}
					>
						<Text style={styles.nextText}>Validera</Text>
					</Pressable>
					<Text style={styles.feedback}>{feedback}</Text>
					<Text style={styles.xp}>XP: {currentLevelXp}</Text>
					<Pressable style={styles.nextBtn} onPress={() => { setQIndex(qIndex + 1); setFeedback(''); setSelectedAction(undefined); setSelectedTargetPlayerId(undefined); setSelectedPoint(undefined); }}>
						<Text style={styles.nextText}>Nästa</Text>
					</Pressable>
					<Pressable style={styles.nextBtn} onPress={() => { setSelectedAction(undefined); setSelectedTargetPlayerId(undefined); setSelectedPoint(undefined); setFeedback('Val rensade'); }}>
						<Text style={styles.nextText}>Ångra/Rensa val</Text>
					</Pressable>
				</View>
			)}
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
	actionSection: { gap: 10 },
	feedback: { color: '#0a84ff', fontWeight: '600' },
	xp: { color: '#34c759', fontWeight: '700' },
	nextBtn: { backgroundColor: FC25.colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
	nextText: { color: '#0a0a0f', fontWeight: '800' },
});

