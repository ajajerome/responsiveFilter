import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '@/store/useAppStore';

export default function Repetition() {
  const favorite = useAppStore((s) => s.profile.favoritePosition);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repetitionsläge</Text>
      <Text>
        Position: {favorite ? favorite : 'inte vald ännu'}
      </Text>
      <Text>Adaptiva frågor och fokus på svagheter (demo).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 22, fontWeight: '700' },
});

