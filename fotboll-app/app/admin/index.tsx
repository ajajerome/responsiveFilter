import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAppStore } from "@/store/useAppStore";

export default function Admin() {
  const actions = useAppStore((s) => s.actions);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin</Text>
      <View style={styles.row}>
        <Pressable style={[styles.button, { backgroundColor: '#ff3b30' }]} onPress={actions.resetAll}>
          <Text style={styles.buttonText}>Reset All</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: '#34c759' }]} onPress={actions.unlockAll}>
          <Text style={styles.buttonText}>Unlock All</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: '#5856d6' }]} onPress={actions.clearProgress}>
          <Text style={styles.buttonText}>Clear Progress</Text>
        </Pressable>
      </View>
      <Text style={{ marginTop: 16 }}>Hantera frågor och övningar (demo).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' },
  button: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' }
});
