import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAppStore } from "@/store/useAppStore";
import type { Position } from "@/types/content";

export default function Profile() {
  const favorite = useAppStore((s) => s.profile.favoritePosition);
  const setFavorite = useAppStore((s) => s.actions.setFavoritePosition);

  const positions: Position[] = ['målvakt', 'back', 'mittfält', 'anfallare'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.subtitle}>Favoritposition: {favorite ?? 'inte vald'}</Text>
      <View style={styles.row}>
        {positions.map((pos) => (
          <Pressable
            key={pos}
            onPress={() => setFavorite(pos)}
            style={[styles.chip, favorite === pos && styles.chipActive]}
          >
            <Text style={styles.chipText}>{pos}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={{ marginTop: 16 }}>Avatar och badges kommer här.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  subtitle: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#f2f2f7', borderRadius: 16 },
  chipActive: { backgroundColor: '#1e90ff' },
  chipText: { color: '#000' }
});
