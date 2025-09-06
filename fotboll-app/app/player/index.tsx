import { useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FC25 } from '@/app/components/Theme';

export default function PlayerHome() {
  const router = useRouter();
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Välj nivå</Text>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]} onPress={() => router.push('/player/level/5-manna')}><Text style={styles.buttonText}>5-manna</Text></Pressable>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]} onPress={() => router.push('/player/level/7-manna')}><Text style={styles.buttonText}>7-manna</Text></Pressable>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.primary }]} onPress={() => router.push('/player/level/9-manna')}><Text style={styles.buttonText}>9-manna</Text></Pressable>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.secondary }]} onPress={() => router.push('/player/repetition')}><Text style={styles.buttonText}>Repetitionsläge</Text></Pressable>
      <Pressable style={[styles.button, { backgroundColor: FC25.colors.warning }]} onPress={() => router.push('/player/interaction')}><Text style={styles.buttonText}>Interaktivt läge</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  button: { backgroundColor: "#1e90ff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, minWidth: 240, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600" }
});
