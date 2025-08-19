import { View, Text, StyleSheet } from "react-native";

export default function TrainerHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Förälder/Tränare</Text>
      <Text>Se barnets progression (demo).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 }
});
