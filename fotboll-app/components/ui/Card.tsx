import { View, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@/theme';

type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#1e2130',
  },
});

