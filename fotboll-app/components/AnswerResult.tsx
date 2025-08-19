import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { ENABLE_AUDIO } from '@/config/appConfig';

type Props = {
  correct: boolean;
  message?: string;
  onNext: () => void;
};

export default function AnswerResult({ correct, message, onNext }: Props) {
  useEffect(() => {
    let sound: Audio.Sound | undefined;
    (async () => {
      try {
        if (ENABLE_AUDIO) {
          await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
          sound = new Audio.Sound();
          const src = correct
            ? require('@/assets/sfx/success.mp3')
            : require('@/assets/sfx/fail.mp3');
          await sound.loadAsync(src);
          await sound.playAsync();
        }
      } catch {
        try {
          if (correct) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
        } catch {}
      }
    })();
    return () => {
      sound?.unloadAsync().catch(() => {});
    };
  }, [correct]);
  return (
    <View style={[styles.container, { backgroundColor: correct ? '#e6ffed' : '#ffe6e6', borderColor: correct ? '#2ecc71' : '#ff6b6b' }]}> 
      <Text style={[styles.title, { color: correct ? '#208e4e' : '#c44545' }]}> 
        {correct ? 'Rätt svar!' : 'Fel svar'}
      </Text>
      {message ? <Text style={styles.msg}>{message}</Text> : null}
      <Pressable accessibilityRole="button" onPress={onNext} style={styles.nextBtn}>
        <Text style={styles.nextTxt}>Nästa fråga</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, borderWidth: 2, borderRadius: radii.lg, alignItems: 'center', gap: spacing.xs },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
  msg: { textAlign: 'center', color: colors.muted },
  nextBtn: { marginTop: spacing.sm, backgroundColor: colors.secondary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.md },
  nextTxt: { color: colors.text, fontWeight: '700' },
});
