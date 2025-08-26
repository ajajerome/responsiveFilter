import { Link, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function PlayerHome() {
  const router = useRouter();
  const avatarGender = useAppStore((s) => s.profile.avatar.gender);

  useEffect(() => {
    if (!avatarGender) {
      router.replace('/player/create');
    }
  }, [avatarGender]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Välj nivå</Text>
      <Link href="/player/level/5-manna" asChild>
        <Pressable style={styles.button}><Text style={styles.buttonText}>5-manna</Text></Pressable>
      </Link>
      <Link href="/player/level/7-manna" asChild>
        <Pressable style={styles.button}><Text style={styles.buttonText}>7-manna</Text></Pressable>
      </Link>
      <Link href="/player/level/9-manna" asChild>
        <Pressable style={styles.button}><Text style={styles.buttonText}>9-manna</Text></Pressable>
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
  buttonText: { color: "white", fontWeight: "600" }
});
