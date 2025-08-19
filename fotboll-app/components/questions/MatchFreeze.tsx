import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { MatchFreezeQuestion } from '@/types/content';

type Props = { question: MatchFreezeQuestion; onAnswer: (isCorrect: boolean) => void };

export default function MatchFreeze({ question, onAnswer }: Props) {
  const w = 320, h = 220;
  const check = (playerId?: string) => {
    if (question.correctPlayerIds && playerId) return onAnswer(question.correctPlayerIds.includes(playerId));
    onAnswer(false);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.question}</Text>
      <Svg width={w} height={h} style={{ backgroundColor: '#0a7d2a', borderRadius: 12 }}>
        {question.players.map(p => (
          <Pressable key={p.id} onPress={() => check(p.id)} style={{ position: 'absolute', left: p.x * w - 14, top: p.y * h - 14, width: 28, height: 28 }}>
            <Svg width={28} height={28}>
              <Circle cx={14} cy={14} r={12} fill={p.team === 'home' ? '#7a7cff' : '#ff3b30'} />
            </Svg>
          </Pressable>
        ))}
        <Circle cx={question.ball.x * w} cy={question.ball.y * h} r={6} fill="#fff" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
});

