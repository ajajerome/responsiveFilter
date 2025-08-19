import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchQuestions } from "@/services/questionsApi";
import OneXTwoQuestionView from "@/components/questions/OneXTwoQuestion";
import DragDropQuestionView from "@/components/questions/DragDropQuestion";
import MultipleChoiceQuestionView from "@/components/questions/MultipleChoiceQuestion";
import MatchFreeze from "@/components/questions/MatchFreeze";
import PassQuestionView from "@/components/questions/PassQuestion";
import type { Level, Question } from "@/types/content";
import AnswerResult from "@/components/AnswerResult";

export default function QuizScreen() {
  const { level } = useLocalSearchParams<{ level?: Level }>();
  const [counter, setCounter] = useState(0);
  const [queue, setQueue] = useState<Question[] | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      const q = await fetchQuestions(level ?? '5-manna');
      setQueue(q);
    })();
  }, [level, counter]);
  const question: Question | null = queue && queue.length ? queue[0] : null;

  const handleAnswered = useCallback((isCorrect: boolean) => {
    setLastCorrect(isCorrect);
  }, []);

  const handleNext = useCallback(() => {
    // TODO: award XP, persist progress via store
    setLastCorrect(null);
    setCounter((c) => c + 1);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>{question?.level ?? ''}</Text>
      <View style={{ gap: 12 }}>
        {question && question.type === 'one_x_two' && (
          <OneXTwoQuestionView question={question} onAnswer={handleAnswered} />
        )}
        {question && question.type === 'drag_drop' && (
          <DragDropQuestionView question={question} onAnswer={handleAnswered} />
        )}
        {question && question.type === 'quiz' && (
          <MultipleChoiceQuestionView question={question} onAnswer={handleAnswered} />
        )}
        {question && question.type === 'matchscenario' && 'ball' in question && 'correctPlayerIds' in question && (
          <MatchFreeze question={question as any} onAnswer={handleAnswered} />
        )}
        {question && question.type === 'matchscenario' && 'ballHolderId' in question && (
          <PassQuestionView question={question as any} onAnswer={handleAnswered} />
        )}
        {lastCorrect !== null && (
          <AnswerResult correct={lastCorrect} message={question?.explanation} onNext={handleNext} />
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
