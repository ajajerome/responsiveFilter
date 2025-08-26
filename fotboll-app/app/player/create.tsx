import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppStore } from '@/store/useAppStore';

export default function CreatePlayer() {
  const router = useRouter();
  const setAvatar = useAppStore((s) => s.actions.setAvatar);

  const choose = (gender: 'kille' | 'tjej' | 'annat') => {
    setAvatar({ gender });
    router.replace('/player');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Välj din avatar</Text>
      <View style={styles.row}>
        <Pressable style={[styles.button, { backgroundColor: '#1e90ff' }]} onPress={() => choose('kille')}>
          <Text style={styles.buttonText}>Kille</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: '#ff2d55' }]} onPress={() => choose('tjej')}>
          <Text style={styles.buttonText}>Tjej</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: '#8e8e93' }]} onPress={() => choose('annat')}>
          <Text style={styles.buttonText}>Annat</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 12 },
  button: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: '600' },
});

