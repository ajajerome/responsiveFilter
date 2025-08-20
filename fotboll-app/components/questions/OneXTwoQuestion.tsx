import { View, Text, StyleSheet } from 'react-native';
import type { OneXTwoQuestion } from '@/types/content';
import Button from '@/components/ui/Button';

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
          <Button key={label} title={`${label}: ${question.answers[idx]}`} onPress={() => onAnswer(idx === question.correctIndex)} />
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
  choice: {},
  choiceText: { },
  choiceSub: { },
  hint: { marginTop: 8, color: '#444' },
});

