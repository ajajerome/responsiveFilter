import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useEffect } from 'react';
import { useRouter, Link } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import Screen from '@/app/components/Screen';

export default function Dashboard() {
  const router = useRouter();
  const { name } = useAppStore((s) => s.profile);
  // Minimal skeleton + season card
  const season = useAppStore((s) => s.season);
  const hydrated = useAppStore((s) => s.hydrated);
  const dayPlan = useAppStore((s) => s.dayPlan);
  const actions = useAppStore((s) => s.actions);

  useEffect(() => {
    actions.ensureDayPlan();
  }, []);

  return (
    <Screen>
      <ErrorBoundary fallback={<View style={{ padding: 16 }}><Text style={{ color: FC25.colors.warning }}>Kunde inte ladda dashboarden.</Text></View>}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Hej {name || 'spelare'}</Text>
      <View style={[styles.card, { borderColor: FC25.colors.border, backgroundColor: FC25.colors.card }]}>
        <Text style={[styles.cardText, { color: FC25.colors.text }]}>Säsong: {season.number}</Text>
        <Text style={[styles.cardText, { color: FC25.colors.text }]}>Säsongs-XP: {season.xp}</Text>
      </View>
      {(() => {
        try {
          const totals = dayPlan?.totals ?? { interactive: 4, quiz: 4, quick: 2 };
          const done = dayPlan?.done ?? { interactive: 0, quiz: 0, quick: 0 };
          return (
            <View style={[styles.card, { borderColor: FC25.colors.border, backgroundColor: FC25.colors.card }]}>
              <Text style={[styles.cardText, { color: FC25.colors.text }]}>Dagens plan</Text>
              <Text style={[styles.cardText, { color: FC25.colors.text }]}>Interaktivt: {done.interactive}/{totals.interactive}</Text>
              <Text style={[styles.cardText, { color: FC25.colors.text }]}>Quiz: {done.quiz}/{totals.quiz}</Text>
              <Text style={[styles.cardText, { color: FC25.colors.text }]}>Snabbfrågor: {done.quick}/{totals.quick}</Text>
            </View>
          );
        } catch {
          return (
            <View style={[styles.card, { borderColor: FC25.colors.border, backgroundColor: FC25.colors.card }]}>
              <Text style={[styles.cardText, { color: FC25.colors.text }]}>Dagens plan</Text>
              <Text style={[styles.cardText, { color: FC25.colors.subtle }]}>Kunde inte läsa planen just nu.</Text>
            </View>
          );
        }
      })()}

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
      </ErrorBoundary>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 8 },
  cardText: { fontSize: 16 },
  button: { alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: '#0a0a0f', fontWeight: '800' },
});

