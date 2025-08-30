import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';

export default function NewPlayer() {
  const router = useRouter();
  const setName = useAppStore((s) => s.actions.setName);
  const [name, setLocalName] = useState('');
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Ny spelare</Text>
      <TextInput
        placeholder="Ditt namn"
        value={name}
        onChangeText={setLocalName}
        style={[styles.input, { color: FC25.colors.text, borderColor: FC25.colors.border }]}
        placeholderTextColor={FC25.colors.subtle}
      />
      <Pressable
        style={[styles.button, { backgroundColor: FC25.colors.primary }]}
        onPress={() => { if (!name.trim()) return; setName(name.trim()); router.push('/player/avatar'); }}
      >
        <Text style={styles.buttonText}>Fortsätt</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  button: { alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: '#0a0a0f', fontWeight: '800' },
});

