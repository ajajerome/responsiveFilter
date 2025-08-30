import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { QUESTIONS } from '@/data/questions';
import type { Level, Question, MatchScenarioQuestion } from '@/types/content';
import PitchView from '@/app/components/PitchView';
import ActionBar from '@/app/components/ActionBar';
import { FC25 } from '@/app/components/Theme';
import { validateAction, getAllowedPassTargets, scoreSequenceStep } from '@/app/services/scenarioEngine';
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
	const [age, setAge] = useState<number>(9);
	const [showAgeControls, setShowAgeControls] = useState<boolean>(false);
	const level = useMemo(() => deriveLevelFromAge(age), [age]);
	const ageTier = useMemo(() => deriveAgeTier(age), [age]);
    const { actions, progress } = useAppStore((s) => ({ actions: s.actions, progress: s.progress }));
	const limits: any = useAppStore((s: any) => (s as any).limits);

	const relevantQuestions: Question[] = useMemo(() => {
		return QUESTIONS.filter((q) => q.level === level);
	}, [level]);

	const SESSION_LENGTH = 5;
	const [qIndex, setQIndex] = useState(0);
	const [sessionCount, setSessionCount] = useState(0);
	const [sessionDone, setSessionDone] = useState(false);
	const question = relevantQuestions[qIndex % Math.max(1, relevantQuestions.length)];
	const [feedback, setFeedback] = useState<string>('');
	const [xp, setXp] = useState<number>(0);
	const currentLevelXp = progress[level]?.xp ?? 0;
	const [selectedAction, setSelectedAction] = useState<ActionType | undefined>();
	const [selectedTargetPlayerId, setSelectedTargetPlayerId] = useState<string | undefined>();
	const [selectedPoint, setSelectedPoint] = useState<Vector2 | undefined>();
	const [stepIndex, setStepIndex] = useState<number>(0);

	// Limits
	const now = new Date();
	const hour = now.getHours();
	const maxPerDay = limits?.maxScenariosPerDay ?? 10;
	const scenariosToday = limits?.scenariosToday ?? 0;
	const curfew = limits?.curfew ?? { startHour: 7, endHour: 20 };
	const isCurfew = hour < curfew.startHour || hour >= curfew.endHour;

	return (
		<ScrollView contentContainerStyle={[styles.container, { backgroundColor: FC25.colors.bg }] }>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<Text style={[styles.title, { color: FC25.colors.text }]}>Matchscenario – Interaktivt läge</Text>
				<Pressable onPress={() => setShowAgeControls(!showAgeControls)}>
					<Text style={{ color: FC25.colors.subtle }}>{showAgeControls ? 'Dölj ålder' : 'Ålder'}</Text>
				</Pressable>
			</View>
			<Text style={[styles.subtitle, { color: FC25.colors.subtle }]}>Ålder: {age} ({ageTier}) • Nivå: {level}</Text>
			{showAgeControls && (
				<View style={styles.ageControls}>
					{[7, 8, 9, 10, 11, 12, 13].map((a) => (
						<Pressable key={a} style={[styles.ageButton, age === a && styles.ageButtonActive]} onPress={() => setAge(a)}>
							<Text style={[styles.ageButtonText, age === a && styles.ageButtonTextActive]}>{a}</Text>
						</Pressable>
					))}
				</View>
			)}

			<View style={{ backgroundColor: FC25.colors.card, borderRadius: FC25.radius, padding: 8, borderWidth: 1, borderColor: FC25.colors.border }}>
				<Text style={{ color: FC25.colors.text, fontWeight: '700' }}>XP: {currentLevelXp}</Text>
			</View>

			{sessionDone && (
				<View style={{ backgroundColor: FC25.colors.card, borderRadius: FC25.radius, padding: 16, borderWidth: 1, borderColor: FC25.colors.border, alignItems: 'center', gap: 8 }}>
					<Text style={{ color: FC25.colors.text, fontSize: 18, fontWeight: '800' }}>Session klar!</Text>
					<Text style={{ color: FC25.colors.subtle }}>Bra jobbat! Du klarade {SESSION_LENGTH} scenarier.</Text>
					<Pressable style={styles.nextBtn} onPress={() => { setSessionDone(false); setSessionCount(0); setQIndex(0); setFeedback(''); setSelectedAction(undefined); setSelectedTargetPlayerId(undefined); setSelectedPoint(undefined); setStepIndex(0); }}>
						<Text style={styles.nextText}>Spela igen</Text>
					</Pressable>
				</View>
			)}

			{(isCurfew || scenariosToday >= maxPerDay) ? (
				<View style={{ backgroundColor: FC25.colors.card, borderRadius: FC25.radius, padding: 16, borderWidth: 1, borderColor: FC25.colors.border, gap: 8 }}>
					<Text style={{ color: FC25.colors.text, fontWeight: '800', fontSize: 18 }}>{isCurfew ? 'Dags att vila' : 'Dagens gräns nådd'}</Text>
					<Text style={{ color: FC25.colors.subtle }}>
						{isCurfew ? 'Det är sent – sömn hjälper kroppen att växa och bli starkare.' : 'Bra jobbat idag! Fortsätt i morgon för att bli ännu bättre.'}
					</Text>
				</View>
			) : question?.type === 'matchscenario' ? (
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

			<View style={[styles.questionBox, { backgroundColor: FC25.colors.card, borderColor: FC25.colors.border }] }>
				<Text style={[styles.questionTitle, { color: FC25.colors.text }]}>{question?.question ?? 'Inga frågor tillgängliga för denna nivå ännu.'}</Text>
				{(question as any)?.options && (
					<View style={styles.options}>
						{(question as any).options.map((opt: string, i: number) => (
							<Pressable key={i} style={styles.option} onPress={() => setQIndex(qIndex + 1)}>
								<Text style={{ color: FC25.colors.text }}>{opt}</Text>
							</Pressable>
						))}
					</View>
				)}
				{!question && (
					<Text style={[styles.noQuestions, { color: FC25.colors.subtle }]}>Lägg till frågor i data/questions.ts för nivån {level}.</Text>
				)}
			</View>

			{question?.type === 'matchscenario' && !isCurfew && scenariosToday < maxPerDay && (
				<View style={styles.actionSection}>
					{/* HUD + Step indicator */}
					{(() => {
						const scen = (question as MatchScenarioQuestion).scenario;
						const actor = scen.players.find(p => p.id === scen.keyActors?.ballCarrierId);
						const seq = (question as MatchScenarioQuestion).sequence;
						const currentStep = seq?.steps?.[stepIndex];
						return (
							<View style={{ gap: 6 }}>
								<Text style={{ color: FC25.colors.text }}>Bollhållare: {actor?.role ?? 'okänd'} • Lane: {scen.keyActors?.focusLane ?? '-'}</Text>
								{seq && (
									<View style={styles.stepBar}>
										<Text style={styles.stepText}>Steg {stepIndex + 1}/{seq.steps.length}</Text>
										{currentStep?.hint && <Text style={styles.hintText}>Hint: {currentStep.hint}</Text>}
									</View>
								)}
							</View>
						);
					})()}

					<ActionBar
						allowed={(() => {
							const seq = (question as MatchScenarioQuestion).sequence;
							const expected = seq?.steps?.[stepIndex]?.expected as ActionType | undefined;
							return expected ? [expected] : (question as MatchScenarioQuestion).allowedActions;
						})()}
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
							const act = selectedAction === 'pass'
								? ({ kind: 'pass', actorId, targetId: selectedTargetPlayerId } as const)
								: selectedAction === 'dribble'
								? ({ kind: 'dribble', actorId, from: (scen.players.find(p => p.id === actorId)?.pos as Vector2), to: (selectedPoint as Vector2) } as const)
								: selectedAction === 'shoot'
								? ({ kind: 'shoot', actorId } as const)
								: ({ kind: 'defend', from: (selectedPoint as Vector2), to: (selectedPoint as Vector2) } as const);
							const seq = (question as MatchScenarioQuestion).sequence;
							const result = seq
								? scoreSequenceStep(scen, seq, stepIndex, act as any, { allowedActions: (question as MatchScenarioQuestion).allowedActions, focusLane: scen.keyActors?.focusLane })
								: validateAction(scen, act as any, { allowedActions: (question as MatchScenarioQuestion).allowedActions, focusLane: scen.keyActors?.focusLane });
							setFeedback(result.message ?? (result.valid ? 'Rätt!' : 'Fel'));
							if (result.xpDelta) {
								// Persist XP to store for this level
								actions.addXp(level, result.xpDelta);
								setXp((v) => v + result.xpDelta!);
							}
							if (result.valid) {
								Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
								if (seq) {
									const next = stepIndex + 1;
									if (next < seq.steps.length) {
										setStepIndex(next);
										setSelectedAction(undefined);
										setSelectedTargetPlayerId(undefined);
										setSelectedPoint(undefined);
									} else {
										setFeedback('Sekvens klar!');
									}
								}
							} else {
								Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
							}
						}}
					>
						<Text style={styles.nextText}>Validera</Text>
					</Pressable>
					<Text style={[styles.feedback, { color: FC25.colors.success }]}>{feedback}</Text>
					<Text style={[styles.xp, { color: FC25.colors.success }]}>XP: {currentLevelXp}</Text>
					<Pressable style={styles.nextBtn} onPress={() => { const nextCount = sessionCount + 1; setSessionCount(nextCount); actions.incrementScenarioCount(); if (nextCount >= SESSION_LENGTH) { setSessionDone(true); } setQIndex(qIndex + 1); setFeedback(''); setSelectedAction(undefined); setSelectedTargetPlayerId(undefined); setSelectedPoint(undefined); setStepIndex(0); }}>
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
	stepBar: { backgroundColor: FC25.colors.card, borderRadius: 10, padding: 8, borderWidth: 1, borderColor: FC25.colors.border },
	stepText: { color: FC25.colors.text, fontWeight: '700' },
	hintText: { color: FC25.colors.warning },
});

