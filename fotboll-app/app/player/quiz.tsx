import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import type { PedagogyTag } from '@/app/services/aiGenerator';

const sampleQuestions = [
  { id: "q1", type: "mc", level: "5-manna", position: "mittfält", question: "Vilken yta ska mittfältaren täcka i försvar?", options: ["Centralt", "Ytterkant"], correct: 0 },
  { id: "q2", type: "drag_drop", level: "7-manna", position: "back", question: "Placera backlinjen i 2-3-1", options: ["Höger", "Vänster"], correct: 1 }
];

export default function QuizScreen() {
  const { level } = useLocalSearchParams<{ level?: string }>();
  const [index, setIndex] = useState(0);
  const q = sampleQuestions[index % sampleQuestions.length];

  const tags: PedagogyTag[] = ['beslut', 'samarbete'];
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>{level ?? q.level}</Text>
      <Text style={styles.title}>{q.question}</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        {tags.map((t) => (
          <View key={t} style={styles.tag}><Text style={{ fontSize: 12 }}>#{t}</Text></View>
        ))}
      </View>
      {q.options?.map((opt, i) => (
        <Pressable key={i} style={styles.option} onPress={() => setIndex(index + 1)}>
          <Text>{opt}</Text>
        </Pressable>
      ))}
      <Text style={styles.progress}>Fråga {index + 1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: "center" },
  badge: { alignSelf: "flex-start", backgroundColor: "#eee", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  title: { fontSize: 20, fontWeight: "700" },
  tag: { backgroundColor: "#e6f7ff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: "#b3e0ff" },
  option: { backgroundColor: "#f2f2f7", padding: 12, borderRadius: 8 },
  progress: { marginTop: 16, color: "#666" }
});
