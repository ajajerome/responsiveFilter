import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { FC25 } from '@/app/components/Theme';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsScreen() {
  const actions = useAppStore((s) => s.actions);
  const limits: any = useAppStore((s: any) => (s as any).limits);

  const [maxPerDay, setMaxPerDay] = useState<string>(String(limits?.maxScenariosPerDay ?? 10));
  const [startHour, setStartHour] = useState<string>(String(limits?.curfew?.startHour ?? 7));
  const [endHour, setEndHour] = useState<string>(String(limits?.curfew?.endHour ?? 20));

  useEffect(() => {
    setMaxPerDay(String(limits?.maxScenariosPerDay ?? 10));
    setStartHour(String(limits?.curfew?.startHour ?? 7));
    setEndHour(String(limits?.curfew?.endHour ?? 20));
  }, [limits]);

  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Inställningar (förälder)</Text>

      <View style={styles.card}>
        <Text style={[styles.label, { color: FC25.colors.subtle }]}>Max scenarier per dag</Text>
        <TextInput
          keyboardType="number-pad"
          value={maxPerDay}
          onChangeText={setMaxPerDay}
          style={styles.input}
          placeholder="10"
          placeholderTextColor={FC25.colors.subtle}
        />
        <Pressable style={styles.btn} onPress={() => actions.setMaxScenariosPerDay(Math.max(1, parseInt(maxPerDay || '10', 10) || 10))}>
          <Text style={styles.btnText}>Spara daglig gräns</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={[styles.label, { color: FC25.colors.subtle }]}>Träning tillåten mellan (timmar)</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput keyboardType="number-pad" value={startHour} onChangeText={setStartHour} style={[styles.input, { flex: 1 }]} placeholder="7" placeholderTextColor={FC25.colors.subtle} />
          <TextInput keyboardType="number-pad" value={endHour} onChangeText={setEndHour} style={[styles.input, { flex: 1 }]} placeholder="20" placeholderTextColor={FC25.colors.subtle} />
        </View>
        <Pressable style={styles.btn} onPress={() => actions.setCurfew(Math.max(0, Math.min(23, parseInt(startHour || '7', 10) || 7)), Math.max(1, Math.min(24, parseInt(endHour || '20', 10) || 20)))}>
          <Text style={styles.btnText}>Spara tider</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  title: { fontSize: 20, fontWeight: '800' },
  card: { backgroundColor: FC25.colors.card, borderRadius: FC25.radius, padding: 12, borderWidth: 1, borderColor: FC25.colors.border, gap: 8 },
  label: { fontWeight: '700' },
  input: { backgroundColor: '#0f0f15', color: FC25.colors.text, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: FC25.colors.border },
  btn: { backgroundColor: FC25.colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#0a0a0f', fontWeight: '800' },
});

