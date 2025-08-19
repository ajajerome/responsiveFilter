import { useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import type { PassQuestion } from '@/types/content';

type Props = { question: PassQuestion; onAnswer: (isCorrect: boolean) => void };

export default function PassQuestionView({ question, onAnswer }: Props) {
  const w = 320, h = 220;
  const [line, setLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setLine({ x1: locationX, y1: locationY, x2: locationX, y2: locationY });
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setLine((l) => (l ? { ...l, x2: locationX, y2: locationY } : l));
      },
      onPanResponderRelease: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        setLine((l) => (l ? { ...l, x2: locationX, y2: locationY } : l));
        const holder = question.players.find(p => p.id === question.ballHolderId)!;
        const target = question.players.find(p => p.id === question.correctTargetId)!;
        // enkel check: är release nära target?
        const tx = target.x * w, ty = target.y * h;
        const dx = locationX - tx, dy = locationY - ty;
        const ok = Math.hypot(dx, dy) < 24;
        onAnswer(ok);
      },
    })
  ).current;
  const holder = question.players.find(p => p.id === question.ballHolderId)!;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.question}</Text>
      <View {...pan.panHandlers}>
        <Svg width={w} height={h} style={{ backgroundColor: '#0a7d2a', borderRadius: 12 }}>
          {question.players.map(p => (
            <Circle key={p.id} cx={p.x * w} cy={p.y * h} r={12} fill={p.team === 'home' ? '#7a7cff' : '#ff3b30'} />
          ))}
          <Circle cx={holder.x * w} cy={holder.y * h} r={6} fill="#fff" />
          {line && <Line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#fff" strokeWidth={2} />}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
});

