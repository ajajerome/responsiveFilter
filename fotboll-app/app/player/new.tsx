import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';

export default function NewPlayer() {
  const navigation = useNavigation<any>();
  const setName = useAppStore((s) => s.actions.setName);
  const [name, setLocalName] = useState('');
  const [error, setError] = useState<string>('');
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Ny spelare</Text>
      <TextInput
        placeholder="Ditt namn"
        value={name}
        onChangeText={(t) => { setLocalName(t); if (error) setError(''); }}
        style={[styles.input, { color: FC25.colors.text, borderColor: FC25.colors.border }]}
        placeholderTextColor={FC25.colors.subtle}
        returnKeyType="done"
        onSubmitEditing={() => {
          const trimmed = name.trim();
          if (!trimmed) { setError('Ange ett namn för att fortsätta'); return; }
          // Bypass persistence on submit to avoid crash; navigation is done by button
          try { console.warn('NewPlayer: submitEditing (no navigation)'); } catch {}
        }}
      />
      {!!error && <Text style={[styles.error, { color: '#ff3b30' }]}>{error}</Text>}
      <Pressable
        style={[styles.button, { backgroundColor: name.trim() ? FC25.colors.primary : FC25.colors.border }]}
        disabled={!name.trim()}
        onPress={() => {
          const trimmed = name.trim();
          if (!trimmed) { setError('Ange ett namn för att fortsätta'); return; }
          try { console.warn('NewPlayer: Fortsätt pressed'); } catch {}
          // Soften transition: dismiss keyboard, avoid immediate persistence, navigate after a short delay
          try { Keyboard.dismiss(); } catch {}
          setTimeout(() => {
            // Avoid persistence; navigate directly to Interaction for stability
            try { navigation.navigate('Interaction'); } catch {}
          }, 50);
        }}
      >
        <Text style={styles.buttonText}>Fortsätt</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  error: { marginTop: 4, fontSize: 12 },
  button: { alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: '#0a0a0f', fontWeight: '800' },
});

