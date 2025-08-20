import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@/theme';

type Props = { label: string };

export default function Tag({ label }: Props) {
  return (
    <View style={styles.tag}>
      <Text style={styles.txt}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: { backgroundColor: colors.card, borderColor: '#1e2130', borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  txt: { color: colors.text, fontWeight: '700', fontSize: 12 },
});

