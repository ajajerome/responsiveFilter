import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';
import Screen from '@/app/components/Screen';

export default function Train() {
  const router = useRouter();
  const dayPlan = useAppStore((s) => s.dayPlan);
  const actions = useAppStore((s) => s.actions);
  useEffect(() => { actions.ensureDayPlan(); }, []);
  const [choice, setChoice] = useState<'quiz'|'interactive'|null>(null);
  const remaining = useMemo(() => {
    const totals = dayPlan?.totals ?? { interactive: 4, quiz: 4, quick: 2 };
    const done = dayPlan?.done ?? { interactive: 0, quiz: 0, quick: 0 };
    return {
      interactive: Math.max(0, totals.interactive - done.interactive),
      quiz: Math.max(0, totals.quiz - done.quiz),
    };
  }, [dayPlan]);

  return (
    <Screen>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Dagens mål</Text>
      <Text style={{ color: FC25.colors.subtle }}>Interaktivt kvar: {remaining.interactive} • Quiz kvar: {remaining.quiz}</Text>
      <Pressable style={[styles.btn, { backgroundColor: FC25.colors.primary }]} onPress={() => {
        // Fallback: always quiz for stability
        setChoice('quiz');
        router.push('/player/quiz');
      }}>
        <Text style={styles.btnText}>Starta pass</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800' },
  btn: { alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  btnText: { color: '#0a0a0f', fontWeight: '800' },
});

