import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FC25 } from '@/app/components/Theme';
import { useAppStore } from '@/store/useAppStore';

export default function HomeIndex() {
  const navigation = useNavigation<any>();
  const name = useAppStore((s) => s.profile.name);
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]} pointerEvents="auto">
      <Text style={[styles.title, { color: FC25.colors.text }]}>Fotbollsteori – Resan börjar</Text>
      <Pressable
        style={[styles.button, { backgroundColor: FC25.colors.secondary }]}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        onPress={() => { try { console.warn('Home: Ny spelare'); } catch {}; navigation.navigate('PlayerNew'); }}
      >
        <Text style={styles.buttonText}>Ny spelare</Text>
      </Pressable>
      <Pressable
        style={[styles.button, { backgroundColor: FC25.colors.warning }]}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        onPress={() => { try { console.warn('Home: Interaktivt läge'); } catch {}; navigation.navigate('Interaction'); }}
      >
        <Text style={styles.buttonText}>Testa interaktivt läge</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  button: { backgroundColor: "#1e90ff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, minWidth: 240, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600" }
});
