import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { FormationQuizQuestion } from '@/types/content';
import MatchPitch from '@/features/pitch/MatchPitch';

type Props = { question: FormationQuizQuestion; onAnswer: (isCorrect: boolean) => void };

export default function FormationQuiz({ question, onAnswer }: Props) {
  const w = 320, h = 220;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.question}</Text>
      {question.explanation ? (
        <Text style={styles.expl}>{question.explanation}</Text>
      ) : null}
      <View style={{ width: w, height: h }}>
        <MatchPitch width={w} height={h} level={question.level} />
        <Svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
          {question.players.map((p, i) => (
            <Circle key={i} cx={p.x * w} cy={p.y * h} r={10} fill="#4da3ff" />
          ))}
        </Svg>
      </View>
      <View style={{ gap: 8 }}>
        {question.options.map((opt, idx) => (
          <Pressable key={idx} style={styles.option} onPress={() => onAnswer(idx === question.correctIndex)}>
            <Text style={styles.optionText}>{opt}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  expl: { color: '#e7ebf3', backgroundColor: 'rgba(0,0,0,0.25)', padding: 8, borderRadius: 8 },
  option: { backgroundColor: '#f2f2f7', padding: 12, borderRadius: 8 },
  optionText: { color: '#111' },
});

