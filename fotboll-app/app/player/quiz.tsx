import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useMemo, useState } from "react";
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

  const quizBank = useMemo(() => {
    const all = QUESTIONS.filter((qq: any) => qq.type === 'quiz');
    // Optionally bias by age -> level mapping
    const preferredLevel = profileAge <= 8 ? '5-manna' : profileAge <= 11 ? '7-manna' : '9-manna';
    const prioritized = all.filter((q: any) => q.level === preferredLevel);
    const rest = all.filter((q: any) => q.level !== preferredLevel);
    return [...prioritized, ...rest];
  }, [profileAge]);

  const q = quizBank[(index % Math.max(quizBank.length, 1))] as any;

  const tags: PedagogyTag[] = ['beslut', 'samarbete'];
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>{level ?? q?.level}</Text>
      <Text style={styles.title}>{q?.question}</Text>
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
          if (selected === null) return;
          setValidated(true);
          actions.markDone('quiz');
          setTimeout(() => {
            setSelected(null);
            setValidated(false);
            setIndex(index + 1);
          }, 600);
        }}
      >
        <Text style={{ color: '#0a0a0f', fontWeight: '800' }}>{validated ? 'Rätt! Nästa…' : 'Validera & Nästa'}</Text>
      </Pressable>
      <Text style={styles.progress}>Fråga {index + 1} av {quizBank.length}</Text>
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
