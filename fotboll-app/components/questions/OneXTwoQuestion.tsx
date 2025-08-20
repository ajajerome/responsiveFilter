import { View, Text, StyleSheet } from 'react-native';
import type { OneXTwoQuestion } from '@/types/content';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors } from '@/theme';

type Props = {
  question: OneXTwoQuestion;
  onAnswer: (isCorrect: boolean) => void;
};

export default function OneXTwoQuestionView({ question, onAnswer }: Props) {
  return (
    <Card>
      <View style={styles.container}>
        <Text style={styles.title}>{question.question}</Text>
        {question.explanation ? <Text style={styles.expl}>{question.explanation}</Text> : null}
        <View style={{ gap: 10 }}>
          {question.answers.map((opt, idx) => (
            <Button key={idx} title={opt} onPress={() => onAnswer(idx === question.correctIndex)} />
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

