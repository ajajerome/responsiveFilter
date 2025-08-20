import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { colors, radii, spacing } from '@/theme';

export default function XpBadge() {
  const progress = useAppStore((s) => s.progress);
  const totalXp = Object.values(progress || {}).reduce((acc, lv: any) => acc + (lv?.xp || 0), 0);
  return (
    <View style={styles.badge} pointerEvents="none">
      <Text style={styles.txt}>XP {totalXp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
    backgroundColor: colors.secondary,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  txt: { color: colors.text, fontWeight: '800' },
});

