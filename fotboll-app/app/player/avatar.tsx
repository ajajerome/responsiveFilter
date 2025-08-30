import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';

export default function AvatarSetup() {
  const router = useRouter();
  const name = useAppStore((s) => s.profile.name);
  const avatar = useAppStore((s) => s.profile.avatar);
  const updateAvatar = useAppStore((s) => s.actions.updateAvatar);
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Bygg avatar</Text>
      <Text style={{ color: FC25.colors.subtle }}>Hej {name ?? 'spelare'}! Välj utseende (demo).</Text>
      <View style={styles.row}>
        {(['kille','tjej','annat'] as const).map(g => (
          <Pressable key={g} style={[styles.pill, { borderColor: FC25.colors.border, backgroundColor: avatar.gender===g? FC25.colors.primary : 'transparent' }]} onPress={() => updateAvatar({ gender: g })}>
            <Text style={{ color: avatar.gender===g? '#0a0a0f' : FC25.colors.text }}>{g}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.row}>
        {['#1e90ff','#ff3b30','#34c759','#ffd60a'].map(c => (
          <Pressable key={c} style={[styles.color, { backgroundColor: c, borderColor: FC25.colors.border, borderWidth: avatar.shirtColor===c? 3:1 }]} onPress={() => updateAvatar({ shirtColor: c })} />
        ))}
      </View>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]} onPress={() => router.push('/player/dashboard')}>
        <Text style={styles.buttonText}>Fortsätt</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 12 },
  pill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  color: { width: 32, height: 32, borderRadius: 8 },
  button: { alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  buttonText: { color: '#0a0a0f', fontWeight: '800' },
});

