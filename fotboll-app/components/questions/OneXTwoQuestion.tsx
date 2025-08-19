import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { OneXTwoQuestion } from '@/types/content';

type Props = {
  question: OneXTwoQuestion;
  onAnswer: (isCorrect: boolean) => void;
};

export default function OneXTwoQuestionView({ question, onAnswer }: Props) {
  const labels = ['1', 'X', '2'] as const;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.question}</Text>
      <View style={styles.column}
      >
        {labels.map((label, idx) => (
          <Pressable key={label} style={styles.choice} onPress={() => onAnswer(idx === question.correctIndex)}>
            <Text style={styles.choiceText}>{label}</Text>
            <Text style={styles.choiceSub}>{question.answers[idx]}</Text>
          </Pressable>
        ))}
      </View>
      {question.explanation ? <Text style={styles.hint}>Tips: {question.explanation}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  column: { flexDirection: 'column', gap: 12 },
  choice: { backgroundColor: '#1e90ff', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center' },
  choiceText: { color: 'white', fontWeight: '700', fontSize: 18 },
  choiceSub: { color: 'white', marginTop: 4, textAlign: 'center' },
  hint: { marginTop: 8, color: '#444' },
});

