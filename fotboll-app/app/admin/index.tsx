import { View, Text, StyleSheet } from "react-native";
import { FC25 } from '@/app/components/Theme';

export default function Admin() {
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Admin</Text>
      <Text style={{ color: FC25.colors.subtle }}>Hantera frågor och övningar (demo).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 }
});
