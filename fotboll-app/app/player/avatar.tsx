import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';

const TEAM_COLORS = ['#1e90ff', '#ff3b30', '#34c759', '#ff9f0a', '#8e8e93', '#5856d6'];
const SKIN_TONES = ['#f6e0c9', '#e0c1a4', '#c89e7a', '#a8745a', '#7a4b2e', '#4b2a18'];
const GENDERS: Array<{ label: string; value: 'kille' | 'tjej' | 'annat' }> = [
  { label: 'Kille', value: 'kille' },
  { label: 'Tjej', value: 'tjej' },
  { label: 'Annat', value: 'annat' },
];

export default function AvatarSetup() {
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);
  const actions = useAppStore((s) => s.actions);

  const [name, setName] = useState(profile.name ?? '');
  const [age, setAge] = useState<number>(profile.age ?? 9);
  const [jersey, setJersey] = useState<string>(String(profile.jerseyNumber ?? 10));
  const [teamColor, setTeamColor] = useState<string>(profile.teamColor ?? TEAM_COLORS[0]);
  const [skinTone, setSkinTone] = useState<string>(profile.skinTone ?? SKIN_TONES[2]);
  const [gender, setGender] = useState<'kille' | 'tjej' | 'annat'>(profile.avatar.gender ?? 'kille');
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => { setSaved(false); }, [name, age, jersey, teamColor, skinTone, gender]);

  const canStart = useMemo(() => name.trim().length > 0 && saved, [name, saved]);

  const saveAll = () => {
    const jerseyNum = Math.min(99, Math.max(1, parseInt(jersey || '10', 10) || 10));
    actions.setName(name.trim());
    actions.setAge(age);
    actions.setJerseyNumber(jerseyNum);
    actions.setTeamColor(teamColor);
    actions.setSkinTone(skinTone);
    actions.setGender(gender);
    setSaved(true);
  };

  const startJourney = () => {
    if (!canStart) return;
    router.replace('/player/dashboard');
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: FC25.colors.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: FC25.colors.text }]}>Bygg din spelare</Text>

        {/* Namn */}
        <View style={styles.field}> 
          <Text style={[styles.label, { color: FC25.colors.subtle }]}>Namn</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ange namn"
            placeholderTextColor={FC25.colors.subtle}
            style={[styles.input, { color: FC25.colors.text, borderColor: FC25.colors.border }]}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Ålder */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: FC25.colors.subtle }]}>Ålder</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[7,8,9,10,11,12,13].map((a) => (
              <Pressable key={a} style={[styles.pill, { borderColor: FC25.colors.border, backgroundColor: age === a ? FC25.colors.primary : FC25.colors.card }]} onPress={() => setAge(a)}>
                <Text style={{ color: age === a ? '#0a0a0f' : FC25.colors.text, fontWeight: '800' }}>{a}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Nummer */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: FC25.colors.subtle }]}>Tröjnummer</Text>
          <TextInput
            value={jersey}
            onChangeText={setJersey}
            keyboardType="number-pad"
            placeholder="10"
            placeholderTextColor={FC25.colors.subtle}
            style={[styles.input, { color: FC25.colors.text, borderColor: FC25.colors.border }]}
            maxLength={2}
          />
        </View>

        {/* Lagfärg */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: FC25.colors.subtle }]}>Lagfärg</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {TEAM_COLORS.map((c) => (
              <Pressable key={c} onPress={() => setTeamColor(c)} style={[styles.colorDot, { backgroundColor: c, borderColor: teamColor === c ? FC25.colors.text : FC25.colors.border, borderWidth: teamColor === c ? 2 : 1 }]} />
            ))}
          </View>
        </View>

        {/* Hudfärg */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: FC25.colors.subtle }]}>Hudfärg</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {SKIN_TONES.map((c) => (
              <Pressable key={c} onPress={() => setSkinTone(c)} style={[styles.colorDot, { backgroundColor: c, borderColor: skinTone === c ? FC25.colors.text : FC25.colors.border, borderWidth: skinTone === c ? 2 : 1 }]} />
            ))}
          </View>
        </View>

        {/* Kön */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: FC25.colors.subtle }]}>Kön</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {GENDERS.map((g) => (
              <Pressable key={g.value} style={[styles.pill, { borderColor: FC25.colors.border, backgroundColor: gender === g.value ? FC25.colors.primary : FC25.colors.card }]} onPress={() => setGender(g.value)}>
                <Text style={{ color: gender === g.value ? '#0a0a0f' : FC25.colors.text, fontWeight: '800' }}>{g.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Sparad indikator */}
        <Text style={{ color: saved ? FC25.colors.success : FC25.colors.subtle }}>{saved ? 'Sparad ✓' : 'Inte sparad'}</Text>

      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { borderColor: FC25.colors.border, backgroundColor: FC25.colors.card }]}>
        <Pressable style={[styles.saveBtn, { backgroundColor: FC25.colors.primary }]} onPress={saveAll}>
          <Text style={styles.saveText}>{saved ? 'Spara igen' : 'Spara'}</Text>
        </Pressable>
        <Pressable style={[styles.startBtn, { backgroundColor: canStart ? FC25.colors.success : FC25.colors.border }]} onPress={startJourney} disabled={!canStart}>
          <Text style={[styles.startText, { color: canStart ? '#0a0a0f' : FC25.colors.subtle }]}>Starta resan</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: '800' },
  field: { gap: 8 },
  label: { fontWeight: '700' },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  pill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  bottomBar: { flexDirection: 'row', gap: 12, padding: 12, borderTopWidth: 1 },
  saveBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  startBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  saveText: { color: '#0a0a0f', fontWeight: '800' },
  startText: { fontWeight: '800' },
});

