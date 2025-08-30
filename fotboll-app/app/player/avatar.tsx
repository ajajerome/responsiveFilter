import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';

export default function AvatarSetup() {
  const router = useRouter();
  const name = useAppStore((s) => s.profile.name);

  const goNext = () => {
    Alert.alert('Navigerar', Platform.OS === 'ios' ? 'Fortsätter till Dashboard...' : 'Fortsätter...');
    try { router.replace('/player/dashboard'); } catch {}
    setTimeout(() => { try { router.push('/player/dashboard'); } catch {} }, 60);
    setTimeout(() => { try { router.push('/player/interaction'); } catch {} }, 140);
  };

  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}> 
      <Text style={[styles.title, { color: FC25.colors.text }]}>Bygg avatar</Text>
      <Text style={{ color: FC25.colors.subtle }}>Hej {name ?? 'spelare'}! Välj utseende (demo).</Text>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={goNext}>
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

