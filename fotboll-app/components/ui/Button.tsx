import { Pressable, Text, StyleSheet, ViewStyle, PressableProps } from 'react-native';
import { colors, radii, spacing } from '@/theme';

type Props = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export default function Button({ title, onPress, variant = 'primary', style, ...rest }: Props) {
  const bg = variant === 'primary' ? colors.secondary : colors.card;
  const fg = variant === 'primary' ? colors.text : colors.text;
  const injectedOnPress = rest.onPress ?? onPress;
  return (
    <Pressable {...rest} onPress={injectedOnPress} style={[styles.base, { backgroundColor: bg }, style]}
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

