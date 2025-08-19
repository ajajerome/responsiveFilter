import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useCallback, useMemo, useState } from "react";
import { getRandomQuestion } from "@/engine/generator";
import OneXTwoQuestionView from "@/components/questions/OneXTwoQuestion";
import DragDropQuestionView from "@/components/questions/DragDropQuestion";
import type { Level, Question } from "@/types/content";

export default function QuizScreen() {
  const { level } = useLocalSearchParams<{ level?: Level }>();
  const [counter, setCounter] = useState(0);
  const question: Question = useMemo(() => getRandomQuestion(level ?? '5-manna'), [counter, level]);

  const handleAnswered = useCallback((isCorrect: boolean) => {
    // TODO: award XP, persist progress via store
    setCounter((c) => c + 1);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>{question.level}</Text>
      <View style={{ gap: 12 }}>
        {question.type === 'one_x_two' && (
          <OneXTwoQuestionView question={question} onAnswer={handleAnswered} />
        )}
        {question.type === 'drag_drop' && (
          <DragDropQuestionView question={question} onAnswer={handleAnswered} />
        )}
        {question.type === 'quiz' && (
          // Fallback: rendera enkla flervalsfrågor
          <View style={{ gap: 8 }}>
            <Text style={styles.title}>{question.question}</Text>
          </View>
        )}
      </View>
      <Text style={styles.progress}>Fortsätter automatiskt vid svar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: "center" },
  badge: { alignSelf: "flex-start", backgroundColor: "#eee", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  title: { fontSize: 20, fontWeight: "700" },
  option: { backgroundColor: "#f2f2f7", padding: 12, borderRadius: 8 },
  progress: { marginTop: 16, color: "#666" }
});
