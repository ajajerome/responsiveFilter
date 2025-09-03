import { Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FC25 } from '@/app/components/Theme';
import Screen from '@/app/components/Screen';

export default function Train() {
  const router = useRouter();

  return (
    <Screen>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Dagens mål</Text>
      <Text style={{ color: FC25.colors.subtle }}>Vi startar med ett quizpass medan interaktiva läget stabiliseras.</Text>
      <Pressable style={[styles.btn, { backgroundColor: FC25.colors.primary }]} onPress={() => {
        router.push('/player/quiz');
      }}>
        <Text style={styles.btnText}>Starta pass</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800' },
  btn: { alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  btnText: { color: '#0a0a0f', fontWeight: '800' },
});

