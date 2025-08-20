import { View, Text, StyleSheet } from "react-native";
import Screen from "@/components/ui/Screen";

export default function Profile() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Profil</Text>
        <Text>Avatar, position och badges visas här.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 }
});
