import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchQuestions } from "@/services/questionsApi";
import OneXTwoQuestionView from "@/components/questions/OneXTwoQuestion";
import DragDropQuestionView from "@/components/questions/DragDropQuestion";
import MultipleChoiceQuestionView from "@/components/questions/MultipleChoiceQuestion";
import MatchFreeze from "@/components/questions/MatchFreeze";
import PassQuestionView from "@/components/questions/PassQuestion";
import FormationQuiz from "@/components/questions/FormationQuiz";
import type { Level, Question } from "@/types/content";
import { useAppStore } from "@/store/useAppStore";
import AnswerResult from "@/components/AnswerResult";
import XpBadge from "@/components/ui/XpBadge";
import Tag from "@/components/ui/Tag";
import Screen from "@/components/ui/Screen";

export default function QuizScreen() {
  const { level, category } = useLocalSearchParams<{ level?: Level, category?: string }>();
  const addXp = useAppStore((s) => s.actions.addXp);
  const markCompleted = useAppStore((s) => s.actions.markQuestionCompleted);
  const incCat = useAppStore((s) => s.actions.incrementCategory);
  const [counter, setCounter] = useState(0);
  const [queue, setQueue] = useState<Question[] | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    (async () => {
      // Reset session when level changes
      setSeenIds(new Set());
      const q = await fetchQuestions(level ?? '5-manna', undefined, 5, undefined, category);
      setQueue(q);
    })();
  }, [level]);
  const question: Question | null = queue && queue.length ? queue[0] : null;
  const loadingNext = !question;

  const handleAnswered = useCallback((isCorrect: boolean) => {
    setLastCorrect(isCorrect);
  }, []);

  const handleNext = useCallback(() => {
    if (question) {
      if (lastCorrect) addXp(question.level, 10);
      markCompleted(question.level, question.id);
      if (category) incCat(question.level, String(category), 1);
      const updated = new Set(seenIds);
      updated.add(question.id);
      setSeenIds(updated);
    }
    setLastCorrect(null);
    setQueue((prev) => {
      const next = prev && prev.length ? prev.slice(1) : prev;
      if (!next || next.length === 0) {
        const filter = question ? new Set(seenIds).add(question.id) : seenIds;
        fetchQuestions(level ?? '5-manna', undefined, 5, filter, category).then((q) => {
          if (q && q.length > 0) setQueue(q);
          else {
            // fallback: try without filter after small delay
            setTimeout(() => {
              fetchQuestions(level ?? '5-manna', undefined, 5, undefined, category).then(setQueue);
            }, 200);
          }
        });
      }
      return next;
    });
  }, [question, lastCorrect, addXp, markCompleted, level, seenIds, category, incCat]);

  return (
    <Screen>
      <XpBadge />
      <Tag label={question?.level ?? ''} />
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
        {question && question.type === 'formation_quiz' && (
          <FormationQuiz question={question as any} onAnswer={handleAnswered} />
        )}
        {question && question.type === 'matchscenario' && 'ball' in question && 'correctPlayerIds' in question && (
          <MatchFreeze question={question as any} onAnswer={handleAnswered} />
        )}
        {question && question.type === 'matchscenario' && 'ballHolderId' in question && (
          <PassQuestionView question={question as any} onAnswer={handleAnswered} />
        )}
        {lastCorrect !== null && (
          <AnswerResult correct={lastCorrect} message={question?.explanation} onNext={handleNext} disabled={loadingNext} />
        )}
      </View>
      <Text style={styles.progress}>Fortsätter automatiskt vid svar</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: "center" },
  badge: { alignSelf: "flex-start", backgroundColor: "#eee", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  title: { fontSize: 20, fontWeight: "700" },
  option: { backgroundColor: "#f2f2f7", padding: 12, borderRadius: 8 },
  progress: { marginTop: 16, color: "#666" }
});