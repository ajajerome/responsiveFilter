import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function AuthIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Välj inloggning</Text>
      <Link href="/(home)" asChild>
        <Pressable style={styles.button}><Text style={styles.buttonText}>Fortsätt utan konto</Text></Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  button: { backgroundColor: "#1e90ff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "600" }
});
