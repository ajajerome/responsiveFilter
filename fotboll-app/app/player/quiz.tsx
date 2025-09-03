import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { useMemo, useState, useEffect, useRef } from "react";
import type { PedagogyTag } from '@/app/services/aiGenerator';
import { FC25 } from '@/app/components/Theme';
import { QUESTIONS } from '@/data/questions';
import { useAppStore } from '@/store/useAppStore';
import { adjustToneByAge } from '@/app/services/aiGenerator';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function QuizScreen() {
  const { level } = useLocalSearchParams<{ level?: string }>();
  const profileAge = useAppStore((s) => s.profile.age ?? 10);
  const actions = useAppStore((s) => s.actions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [validated, setValidated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const ctaAnim = useRef(new Animated.Value(0)).current; // 0=base, 1=coral

  useEffect(() => { try { actions.ensureDayPlan(); } catch {} }, []);

  useEffect(() => {
    const wrong = validated && isCorrect === false;
    Animated.timing(ctaAnim, { toValue: wrong ? 1 : 0, duration: 220, useNativeDriver: false }).start();
  }, [validated, isCorrect, ctaAnim]);

  const quizBank = useMemo(() => {
    const all = QUESTIONS.filter((qq: any) => qq.type === 'quiz');
    const preferredLevel = profileAge <= 8 ? '5-manna' : profileAge <= 11 ? '7-manna' : '9-manna';
    const prioritized = all.filter((q: any) => q.level === preferredLevel);
    const rest = all.filter((q: any) => q.level !== preferredLevel);
    return [...prioritized, ...rest];
  }, [profileAge]);

  const q = quizBank.length > 0 ? (quizBank[(index % quizBank.length)] as any) : null;

  const tags: PedagogyTag[] = ['beslut', 'samarbete'];
  const baseColor = selected !== null ? FC25.colors.primary : '#2b2c33';
  const ctaBg = ctaAnim.interpolate({ inputRange: [0, 1], outputRange: [baseColor, '#ff5061'] });

  function getCorrectIndex(question: any): number {
    const raw = question?.correctIndex ?? question?.correct;
    const n = typeof raw === 'string' ? parseInt(raw, 10) : raw;
    const idx = Number.isFinite(n) ? (n as number) : -1;
    const len = Array.isArray(question?.options) ? question.options.length : 0;
    return idx >= 0 && idx < len ? idx : -1;
  }

  const disableCta = selected === null || (validated && isCorrect === false);

  const displayQuestion = adjustToneByAge(q?.question ?? 'Inga frågor tillgängliga', profileAge);
  const displayMicro = q?.microInfo ? adjustToneByAge(q.microInfo, profileAge) : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>{level ?? q?.level ?? ''}</Text>
      <Text style={styles.title}>{displayQuestion}</Text>
      {!!displayMicro && (<Text style={{ color: FC25.colors.subtle, marginBottom: 8 }}>{displayMicro}</Text>)}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        {tags.map((t) => (<View key={t} style={styles.tag}><Text style={{ fontSize: 12 }}>#{t}</Text></View>))}
      </View>
      {q?.options?.map((opt: string, i: number) => (
        <Pressable
          key={i}
          style={[styles.option, {
            backgroundColor: selected === i && isCorrect === true ? FC25.colors.primary : '#1b1c22',
            borderColor: selected === i && validated && isCorrect === false ? FC25.colors.warning : (selected === i && isCorrect === true ? FC25.colors.border : '#2a2b33'),
          }]}
          onPress={() => { setSelected(i); if (validated || isCorrect !== null) { setValidated(false); setIsCorrect(null); } }}
        >
          <Text style={{ color: selected === i && isCorrect === true ? '#0a0a0f' : FC25.colors.text }}>{opt}</Text>
        </Pressable>
      ))}
      <AnimatedPressable
        style={[styles.cta, { backgroundColor: ctaBg }]}
        disabled={disableCta}
        onPress={() => {
          try {
            if (selected === null || !q) return;
            const ci = getCorrectIndex(q);
            const ok = selected === ci;
            setValidated(true);
            setIsCorrect(ok);
            if (ok) {
              try { actions.markDone('quiz'); } catch {}
              setTimeout(() => { try { setSelected(null); setValidated(false); setIsCorrect(null); setIndex((prev) => prev + 1); } catch {} }, 350);
            }
          } catch {}
        }}
      >
        <Text style={{ color: '#0a0a0f', fontWeight: '800' }}>{validated ? (isCorrect ? 'Rätt! Nästa…' : 'Inte helt rätt – försök igen') : 'Validera'}</Text>
      </AnimatedPressable>
      {validated && isCorrect === false && (
        <Text style={{ marginTop: 6, color: FC25.colors.warning }}>{displayMicro ?? 'Tänk på spelbarhet, vinklar och bredd.'}</Text>
      )}
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
