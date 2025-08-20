import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { TimelineQuestion } from '@/types/content';
import MatchPitch from '@/features/pitch/MatchPitch';
import Button from '@/components/ui/Button';

type Props = { question: TimelineQuestion; onAnswer: (isCorrect: boolean) => void };

export default function TimelineQuestionView({ question, onAnswer }: Props) {
  const w = 320, h = 220;
  // Absolute position ball
  const ball = useRef(new Animated.ValueXY({ x: question.ball.x * w, y: question.ball.y * h })).current;
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const toX = question.animTo.x * w;
    const toY = question.animTo.y * h;
    const midX = (question.ball.x * w) + (toX - (question.ball.x * w)) * 0.4;
    const midY = (question.ball.y * h) + (toY - (question.ball.y * h)) * 0.4;
    Animated.timing(ball, { toValue: { x: midX, y: midY }, duration: Math.max(250, question.animTo.durationMs * 0.4), easing: Easing.out(Easing.quad), useNativeDriver: false }).start(() => setPaused(true));
  }, [question.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.question}</Text>
      <Text style={styles.hint}>Sekvensen pausas – gör ditt drag.</Text>
      <View style={{ width: w, height: h }}>
        <MatchPitch width={w} height={h} />
        <Svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0 }}>
          {question.players?.map((p) => (
            <Circle key={p.id} cx={p.x * w} cy={p.y * h} r={12} fill={p.team === 'home' ? '#4da3ff' : '#ff3b30'} />
          ))}
        </Svg>
        <Animated.View style={{ position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#ffffff', transform: [{ translateX: ball.x }, { translateY: ball.y }] }} />
      </View>
      {paused && (
        <View style={{ gap: 8 }}>
          {question.options.map((opt, idx) => (
            <Button key={idx} title={opt} onPress={() => onAnswer(idx === question.correctIndex)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: '700', color: '#e7ebf3' },
  hint: { color: '#e7ebf3' },
});

