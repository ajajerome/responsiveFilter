import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useMemo, useState } from "react";
import { QUESTIONS } from "@/data/questions";
import type { Level, Question } from "@/types/content";
import { useAppStore } from "@/store/useAppStore";

export default function QuizScreen() {
  const { level } = useLocalSearchParams<{ level?: string }>();
  const [index, setIndex] = useState(0);
  const selectedLevel: Level | undefined = (level as Level) ?? undefined;

  const { progress, actions } = useAppStore((s) => ({ progress: s.progress, actions: s.actions }));

  const questionsForLevel: Question[] = useMemo(() => {
    const pool = selectedLevel ? QUESTIONS.filter((q) => q.level === selectedLevel) : QUESTIONS;
    return pool;
  }, [selectedLevel]);

  const currentQuestion = questionsForLevel[index % (questionsForLevel.length || 1)];

  const handleAnswer = (optionIndex?: number) => {
    if (!currentQuestion) return;
    const effectiveLevel: Level = selectedLevel ?? currentQuestion.level;

    if (currentQuestion.type === 'quiz') {
      const isCorrect = optionIndex === currentQuestion.correctIndex;
      if (isCorrect) {
        actions.addXp(effectiveLevel, 10);
        actions.markQuestionCompleted(effectiveLevel, currentQuestion.id);
        // Simple unlock rule: reaching 30 XP unlocks next level
        const xpNow = (progress[effectiveLevel]?.xp ?? 0) + 10;
        if (effectiveLevel === '5-manna' && xpNow >= 30) {
          actions.unlockLevel('7-manna');
        }
        if (effectiveLevel === '7-manna' && xpNow >= 30) {
          actions.unlockLevel('9-manna');
        }
      }
    } else {
      // For non-quiz types in this demo, just progress forward without XP.
      actions.markQuestionCompleted(effectiveLevel, currentQuestion.id);
    }

    setIndex((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      {currentQuestion ? (
        <>
          <Text style={styles.badge}>{selectedLevel ?? currentQuestion.level}</Text>
          <Text style={styles.title}>{currentQuestion.question}</Text>
          {currentQuestion.type === 'quiz' && currentQuestion.options?.map((opt, i) => (
            <Pressable key={i} style={styles.option} onPress={() => handleAnswer(i)}>
              <Text>{opt}</Text>
            </Pressable>
          ))}
          {currentQuestion.type !== 'quiz' && (
            <Pressable style={styles.option} onPress={() => handleAnswer()}>
              <Text>Fortsätt</Text>
            </Pressable>
          )}
          <Text style={styles.progress}>Fråga {index + 1} av {questionsForLevel.length || 1}</Text>
        </>
      ) : (
        <Text>Inga frågor tillgängliga.</Text>
      )}
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
