import { View, Text, StyleSheet } from 'react-native';
import type { QuizQuestion } from '@/types/content';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { colors } from '@/theme';

type Props = {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
};

export default function MultipleChoiceQuestionView({ question, onAnswer }: Props) {
  return (
    <Card>
      <View style={styles.container}>
        <Text style={styles.title}>{question.question}</Text>
        {question.explanation ? <Text style={styles.expl}>{question.explanation}</Text> : null}
        <View style={{ gap: 10 }}>
          {question.options.map((opt, i) => (
            <Button key={i} title={opt} onPress={() => onAnswer(i === question.correctIndex)} />
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
  expl: { color: colors.muted },
});

