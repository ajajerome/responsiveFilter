import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';

export default function AvatarSetup() {
  const router = useRouter();
  const name = useAppStore((s) => s.profile.name);
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Bygg avatar</Text>
      <Text style={{ color: FC25.colors.subtle }}>Hej {name ?? 'spelare'}! Välj utseende (demo).</Text>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]} onPress={() => router.push('/player/dashboard')}>
        <Text style={styles.buttonText}>Fortsätt</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  button: { alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  buttonText: { color: '#0a0a0f', fontWeight: '800' },
});

