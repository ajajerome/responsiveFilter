import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAppStore } from "@/store/useAppStore";

export default function PlayerHome() {
  const progress = useAppStore((s) => s.progress);
  const isUnlocked = (lv: '5-manna' | '7-manna' | '9-manna') => progress[lv]?.unlocked;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Välj nivå</Text>
      <Link href="/player/level/5-manna" asChild>
        <Pressable style={styles.button}><Text style={styles.buttonText}>5-manna</Text></Pressable>
      </Link>
      <Link href={isUnlocked('7-manna') ? "/player/level/7-manna" : undefined as any} asChild>
        <Pressable disabled={!isUnlocked('7-manna')} style={[styles.button, !isUnlocked('7-manna') && styles.buttonDisabled]}><Text style={styles.buttonText}>7-manna {isUnlocked('7-manna') ? '' : '(låst)'}</Text></Pressable>
      </Link>
      <Link href={isUnlocked('9-manna') ? "/player/level/9-manna" : undefined as any} asChild>
        <Pressable disabled={!isUnlocked('9-manna')} style={[styles.button, !isUnlocked('9-manna') && styles.buttonDisabled]}><Text style={styles.buttonText}>9-manna {isUnlocked('9-manna') ? '' : '(låst)'}</Text></Pressable>
      </Link>
      <Link href="/player/repetition" asChild>
        <Pressable style={[styles.button, { backgroundColor: '#ff9f0a' }]}><Text style={styles.buttonText}>Repetitionsläge</Text></Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  button: { backgroundColor: "#1e90ff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, minWidth: 240, alignItems: "center" },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "white", fontWeight: "600" }
});
