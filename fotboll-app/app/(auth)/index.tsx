import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FC25 } from '@/app/components/Theme';

export default function AuthIndex() {
  const navigation = useNavigation<any>();
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Välj inloggning</Text>
      <Pressable
        style={[styles.button, { backgroundColor: FC25.colors.primary }]}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        onPress={() => {
          try { console.warn('Navigating to Home from Auth'); } catch {}
          navigation.navigate('Home');
        }}
      >
        <Text style={styles.buttonText}>Fortsätt utan konto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  button: { backgroundColor: "#1e90ff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "600" }
});
