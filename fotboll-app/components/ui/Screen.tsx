import { View, StyleSheet, ImageBackground } from 'react-native';
import { colors, spacing } from '@/theme';
// use a static require path
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bg = require('../../assets/bg/football.png');

type Props = { children: React.ReactNode };

export default function Screen({ children }: Props) {
  return (
    <ImageBackground source={bg} resizeMode="cover" style={styles.container} imageStyle={{ opacity: 0.12 }}>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.md,
  },
});

