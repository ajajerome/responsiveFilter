import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const SESSION_TARGET = 10;

export default function QuizScreen() {
  const { level, category } = useLocalSearchParams<{ level?: Level, category?: string }>();
  const addXp = useAppStore((s) => s.actions.addXp);
  const markCompleted = useAppStore((s) => s.actions.markQuestionCompleted);
  const incCat = useAppStore((s) => s.actions.incrementCategory);
  const [queue, setQueue] = useState<Question[] | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [fetching, setFetching] = useState(false);
  const [servedCount, setServedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Animation: bounce-in on question change
  const bounce = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView | null>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    Animated.spring(bounce, { toValue: 1, friction: 6, tension: 140, useNativeDriver: true }).start();
    return () => {
      bounce.setValue(0);
    };
  }, [queue && queue[0]?.id]);

  const question: Question | null = queue && queue.length ? queue[0] : null;
  const loadingNext = fetching;

  const remaining = Math.max(0, SESSION_TARGET - servedCount - (queue?.length || 0));

  const getMore = useCallback(async () => {
    // Fetch up to remaining questions, in batches
    if (servedCount >= SESSION_TARGET) return;
    setFetching(true);
    try {
      const filter = new Set<string>(seenIds);
      const need = Math.max(0, Math.min(5, SESSION_TARGET - servedCount - (queue?.length || 0)));
      if (need > 0) {
        const more = await fetchQuestions(level ?? '5-manna', undefined, need, filter, category);
        setQueue((prev) => (prev ? [...prev, ...more] : more));
      }
    } finally {
      setFetching(false);
    }
  }, [level, category, servedCount, seenIds, queue?.length]);

  // Reset session on level/category change
  useEffect(() => {
    (async () => {
      setSeenIds(new Set());
      setServedCount(0);
      setCorrectCount(0);
      setFetching(true);
      try {
        const q = await fetchQuestions(level ?? '5-manna', undefined, Math.min(5, SESSION_TARGET), undefined, category);
        setQueue(q);
      } finally {
        setFetching(false);
      }
    })();
  }, [level, category]);

  useEffect(() => {
    // Top-up if our queue is running low and session not done
    if ((queue?.length || 0) <= 2 && servedCount < SESSION_TARGET && !fetching) {
      getMore();
    }
  }, [queue?.length, servedCount, fetching, getMore]);

  const handleAnswered = useCallback((isCorrect: boolean) => {
    setLastCorrect(isCorrect);
    // Award 1 XP per correct immediately
    if (question && isCorrect) {
      addXp(question.level, 1);
    }
    // Update category progress immediately
    if (question && category) incCat(question.level, String(category), 1);

    // Mark completed and update seen
    if (question) {
      markCompleted(question.level, question.id);
      setSeenIds((prev) => new Set(prev).add(question.id));
    }

    // Auto-advance after short delay
    setTimeout(() => {
      setLastCorrect(null);
      setQueue((prev) => {
        const next = prev && prev.length ? prev.slice(1) : prev;
        setServedCount((c) => c + 1);
        return next;
      });
    }, 700);
  }, [question, addXp, category, incCat, markCompleted]);

  // When session completes, grant bonus if perfect and restart next session automatically
  useEffect(() => {
    if (servedCount >= SESSION_TARGET) {
      if (correctCount === SESSION_TARGET) {
        // Use current level fallback if no current question
        const lvl = (question?.level as Level) || (level as Level) || '5-manna';
        addXp(lvl, 5);
      }
      // Restart session
      (async () => {
        setSeenIds(new Set());
        setServedCount(0);
        setCorrectCount(0);
        setFetching(true);
        try {
          const q = await fetchQuestions(level ?? '5-manna', undefined, Math.min(5, SESSION_TARGET), undefined, category);
          setQueue(q);
        } finally {
          setFetching(false);
        }
      })();
    }
  }, [servedCount]);

  // Track correctCount based on lastCorrect transitions
  useEffect(() => {
    if (lastCorrect === true) setCorrectCount((c) => c + 1);
  }, [lastCorrect]);

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <ScrollView ref={scrollRef} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 96 }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'flex-start', marginBottom: 8 }}>
            <XpBadge />
            <Tag label={question?.level ?? ''} />
          </View>
          <Animated.View style={{ gap: 12, transform: [{ scale: bounce.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }, { translateY: bounce.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }}>
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
            <Text style={styles.progress}>{fetching ? 'Hämtar nästa fråga…' : `Fråga ${Math.min(servedCount + 1, SESSION_TARGET)} / ${SESSION_TARGET}`}</Text>
          </Animated.View>
        </ScrollView>
        {lastCorrect !== null && (
          <View pointerEvents="box-none" style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
            <AnswerResult correct={lastCorrect} message={question?.explanation} onNext={() => handleAnswered(lastCorrect)} disabled={loadingNext} />
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: "center" },
  badge: { alignSelf: "flex-start", backgroundColor: "#eee", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  title: { fontSize: 20, fontWeight: "700" },
  option: { backgroundColor: "#f2f2f7", padding: 12, borderRadius: 8 },
  progress: { marginTop: 16, color: "#ccc" }
});