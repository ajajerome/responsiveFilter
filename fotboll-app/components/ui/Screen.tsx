import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

type Props = { children: React.ReactNode };

export default function Screen({ children }: Props) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.md,
  },
});

