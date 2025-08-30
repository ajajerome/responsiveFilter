import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FC25 } from '@/app/components/Theme';

export default function HomeIndex() {
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Fotbollsteori – Resan börjar</Text>
      <Link href="/player" asChild>
        <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]}><Text style={styles.buttonText}>Starta som spelare</Text></Pressable>
      </Link>
      <Link href="/trainer" asChild>
        <Pressable style={[styles.button, { backgroundColor: FC25.colors.secondary }]}><Text style={styles.buttonText}>Förälder/Tränare</Text></Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  button: { backgroundColor: "#1e90ff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, minWidth: 240, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600" }
});
