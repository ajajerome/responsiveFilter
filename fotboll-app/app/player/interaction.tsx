import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { QUESTIONS } from '@/data/questions';
import { generateScenarioFor } from '@/app/services/aiGenerator';
import type { Level, Question, MatchScenarioQuestion } from '@/types/content';
import { PitchView } from '@/app/components/PitchView';
import ActionBar from '@/app/components/ActionBar';
import { FC25 } from '@/app/components/Theme';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import { validateAction, getAllowedPassTargets, scoreSequenceStep } from '@/app/services/scenarioEngine';
import type { ActionType } from '@/types/content';
import type { Vector2 } from '@/types/scenario';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '@/store/useAppStore';
import { useLocalSearchParams } from 'expo-router';

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
	// Fixed demo age
	const age = 9;
	const level = useMemo(() => deriveLevelFromAge(age), [age]);
	const ageTier = useMemo(() => deriveAgeTier(age), [age]);
    const { actions, progress } = useAppStore((s) => ({ actions: s.actions, progress: s.progress }));
    const { safe } = useLocalSearchParams<{ safe?: string }>();
    const safeMode = safe === '1';
    const enableHaptics = !safeMode;

	function isValidScenario(s: any): boolean {
		return !!s && Array.isArray(s.players) && s.players.length >= 3 && !!s.ball && !!s.level;
	}

	const FALLBACK: MatchScenarioQuestion = {
		id: 'fallback-7m-01',
		type: 'matchscenario',
		level: '7-manna',
		position: 'mittfält',
		question: 'Snabbt anfall: pass inåt och avslut',
		scenario: {
			level: '7-manna', attacking: 'home', possession: 'home',
			players: [
				{ id: 'h-gk', role: 'GK', team: 'home', pos: { x: 8, y: 50 } },
				{ id: 'h-lm', role: 'LM', team: 'home', pos: { x: 42, y: 28 } },
				{ id: 'h-cm', role: 'CM', team: 'home', pos: { x: 50, y: 50 } },
				{ id: 'h-rm', role: 'RM', team: 'home', pos: { x: 42, y: 72 } },
				{ id: 'h-st', role: 'ST', team: 'home', pos: { x: 72, y: 50 } },
				{ id: 'a-gk', role: 'GK', team: 'away', pos: { x: 92, y: 50 } },
				{ id: 'a-cb', role: 'CB', team: 'away', pos: { x: 80, y: 50 } },
			],
			ball: { pos: { x: 42, y: 72 } },
			keyActors: { ballCarrierId: 'h-rm', focusLane: 'right' }
		} as any,
		allowedActions: ['pass', 'shoot'],
		sequence: { steps: [
			{ expected: 'pass', hint: 'Spela inåt till CM/ST i ficka', xpBonus: 2 },
			{ expected: 'shoot', hint: 'Avsluta snabbt', xpBonus: 3 },
		]},
	};

	// Always use the fallback scenario for demo, but prefer AI stub when profile age exists
	const playerAge = useAppStore((s) => s.profile.age ?? age);
	const sourceQuestion: MatchScenarioQuestion = FALLBACK;
	const scenario = isValidScenario(sourceQuestion.scenario) ? sourceQuestion.scenario : FALLBACK.scenario;
	const seq = sourceQuestion.sequence;
	const allowed = sourceQuestion.allowedActions;
	const questionText = sourceQuestion.question;

	const SESSION_LENGTH = 5;
	const [qIndex, setQIndex] = useState(0);
	const [sessionCount, setSessionCount] = useState(0);
	const [sessionDone, setSessionDone] = useState(false);
	const [feedback, setFeedback] = useState<string>('');
	const [xp, setXp] = useState<number>(0);
	const currentLevelXp = progress[level]?.xp ?? 0;
	const [selectedAction, setSelectedAction] = useState<ActionType | undefined>();
	const [selectedTargetPlayerId, setSelectedTargetPlayerId] = useState<string | undefined>();
	const [selectedPoint, setSelectedPoint] = useState<Vector2 | undefined>();
	const [stepIndex, setStepIndex] = useState<number>(0);

	return (
		<ScrollView contentContainerStyle={[styles.container]} style={{ backgroundColor: FC25.colors.bg }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<Text style={[styles.title, { color: FC25.colors.text }]}>Matchscenario – Interaktivt läge</Text>
			</View>
			<Text style={[styles.subtitle, { color: FC25.colors.subtle }]}>Ålder: {age} ({ageTier}) • Nivå: {level} • Fallback: {isValidScenario(sourceQuestion.scenario) ? 'Nej' : 'Ja'}</Text>

			<ErrorBoundary fallback={<View style={{ padding: 12 }}><Text style={{ color: FC25.colors.warning }}>Kunde inte rendera planen.</Text></View>}>
			{safeMode ? (
				<View style={[styles.questionBox, { backgroundColor: FC25.colors.card, borderColor: FC25.colors.border }]}>
					<Text style={[styles.questionTitle, { color: FC25.colors.text }]}>Säkert läge – planen är tillfälligt avstängd.</Text>
				</View>
			) : (
			<PitchView
				scenario={scenario}
				selectable
				highlightPlayerIds={(() => {
					if (selectedAction === 'pass') {
						return getAllowedPassTargets(scenario as any, (scenario as any).keyActors?.ballCarrierId, { focusLane: (scenario as any).keyActors?.focusLane });
					}
					return selectedTargetPlayerId ? [selectedTargetPlayerId] : [];
				})()}
				selectedPoint={selectedPoint}
				ghostPath={selectedAction === 'dribble' && selectedPoint ? { from: ((scenario as any).players.find((p: any) => p.id === (scenario as any).keyActors?.ballCarrierId)?.pos as Vector2), to: selectedPoint } : undefined}
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
			)}
			</ErrorBoundary>

			<View style={[styles.questionBox, { backgroundColor: FC25.colors.card, borderColor: FC25.colors.border }] }>
				<Text style={[styles.questionTitle, { color: FC25.colors.text }]}>{questionText}</Text>
			</View>

			<View style={styles.actionSection}>
				{(() => {
					const actor = (scenario as any).players.find((p: any) => p.id === (scenario as any).keyActors?.ballCarrierId);
					const currentStep = seq?.steps?.[stepIndex];
					return (
						<View style={{ gap: 6 }}>
							<Text style={{ color: FC25.colors.text }}>Bollhållare: {actor?.role ?? 'okänd'} • Lane: {(scenario as any).keyActors?.focusLane ?? '-'}</Text>
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
						const expected = seq?.steps?.[stepIndex]?.expected as ActionType | undefined;
						return expected ? [expected] : allowed;
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
						if (!selectedAction) return;
						const actorId = selectedAction === 'defend' ? undefined : (scenario as any).keyActors?.ballCarrierId;
						const act = selectedAction === 'pass'
							? ({ kind: 'pass', actorId, targetId: selectedTargetPlayerId } as const)
							: selectedAction === 'dribble'
							? ({ kind: 'dribble', actorId, from: (((scenario as any).players.find((p: any) => p.id === actorId)?.pos) as Vector2), to: (selectedPoint as Vector2) } as const)
							: selectedAction === 'shoot'
							? ({ kind: 'shoot', actorId } as const)
							: ({ kind: 'defend', from: (selectedPoint as Vector2), to: (selectedPoint as Vector2) } as const);
						const result = seq
							? scoreSequenceStep(scenario as any, seq, stepIndex, act as any, { allowedActions: allowed as any, focusLane: (scenario as any).keyActors?.focusLane })
							: validateAction(scenario as any, act as any, { allowedActions: allowed as any, focusLane: (scenario as any).keyActors?.focusLane });
						setFeedback(result.message ?? (result.valid ? 'Rätt!' : 'Fel'));
						if (result.xpDelta) {
							actions.addXp(level, result.xpDelta);
							setXp((v) => v + result.xpDelta!);
						}
						if (result.valid) {
							if (enableHaptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
							if (enableHaptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

