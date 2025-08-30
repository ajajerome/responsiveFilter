import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return 'God morgon';
  if (h < 18) return 'Hej';
  return 'God kväll';
}

export default function Dashboard() {
  const { name } = useAppStore((s) => s.profile);
  const season = useAppStore((s) => s.season);
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>{greeting()}, {name ?? 'spelare'}</Text>
      <View style={[styles.card, { borderColor: FC25.colors.border, backgroundColor: FC25.colors.card }]}>
        <Text style={[styles.cardText, { color: FC25.colors.text }]}>Säsong: {season.number}</Text>
        <Text style={[styles.cardText, { color: FC25.colors.text }]}>Säsongs-XP: {season.xp}</Text>
      </View>
      <Link href="/player/interaction" asChild>
        <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]}>
          <Text style={styles.buttonText}>Jag vill träna</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 8 },
  cardText: { fontSize: 16 },
  button: { alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: '#0a0a0f', fontWeight: '800' },
});

