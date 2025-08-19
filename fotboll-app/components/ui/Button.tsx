import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '@/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export default function Button({ title, onPress, variant = 'primary', style }: Props) {
  const bg = variant === 'primary' ? colors.secondary : colors.card;
  const fg = variant === 'primary' ? colors.text : colors.text;
  return (
    <Pressable onPress={onPress} style={[styles.base, { backgroundColor: bg }, style]}
      accessibilityRole="button"
    >
      <Text style={[styles.text, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
  },
});

