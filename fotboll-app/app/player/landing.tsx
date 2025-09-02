import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FC25 } from '@/app/components/Theme';
import Screen from '@/app/components/Screen';

export default function PlayerLanding() {
  const router = useRouter();
  return (
    <Screen>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Välkommen tillbaka</Text>
      <Text style={{ color: FC25.colors.subtle }}>Snabbstart</Text>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]} onPress={() => router.push('/player/quiz')}>
        <Text style={styles.buttonText}>Jag vill träna</Text>
      </Pressable>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.secondary }]} onPress={() => router.push('/player/dashboard?safe=1')}>
        <Text style={styles.buttonText}>Gå till Dashboard</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  button: { alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: '#0a0a0f', fontWeight: '800' },
});

