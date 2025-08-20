import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, radii } from '@/theme';

type Props = { value: number }; // 0..1

export default function ProgressBar({ value }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: Math.max(0, Math.min(1, value)), duration: 600, useNativeDriver: false }).start();
  }, [value]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: radii.md, backgroundColor: '#1e2130', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.secondary },
});

