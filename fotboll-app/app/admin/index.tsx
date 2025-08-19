import { View, Text, StyleSheet } from "react-native";

export default function Admin() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin</Text>
      <Text>Hantera frågor och övningar (demo).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 }
});
