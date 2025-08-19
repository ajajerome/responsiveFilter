import { View, Text, StyleSheet } from 'react-native';

type Props = {
  correct: boolean;
  message?: string;
};

export default function AnswerResult({ correct, message }: Props) {
  return (
    <View style={[styles.container, { backgroundColor: correct ? '#e6ffed' : '#ffe6e6', borderColor: correct ? '#2ecc71' : '#ff6b6b' }]}>
      <Text style={[styles.title, { color: correct ? '#208e4e' : '#c44545' }]}>
        {correct ? 'Rätt svar!' : 'Fel svar'}
      </Text>
      {message ? <Text style={styles.msg}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, borderWidth: 2, borderRadius: 12, alignItems: 'center', gap: 4 },
  title: { fontSize: 18, fontWeight: '800' },
  msg: { textAlign: 'center', color: '#333' },
});

