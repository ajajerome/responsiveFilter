import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';

export default function PlayerStats() {
  const router = useRouter();
  const { name } = useAppStore((s) => s.profile);
  const season = useAppStore((s) => s.season);

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: FC25.colors.bg }}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Player Stats</Text>
      <View style={[styles.card, { borderColor: FC25.colors.border, backgroundColor: FC25.colors.card }]}>
        <Text style={[styles.cardText, { color: FC25.colors.text }]}>Namn: {name || 'spelare'}</Text>
        <Text style={[styles.cardText, { color: FC25.colors.text }]}>Säsong: {season.number}</Text>
        <Text style={[styles.cardText, { color: FC25.colors.text }]}>Säsongs-XP: {season.xp}</Text>
      </View>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]} onPress={() => router.push('/player/interaction')}>
        <Text style={styles.buttonText}>Träna interaktivt</Text>
      </Pressable>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.secondary }]} onPress={() => router.push('/player/level/7-manna')}>
        <Text style={styles.buttonText}>Spela 7-manna</Text>
      </Pressable>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.warning }]} onPress={() => router.push('/player/index')}>
        <Text style={styles.buttonText}>Välj nivå</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 8 },
  cardText: { fontSize: 16 },
  button: { alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: '#0a0a0f', fontWeight: '800' },
});

