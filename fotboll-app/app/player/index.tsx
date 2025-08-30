import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FC25 } from '@/app/components/Theme';

export default function PlayerHome() {
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Välj nivå</Text>
      <Link href="/player/level/5-manna" asChild>
        <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]}><Text style={styles.buttonText}>5-manna</Text></Pressable>
      </Link>
      <Link href="/player/level/7-manna" asChild>
        <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]}><Text style={styles.buttonText}>7-manna</Text></Pressable>
      </Link>
      <Link href="/player/level/9-manna" asChild>
        <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]}><Text style={styles.buttonText}>9-manna</Text></Pressable>
      </Link>
      <Link href="/player/repetition" asChild>
        <Pressable style={[styles.button, { backgroundColor: FC25.colors.secondary }]}><Text style={styles.buttonText}>Repetitionsläge</Text></Pressable>
      </Link>
      <Link href="/player/interaction" asChild>
        <Pressable style={[styles.button, { backgroundColor: FC25.colors.warning }]}><Text style={styles.buttonText}>Interaktivt läge</Text></Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  button: { backgroundColor: "#1e90ff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, minWidth: 240, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600" }
});
