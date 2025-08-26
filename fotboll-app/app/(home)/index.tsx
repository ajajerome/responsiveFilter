import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function HomeIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fotbollsteori – Resan börjar</Text>
      <Link href="/player" asChild>
        <Pressable style={styles.button}><Text style={styles.buttonText}>Starta som spelare</Text></Pressable>
      </Link>
      <Link href="/trainer" asChild>
        <Pressable style={[styles.button, { backgroundColor: "#34c759" }]}><Text style={styles.buttonText}>Förälder/Tränare</Text></Pressable>
      </Link>
      <Link href="/profile" asChild>
        <Pressable style={[styles.button, { backgroundColor: "#5856d6" }]}><Text style={styles.buttonText}>Profil</Text></Pressable>
      </Link>
      <Link href="/admin" asChild>
        <Pressable style={[styles.button, { backgroundColor: "#8e8e93" }]}><Text style={styles.buttonText}>Admin</Text></Pressable>
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
