import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { QuizQuestion } from '@/types/content';

type Props = {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
};

export default function MultipleChoiceQuestionView({ question, onAnswer }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.question}</Text>
      <View style={{ gap: 8 }}>
        {question.options.map((opt, i) => (
          <Pressable key={i} style={styles.option} onPress={() => onAnswer(i === question.correctIndex)}>
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
  option: { backgroundColor: '#f2f2f7', padding: 12, borderRadius: 8 },
  optionText: { color: '#111' },
});

