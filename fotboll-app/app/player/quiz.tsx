import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import type { PedagogyTag } from '@/app/services/aiGenerator';
import { FC25 } from '@/app/components/Theme';

const sampleQuestions = [
  { id: "q1", type: "mc", level: "5-manna", position: "mittfält", question: "Vilken yta ska mittfältaren täcka i försvar?", options: ["Centralt", "Ytterkant"], correct: 0 },
  { id: "q2", type: "drag_drop", level: "7-manna", position: "back", question: "Placera backlinjen i 2-3-1", options: ["Höger", "Vänster"], correct: 1 }
];

export default function QuizScreen() {
  const { level } = useLocalSearchParams<{ level?: string }>();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [validated, setValidated] = useState<boolean>(false);
  const q = sampleQuestions[index % sampleQuestions.length];

  const tags: PedagogyTag[] = ['beslut', 'samarbete'];
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>{level ?? q.level}</Text>
      <Text style={styles.title}>{q.question}</Text>
      <Text style={{ color: FC25.colors.subtle, marginBottom: 8 }}>UEFA: Bredda backar skapar passningsvinkel och spelbarhet.</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        {tags.map((t) => (
          <View key={t} style={styles.tag}><Text style={{ fontSize: 12 }}>#{t}</Text></View>
        ))}
      </View>
      {q.options?.map((opt, i) => (
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
          setTimeout(() => {
            setSelected(null);
            setValidated(false);
            setIndex(index + 1);
          }, 600);
        }}
      >
        <Text style={{ color: '#0a0a0f', fontWeight: '800' }}>{validated ? 'Rätt! Nästa…' : 'Validera & Nästa'}</Text>
      </Pressable>
      <Text style={styles.progress}>Fråga {index + 1}</Text>
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
