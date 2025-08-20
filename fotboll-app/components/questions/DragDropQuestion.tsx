import { useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import MatchPitch from '@/features/pitch/MatchPitch';
import ArrowsLayer, { Arrow as DrawnArrow } from '@/features/tactics/ArrowsLayer';
import { arrowsSatisfy } from '@/features/tactics/vectorValidation';
import Button from '@/components/ui/Button';
import * as Haptics from 'expo-haptics';
import { playLocal } from '@/utils/sound';
import type { DragDropQuestion, TacticsQuestion } from '@/types/content';

type Props = {
  question: DragDropQuestion | TacticsQuestion;
  onAnswer: (isCorrect: boolean) => void;
};

export default function DragDropQuestionView({ question, onAnswer }: Props) {
  const w = 320, h = 220;
  const [pitchSize, setPitchSize] = useState({ width: w, height: h });
  const [arrows, setArrows] = useState<DrawnArrow[]>([]);
  const position = useRef(new Animated.ValueXY({
    x: 0,
    y: 0,
  })).current;
  // För taktik: fler spelare
  const [playersPos, setPlayersPos] = useState<Record<string, Animated.ValueXY>>({});

  const startPx = 'start' in question
    ? { x: question.start.x * pitchSize.width, y: question.start.y * pitchSize.height }
    : { x: pitchSize.width * 0.5, y: pitchSize.height * 0.85 };

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
        if ('targetRect' in question) {
          const target = question.targetRect;
          const inRect =
            centerX >= target.x * pitchSize.width &&
            centerX <= (target.x + target.width) * pitchSize.width &&
            centerY >= target.y * pitchSize.height &&
            centerY <= (target.y + target.height) * pitchSize.height;
          if (inRect) {
            const tx = (target.x + target.width / 2) * pitchSize.width;
            const ty = (target.y + target.height / 2) * pitchSize.height;
            Animated.spring(position, { toValue: { x: tx - startPx.x, y: ty - startPx.y }, useNativeDriver: false }).start(() => {
              playLocal(require('@/assets/sfx/success.mp3'));
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
              onAnswer(true);
            });
          } else {
            // shake
            Animated.sequence([
              Animated.timing(position, { toValue: { x: x + 10, y }, duration: 50, useNativeDriver: false }),
              Animated.timing(position, { toValue: { x: x - 10, y }, duration: 50, useNativeDriver: false }),
              Animated.timing(position, { toValue: { x, y }, duration: 50, useNativeDriver: false }),
            ]).start();
            playLocal(require('@/assets/sfx/fail.mp3'));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
            onAnswer(false);
          }
        } else if ('targets' in question && question.targets?.length) {
          const hit = question.targets.some(t => (
            centerX >= t.rect.x * pitchSize.width &&
            centerX <= (t.rect.x + t.rect.width) * pitchSize.width &&
            centerY >= t.rect.y * pitchSize.height &&
            centerY <= (t.rect.y + t.rect.height) * pitchSize.height
          ));
          // Validera pilar mot expectedVectors om de finns
          let arrowsOk = true;
          if ('expectedVectors' in question && question.expectedVectors && question.expectedVectors.length > 0) {
            const normArrows = arrows.map(a => ({
              from: { x: a.from.x / (pitchSize.width || 1), y: a.from.y / (pitchSize.height || 1) },
              to: { x: a.to.x / (pitchSize.width || 1), y: a.to.y / (pitchSize.height || 1) },
              kind: a.kind,
            }));
            arrowsOk = arrowsSatisfy(normArrows as any, question.expectedVectors as any);
          }
          if (hit && arrowsOk) {
            playLocal(require('@/assets/sfx/success.mp3'));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          } else {
            playLocal(require('@/assets/sfx/fail.mp3'));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
          }
          onAnswer(hit && arrowsOk);
        } else {
          onAnswer(false);
        }
      },
    })
  ).current;

  function validateAllPlayersAndArrows(): boolean {
    if (!('players' in question)) return false;
    const q = question as TacticsQuestion;
    // all players with targetId must be inside their target rects
    const allPlayersOk = (q.players || []).every(p => {
      if (!p.targetId) return true;
      const target = q.targets?.find(t => t.id === p.targetId);
      if (!target) return false;
      const pos = playersPos[p.id];
      if (!pos) return false;
      const cx = (pos as any).x._value + p.start.x * pitchSize.width;
      const cy = (pos as any).y._value + p.start.y * pitchSize.height;
      return (
        cx >= target.rect.x * pitchSize.width &&
        cx <= (target.rect.x + target.rect.width) * pitchSize.width &&
        cy >= target.rect.y * pitchSize.height &&
        cy <= (target.rect.y + target.rect.height) * pitchSize.height
      );
    });
    let arrowsOk = true;
    if (q.expectedVectors && q.expectedVectors.length > 0) {
      const normArrows = arrows.map(a => ({
        from: { x: a.from.x / (pitchSize.width || 1), y: a.from.y / (pitchSize.height || 1) },
        to: { x: a.to.x / (pitchSize.width || 1), y: a.to.y / (pitchSize.height || 1) },
        kind: a.kind,
      }));
      arrowsOk = arrowsSatisfy(normArrows as any, q.expectedVectors as any);
    }
    return allPlayersOk && arrowsOk;
  }

  const isMulti = 'players' in question;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.question}</Text>
      <Text style={styles.expl}>
        Flytta spelaren så den täcker rätt yta. {'explanation' in question && question.explanation ? `\n${question.explanation}` : ''}
      </Text>
      <View
        style={[styles.pitch, { width: w, height: h }]}
        onLayout={() => {
          setPitchSize({ width: w, height: h });
          position.setValue({ x: 0, y: 0 });
        }}
      >
        <MatchPitch width={w} height={h} />
        {'targetRect' in question && (
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
        )}
        {'targets' in question && question.targets?.map(t => (
          <View
            key={t.id}
            style={{
              position: 'absolute',
              left: t.rect.x * pitchSize.width,
              top: t.rect.y * pitchSize.height,
              width: t.rect.width * pitchSize.width,
              height: t.rect.height * pitchSize.height,
              borderWidth: 2,
              borderColor: '#34c759',
              backgroundColor: 'rgba(52,199,89,0.12)',
            }}
          />
        ))}
        {/* Enkel-läge: en spelare */}
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
            <Text style={styles.playerText}>{'playerLabel' in question ? (question.playerLabel ?? 'P') : 'P'}</Text>
          </View>
        </Animated.View>
        {/* Taktik-läge: flera spelare */}
        {'players' in question && question.players.map(p => {
          const key = p.id;
          if (!playersPos[key]) {
            playersPos[key] = new Animated.ValueXY({ x: p.start.x * pitchSize.width, y: p.start.y * pitchSize.height });
            setPlayersPos({ ...playersPos });
          }
          const pan = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
              playersPos[key].setOffset({ x: (playersPos[key] as any).x._value, y: (playersPos[key] as any).y._value });
              playersPos[key].setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([null, { dx: playersPos[key].x, dy: playersPos[key].y }], { useNativeDriver: false }),
            onPanResponderRelease: () => {
              playersPos[key].flattenOffset();
            },
          });
          const target = question.targets?.find(t => t.id === p.targetId);
          return (
            <>
              {target && (
                <View key={`z-${key}`} style={{ position: 'absolute', left: target.rect.x * pitchSize.width, top: target.rect.y * pitchSize.height, width: target.rect.width * pitchSize.width, height: target.rect.height * pitchSize.height, borderWidth: 2, borderColor: '#34c759', backgroundColor: 'rgba(52,199,89,0.12)' }} />
              )}
              <Animated.View key={`p-${key}`} {...pan.panHandlers} style={{ position: 'absolute', transform: playersPos[key].getTranslateTransform(), left: p.start.x * pitchSize.width - 18, top: p.start.y * pitchSize.height - 18 }}>
                <View style={[styles.player, { backgroundColor: '#7a7cff' }]}>
                  <Text style={styles.playerText}>{p.label}</Text>
                </View>
              </Animated.View>
            </>
          );
        })}
        {/* Pilar av – förenklat läge */}
        <ArrowsLayer width={w} height={h} onArrowsChanged={setArrows} interactive={false} />

        {/* Riktning/plan-indikator */}
        <View style={{ position: 'absolute', left: 6, top: 6, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Anfall →</Text>
        </View>
      </View>
      {isMulti && (
        <Button title="Kontrollera" onPress={() => onAnswer(validateAllPlayersAndArrows())} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  pitch: {
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
  expl: { color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.35)', padding: 8, borderRadius: 8 },
});

