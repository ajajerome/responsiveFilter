import { useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import type { DragDropQuestion } from '@/types/content';

type Props = {
  question: DragDropQuestion;
  onAnswer: (isCorrect: boolean) => void;
};

export default function DragDropQuestionView({ question, onAnswer }: Props) {
  const [pitchSize, setPitchSize] = useState({ width: 0, height: 0 });
  const position = useRef(new Animated.ValueXY({
    x: 0,
    y: 0,
  })).current;

  const startPx = {
    x: question.start.x * pitchSize.width,
    y: question.start.y * pitchSize.height,
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({ x: (position as any).x._value, y: (position as any).y._value });
        position.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        position.flattenOffset();
        const { x, y } = { x: (position as any).x._value, y: (position as any).y._value };
        const centerX = (startPx.x + x);
        const centerY = (startPx.y + y);
        const target = question.targetRect;
        const inRect =
          centerX >= target.x * pitchSize.width &&
          centerX <= (target.x + target.width) * pitchSize.width &&
          centerY >= target.y * pitchSize.height &&
          centerY <= (target.y + target.height) * pitchSize.height;
        onAnswer(inRect);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.question}</Text>
      <View
        style={styles.pitch}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setPitchSize({ width, height });
          position.setValue({ x: 0, y: 0 });
        }}
      >
        {/* Target area */}
        <View
          style={{
            position: 'absolute',
            left: question.targetRect.x * pitchSize.width,
            top: question.targetRect.y * pitchSize.height,
            width: question.targetRect.width * pitchSize.width,
            height: question.targetRect.height * pitchSize.height,
            borderWidth: 2,
            borderColor: '#34c759',
            backgroundColor: 'rgba(52,199,89,0.12)',
          }}
        />
        {/* Draggable marker */}
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            position: 'absolute',
            transform: position.getTranslateTransform(),
            left: startPx.x - 18,
            top: startPx.y - 18,
          }}
        >
          <View style={styles.player}>
            <Text style={styles.playerText}>{question.playerLabel ?? 'P'}</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  pitch: {
    height: 320,
    borderRadius: 12,
    backgroundColor: '#0a7d2a',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0a5d20',
  },
  player: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff9f0a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#c87f08',
  },
  playerText: { color: 'white', fontWeight: '700' },
});

