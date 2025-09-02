import { useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FC25 } from '@/app/components/Theme';
import { useAppStore } from '@/store/useAppStore';

export default function HomeIndex() {
  const router = useRouter();
  const name = useAppStore((s) => s.profile.name);
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Fotbollsteori – Resan börjar</Text>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]} onPress={() => router.push('/player/interaction')}>
        <Text style={styles.buttonText}>Starta</Text>
      </Pressable>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.secondary }]} onPress={() => router.push('/player/new')}>
        <Text style={styles.buttonText}>Ny spelare</Text>
      </Pressable>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.secondary }]} onPress={() => router.push('/trainer')}>
        <Text style={styles.buttonText}>Förälder/Tränare</Text>
      </Pressable>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.card, borderWidth: 1, borderColor: FC25.colors.border }]} onPress={() => router.push('/settings')}>
        <Text style={[styles.buttonText, { color: FC25.colors.text }]}>Inställningar (förälder)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  button: { backgroundColor: "#1e90ff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, minWidth: 240, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600" }
});
