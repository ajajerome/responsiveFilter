import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { FC25 } from '@/app/components/Theme';

export default function Repetition() {
  const favorite = useAppStore((s) => s.profile.favoritePosition);
  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Repetitionsläge</Text>
      <Text style={{ color: FC25.colors.subtle }}>
        Position: {favorite ? favorite : 'inte vald ännu'}
      </Text>
      <Text style={{ color: FC25.colors.subtle }}>Adaptiva frågor och fokus på svagheter (demo).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 22, fontWeight: '700' },
});

