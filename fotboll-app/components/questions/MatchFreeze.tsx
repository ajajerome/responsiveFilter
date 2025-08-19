import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { MatchFreezeQuestion } from '@/types/content';
import { useEffect } from 'react';
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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.question}</Text>
      <View style={{ width: w, height: h, position: 'relative' }}>
        <Svg width={w} height={h} style={{ backgroundColor: '#0a7d2a', borderRadius: 12 }}>
          <Circle cx={question.ball.x * w} cy={question.ball.y * h} r={6} fill="#fff" />
        </Svg>
        {question.players.map(p => (
          <Pressable
            key={p.id}
            onPress={() => check(p.id)}
            hitSlop={12}
            style={{ position: 'absolute', left: p.x * w - 18, top: p.y * h - 18, width: 36, height: 36, borderRadius: 18, backgroundColor: p.team === 'home' ? '#7a7cff' : '#ff3b30', alignItems: 'center', justifyContent: 'center' }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
});

