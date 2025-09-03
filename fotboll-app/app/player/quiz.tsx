import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useMemo, useState, useEffect } from "react";
import type { PedagogyTag } from '@/app/services/aiGenerator';
import { FC25 } from '@/app/components/Theme';
import { QUESTIONS } from '@/data/questions';
import { useAppStore } from '@/store/useAppStore';

export default function QuizScreen() {
  const { level } = useLocalSearchParams<{ level?: string }>();
  const profileAge = useAppStore((s) => s.profile.age ?? 10);
  const actions = useAppStore((s) => s.actions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [validated, setValidated] = useState<boolean>(false);

  useEffect(() => {
    try { actions.ensureDayPlan(); } catch {}
  }, []);

  const quizBank = useMemo(() => {
    const all = QUESTIONS.filter((qq: any) => qq.type === 'quiz');
    const preferredLevel = profileAge <= 8 ? '5-manna' : profileAge <= 11 ? '7-manna' : '9-manna';
    const prioritized = all.filter((q: any) => q.level === preferredLevel);
    const rest = all.filter((q: any) => q.level !== preferredLevel);
    return [...prioritized, ...rest];
  }, [profileAge]);

  const q = quizBank.length > 0 ? (quizBank[(index % quizBank.length)] as any) : null;

  const tags: PedagogyTag[] = ['beslut', 'samarbete'];
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>{level ?? q?.level ?? ''}</Text>
      <Text style={styles.title}>{q?.question ?? 'Inga frågor tillgängliga'}</Text>
      {!!q?.microInfo && (
        <Text style={{ color: FC25.colors.subtle, marginBottom: 8 }}>{q.microInfo}</Text>
      )}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        {tags.map((t) => (
          <View key={t} style={styles.tag}><Text style={{ fontSize: 12 }}>#{t}</Text></View>
        ))}
      </View>
      {q?.options?.map((opt: string, i: number) => (
        <Pressable
          key={i}
          style={[styles.option, {
            backgroundColor: selected === i ? FC25.colors.primary : '#1b1c22',
            borderColor: selected === i ? FC25.colors.border : '#2a2b33',
          }]}
          onPress={() => setSelected(i)}
        >
          <Text style={{ color: selected === i ? '#0a0a0f' : FC25.colors.text }}>{opt}</Text>
        </Pressable>
      ))}
      <Pressable
        style={[styles.cta, { backgroundColor: selected !== null ? FC25.colors.primary : '#2b2c33' }]}
        disabled={selected === null}
        onPress={() => {
          try {
            if (selected === null || !q) return;
            setValidated(true);
            try { actions.markDone('quiz'); } catch {}
            setTimeout(() => {
              try {
                setSelected(null);
                setValidated(false);
                setIndex((prev) => prev + 1);
              } catch {}
            }, 300);
          } catch {}
        }}
      >
        <Text style={{ color: '#0a0a0f', fontWeight: '800' }}>{validated ? 'Rätt! Nästa…' : 'Validera & Nästa'}</Text>
      </Pressable>
      <Text style={styles.progress}>Fråga {Math.min(index + 1, Math.max(quizBank.length, 1))} av {Math.max(quizBank.length, 1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: "center", backgroundColor: FC25.colors.bg },
  badge: { alignSelf: "flex-start", backgroundColor: "#eee", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  title: { fontSize: 20, fontWeight: "700", color: FC25.colors.text },
  tag: { backgroundColor: "#e6f7ff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: "#b3e0ff" },
  option: { padding: 12, borderRadius: 10, borderWidth: 1 },
  cta: { marginTop: 8, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  progress: { marginTop: 16, color: FC25.colors.subtle }
});
