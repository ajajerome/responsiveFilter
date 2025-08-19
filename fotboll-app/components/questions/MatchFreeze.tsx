import { View, Text, StyleSheet, Pressable, PanResponder, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { MatchFreezeQuestion } from '@/types/content';
import { useEffect, useMemo, useRef, useState } from 'react';
import { playLocal } from '@/utils/sound';

type Props = { question: MatchFreezeQuestion; onAnswer: (isCorrect: boolean) => void };

export default function MatchFreeze({ question, onAnswer }: Props) {
  const w = 320, h = 220;
  useEffect(() => {
    playLocal(require('@/assets/sfx/whistle.mp3'));
  }, []);
  const check = (playerId?: string) => {
    if (question.correctPlayerIds && playerId) return onAnswer(question.correctPlayerIds.includes(playerId));
    onAnswer(false);
  };
  // Drag på boll
  const initialBall = useMemo(() => ({ x: question.ball.x * w, y: question.ball.y * h }), [question.ball.x, question.ball.y]);
  const ballPos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [ballOffset, setBallOffset] = useState({ x: 0, y: 0 });
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        ballPos.setOffset({ x: (ballPos as any).x._value, y: (ballPos as any).y._value });
        ballPos.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: ballPos.x, dy: ballPos.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        ballPos.flattenOffset();
        const current = { x: (ballPos as any).x._value, y: (ballPos as any).y._value };
        const cx = initialBall.x + current.x;
        const cy = initialBall.y + current.y;
        setBallOffset(current);
        // Rätt/fel: zon före spelare
        if (question.correctZones && question.correctZones.length > 0) {
          const ok = question.correctZones.some(z => (
            cx >= z.rect.x * w && cx <= (z.rect.x + z.rect.width) * w &&
            cy >= z.rect.y * h && cy <= (z.rect.y + z.rect.height) * h
          ));
          onAnswer(ok);
          return;
        }
        if (question.correctPlayerIds && question.correctPlayerIds.length > 0) {
          const ok = question.players.some(p => question.correctPlayerIds!.includes(p.id) && Math.hypot(cx - p.x * w, cy - p.y * h) < 28);
          onAnswer(ok);
          return;
        }
        onAnswer(false);
      },
    })
  ).current;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.question}</Text>
      <View style={{ width: w, height: h, position: 'relative' }}>
        <Svg width={w} height={h} style={{ backgroundColor: '#0a7d2a', borderRadius: 12 }}>
          <Circle cx={question.ball.x * w} cy={question.ball.y * h} r={4} fill="#fff9" />
        </Svg>
        {question.players.map(p => (
          <Pressable
            key={p.id}
            onPress={() => check(p.id)}
            hitSlop={12}
            style={{ position: 'absolute', left: p.x * w - 18, top: p.y * h - 18, width: 36, height: 36, borderRadius: 18, backgroundColor: p.team === 'home' ? '#7a7cff' : '#ff3b30', alignItems: 'center', justifyContent: 'center' }}
          />
        ))}
        {/* Draggable ball overlay */}
        <Animated.View
          {...pan.panHandlers}
          style={{ position: 'absolute', left: initialBall.x - 8, top: initialBall.y - 8, transform: ballPos.getTranslateTransform(), width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
});

