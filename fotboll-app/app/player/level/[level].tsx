import { useLocalSearchParams, Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function LevelScreen() {
  const { level } = useLocalSearchParams<{ level: string }>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{level} – Nivåöversikt</Text>
      <Link href={{ pathname: "/player/quiz", params: { level } }} asChild>
        <Pressable style={styles.button}><Text style={styles.buttonText}>Starta frågorna</Text></Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textTransform: "capitalize" },
  button: { backgroundColor: "#1e90ff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, minWidth: 240, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600" }
});
