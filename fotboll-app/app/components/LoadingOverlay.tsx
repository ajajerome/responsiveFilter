import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FC25 } from '@/app/components/Theme';

export default function LoadingOverlay() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: any;
    const tick = () => {
      setProgress((p) => (p < 95 ? p + Math.max(1, Math.floor((100 - p) * 0.05)) : p));
      raf = setTimeout(tick, 120);
    };
    tick();
    return () => clearTimeout(raf);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: FC25.colors.bg }]}>
      <Text style={[styles.title, { color: FC25.colors.text }]}>Laddar…</Text>
      <View style={[styles.bar, { borderColor: FC25.colors.border }]}> 
        <View style={[styles.fill, { width: `${progress}%`, backgroundColor: FC25.colors.primary }]} />
      </View>
      <Text style={{ color: FC25.colors.subtle }}>{progress}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: 10 },
  title: { fontSize: 18, fontWeight: '800' },
  bar: { width: 220, height: 10, borderWidth: 1, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%' },
});

