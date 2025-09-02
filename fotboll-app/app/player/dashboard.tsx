import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { useRouter, Link } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';

export default function Dashboard() {
  const router = useRouter();
  const { name } = useAppStore((s) => s.profile);
  const season = useAppStore((s) => s.season);
  const dayPlan = useAppStore((s) => s.dayPlan);
  const actions = useAppStore((s) => s.actions);
  useEffect(() => {
    actions.ensureDayPlan();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: FC25.colors.bg }}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Hej {name || 'spelare'}</Text>
      <View style={[styles.card, { borderColor: FC25.colors.border, backgroundColor: FC25.colors.card }]}>
        <Text style={[styles.cardText, { color: FC25.colors.text }]}>Säsong: {season.number}</Text>
        <Text style={[styles.cardText, { color: FC25.colors.text }]}>Säsongs-XP: {season.xp}</Text>
      </View>
      {dayPlan && (
        <View style={[styles.card, { borderColor: FC25.colors.border, backgroundColor: FC25.colors.card }]}> 
          <Text style={[styles.cardText, { color: FC25.colors.text }]}>Dagens plan</Text>
          <Text style={[styles.cardText, { color: FC25.colors.text }]}>Interaktivt: {dayPlan.done.interactive}/{dayPlan.totals.interactive}</Text>
          <Text style={[styles.cardText, { color: FC25.colors.text }]}>Quiz: {dayPlan.done.quiz}/{dayPlan.totals.quiz}</Text>
          <Text style={[styles.cardText, { color: FC25.colors.text }]}>Snabbfrågor: {dayPlan.done.quick}/{dayPlan.totals.quick}</Text>
        </View>
      )}

      <Pressable
        style={[styles.button, { backgroundColor: FC25.colors.primary }]}
        onPress={() => requestAnimationFrame(() => router.push('/player/interaction'))}
      >
        <Text style={styles.buttonText}>Träna interaktivt</Text>
      </Pressable>

      <Link href="/player/interaction" asChild>
        <Pressable style={[styles.button, { backgroundColor: FC25.colors.secondary }]}> 
          <Text style={styles.buttonText}>Träna interaktivt (länk)</Text>
        </Pressable>
      </Link>

      <Text style={{ color: FC25.colors.text, textDecorationLine: 'underline' }} onPress={() => router.push('/player/interaction')}>
        Gå till interaktiv vy
      </Text>

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

