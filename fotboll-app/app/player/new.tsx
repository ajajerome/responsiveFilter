import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Keyboard, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link, usePathname } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';

export default function NewPlayer() {
  const router = useRouter();
  const pathname = usePathname();
  const setName = useAppStore((s) => s.actions.setName);
  const [name, setLocalName] = useState('');
  const [error, setError] = useState<string>('');
  const [lastNav, setLastNav] = useState<string>('');

  const navigateToAvatar = () => {
    setLastNav(`tap:${Date.now()} route:${pathname}`);
    // Primary
    try { router.replace('/player/avatar'); } catch {}
    // Fallback 1: delayed push
    setTimeout(() => { try { router.push('/player/avatar'); } catch {} }, 50);
    // Fallback 2: go to player home, then avatar
    setTimeout(() => {
      try { router.push('/player'); } catch {}
      setTimeout(() => { try { router.push('/player/avatar'); } catch {} }, 50);
    }, 120);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: FC25.colors.bg }]}> 
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={64} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 24 }} keyboardShouldPersistTaps="handled">
          <View style={{ paddingHorizontal: 24, gap: 12 }}>
            <Text style={[styles.title, { color: FC25.colors.text }]}>Ny spelare</Text>
            <TextInput
              placeholder="Ditt namn"
              value={name}
              onChangeText={(t) => { setLocalName(t); if (error) setError(''); }}
              style={[styles.input, { color: FC25.colors.text, borderColor: FC25.colors.border }]}
              placeholderTextColor={FC25.colors.subtle}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => {
                const trimmed = name.trim();
                if (!trimmed) { setError('Ange ett namn för att fortsätta'); return; }
                setName(trimmed);
                Keyboard.dismiss();
                requestAnimationFrame(navigateToAvatar);
              }}
            />
            {!!error && <Text style={[styles.error, { color: '#ff3b30' }]}>{error}</Text>}
            <Pressable
              style={[styles.button, { backgroundColor: name.trim() ? FC25.colors.primary : FC25.colors.border }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => {
                const trimmed = name.trim();
                if (!trimmed) { setError('Ange ett namn för att fortsätta'); return; }
                setName(trimmed);
                Keyboard.dismiss();
                requestAnimationFrame(navigateToAvatar);
              }}
            >
              <Text style={styles.buttonText}>Fortsätt</Text>
            </Pressable>
          </View>
          <Link
            href="/player/avatar"
            onPress={(e) => {
              const trimmed = name.trim();
              if (!trimmed) {
                e.preventDefault();
                setError('Ange ett namn för att fortsätta');
                return;
              }
              setName(trimmed);
              Keyboard.dismiss();
            }}
            asChild
          >
            <Pressable style={[styles.button, { backgroundColor: FC25.colors.secondary }]}> 
              <Text style={styles.buttonText}>Fortsätt (länk)</Text>
            </Pressable>
          </Link>
          <Text
            style={{ color: FC25.colors.text, textAlign: 'center', textDecorationLine: 'underline', marginTop: 10 }}
            onPress={() => {
              const trimmed = name.trim();
              if (!trimmed) { setError('Ange ett namn för att fortsätta'); return; }
              setName(trimmed);
              Keyboard.dismiss();
              setTimeout(navigateToAvatar, 50);
            }}
          >
            Gå vidare om knappen inte fungerar
          </Text>
          <Text style={{ color: FC25.colors.subtle, textAlign: 'center', marginTop: 6 }}>debug: {lastNav}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  error: { marginTop: 4, fontSize: 12 },
  button: { alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: '#0a0a0f', fontWeight: '800' },
});

