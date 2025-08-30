import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FC25 } from '@/app/components/Theme';
import { useAppStore } from '@/store/useAppStore';
import type { Level, Position } from '@/types/content';

function recommend(level: Level, pos?: Position) {
  const base = [
    { id: 'rec1', title: 'Passningstriangel', target: 'pass', minutes: 10 },
    { id: 'rec2', title: 'Driv med boll framåt', target: 'dribble', minutes: 8 },
  ];
  if (pos === 'anfallare') base.push({ id: 'rec3', title: 'Avslut i boxen', target: 'shoot', minutes: 10 });
  if (pos === 'back') base.push({ id: 'rec4', title: 'Press och täck', target: 'defend', minutes: 8 });
  if (level === '9-manna') base.push({ id: 'rec5', title: 'Spelvändning', target: 'pass', minutes: 12 });
  return base;
}

export default function Training() {
  const router = useRouter();
  const pos = useAppStore((s) => s.profile.favoritePosition);
  const level: Level = '7-manna';
  const items = useMemo(() => recommend(level, pos), [level, pos]);
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Rekommenderad träning</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: FC25.colors.border, backgroundColor: FC25.colors.card }]}>
            <Text style={[styles.cardTitle, { color: FC25.colors.text }]}>{item.title}</Text>
            <Text style={{ color: FC25.colors.subtle }}>Mål: {item.target} • {item.minutes} min</Text>
            <Pressable style={[styles.startBtn, { backgroundColor: FC25.colors.primary }]} onPress={() => router.push('/player/interaction')}>
              <Text style={styles.startText}>Starta</Text>
            </Pressable>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  card: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  startBtn: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  startText: { color: '#0a0a0f', fontWeight: '800' },
});

